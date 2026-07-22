#!/usr/bin/env node
// RLS isolation test for the Security Hardening PR — run against a
// Supabase PREVIEW branch only. This script refuses to run against the
// known production project.
//
// Usage:
//   node --env-file=.env.test.local scripts/test-rls.mjs
//
// Required env vars (test-only names — never the app's real
// NEXT_PUBLIC_SUPABASE_* vars, so this can never accidentally be pointed
// at a developer's real .env.local by habit):
//   SUPABASE_TEST_URL
//   SUPABASE_TEST_ANON_KEY
//   SUPABASE_TEST_SERVICE_ROLE_KEY   (setup/teardown of throwaway fixtures
//                                     and the one "privileged path" check —
//                                     NEVER used for an isolation assertion)
//
// Safety:
//   - Refuses to run if the target project ref matches production.
//   - Never prints the Supabase URL, any key, JWT, or raw user/booking IDs.
//   - Creates only throwaway users/rows scoped to this run; deletes them
//     all in a `finally` block that runs even if assertions fail/throw.
//   - Exits non-zero if any assertion fails.
//
// Requires migration 007_security_hardening.sql to already be applied to
// the target project.

import { createClient } from "@supabase/supabase-js";

const PRODUCTION_REF = "nslvqdxbpkgqppidwbff"; // Ivera's real production project — never test against this.

const url = process.env.SUPABASE_TEST_URL;
const anonKey = process.env.SUPABASE_TEST_ANON_KEY;
const serviceKey = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error(
    "Missing required env vars: SUPABASE_TEST_URL, SUPABASE_TEST_ANON_KEY, SUPABASE_TEST_SERVICE_ROLE_KEY.\n" +
      "Run with: node --env-file=.env.test.local scripts/test-rls.mjs"
  );
  process.exit(1);
}

const refMatch = url.match(/^https:\/\/([a-z0-9]+)\.supabase\.co\/?$/i);
if (!refMatch) {
  console.error("SUPABASE_TEST_URL doesn't look like a Supabase project URL. Refusing to run.");
  process.exit(1);
}
const targetRef = refMatch[1];
if (targetRef === PRODUCTION_REF) {
  console.error(
    `\n🛑 REFUSING TO RUN: SUPABASE_TEST_URL points at the production project (${PRODUCTION_REF}).\n` +
      "This script is only for a Supabase preview/test branch. Aborting without making any request.\n"
  );
  process.exit(1);
}

// Optional stricter allowlist: if set, the target ref must match exactly
// (in addition to the production denylist above). Not required — preview
// branch refs are transient per-PR, so leaving this unset just means "any
// non-production ref". Set it when you want the script to refuse anything
// but one specific, already-known preview ref.
const expectedRef = process.env.SUPABASE_TEST_EXPECTED_REF;
if (expectedRef && targetRef !== expectedRef) {
  console.error(
    `\n🛑 REFUSING TO RUN: SUPABASE_TEST_EXPECTED_REF is set but doesn't match the target project.\n`
  );
  process.exit(1);
}

console.log(`Target project ref (not production): ${targetRef}\n`);

const service = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const results = [];
function record(name, passed, note) {
  results.push({ name, passed, note });
  console.log(`${passed ? "✅ PASS" : "❌ FAIL"} — ${name}${note ? ` (${note})` : ""}`);
}

// Runs one assertion in isolation — a thrown error inside `fn` is recorded
// as a FAIL, never allowed to abort the rest of the suite or skip cleanup.
async function check(name, fn) {
  try {
    await fn();
  } catch (e) {
    record(name, false, `threw: ${e.message}`);
  }
}

const RUN_ID = Math.random().toString(36).slice(2, 8);
const fixtures = { userIds: [], profileIds: [], bookingIds: [] };

async function createTestUser(label) {
  const email = `ivera-rls-test-${RUN_ID}-${label}@example.com`;
  const password = `Test-${RUN_ID}-${label}-Pw1!`;
  const { data, error } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) throw new Error(`Could not create test user ${label}: ${error?.message}`);
  fixtures.userIds.push(data.user.id);

  const { data: profile, error: profileError } = await service
    .from("explorer_profiles")
    .insert({ name: `RLS Test ${label}`, auth_user_id: data.user.id })
    .select("id")
    .single();
  if (profileError || !profile) throw new Error(`Could not create profile for ${label}: ${profileError?.message}`);
  fixtures.profileIds.push(profile.id);

  const { data: booking, error: bookingError } = await service
    .from("bookings")
    .insert({
      booking_code: `IVERA-RLSTEST-${RUN_ID}-${label}`,
      explorer_id: profile.id,
      tour_slug: "rls-test-tour",
      tour_title: "RLS Test Tour",
      selected_date: "2099-01-01",
      people_count: 1,
      status: "pending",
      payment_status: "unpaid",
      notes: `fixture for ${label}`,
    })
    .select("id")
    .single();
  if (bookingError || !booking) throw new Error(`Could not create booking for ${label}: ${bookingError?.message}`);
  fixtures.bookingIds.push(booking.id);

  return { email, password, profileId: profile.id, bookingId: booking.id };
}

