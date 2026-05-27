# Ivera QR Beta Setup — Kakheti Route

Practical guide for preparing and deploying QR codes for the Kakheti controlled beta test.

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
1. The app reads the code
2. Looks it up in the `qr_missions` Supabase table (or parses it locally in offline mode)
3. Returns the mission ID and marks it complete
4. Awards XP and saves progress

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
- If a scan fails, the guide can use Demo Scan mode as a fallback

After beta validation, QR cards can be permanently installed at locations.

---

## Testing QR codes before the tour

1. Open the Ivera app on your phone
2. Navigate to the Kakheti Quest page
3. The **Demo Scan ✦** button simulates a successful scan — use this for flow testing
4. For real QR testing: print one card, scan with a standard camera QR reader first to confirm the text is readable
5. Then test in the app's QR scanner (once live QR scanning is enabled in a future release)

**Note:** In the current beta version, Demo Scan is used instead of camera QR scanning. The QR cards are presented as the real-world version of what Demo Scan simulates.

---

## How to avoid duplicate XP

The app prevents duplicate XP locally:
- `completeMission()` checks if the mission is already in `completedMissions` and returns early
- The Demo Scan button disappears once a mission is completed
- Supabase upsert ensures no duplicate rows per `(explorer_id, tour_slug, mission_id)`

**Guide instruction:** Ask tourists not to scan the same code twice. If they accidentally try, the app will ignore the duplicate.

---

## How to replace Demo Scan with real QR scanning

When camera QR scanning is implemented (future release):

1. Insert each mission's QR code into the `qr_missions` Supabase table:

```sql
insert into qr_missions (tour_slug, mission_id, qr_code, location_name, points, unlock_text)
values (
  'kakheti-wine-legends',
  'kak-1',
  'ivera::kakheti-wine-legends::kak-1',
  'Bodbe Monastery',
  75,
  'Welcome to Bodbe — the resting place of Saint Nino, Georgia''s Enlightener.'
);
```

2. Repeat for all 5 Kakheti missions
3. The `validateMissionQr()` utility in `src/lib/quests/validateMissionQr.ts` will look up the code and return the correct mission data

---

## QR card design checklist

- [ ] Ivera logo at top
- [ ] Mission name (e.g. "The Saint's Resting Place")
- [ ] QR code (large enough to scan from 20 cm)
- [ ] Small instruction: "Scan with Ivera app to complete this mission"
- [ ] Mission number (e.g. "Mission 1 of 5")
- [ ] Laminated or in a card sleeve for outdoor use
