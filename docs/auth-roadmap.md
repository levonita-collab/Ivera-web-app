# Authentication Roadmap

Ivera's identity model is intentionally lightweight for the first beta. The goal
is conversion and tourism operations, not account management. This document
records what exists today and what is deferred — so social login is treated as a
**future enhancement, not a launch blocker**.

## Current MVP (now)

- **Explorer Pass** — a profile created in-app (name, country, WhatsApp number,
  language preference, interests). No password, no email verification.
- **WhatsApp number** — the primary contact channel. Used by the guide to
  confirm bookings and reach travellers safely. This is the most important field
  for tourism operations.
- **Supabase local-first profile sync** — the Explorer Pass is saved to
  `localStorage` first (instant, offline-friendly, source of truth) and synced
  to the `explorer_profiles` table in Supabase in the background. If Supabase is
  unavailable, the app keeps working from local storage.

No complex auth (sessions, JWTs, password reset, OAuth) is implemented yet.

## Later (planned)

- **Google login via Supabase Auth** — the first social provider to add. Lets
  returning travellers recover their progress across devices. Implement with
  `@supabase/ssr` and link the OAuth identity to the existing
  `explorer_profiles` record.

## Later / lower priority

- **Facebook login** — add only if there is clear demand from the audience.
- **Apple login** — required if/when a native iOS app ships; not needed for the
  web beta.

## Reasoning

Social login is useful but not required before the first beta. For a tourism
service, a reachable **WhatsApp contact** is more valuable than a federated
identity — it enables booking confirmation, real-time support, and traveller
safety. Adding OAuth now would increase scope and risk without improving the
core funnel:

> Visitor → Free Tbilisi Quest → Explorer Pass → Paid Tour

When account portability becomes a real user need, Google via Supabase Auth is
the first step, layered on top of the existing local-first profile rather than
replacing it.