async function createAnonymousProfileFixture() {
  const { data, error } = await service
    .from("explorer_profiles")
    .insert({ name: `RLS Test anon-${RUN_ID}` })
    .select("id")
    .single();
  if (error || !data) throw new Error(`Could not create anonymous profile fixture: ${error?.message}`);
  fixtures.profileIds.push(data.id);
  return data.id;
}

async function cleanup() {
  for (const id of fixtures.bookingIds) {
    await service.from("bookings").delete().eq("id", id).then(
      () => {},
      () => {}
    );
  }
  for (const id of fixtures.profileIds) {
    await service.from("explorer_profiles").delete().eq("id", id).then(
      () => {},
      () => {}
    );
  }
  for (const id of fixtures.userIds) {
    await service.auth.admin.deleteUser(id).catch(() => {});
  }
}

// A mutation is BLOCKED if it errors OR silently affects zero rows —
// Supabase surfaces column-grant violations as an error, and RLS
// row-visibility filtering as a clean empty result. Both count as blocked.
function wasBlocked(result) {
  return Boolean(result.error) || !result.data || result.data.length === 0;
}

async function main() {
  console.log(`Setting up fixtures (run ${RUN_ID})…\n`);
  const userA = await createTestUser("a");
  const userB = await createTestUser("b");
  const anonProfileId = await createAnonymousProfileFixture();

  const clientA = createClient(url, anonKey);
  const { error: signInError } = await clientA.auth.signInWithPassword({
    email: userA.email,
    password: userA.password,
  });
  if (signInError) throw new Error(`User A sign-in failed: ${signInError.message}`);

  const trulyAnon = createClient(url, anonKey); // no session at all

  // ── 1. Anonymous users cannot read bookings ────────────────────────────
  await check("1. Anonymous client reads zero bookings", async () => {
    const res = await trulyAnon.from("bookings").select("id").limit(5);
    record("1. Anonymous client reads zero bookings", wasBlocked(res));
  });

  // ── 2. Anonymous insert: allowed shape succeeds, protected fields don't ─
  let anonInsertedId = null;
  await check("2a. Anonymous insert (intended shape) succeeds", async () => {
    const res = await trulyAnon
      .from("bookings")
      .insert({
        booking_code: `IVERA-RLSTEST-${RUN_ID}-anon`,
        explorer_id: anonProfileId,
        tour_slug: "rls-test-tour",
        tour_title: "RLS Test Tour (anon insert)",
        selected_date: "2099-01-01",
        people_count: 1,
      })
      .select("id");
    const ok = !res.error && res.data?.length === 1;
    if (ok) {
      anonInsertedId = res.data[0].id;
      fixtures.bookingIds.push(anonInsertedId);
    }
    record("2a. Anonymous insert (intended shape) succeeds", ok, res.error?.code);
  });

  await check("2b. Anonymous insert CANNOT set payment_status", async () => {
    const res = await trulyAnon
      .from("bookings")
      .insert({
        booking_code: `IVERA-RLSTEST-${RUN_ID}-anon-paid`,
        tour_slug: "rls-test-tour",
        tour_title: "RLS Test Tour",
        selected_date: "2099-01-01",
        people_count: 1,
        payment_status: "paid",
      })
      .select("id");
    record("2b. Anonymous insert CANNOT set payment_status", wasBlocked(res), res.error?.code);
  });

  await check("2c. Anonymous insert CANNOT set status", async () => {
    const res = await trulyAnon
      .from("bookings")
      .insert({
        booking_code: `IVERA-RLSTEST-${RUN_ID}-anon-confirmed`,
        tour_slug: "rls-test-tour",
        tour_title: "RLS Test Tour",
        selected_date: "2099-01-01",
        people_count: 1,
        status: "confirmed",
      })
      .select("id");
    record("2c. Anonymous insert CANNOT set status", wasBlocked(res), res.error?.code);
  });

  // ── 3. Anonymous cannot update (except the one open column) or delete ──
  await check("3a. Anonymous CANNOT update notes on any booking", async () => {
    const res = await trulyAnon
      .from("bookings")
      .update({ notes: "tampered by anon" })
      .eq("id", userA.bookingId)
      .select("id");
    record("3a. Anonymous CANNOT update notes on any booking", wasBlocked(res), res.error?.code);
  });

  await check("3b. Anonymous CAN update whatsapp_opened (intended exception)", async () => {
    const res = await trulyAnon
      .from("bookings")
      .update({ whatsapp_opened: true })
      .eq("id", userA.bookingId)
      .select("id");
    record("3b. Anonymous CAN update whatsapp_opened (intended exception)", !wasBlocked(res), res.error?.code);
  });

  await check("3c. Anonymous CANNOT delete a booking", async () => {
    const res = await trulyAnon.from("bookings").delete().eq("id", userA.bookingId).select("id");
    record("3c. Anonymous CANNOT delete a booking", wasBlocked(res), res.error?.code);
  });

  // ── 4/5. Authenticated user A can read own, not User B's ───────────────
  await check("4. User A can read their own booking", async () => {
    const res = await clientA.from("bookings").select("id").eq("id", userA.bookingId);
    record("4. User A can read their own booking", !wasBlocked(res));
  });

  await check("5. User A cannot read User B's booking", async () => {
    const res = await clientA.from("bookings").select("id").eq("id", userB.bookingId);
    record("5. User A cannot read User B's booking", wasBlocked(res));
  });

  // ── 6. User A cannot update/delete User B's booking ─────────────────────
  await check("6a. User A cannot update User B's booking status", async () => {
    const res = await clientA
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", userB.bookingId)
      .select("id");
    record("6a. User A cannot update User B's booking status", wasBlocked(res), res.error?.code);
  });

  await check("6b. User A cannot delete User B's booking", async () => {
    const res = await clientA.from("bookings").delete().eq("id", userB.bookingId).select("id");
    record("6b. User A cannot delete User B's booking", wasBlocked(res), res.error?.code);
  });

  // ── 7. Normal authenticated user cannot set protected fields — even on
  //       their OWN row ────────────────────────────────────────────────────
  await check("7. User A cannot set protected fields on their OWN booking", async () => {
    const res = await clientA
      .from("bookings")
      .update({
        payment_status: "paid",
        status: "confirmed",
        paypal_order_id: "FAKE-ORDER-ID",
        paid_amount: 999,
        paid_currency: "EUR",
        notes: "self-approved",
      })
      .eq("id", userA.bookingId)
      .select("id");
    record("7. User A cannot set protected fields on their OWN booking", wasBlocked(res), res.error?.code);
  });

  // ── 8. Cannot impersonate another user's explorer_id on insert ──────────
  await check("8. User A cannot insert a booking under User B's explorer_id", async () => {
    const res = await clientA
      .from("bookings")
      .insert({
        booking_code: `IVERA-RLSTEST-${RUN_ID}-impersonate`,
        explorer_id: userB.profileId,
        tour_slug: "rls-test-tour",
        tour_title: "RLS Test Tour (impersonation attempt)",
        selected_date: "2099-01-01",
        people_count: 1,
      })
      .select("id");
    if (!res.error && res.data?.length) fixtures.bookingIds.push(res.data[0].id); // shouldn't happen, but clean up if it does
    record("8. User A cannot insert a booking under User B's explorer_id", wasBlocked(res), res.error?.code);
  });

  await check("8b. Sanity: User A CAN insert a booking under their OWN explorer_id", async () => {
    const res = await clientA
      .from("bookings")
      .insert({
        booking_code: `IVERA-RLSTEST-${RUN_ID}-a-second`,
        explorer_id: userA.profileId,
        tour_slug: "rls-test-tour",
        tour_title: "RLS Test Tour (own second booking)",
        selected_date: "2099-01-01",
        people_count: 1,
      })
      .select("id");
    if (!res.error && res.data?.length) fixtures.bookingIds.push(res.data[0].id);
    record("8b. Sanity: User A CAN insert a booking under their OWN explorer_id", !wasBlocked(res), res.error?.code);
  });

  // ── 9. Privileged path (service role) still works — NOT an isolation
  //       check, explicitly using the service client on purpose ──────────
  await check("9. Service-role (admin/PayPal path) CAN set protected fields", async () => {
    const res = await service
      .from("bookings")
      .update({ status: "confirmed", payment_status: "paid" })
      .eq("id", userB.bookingId)
      .select("id");
    record("9. Service-role (admin/PayPal path) CAN set protected fields", !wasBlocked(res), res.error?.code);
  });

  await clientA.auth.signOut();
}

main()
  .catch((e) => {
    console.error("\nUnexpected error in test setup:", e.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    console.log("\nCleaning up fixtures (10. cleanup runs even if a check above failed)…");
    await cleanup();
    console.log("Cleanup done.");

    const failed = results.filter((r) => !r.passed);
    console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
    if (failed.length > 0) {
      console.log("Failed:", failed.map((f) => f.name).join(", "));
      process.exitCode = 1;
    }
  });
