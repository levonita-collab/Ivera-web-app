#!/usr/bin/env node
// RLS isolation test for the Security Hardening PR.
//
// Verifies, against your REAL Supabase project, that:
//   1. A signed-in user can read their own booking.
//   2. A signed-in user CANNOT read another user's booking.
//   3. A signed-in user CANNOT change another user's booking status/notes.
//   4. Anyone (even anonymous) CAN still flip whatsapp_opened — the one
//      column intentionally left open for the booking-widget flow.
//   5. A fully anonymous (no session) client cannot read ANY booking.
//
// Requires migration 007_security_hardening.sql to already be applied to
// the target project — run this AFTER applying it, not before.
//
// Usage:
//   node --env-file=.env.local scripts/test-rls.mjs
//
// Required env vars:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
//   SUPABASE_SERVICE_ROLE_KEY             (used ONLY to set up/tear down
//                                          throwaway fixtures — never used
//                                          to perform the actual checks)
//
// Creates two throwaway auth users + bookings, runs the checks, then
// deletes everything it created. Safe to run against production — it
// cleans up after itself even if a check fails (best-effort).

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceKey) {
  console.error(
    "Missing required env vars. Need NEXT_PUBLIC_SUPABASE_URL, " +
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or _ANON_KEY), and SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Run with: node --env-file=.env.local scripts/test-rls.mjs"
  );
  process.exit(1);
}

const service = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const results = [];
function record(name, passed, detail) {
  results.push({ name, passed, detail });
  console.log(`${passed ? "✅ PASS" : "❌ FAIL"} — ${name}${detail ? `: ${detail}` : ""}`);
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

async function cleanup() {
  for (const id of fixtures.bookingIds) {
    await service.from("bookings").delete().eq("id", id);
  }
  for (const id of fixtures.profileIds) {
    await service.from("explorer_profiles").delete().eq("id", id);
  }
  for (const id of fixtures.userIds) {
    await service.auth.admin.deleteUser(id).catch(() => {});
  }
}

async function main() {
  console.log(`\nSetting up fixtures (run ${RUN_ID})…\n`);
  const userA = await createTestUser("a");
  const userB = await createTestUser("b");

  const anonA = createClient(url, anonKey);
  const { error: signInError } = await anonA.auth.signInWithPassword({
    email: userA.email,
    password: userA.password,
  });
  if (signInError) throw new Error(`User A sign-in failed: ${signInError.message}`);

  // 1. User A can read their own booking.
  const { data: ownRead } = await anonA
    .from("bookings")
    .select("id")
    .eq("id", userA.bookingId);
  record("User A can read their own booking", (ownRead?.length ?? 0) === 1);

  // 2. User A cannot read User B's booking.
  const { data: crossRead } = await anonA
    .from("bookings")
    .select("id")
    .eq("id", userB.bookingId);
  record("User A cannot read User B's booking", (crossRead?.length ?? 0) === 0);

  // 3. User A cannot change User B's status or notes.
  const { data: crossStatusWrite } = await anonA
    .from("bookings")
    .update({ status: "confirmed" })
    .eq("id", userB.bookingId)
    .select("id");
  record(
    "User A cannot change User B's booking status",
    (crossStatusWrite?.length ?? 0) === 0
  );

  const { data: crossNotesWrite } = await anonA
    .from("bookings")
    .update({ notes: "tampered" })
    .eq("id", userB.bookingId)
    .select("id");
  record(
    "User A cannot change User B's booking notes",
    (crossNotesWrite?.length ?? 0) === 0
  );

  // 4. Anyone (even anonymous, no session) can still flip whatsapp_opened —
  //    the one intentionally-open column.
  const trulyAnon = createClient(url, anonKey);
  const { error: whatsappError } = await trulyAnon
    .from("bookings")
    .update({ whatsapp_opened: true })
    .eq("id", userA.bookingId);
  record(
    "Anonymous client CAN still flip whatsapp_opened (intended)",
    !whatsappError,
    whatsappError?.message
  );

  // 5. A fully anonymous (no session) client cannot read ANY booking.
  const { data: anonRead } = await trulyAnon.from("bookings").select("id").limit(5);
  record(
    "Anonymous (no session) client reads zero bookings",
    (anonRead?.length ?? 0) === 0
  );

  await anonA.auth.signOut();
}

main()
  .catch((e) => {
    console.error("\nTest script error:", e.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    console.log("\nCleaning up fixtures…");
    await cleanup();

    const failed = results.filter((r) => !r.passed);
    console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
    if (failed.length > 0) {
      console.log("Failed checks:", failed.map((f) => f.name).join(", "));
      process.exitCode = 1;
    }
  });
