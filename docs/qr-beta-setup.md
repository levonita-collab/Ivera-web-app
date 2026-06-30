# Ivera QR Setup — All Tours

Practical guide for preparing and deploying QR codes across every tour.

**Status: real camera scanning is live.** The quest page now opens the
device camera (`src/components/quest/QrScanner.tsx`), decodes the QR with
`jsqr`, and validates the result through `validateMissionQr()`. The old
one-tap "Demo Scan" button has been removed — tourists must scan (or
manually type) the real printed code to complete a mission.

---

## How QR codes work in Ivera

Each mission has a `qrCode` field in the data. The format is:

```
ivera::{tourSlug}::{missionId}
```

Example for Kakheti mission 1:
```
ivera::kakheti-wine-legends::kak-1
```

When a tourist scans this QR code with the Ivera app:
1. The camera scanner reads the code (or the tourist types the manual fallback code, e.g. `IVERA-KAK-1`)
2. `validateMissionQr()` looks it up in the `qr_missions` Supabase table (or parses it locally in offline mode, when Supabase isn't configured)
3. The app checks the code belongs to the mission currently being scanned — a code from a different tour/location is rejected
4. On a match, the mission is marked complete and XP is awarded

All 30 mission QR codes (8 tours) are pre-generated as PNGs in `docs/qr-codes/`.

---

## Kakheti mission QR codes

Print or display these QR codes at each location:

| Mission | Location | QR Code Value |
|---|---|---|
| kak-1 — The Saint's Resting Place | Bodbe Monastery | `ivera::kakheti-wine-legends::kak-1` |
| kak-2 — City of Love Panorama | Sighnaghi Viewpoint | `ivera::kakheti-wine-legends::kak-2` |
| kak-3 — Guardian of the Walls | Sighnaghi City Walls | `ivera::kakheti-wine-legends::kak-3` |
| kak-4 — The Amber Wine Ritual | Wine Tasting Hall | `ivera::kakheti-wine-legends::kak-4` |
| kak-5 — Tamada: Master of the Toast | Supra Table | `ivera::kakheti-wine-legends::kak-5` |

---

## How to create QR codes

1. Go to any free QR generator (e.g. qr-code-generator.com or qrcode-monkey.com)
2. Choose **Text** or **URL** mode — paste the QR code value exactly (e.g. `ivera::kakheti-wine-legends::kak-1`)
3. Download as PNG or PDF
4. Print on card stock (A6 size or business card size works well)
5. Laminate if possible — outdoor locations need weather protection

**Recommended format:** White background, black QR code, Ivera logo above, mission name below.

---

## Where to place QR cards during beta

| Mission | Placement |
|---|---|
| kak-1 (Bodbe) | On the monastery entrance wall or given by guide at the door |
| kak-2 (Sighnaghi Viewpoint) | At the main viewpoint railing or bench |
| kak-3 (City Walls) | On the tower door or wall plaque |
| kak-4 (Wine Tasting) | On the table at the wine cellar |
| kak-5 (Supra) | On the lunch table, placed face-down until the toast challenge begins |

---

## Why QR should be controlled by the guide during beta

During the first beta:
- **The guide holds the QR cards** and reveals them at the right moment
- This prevents tourists from scanning ahead and skipping missions
- The guide can explain the story before the scan adds emotional impact
- If the camera fails to read a card (glare, lamination glare, low light), tap **Enter code manually** in the scanner and type the manual code printed on the card (e.g. `IVERA-KAK-1`)

After beta validation, QR cards can be permanently installed at locations.

---

## Testing QR codes before the tour

1. Open the Ivera app on your phone and navigate to any Quest page
2. Tap **Scan QR ✦** on a mission — this opens the camera scanner
3. Print one card, then scan it with the in-app scanner to confirm the code is read correctly
4. If the camera can't read it, tap **Enter code manually** and type the code (full `ivera::...` value or the short `IVERA-XXX-N` code) to confirm the fallback path works
5. Confirm the mission only completes for the card that matches that exact mission — scanning a different mission's card should show "doesn't match this mission"

---

## How to avoid duplicate XP

The app prevents duplicate XP locally:
- `completeMission()` checks if the mission is already in `completedMissions` and returns early
- The Scan QR ✦ button disappears once a mission is completed
- Supabase upsert ensures no duplicate rows per `(explorer_id, tour_slug, mission_id)`

**Guide instruction:** Ask tourists not to scan the same code twice. If they accidentally try, the app will ignore the duplicate.

---

## Deploying QR data to Supabase

The `qr_missions` table must be seeded before real scans work in production
(when Supabase is configured, `validateMissionQr()` looks codes up there
instead of parsing them offline). Run the migration:

```
supabase/migrations/005_seed_qr_missions.sql
```

This inserts (and upserts, safe to re-run) all 30 missions across all 8
tours — not just Kakheti. Apply it via the Supabase SQL editor or CLI
(`supabase db push`) against the project. Until this migration is applied
to the production database, real-mode scans will fail with "QR code not
recognised" even though the printed codes are correct.

---

## QR card design checklist

- [ ] Ivera logo at top
- [ ] Mission name (e.g. "The Saint's Resting Place")
- [ ] QR code (large enough to scan from 20 cm)
- [ ] Small instruction: "Scan with Ivera app to complete this mission"
- [ ] Mission number (e.g. "Mission 1 of 5")
- [ ] Laminated or in a card sleeve for outdoor use
