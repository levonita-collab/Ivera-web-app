-- Seed qr_missions with all printable QR codes for every tour.
-- Safe to re-run: upserts on the (tour_slug, mission_id) unique constraint
-- defined in 000_baseline_schema.sql, so re-applying just refreshes the data.

insert into qr_missions (tour_slug, mission_id, qr_code, location_name, points, unlock_text, active)
values
  ('tbilisi-city-quest', 'tbs-1', 'ivera::tbilisi-city-quest::tbs-1', 'Metekhi Church', 50, 'You stand above the Mtkvari river — this cliff has watched Tbilisi grow for 1,500 years.', true),
  ('tbilisi-city-quest', 'tbs-2', 'ivera::tbilisi-city-quest::tbs-2', 'Narikala Fortress', 75, 'Narikala has guarded Tbilisi since the 4th century. You are standing where Persian, Arab, and Mongol armies once looked down on the city.', true),
  ('tbilisi-city-quest', 'tbs-3', 'ivera::tbilisi-city-quest::tbs-3', 'Abanotubani Sulfur Baths', 50, 'The name Tbilisi means ''warm place'' — named after these very springs, discovered in the 5th century.', true),
  ('tbilisi-city-quest', 'tbs-4', 'ivera::tbilisi-city-quest::tbs-4', 'Peace Bridge', 75, 'The Bridge of Peace was built in 2010 — a modern connection between old and new Tbilisi.', true),
  ('mtskheta-sacred-route', 'mtk-1', 'ivera::mtskheta-sacred-route::mtk-1', 'Jvari Monastery', 100, 'Jvari — ''Cross Monastery'' — was built in 605 AD on the spot where Saint Nino planted a wooden cross. Pushkin wrote about this view.', true),
  ('mtskheta-sacred-route', 'mtk-2', 'ivera::mtskheta-sacred-route::mtk-2', 'Svetitskhoveli Cathedral', 75, 'Svetitskhoveli — ''Life-Giving Pillar'' — has been rebuilt three times since the 4th century. The current structure dates to 1029 AD.', true),
  ('mtskheta-sacred-route', 'mtk-3', 'ivera::mtskheta-sacred-route::mtk-3', 'Mtskheta Old Town', 50, 'For 1,000 years, Mtskheta was a major stop on the Silk Road trade route connecting China to Europe.', true),
  ('gori-uplistsikhe-quest', 'gori-1', 'ivera::gori-uplistsikhe-quest::gori-1', 'Gori Fortress', 75, 'Gori Fortress has existed in some form since antiquity — its hilltop position made it one of the most strategically important sites in Georgia.', true),
  ('gori-uplistsikhe-quest', 'gori-2', 'ivera::gori-uplistsikhe-quest::gori-2', 'Uplistsikhe — Main Gate', 100, 'Uplistsikhe was inhabited from the early Iron Age until the 13th century. At its peak, 20,000 people lived in these rock-carved rooms.', true),
  ('gori-uplistsikhe-quest', 'gori-3', 'ivera::gori-uplistsikhe-quest::gori-3', 'Uplistsikhe — Wine Cellar', 75, 'These wine cellars are evidence that Georgians were making wine here 3,000 years ago — long before modern winemaking spread to Europe.', true),
  ('gori-uplistsikhe-quest', 'gori-4', 'ivera::gori-uplistsikhe-quest::gori-4', 'Lunch Stop', 50, 'The Georgian supra is more than a meal — it is a ritual of hospitality, storytelling, and celebration that has existed for millennia.', true),
  ('kakheti-wine-legends', 'kak-1', 'ivera::kakheti-wine-legends::kak-1', 'Bodbe Monastery', 75, 'Welcome to Bodbe — the resting place of Saint Nino, Georgia''s Enlightener. The small church above her tomb has stood here since the 4th century.', true),
  ('kakheti-wine-legends', 'kak-2', 'ivera::kakheti-wine-legends::kak-2', 'Sighnaghi — Main Viewpoint', 100, 'Sighnaghi — the City of Love — sits 800 metres above sea level. The Alazani plain below is the most fertile wine-growing valley in the Caucasus.', true),
  ('kakheti-wine-legends', 'kak-3', 'ivera::kakheti-wine-legends::kak-3', 'Sighnaghi City Walls', 75, 'These walls were built by King Erekle II in the 1780s to protect the Kakheti region. They stretch 4.5 kilometres around the city.', true),
  ('kakheti-wine-legends', 'kak-4', 'ivera::kakheti-wine-legends::kak-4', 'Wine Tasting Hall — Qvevri Cellar', 125, 'The qvevri is Georgia''s secret — a clay vessel buried in the earth, unchanged for 8,000 years. The wine inside tastes like no other wine in the world.', true),
  ('kakheti-wine-legends', 'kak-5', 'ivera::kakheti-wine-legends::kak-5', 'Traditional Supra Table', 100, 'The supra is Georgia''s most sacred tradition — a table of wine, food, song, and soul. The tamada''s toast connects everyone present across time.', true),
  ('kazbegi-mountain-quest', 'kaz-1', 'ivera::kazbegi-mountain-quest::kaz-1', 'Ananuri Fortress', 75, 'Ananuri has stood since the 16th century, reflected in the reservoir below. It survived sieges, betrayals, and centuries of Georgian history.', true),
  ('kazbegi-mountain-quest', 'kaz-2', 'ivera::kazbegi-mountain-quest::kaz-2', 'Soviet Friendship Monument', 100, 'Built in 1983 to celebrate 200 years of Georgian-Russian treaty, this circular monument sits at 2,395 metres. The view from here is endless.', true),
  ('kazbegi-mountain-quest', 'kaz-3', 'ivera::kazbegi-mountain-quest::kaz-3', 'Jvari Pass (2,379 m)', 150, 'The Jvari Pass is the highest point of the Georgian Military Highway. For centuries, merchants and armies passed here between Russia and Georgia.', true),
  ('kazbegi-mountain-quest', 'kaz-4', 'ivera::kazbegi-mountain-quest::kaz-4', 'Gergeti Trinity Church (2,170 m)', 200, 'Gergeti Trinity Church was built in the 14th century at 2,170 metres. Behind it, Mount Kazbek rises to 5,047 metres — one of the highest peaks in the Caucasus.', true),
  ('vardzia-cave-kingdom', 'var-1', 'ivera::vardzia-cave-kingdom::var-1', 'Rabati Fortress', 75, 'Rabati Fortress in Akhaltsikhe has been Georgian, Mongol, Ottoman, and Russian territory. Its walls hold layers of history from each era.', true),
  ('vardzia-cave-kingdom', 'var-2', 'ivera::vardzia-cave-kingdom::var-2', 'Vardzia — Main Entrance', 100, 'Vardzia was carved into the Erusheti mountain in the 12th century. At its peak, over 6,000 monks and civilians lived in 3,000 rooms across 13 stories.', true),
  ('vardzia-cave-kingdom', 'var-3', 'ivera::vardzia-cave-kingdom::var-3', 'Vardzia — Church of the Dormition', 125, 'The Church of the Dormition contains frescoes from the 1180s. Queen Tamar''s portrait here is one of the most important medieval artworks in the Caucasus.', true),
  ('kutaisi-martvili-canyons', 'kut-1', 'ivera::kutaisi-martvili-canyons::kut-1', 'Prometheus Cave', 100, 'Prometheus Cave was discovered in 1984. The stalactites inside formed over millions of years, one drop at a time.', true),
  ('kutaisi-martvili-canyons', 'kut-2', 'ivera::kutaisi-martvili-canyons::kut-2', 'Martvili Canyon — Entrance', 100, 'Martvili Canyon was carved by the Abasha river over millennia. The turquoise colour comes from mineral-rich spring water flowing from the mountain.', true),
  ('kutaisi-martvili-canyons', 'kut-3', 'ivera::kutaisi-martvili-canyons::kut-3', 'Martvili Canyon — Boat Point', 125, 'You are floating through limestone carved by water over millions of years. The canyon walls rise 20 metres above you on both sides.', true),
  ('batumi-black-sea-quest', 'bat-1', 'ivera::batumi-black-sea-quest::bat-1', 'Batumi Boulevard', 75, 'Batumi sits where the subtropical Caucasus meets the Black Sea — a city of palm trees, Art Nouveau buildings, and extraordinary food.', true),
  ('batumi-black-sea-quest', 'bat-2', 'ivera::batumi-black-sea-quest::bat-2', 'Alphabet Tower', 100, 'The Georgian alphabet is one of only 14 in the world to have its own distinct script. It was created in the 5th century AD.', true),
  ('batumi-black-sea-quest', 'bat-3', 'ivera::batumi-black-sea-quest::bat-3', 'Local Bakery', 100, 'Adjarian khachapuri is shaped like a boat, filled with cheese, topped with an egg and butter. It was invented here in Adjara. Nothing else compares.', true),
  ('batumi-black-sea-quest', 'bat-4', 'ivera::batumi-black-sea-quest::bat-4', 'Makhuntseti Waterfall', 150, 'Makhuntseti Waterfall plunges 15 metres into a natural pool surrounded by subtropical forest. The Queen Tamar Bridge nearby dates to the 12th century.', true)
on conflict (tour_slug, mission_id) do update set
  qr_code = excluded.qr_code,
  location_name = excluded.location_name,
  points = excluded.points,
  unlock_text = excluded.unlock_text,
  active = excluded.active;
