# QR Codes — All Tours Reference

Master list of every mission QR code across all 8 tours (30 missions total).
PNG images for every code are pre-generated in `docs/qr-codes/{missionId}.png`
(600×600px, ready to print).

Printing: card stock, A6 or business-card size, laminated for outdoor use.
See `docs/kakheti-qr-card-copy.md` for the full card-layout template — reuse
the same layout for the other tours, swapping in the title/location/QR/XP
per mission below.

---

### tbilisi-city-quest

| Mission | Location | QR Code Value |
|---|---|---|
| tbs-1 — Metekhi Lookout | Metekhi Church | `ivera::tbilisi-city-quest::tbs-1` |
| tbs-2 — Narikala Summit | Narikala Fortress | `ivera::tbilisi-city-quest::tbs-2` |
| tbs-3 — Sulfur Secret | Abanotubani Sulfur Baths | `ivera::tbilisi-city-quest::tbs-3` |
| tbs-4 — Bridge of Peace | Peace Bridge | `ivera::tbilisi-city-quest::tbs-4` |

### mtskheta-sacred-route

| Mission | Location | QR Code Value |
|---|---|---|
| mtk-1 — Jvari Pilgrimage | Jvari Monastery | `ivera::mtskheta-sacred-route::mtk-1` |
| mtk-2 — Pillar of Life | Svetitskhoveli Cathedral | `ivera::mtskheta-sacred-route::mtk-2` |
| mtk-3 — Ancient Crossroads | Mtskheta Old Town | `ivera::mtskheta-sacred-route::mtk-3` |

### gori-uplistsikhe-quest

| Mission | Location | QR Code Value |
|---|---|---|
| gori-1 — Fortress Watch | Gori Fortress | `ivera::gori-uplistsikhe-quest::gori-1` |
| gori-2 — Cave City Entry | Uplistsikhe — Main Gate | `ivera::gori-uplistsikhe-quest::gori-2` |
| gori-3 — Ancient Wine Cellar | Uplistsikhe — Wine Cellar | `ivera::gori-uplistsikhe-quest::gori-3` |
| gori-4 — Supra Experience | Lunch Stop | `ivera::gori-uplistsikhe-quest::gori-4` |

### kakheti-wine-legends

| Mission | Location | QR Code Value |
|---|---|---|
| kak-1 — The Saint's Resting Place | Bodbe Monastery | `ivera::kakheti-wine-legends::kak-1` |
| kak-2 — City of Love Panorama | Sighnaghi — Main Viewpoint | `ivera::kakheti-wine-legends::kak-2` |
| kak-3 — Guardian of the Walls | Sighnaghi City Walls | `ivera::kakheti-wine-legends::kak-3` |
| kak-4 — The Amber Wine Ritual | Wine Tasting Hall — Qvevri Cellar | `ivera::kakheti-wine-legends::kak-4` |
| kak-5 — Tamada — Master of the Toast | Traditional Supra Table | `ivera::kakheti-wine-legends::kak-5` |

### kazbegi-mountain-quest

| Mission | Location | QR Code Value |
|---|---|---|
| kaz-1 — Ananuri Guardian | Ananuri Fortress | `ivera::kazbegi-mountain-quest::kaz-1` |
| kaz-2 — Friendship Monument | Soviet Friendship Monument | `ivera::kazbegi-mountain-quest::kaz-2` |
| kaz-3 — Cross Pass Conqueror | Jvari Pass (2,379 m) | `ivera::kazbegi-mountain-quest::kaz-3` |
| kaz-4 — Gergeti Summit | Gergeti Trinity Church (2,170 m) | `ivera::kazbegi-mountain-quest::kaz-4` |

### vardzia-cave-kingdom

| Mission | Location | QR Code Value |
|---|---|---|
| var-1 — Rabati Gate | Rabati Fortress | `ivera::vardzia-cave-kingdom::var-1` |
| var-2 — Cave Kingdom Entry | Vardzia — Main Entrance | `ivera::vardzia-cave-kingdom::var-2` |
| var-3 — Fresco Hunter | Vardzia — Church of the Dormition | `ivera::vardzia-cave-kingdom::var-3` |

### kutaisi-martvili-canyons

| Mission | Location | QR Code Value |
|---|---|---|
| kut-1 — Cave of Light | Prometheus Cave | `ivera::kutaisi-martvili-canyons::kut-1` |
| kut-2 — Canyon Keeper | Martvili Canyon — Entrance | `ivera::kutaisi-martvili-canyons::kut-2` |
| kut-3 — Emerald Waters | Martvili Canyon — Boat Point | `ivera::kutaisi-martvili-canyons::kut-3` |

### batumi-black-sea-quest

| Mission | Location | QR Code Value |
|---|---|---|
| bat-1 — Black Sea Arrival | Batumi Boulevard | `ivera::batumi-black-sea-quest::bat-1` |
| bat-2 — Alphabet Tower | Alphabet Tower | `ivera::batumi-black-sea-quest::bat-2` |
| bat-3 — Adjarian Khachapuri | Local Bakery | `ivera::batumi-black-sea-quest::bat-3` |
| bat-4 — Makhuntseti Waterfall | Makhuntseti Waterfall | `ivera::batumi-black-sea-quest::bat-4` |


---

**Before these go live in the field:** apply `supabase/migrations/005_seed_qr_missions.sql` to the production database, or real-mode scans will fail with "QR code not recognised".
