import { useLanguage } from "./LanguageContext";
import type { Language } from "./LanguageContext";

export const en = {
  // ── Navigation ──────────────────────────────────────────────────────────
  "nav.home": "Home",
  "nav.quests": "Quests",
  "nav.rewards": "Rewards",
  "nav.profile": "Profile",
  "nav.myTrip": "My Trip",

  // ── Header / notifications ──────────────────────────────────────────────
  "header.notifications": "Notifications",
  "header.pending": "pending",
  "header.noNotifications": "No notifications yet",
  "header.noNotificationsDesc": "Book a tour to see your booking status here.",
  "header.exploreTours": "Explore tours →",
  "header.viewAllBookings": "View all bookings in My Trip →",
  "header.dailyChallenge": "Daily Quest Challenge",
  "header.dailyChallengeDesc": "Top 3 today earn a free bonus seat.",
  "header.rankings": "Rankings →",
  "header.chatWhatsapp": "Chat with Levani on WhatsApp",
  "header.checkStatus": "Check status on WhatsApp",
  "header.confirmedByLevani": "Confirmed by Levani ✓",
  "header.pendingConfirmation": "Pending WhatsApp confirmation from Levani",
  "header.homeAriaLabel": "Ivera home",
  "header.logoAriaLabel": "Ivera logo mark",

  // ── Hero ─────────────────────────────────────────────────────────────────
  "hero.tagline": "✦ Georgia Travel Quests ✦",
  "hero.headline": "Your journey\nbegins in\nGeorgia.",
  "hero.subtitle":
    "Taste 8,000-year-old wine. Walk fortified mountain cities. Complete missions and earn XP on real guided tours.",
  "hero.chipLocalExpert": "Local Georgian expert",
  "hero.chipEnglishGuide": "English-speaking guide",
  "hero.chipSmallGroups": "Small private groups",
  "hero.chipWhatsappBooking": "WhatsApp booking",
  "hero.chipNoPayment": "No payment now",
  "hero.freePass": "✦ Your Explorer Pass is free — no payment needed ✦",
  "hero.startFreeNoPayment": "✦ Start free — no payment needed ✦",
  "hero.startJourney": "Start Your Journey",
  "hero.buildCustomTrip": "Build Custom Trip on WhatsApp",
  "hero.exploreRoutes": "Explore all 8 routes →",
  "hero.exploreQuestTours": "Explore Quest Tours",
  "hero.createExplorerPass": "Create Explorer Pass →",

  // ── Home page sections ──────────────────────────────────────────────────
  "home.featuredQuests": "Featured Quests",
  "home.viewAll": "View all",
  "home.discoverRegions": "Discover the Regions",
  "home.discoverMoreRegions": "Discover More Regions",
  "home.discoverRegionsDesc": "Three quest routes across Georgia's most iconic landscapes",
  "home.todaysBestDeal": "Today's Best Deal",
  "home.limitedAvailability": "Limited availability",
  "home.viewQuest": "View Quest →",
  "home.howItWorks": "How it works",
  "home.stepLabel": "STEP",
  "home.step1Title": "Start",
  "home.step1Desc": "Choose a free or paid quest.",
  "home.step2Title": "Explore",
  "home.step2Desc": "Visit real Georgian locations.",
  "home.step3Title": "Complete",
  "home.step3Desc": "Scan, solve, photograph or unlock missions.",
  "home.step4Title": "Earn",
  "home.step4Desc": "Collect XP, badges and rewards.",
  "home.step5Title": "Continue",
  "home.step5Desc": "Book your next Georgian adventure.",
  "home.trustBadge": "A real Georgian tour service",
  "home.trustHeading": "Why travellers trust Ivera",
  "home.trustChip1": "Built by local Georgian tour professionals",
  "home.trustChip2": "9+ years organising tours across Georgia",
  "home.trustChip3": "Professional guides, 6–7+ years experience",
  "home.trustChip4": "English & Russian speaking support",
  "home.trustChip5": "Experienced drivers & comfortable transport",
  "home.trustChip6": "Booking & support through WhatsApp",
  "home.trustChip7": "Paid tours include guide & transport; select tours include food",
  "home.groupDiscounts": "Group discounts",
  "home.groupDiscountsNote": "55 GEL minimum per person · best available discount applies",
  "home.needCustomItinerary": "Need a custom itinerary?",
  "home.needCustomItineraryDesc":
    "Message Levani directly on WhatsApp — personalised Georgian experiences for every traveller.",
  "home.chatWhatsapp": "Chat on WhatsApp",

  // ── Discounts ────────────────────────────────────────────────────────────
  "discount.2people": "2 people",
  "discount.3people": "3 people",
  "discount.45people": "4–5 people",
  "discount.6people": "6+ people",
  "discount.5off": "5% off",
  "discount.10off": "10% off",
  "discount.20off": "20% off",
  "discount.custom": "Custom rate",
  "discount.offSuffix": "% off",
  "discount.lastSeats": "% last seats",

  // ── Region card ──────────────────────────────────────────────────────────
  "region.exploreRoute": "Explore Route",

  // ── Tour card ────────────────────────────────────────────────────────────
  "tourCard.categoryCulture": "Culture",
  "tourCard.categoryAdventure": "Adventure",
  "tourCard.categoryWine": "Wine",
  "tourCard.categoryHeritage": "Heritage",
  "tourCard.spotsLeft": "spots left",
  "tourCard.perPerson": "/ person",
  "tourCard.viewQuest": "View Quest →",

  // ── Tours listing page ───────────────────────────────────────────────────
  "tours.title": "Georgia Travel Quests",
  "tours.available": "available",
  "tours.experience": "experience",
  "tours.experiences": "experiences",
  "tours.filterAll": "All",
  "tours.filterCulture": "Culture",
  "tours.filterAdventure": "Adventure",
  "tours.filterWine": "Wine",
  "tours.filterHeritage": "Heritage",

  // ── Tour detail page ─────────────────────────────────────────────────────
  "tourDetail.tours": "Tours",
  "tourDetail.smallPrivateGroup": "Small private group",
  "tourDetail.noPaymentNow": "No payment now",
  "tourDetail.bookThisAdventure": "Book This Adventure",
  "tourDetail.bookTodayPrefix": "Book today: +",
  "tourDetail.bookTodaySuffix": "XP added to your Explorer Pass",
  "tourDetail.route": "Route",
  "tourDetail.included": "Included",
  "tourDetail.notIncluded": "Not included",
  "tourDetail.questMissions": "Quest Missions",
  "tourDetail.xpTotal": "XP total",
  "tourDetail.unlocksOnTour": "Unlocks on the tour",
  "tourDetail.startQuest": "Start Quest ✦",
  "tourDetail.readyToGo": "Ready to go?",
  "tourDetail.messageLevani": "Message Levani directly. He confirms within 2 hours.",
  "tourDetail.englishGuide": "English guide",
  "tourDetail.smallGroup": "Small group",
  "tourDetail.bookViaWhatsapp": "Book via WhatsApp",
  "tourDetail.typeQr": "QR Scan",
  "tourDetail.typePhoto": "Photo",
  "tourDetail.typeObservation": "Observe",
  "tourDetail.typeQuiz": "Quiz",
  "tourDetail.typeTaste": "Taste",

  // ── Booking widget ───────────────────────────────────────────────────────
  "booking.title": "Book this Tour",
  "booking.selectDate": "Select date",
  "booking.numberOfPeople": "Number of people",
  "booking.customRate": "Custom rate",
  "booking.groupOf": "Group of",
  "booking.peopleAbbrev": "people",
  "booking.customGroupRatesDesc":
    "Levani builds custom group rates. He'll send you a personalised quote.",
  "booking.total": "Total",
  "booking.perPerson": "Per person",
  "booking.youSave": "You save",
  "booking.withBooking": "with this booking",
  "booking.priceOnRequest": "Price on Request",
  "booking.customQuoteSuffix": "— Levani will send a custom quote.",
  "booking.bookViaWhatsapp": "Book via WhatsApp",
  "booking.requestPriceWhatsapp": "Request Price via WhatsApp",
  "booking.requestGroupQuote": "Request Group Quote via WhatsApp",
  "booking.savingBooking": "Saving booking…",
  "booking.openingWhatsapp": "Opening WhatsApp…",
  "booking.noPaymentNote": "No payment now — Levani confirms via WhatsApp",
  "booking.pleaseSelectDate": "Please select a date before booking.",
  "booking.successTitle": "Booking Request Sent!",
  "booking.successDescription":
    "WhatsApp should have opened with your request ready. If it didn't, tap below to open it and send your booking to Levani.",
  "booking.openWhatsapp": "Open WhatsApp",
  "booking.viewMyTrip": "View My Trip",
  "booking.bookAnother": "Book Another Date",
  "booking.errorTitle": "Booking could not be saved online",
  "booking.errorDescription":
    "You can still message Levani directly on WhatsApp. Your booking won't appear in My Trip, but Levani will confirm manually.",
  "booking.continueWhatsapp": "Continue to WhatsApp (no booking ID)",
  "booking.cancel": "Cancel",
  "booking.decrease": "Decrease",
  "booking.increase": "Increase",
  "booking.person": "person",
  "booking.people": "people",
  "booking.couldNotSave": "Could not save booking. Please try again.",
  "booking.orPayOnline": "or pay online now",
  "booking.payWithPaypal": "Pay with PayPal",
  "booking.paypalCurrencyNote":
    "PayPal payments are processed in EUR. Your tour price is shown in GEL and converted at checkout.",
  "booking.paypalPreparing": "Preparing secure payment…",
  "booking.paypalSuccessTitle": "Payment Received!",
  "booking.paypalSuccessDescription":
    "Your payment was successful and your booking is confirmed. Levani will be in touch on WhatsApp with the final details.",
  "booking.paymentPolicyLink": "Payment & refund policy",

  // ── Payment policy page ───────────────────────────────────────────────────
  "paymentPolicy.back": "Back",
  "paymentPolicy.title": "Payment & Refund Policy",
  "paymentPolicy.intro":
    "A short summary of how online payments, booking confirmations, and cancellations work at Ivera.",
  "paymentPolicy.paypalTitle": "Paying with PayPal",
  "paymentPolicy.paypalBody":
    "Online payments are processed through PayPal in EUR. Tour prices are displayed in GEL (Georgian Lari) and converted to EUR at checkout using the current rate.",
  "paymentPolicy.confirmationTitle": "Booking confirmation",
  "paymentPolicy.confirmationBody":
    "Your booking is confirmed once payment is received. Levani will then message you on WhatsApp to confirm the final details — meeting point, time, and group size.",
  "paymentPolicy.refundTitle": "Cancellations & refunds",
  "paymentPolicy.refundBody":
    "Refund and cancellation terms are confirmed with Levani on WhatsApp before your tour date. If you need to change or cancel a booking, message us as early as possible.",
  "paymentPolicy.securityTitle": "Payment security",
  "paymentPolicy.securityBody":
    "Card and PayPal account details are handled entirely by PayPal — Ivera never sees or stores your payment information.",
  "paymentPolicy.contactTitle": "Questions about a payment or booking?",
  "paymentPolicy.contactBody": "Levani is happy to help with anything — payments, refunds, or changes to your booking.",
  "paymentPolicy.contactCta": "Message Levani on WhatsApp",

  // ── Combo Pass CTA ────────────────────────────────────────────────────────
  "combo.title": "Combo Explorer Pass",
  "combo.heading": "Book more. Explore more.",
  "combo.description": "Stack routes and unlock exclusive multi-tour discounts — one conversation with Levani.",
  "combo.tours": "tours",
  "combo.toursPlus": "4+ tours",
  "combo.bonusXp": "+ bonus XP",
  "combo.planCombo": "Plan a Combo on WhatsApp",

  // ── My Trip ───────────────────────────────────────────────────────────────
  "myTrip.title": "My Trip",
  "myTrip.subtitle": "Your booked tours and reservations",
  "myTrip.noTripsYet": "No trips yet",
  "myTrip.noTripsDesc": "Book a tour and it will appear here with your booking code and status updates.",
  "myTrip.exploreTours": "Explore Tours",
  "myTrip.chatWithLevani": "or chat with Levani on WhatsApp",
  "myTrip.statBooked": "Booked",
  "myTrip.statPending": "Pending",
  "myTrip.statConfirmed": "Confirmed",
  "myTrip.statCompleted": "Completed",
  "myTrip.estimatedValue": "estimated value",
  "myTrip.xpFromBookings": "XP from bookings",
  "myTrip.yourBookings": "Your Bookings",
  "myTrip.questionsAboutTrip": "Questions about your trip?",
  "myTrip.chatWithLevaniDirect": "Chat with Levani directly on WhatsApp",
  "myTrip.viewTour": "View Tour",
  "myTrip.whatsappLevani": "WhatsApp Levani",
  "myTrip.discount": "discount",
  "myTrip.saved": "saved",
  "myTrip.booking": "booking",
  "myTrip.bookings": "bookings",
  "myTrip.statusPending": "Pending confirmation",
  "myTrip.statusContacted": "WhatsApp sent",
  "myTrip.statusConfirmed": "Confirmed ✓",
  "myTrip.statusCompleted": "Completed",
  "myTrip.statusCancelled": "Cancelled",

  // ── Quest page ───────────────────────────────────────────────────────────
  "quest.activeQuest": "Active Quest",
  "quest.questXp": "Quest XP",
  "quest.questComplete": "Quest Complete!",
  "quest.youEarned": "You earned",
  "quest.unlockedThe": "and unlocked the",
  "quest.badgeSuffix": " badge.",
  "quest.viewProfile": "View Profile",
  "quest.writingChronicle": "Writing your chronicle…",
  "quest.generateChronicle": "Generate My Hero Chronicle",
  "quest.yourHeroChronicle": "✦ Your Hero Chronicle",
  "quest.sendChronicleWhatsapp": "Send Chronicle via WhatsApp",
  "quest.howWasExperience": "How was your experience? Share feedback with Levani.",
  "quest.sendFeedbackWhatsapp": "Send Feedback via WhatsApp",
  "quest.activeMissions": "Active Missions",
  "quest.scanNotePrefix": "✦ Tap",
  "quest.scanNoteSuffix": "and point your camera at the QR code posted at this location.",
  "quest.continueQuest": "Continue Quest ✦",
  "quest.chronicleFallback": "Your adventure has been recorded in the Ivera chronicles.",
  "quest.chronicleShareTitle": "My {tour} chronicle:",
  "quest.chronicleShareFooter": "— via Ivera Travel Quests",
  "quest.needClue": "Need a clue?",
  "quest.gettingClue": "Getting clue…",
  "quest.completed": "Completed",
  "quest.scanQr": "Scan QR ✦",
  "quest.scanning": "Scanning…",
  "quest.scanModalTitle": "Scan the Mission QR Code",
  "quest.scanInstructions": "Point your camera at the QR code posted at this location.",
  "quest.scanManualLabel": "Enter code manually",
  "quest.scanManualPlaceholder": "e.g. IVERA-KAK-1",
  "quest.scanManualSubmit": "Submit Code",
  "quest.scanUseCameraInstead": "Use camera instead",
  "quest.scanCameraDenied": "Camera unavailable. Enter the code printed on the card instead.",
  "quest.scanWrongMission": "That QR code doesn't match this mission. Find the code at this location and try again.",
  "quest.scanInvalidCode": "QR code not recognised. Try again or enter the code manually.",
  "quest.percentComplete": "complete",
  "quest.completeToUnlock": "Complete the quest to unlock",
  "quest.hintFallback": "Look carefully around the location. The answer is hidden in the story of this place.",

  // ── Dashboard (returning user home) ─────────────────────────────────────
  "dashboard.welcomeBack": "Welcome back,",
  "dashboard.levelAbbrev": "Lv.",
  "dashboard.editPass": "Edit Pass",
  "dashboard.questsDone": "Quests done",
  "dashboard.badges": "Badges",
  "dashboard.totalXp": "Total XP",
  "dashboard.yourNextQuest": "Your Next Quest",
  "dashboard.startQuest": "Start Quest",
  "dashboard.exploreByInterest": "Explore by Interest",
  "dashboard.yourBadges": "Your Badges",
  "dashboard.viewAllArrow": "View all →",
  "dashboard.topExplorers": "Top Explorers",
  "dashboard.seeAllArrow": "See all →",
  "dashboard.allRoutes": "All Routes",
  "dashboard.viewAll8Arrow": "View all 8 →",
  "dashboard.chatWithLevaniWhatsapp": "Chat with Levani on WhatsApp",

  // ── Explorer Pass ────────────────────────────────────────────────────────
  "explorerPass.title": "Explorer Pass",
  "explorerPass.subtitle": "Save your XP progress across all quests",
  "explorerPass.yourName": "Your name",
  "explorerPass.namePlaceholder": "Explorer name",
  "explorerPass.country": "Country",
  "explorerPass.countryPlaceholder": "Where are you from?",
  "explorerPass.imInto": "I'm into...",
  "explorerPass.saving": "Saving…",
  "explorerPass.updatePass": "Update Pass",
  "explorerPass.createPass": "Create Explorer Pass",
  "explorerPass.continueAsGuest": "Continue as Guest",
  "explorerPass.interestWine": "Wine",
  "explorerPass.interestMountains": "Mountains",
  "explorerPass.interestHistory": "History",
  "explorerPass.interestFood": "Food",
  "explorerPass.interestAdventure": "Adventure",
  "explorerPass.whatsappLabel": "WhatsApp number",
  "explorerPass.whatsappPlaceholder": "+995 555 12 34 56",
  "explorerPass.whatsappHelper": "So your guide can confirm bookings and reach you safely.",
  "explorerPass.supportLanguage": "Support language",
  "explorerPass.languageEnglish": "English",
  "explorerPass.languageRussian": "Russian",
  "explorerPass.benefitSaveXp": "Save your XP",
  "explorerPass.benefitCollectBadges": "Collect badges",
  "explorerPass.benefitTrackBookings": "Track bookings",
  "explorerPass.benefitUnlockRewards": "Unlock rewards",
  "explorerPass.benefitStayConnected": "Stay connected with your guide",

  // ── Daily Quest Challenge ────────────────────────────────────────────────
  "dailyQuest.top3Today": "Top 3 today",
  "dailyQuest.earnBonusSeat": "earn a free bonus seat on any tour.",
  "dailyQuest.rankingsArrow": "Rankings →",
  "dailyQuest.title": "Daily Quest Challenge",
  "dailyQuest.refreshesDaily": "Refreshes every day at midnight",
  "dailyQuest.descPrefix": "The",
  "dailyQuest.top3Explorers": "3 highest-scoring explorers",
  "dailyQuest.descSuffix": "each day earn a free bonus seat on any Ivera tour. Complete missions, earn XP, and claim yours.",
  "dailyQuest.place": "place",
  "dailyQuest.rank1": "1st",
  "dailyQuest.rank2": "2nd",
  "dailyQuest.rank3": "3rd",
  "dailyQuest.rank1Reward": "Free bonus seat + 500 XP",
  "dailyQuest.rank2Reward": "Free bonus seat + 250 XP",
  "dailyQuest.rank3Reward": "Free bonus seat + 100 XP",
  "dailyQuest.seeTodaysRankings": "See Today's Rankings",

  // ── Profile page ─────────────────────────────────────────────────────────
  "profile.explorerPassport": "✦ Explorer Passport",
  "profile.yourNamePlaceholder": "Your name",
  "profile.save": "Save",
  "profile.explorerFallback": "Explorer",
  "profile.level": "Level",
  "profile.tours": "Tours",
  "profile.myBookings": "My Bookings",
  "profile.viewAll": "View all",
  "profile.viewMyTrip": "View My Trip",
  "profile.yourNextAdventure": "Your Next Adventure",
  "profile.view": "View",
  "profile.passportStamps": "Passport Stamps",
  "profile.startYourJourney": "Start Your Journey",
  "profile.journeyDesc": "Complete quests across Georgia to earn XP, collect badges, and climb the leaderboard.",
  "profile.enterNameToBegin": "Enter your name to begin",
  "profile.beginAdventure": "Begin Adventure",
  "profile.browseTours": "Browse tours →",

  // ── Leaderboard page ─────────────────────────────────────────────────────
  "leaderboard.title": "Leaderboard",
  "leaderboard.demoNote": "Demo · Earn XP by completing quests to join the real rankings",
  "leaderboard.youSuffix": " (You)",
  "leaderboard.youFallback": "You",
  "leaderboard.completeToAppear": "Complete quests to appear on the leaderboard!",

  // ── Free Tbilisi Quest page ──────────────────────────────────────────────
  "freeQuest.freeQuestBadge": "FREE QUEST",
  "freeQuest.title": "Key of Tbilisi",
  "freeQuest.tryFree": "Try Ivera for free 🗝️",
  "freeQuest.introPrefix": "Complete 3 missions around central Tbilisi, earn 200 XP, and unlock the",
  "freeQuest.introBadgeName": " Key of Tbilisi",
  "freeQuest.introSuffix": " starter badge — no payment, no sign-up required.",
  "freeQuest.continueAdventure": "Continue your adventure 🗺️",
  "freeQuest.readyForFullDay": "You've seen what Ivera can do. Ready for a full day quest?",
  "freeQuest.bookKakheti": "Book Kakheti via WhatsApp",
  "freeQuest.bookKazbegi": "Book Kazbegi via WhatsApp",
  "freeQuest.viewKakhetiTour": "View Kakheti Tour",
  "freeQuest.viewKazbegiTour": "View Kazbegi Tour",
  "freeQuest.missionsHeading": "3 Missions · Central Tbilisi",
  "freeQuest.questMasterHint": "Quest Master Hint",
  "freeQuest.hintShown": "Hint shown",
  "freeQuest.needHint": "Need a hint?",
  "freeQuest.demoComplete": "Demo Complete ✦",
  "freeQuest.bottomNote": "✦ Free quest — no payment required. XP and badge saved to your Explorer Pass.",
  "freeQuest.starterQuestBadge": "Free Starter Quest",
  "freeQuest.backHomeAriaLabel": "Back home",
  "freeQuest.unlockSpirit": "Unlock the spirit of Tbilisi through 3 hidden city missions.",
  "freeQuest.missionsTimeXp": "3 missions · 20 minutes · 200 XP",
  "freeQuest.beginJourney": "Begin the Journey",
  "freeQuest.playAsGuestPrefix": "Play as a guest, or ",
  "freeQuest.createExplorerPassLink": "create your Explorer Pass",
  "freeQuest.toSaveXpBadges": " to save XP & badges.",
  "freeQuest.cityOpensClue": "✦ The city opens one clue at a time ✦",
  "freeQuest.walkDiscoverUnlock": "✦ Free quest — no payment required. Walk, discover, unlock.",

  // ── Key of Tbilisi swipe journey ─────────────────────────────────────────
  "freeQuest.previousMissionAriaLabel": "Previous mission",
  "freeQuest.nextMissionAriaLabel": "Next mission",
  "freeQuest.missionScenesAriaLabel": "Mission scenes",
  "freeQuest.missionAriaLabel": "Mission",
  "freeQuest.doneStamp": "DONE",
  "freeQuest.unlocksAfterMission": "Unlocks after Mission {n}.",
  "freeQuest.openInGoogleMaps": "Open in Google Maps",
  "freeQuest.missionCompleteLabel": "Mission Complete",
  "freeQuest.lockedLabel": "Locked",
  "freeQuest.hintLabel": "Hint",
  "freeQuest.getHintAriaLabel": "Get a hint",
  "freeQuest.completeMission": "Complete Mission",
  "freeQuest.missionCounter": "Mission {current} / {total}",
  "freeQuest.goToMissionAriaLabel": "Go to mission {n}",
  "freeQuest.lockedSuffix": " (locked)",
  "freeQuest.completedSuffix": " (completed)",

  // ── Key of Tbilisi spotlight (homepage) ──────────────────────────────────
  "freeQuest.adventureBeginsLabel": "✦ The adventure begins ✦",
  "freeQuest.startFreeQuest": "Start Free Quest",
  "freeQuest.freeToStartNote": "Free to start. Designed by local Georgian experts.",
  "freeQuest.preview1Title": "Freedom Square Signal",
  "freeQuest.preview1Location": "Freedom Square",
  "freeQuest.preview1Teaser": "A hidden city story begins here.",
  "freeQuest.preview2Title": "Old City Whisper",
  "freeQuest.preview2Location": "Narikala District",
  "freeQuest.preview2Teaser": "Carved balconies guard old secrets.",
  "freeQuest.preview3Title": "Bridge of Tomorrow",
  "freeQuest.preview3Location": "Peace Bridge",
  "freeQuest.preview3Teaser": "Where the river tells the future.",

  // ── Key of Tbilisi quest completion ──────────────────────────────────────
  "freeQuest.questCompleteLabel": "✦ Quest Complete ✦",
  "freeQuest.unlockedKeyTitle": "You unlocked the Key of Tbilisi",
  "freeQuest.firstQuestComplete": "Your first Ivera quest is complete. {xp} XP earned.",
  "freeQuest.xpEarnedLabel": "XP earned",
  "freeQuest.missionsLabel": "Missions",
  "freeQuest.createExplorerPassTitle": "Create your Explorer Pass",
  "freeQuest.saveXpBadgesRewards": "Save your XP, badges and rewards.",
  "freeQuest.readyForNextChapter": "Ready for the next chapter of Georgia?",
  "freeQuest.exploreAllQuestTours": "Explore All Quest Tours",
  "freeQuest.viewYourProfile": "View your profile →",
  "freeQuest.kakhetiTourTitle": "Kakheti Wine & Legends Quest",
  "freeQuest.kazbegiTourTitle": "Kazbegi Mountain Quest",
  "freeQuest.tbilisiAtDuskAlt": "Old Tbilisi at dusk",

  // ── Language switcher ────────────────────────────────────────────────────
  "lang.switchTo": "Switch language",
} as const;

export type DictionaryKey = keyof typeof en;

/** Maps the canonical English interest values stored on a profile to their dictionary keys. */
export const INTEREST_LABEL_KEYS: Record<string, DictionaryKey> = {
  Wine: "explorerPass.interestWine",
  Mountains: "explorerPass.interestMountains",
  History: "explorerPass.interestHistory",
  Food: "explorerPass.interestFood",
  Adventure: "explorerPass.interestAdventure",
};

/** Maps the canonical English support-language values stored on a profile to their dictionary keys. */
export const LANGUAGE_LABEL_KEYS: Record<string, DictionaryKey> = {
  English: "explorerPass.languageEnglish",
  Russian: "explorerPass.languageRussian",
};

export const ru: Record<DictionaryKey, string> = {
  // ── Navigation ──────────────────────────────────────────────────────────
  "nav.home": "Главная",
  "nav.quests": "Квесты",
  "nav.rewards": "Награды",
  "nav.profile": "Профиль",
  "nav.myTrip": "Моя поездка",

  // ── Header / notifications ──────────────────────────────────────────────
  "header.notifications": "Уведомления",
  "header.pending": "в ожидании",
  "header.noNotifications": "Пока нет уведомлений",
  "header.noNotificationsDesc": "Забронируйте тур, чтобы видеть статус заказа здесь.",
  "header.exploreTours": "Смотреть туры →",
  "header.viewAllBookings": "Все заказы в разделе «Моя поездка» →",
  "header.dailyChallenge": "Ежедневный квест-вызов",
  "header.dailyChallengeDesc": "Топ-3 сегодня получают бесплатное место в подарок.",
  "header.rankings": "Рейтинг →",
  "header.chatWhatsapp": "Написать Левани в WhatsApp",
  "header.checkStatus": "Проверить статус в WhatsApp",
  "header.confirmedByLevani": "Подтверждено Левани ✓",
  "header.pendingConfirmation": "Ожидает подтверждения от Левани в WhatsApp",
  "header.homeAriaLabel": "Главная Ivera",
  "header.logoAriaLabel": "Логотип Ivera",

  // ── Hero ─────────────────────────────────────────────────────────────────
  "hero.tagline": "✦ Тур-квесты по Грузии ✦",
  "hero.headline": "Ваше путешествие\nначинается в\nГрузии.",
  "hero.subtitle":
    "Попробуйте вино с 8000-летней историей. Пройдите по укреплённым горным городам. Выполняйте задания и получайте опыт в настоящих гид-турах.",
  "hero.chipLocalExpert": "Местный гид-эксперт",
  "hero.chipEnglishGuide": "Гид со знанием английского",
  "hero.chipSmallGroups": "Маленькие частные группы",
  "hero.chipWhatsappBooking": "Бронирование через WhatsApp",
  "hero.chipNoPayment": "Оплата не требуется сейчас",
  "hero.freePass": "✦ Ваш Explorer Pass бесплатный — оплата не требуется ✦",
  "hero.startFreeNoPayment": "✦ Бесплатный старт — оплата не требуется ✦",
  "hero.startJourney": "Начать путешествие",
  "hero.buildCustomTrip": "Собрать индивидуальный тур в WhatsApp",
  "hero.exploreRoutes": "Все 8 маршрутов →",
  "hero.exploreQuestTours": "Все квест-туры",
  "hero.createExplorerPass": "Создать Explorer Pass →",

  // ── Home page sections ──────────────────────────────────────────────────
  "home.featuredQuests": "Популярные квесты",
  "home.viewAll": "Все туры",
  "home.discoverRegions": "Откройте регионы",
  "home.discoverMoreRegions": "Другие регионы",
  "home.discoverRegionsDesc": "Три маршрута-квеста по самым знаковым местам Грузии",
  "home.todaysBestDeal": "Лучшее предложение дня",
  "home.limitedAvailability": "Места ограничены",
  "home.viewQuest": "Смотреть квест →",
  "home.howItWorks": "Как это работает",
  "home.stepLabel": "ШАГ",
  "home.step1Title": "Старт",
  "home.step1Desc": "Выберите бесплатный или платный квест.",
  "home.step2Title": "Исследуйте",
  "home.step2Desc": "Посетите настоящие места Грузии.",
  "home.step3Title": "Выполняйте",
  "home.step3Desc": "Сканируйте, решайте, фотографируйте и открывайте задания.",
  "home.step4Title": "Получайте",
  "home.step4Desc": "Собирайте опыт, значки и награды.",
  "home.step5Title": "Продолжайте",
  "home.step5Desc": "Забронируйте следующее приключение по Грузии.",
  "home.trustBadge": "Настоящая грузинская туристическая компания",
  "home.trustHeading": "Почему путешественники доверяют Ivera",
  "home.trustChip1": "Создано грузинскими профессионалами туристической отрасли",
  "home.trustChip2": "9+ лет организации туров по Грузии",
  "home.trustChip3": "Профессиональные гиды с опытом 6–7+ лет",
  "home.trustChip4": "Поддержка на английском и русском языках",
  "home.trustChip5": "Опытные водители и комфортный транспорт",
  "home.trustChip6": "Бронирование и поддержка через WhatsApp",
  "home.trustChip7": "В платные туры включены гид и транспорт; в некоторые — питание",
  "home.groupDiscounts": "Групповые скидки",
  "home.groupDiscountsNote": "Минимум 55 лари с человека · применяется лучшая доступная скидка",
  "home.needCustomItinerary": "Нужен индивидуальный маршрут?",
  "home.needCustomItineraryDesc":
    "Напишите Левани напрямую в WhatsApp — индивидуальные впечатления от Грузии для каждого путешественника.",
  "home.chatWhatsapp": "Написать в WhatsApp",

  // ── Discounts ────────────────────────────────────────────────────────────
  "discount.2people": "2 человека",
  "discount.3people": "3 человека",
  "discount.45people": "4–5 человек",
  "discount.6people": "6+ человек",
  "discount.5off": "Скидка 5%",
  "discount.10off": "Скидка 10%",
  "discount.20off": "Скидка 20%",
  "discount.custom": "Индивидуальная цена",
  "discount.offSuffix": "% скидка",
  "discount.lastSeats": "% на последние места",

  // ── Region card ──────────────────────────────────────────────────────────
  "region.exploreRoute": "Смотреть маршрут",

  // ── Tour card ────────────────────────────────────────────────────────────
  "tourCard.categoryCulture": "Культура",
  "tourCard.categoryAdventure": "Приключения",
  "tourCard.categoryWine": "Вино",
  "tourCard.categoryHeritage": "Наследие",
  "tourCard.spotsLeft": "мест осталось",
  "tourCard.perPerson": "/ чел.",
  "tourCard.viewQuest": "Смотреть квест →",

  // ── Tours listing page ───────────────────────────────────────────────────
  "tours.title": "Тур-квесты по Грузии",
  "tours.available": "доступно",
  "tours.experience": "тур",
  "tours.experiences": "туров",
  "tours.filterAll": "Все",
  "tours.filterCulture": "Культура",
  "tours.filterAdventure": "Приключения",
  "tours.filterWine": "Вино",
  "tours.filterHeritage": "Наследие",

  // ── Tour detail page ─────────────────────────────────────────────────────
  "tourDetail.tours": "Туры",
  "tourDetail.smallPrivateGroup": "Маленькая частная группа",
  "tourDetail.noPaymentNow": "Оплата не требуется сейчас",
  "tourDetail.bookThisAdventure": "Забронировать это приключение",
  "tourDetail.bookTodayPrefix": "Забронируйте сегодня: +",
  "tourDetail.bookTodaySuffix": "опыта будет добавлено в ваш Explorer Pass",
  "tourDetail.route": "Маршрут",
  "tourDetail.included": "Включено",
  "tourDetail.notIncluded": "Не включено",
  "tourDetail.questMissions": "Задания квеста",
  "tourDetail.xpTotal": "опыта всего",
  "tourDetail.unlocksOnTour": "Откроется во время тура",
  "tourDetail.startQuest": "Начать квест ✦",
  "tourDetail.readyToGo": "Готовы отправиться?",
  "tourDetail.messageLevani": "Напишите Левани напрямую. Он подтвердит в течение 2 часов.",
  "tourDetail.englishGuide": "Гид со знанием английского",
  "tourDetail.smallGroup": "Маленькая группа",
  "tourDetail.bookViaWhatsapp": "Забронировать через WhatsApp",
  "tourDetail.typeQr": "Сканировать QR",
  "tourDetail.typePhoto": "Фото",
  "tourDetail.typeObservation": "Наблюдение",
  "tourDetail.typeQuiz": "Квиз",
  "tourDetail.typeTaste": "Дегустация",

  // ── Booking widget ───────────────────────────────────────────────────────
  "booking.title": "Забронировать тур",
  "booking.selectDate": "Выберите дату",
  "booking.numberOfPeople": "Количество человек",
  "booking.customRate": "Индивидуальная цена",
  "booking.groupOf": "Группа из",
  "booking.peopleAbbrev": "человек",
  "booking.customGroupRatesDesc":
    "Левани составляет индивидуальные групповые тарифы. Он отправит вам персональное предложение.",
  "booking.total": "Итого",
  "booking.perPerson": "За человека",
  "booking.youSave": "Вы экономите",
  "booking.withBooking": "с этим бронированием",
  "booking.priceOnRequest": "Цена по запросу",
  "booking.customQuoteSuffix": "— Левани отправит индивидуальное предложение.",
  "booking.bookViaWhatsapp": "Забронировать через WhatsApp",
  "booking.requestPriceWhatsapp": "Запросить цену в WhatsApp",
  "booking.requestGroupQuote": "Запросить групповое предложение в WhatsApp",
  "booking.savingBooking": "Сохранение бронирования…",
  "booking.openingWhatsapp": "Открываем WhatsApp…",
  "booking.noPaymentNote": "Оплата не требуется — Левани подтвердит через WhatsApp",
  "booking.pleaseSelectDate": "Пожалуйста, выберите дату перед бронированием.",
  "booking.successTitle": "Заявка на бронирование отправлена!",
  "booking.successDescription":
    "WhatsApp должен был открыться с готовым сообщением. Если это не произошло, нажмите ниже, чтобы открыть его и отправить заявку Левани.",
  "booking.openWhatsapp": "Открыть WhatsApp",
  "booking.viewMyTrip": "Моя поездка",
  "booking.bookAnother": "Забронировать другую дату",
  "booking.errorTitle": "Не удалось сохранить бронирование онлайн",
  "booking.errorDescription":
    "Вы всё равно можете написать Левани напрямую в WhatsApp. Бронирование не появится в разделе «Моя поездка», но Левани подтвердит его вручную.",
  "booking.continueWhatsapp": "Перейти в WhatsApp (без номера заявки)",
  "booking.cancel": "Отмена",
  "booking.decrease": "Уменьшить",
  "booking.increase": "Увеличить",
  "booking.person": "человек",
  "booking.people": "человек",
  "booking.couldNotSave": "Не удалось сохранить бронирование. Попробуйте снова.",
  "booking.orPayOnline": "или оплатите онлайн",
  "booking.payWithPaypal": "Оплатить через PayPal",
  "booking.paypalCurrencyNote":
    "Платежи через PayPal обрабатываются в евро (EUR). Цена тура указана в лари (GEL) и конвертируется при оплате.",
  "booking.paypalPreparing": "Подготовка безопасной оплаты…",
  "booking.paypalSuccessTitle": "Оплата получена!",
  "booking.paypalSuccessDescription":
    "Оплата прошла успешно, бронирование подтверждено. Левани свяжется с вами в WhatsApp, чтобы уточнить детали.",
  "booking.paymentPolicyLink": "Условия оплаты и возврата",

  // ── Payment policy page ───────────────────────────────────────────────────
  "paymentPolicy.back": "Назад",
  "paymentPolicy.title": "Условия оплаты и возврата",
  "paymentPolicy.intro":
    "Краткое описание того, как работают онлайн-платежи, подтверждение бронирования и отмены в Ivera.",
  "paymentPolicy.paypalTitle": "Оплата через PayPal",
  "paymentPolicy.paypalBody":
    "Онлайн-платежи обрабатываются через PayPal в евро (EUR). Цены на туры указаны в лари (GEL) и конвертируются в евро при оплате по текущему курсу.",
  "paymentPolicy.confirmationTitle": "Подтверждение бронирования",
  "paymentPolicy.confirmationBody":
    "Ваше бронирование подтверждается после получения оплаты. После этого Левани напишет вам в WhatsApp, чтобы уточнить детали — место встречи, время и состав группы.",
  "paymentPolicy.refundTitle": "Отмена и возврат средств",
  "paymentPolicy.refundBody":
    "Условия отмены и возврата средств согласовываются с Левани в WhatsApp до даты тура. Если вам нужно изменить или отменить бронирование, напишите нам как можно раньше.",
  "paymentPolicy.securityTitle": "Безопасность платежей",
  "paymentPolicy.securityBody":
    "Данные карты и аккаунта PayPal обрабатываются исключительно PayPal — Ivera никогда не видит и не хранит информацию о вашей оплате.",
  "paymentPolicy.contactTitle": "Вопросы по оплате или бронированию?",
  "paymentPolicy.contactBody": "Левани всегда готов помочь — с оплатой, возвратом средств или изменениями в бронировании.",
  "paymentPolicy.contactCta": "Написать Левани в WhatsApp",

  // ── Combo Pass CTA ────────────────────────────────────────────────────────
  "combo.title": "Комбо Explorer Pass",
  "combo.heading": "Бронируйте больше. Исследуйте больше.",
  "combo.description": "Объединяйте маршруты и получайте эксклюзивные скидки за несколько туров — всего один разговор с Левани.",
  "combo.tours": "туров",
  "combo.toursPlus": "4+ туров",
  "combo.bonusXp": "+ бонусный опыт",
  "combo.planCombo": "Спланировать комбо в WhatsApp",

  // ── My Trip ───────────────────────────────────────────────────────────────
  "myTrip.title": "Моя поездка",
  "myTrip.subtitle": "Ваши забронированные туры и заявки",
  "myTrip.noTripsYet": "Пока нет поездок",
  "myTrip.noTripsDesc": "Забронируйте тур, и он появится здесь с кодом бронирования и статусом.",
  "myTrip.exploreTours": "Смотреть туры",
  "myTrip.chatWithLevani": "или напишите Левани в WhatsApp",
  "myTrip.statBooked": "Забронировано",
  "myTrip.statPending": "В ожидании",
  "myTrip.statConfirmed": "Подтверждено",
  "myTrip.statCompleted": "Завершено",
  "myTrip.estimatedValue": "ориентировочная стоимость",
  "myTrip.xpFromBookings": "опыта за бронирования",
  "myTrip.yourBookings": "Ваши бронирования",
  "myTrip.questionsAboutTrip": "Вопросы о поездке?",
  "myTrip.chatWithLevaniDirect": "Напишите Левани напрямую в WhatsApp",
  "myTrip.viewTour": "К туру",
  "myTrip.whatsappLevani": "WhatsApp Левани",
  "myTrip.discount": "скидка",
  "myTrip.saved": "экономия",
  "myTrip.booking": "бронирование",
  "myTrip.bookings": "бронирований",
  "myTrip.statusPending": "Ожидает подтверждения",
  "myTrip.statusContacted": "Отправлено в WhatsApp",
  "myTrip.statusConfirmed": "Подтверждено ✓",
  "myTrip.statusCompleted": "Завершено",
  "myTrip.statusCancelled": "Отменено",

  // ── Quest page ───────────────────────────────────────────────────────────
  "quest.activeQuest": "Активный квест",
  "quest.questXp": "Опыт квеста",
  "quest.questComplete": "Квест завершён!",
  "quest.youEarned": "Вы получили",
  "quest.unlockedThe": "и открыли значок",
  "quest.badgeSuffix": ".",
  "quest.viewProfile": "Профиль",
  "quest.writingChronicle": "Пишем вашу хронику…",
  "quest.generateChronicle": "Создать хронику героя",
  "quest.yourHeroChronicle": "✦ Ваша хроника героя",
  "quest.sendChronicleWhatsapp": "Отправить хронику в WhatsApp",
  "quest.howWasExperience": "Как вам понравилось? Поделитесь отзывом с Левани.",
  "quest.sendFeedbackWhatsapp": "Отправить отзыв в WhatsApp",
  "quest.activeMissions": "Текущие задания",
  "quest.scanNotePrefix": "✦ Нажмите",
  "quest.scanNoteSuffix": "и наведите камеру на QR-код, размещённый в этой точке.",
  "quest.continueQuest": "Продолжить квест ✦",
  "quest.chronicleFallback": "Ваше приключение записано в хрониках Ivera.",
  "quest.chronicleShareTitle": "Моя хроника тура «{tour}»:",
  "quest.chronicleShareFooter": "— через Ivera Travel Quests",
  "quest.needClue": "Нужна подсказка?",
  "quest.gettingClue": "Получаем подсказку…",
  "quest.completed": "Выполнено",
  "quest.scanQr": "Сканировать QR ✦",
  "quest.scanning": "Сканирование…",
  "quest.scanModalTitle": "Сканируйте QR-код задания",
  "quest.scanInstructions": "Наведите камеру на QR-код, размещённый в этой точке.",
  "quest.scanManualLabel": "Ввести код вручную",
  "quest.scanManualPlaceholder": "например, IVERA-KAK-1",
  "quest.scanManualSubmit": "Отправить код",
  "quest.scanUseCameraInstead": "Использовать камеру",
  "quest.scanCameraDenied": "Камера недоступна. Введите код, указанный на карточке.",
  "quest.scanWrongMission": "Этот QR-код не подходит к этому заданию. Найдите код в этой точке и попробуйте снова.",
  "quest.scanInvalidCode": "QR-код не распознан. Попробуйте снова или введите код вручную.",
  "quest.percentComplete": "выполнено",
  "quest.completeToUnlock": "Завершите квест, чтобы открыть",
  "quest.hintFallback": "Внимательно осмотритесь вокруг. Ответ скрыт в истории этого места.",

  // ── Dashboard (returning user home) ─────────────────────────────────────
  "dashboard.welcomeBack": "С возвращением,",
  "dashboard.levelAbbrev": "Ур.",
  "dashboard.editPass": "Изменить Pass",
  "dashboard.questsDone": "Квестов пройдено",
  "dashboard.badges": "Значков",
  "dashboard.totalXp": "Всего опыта",
  "dashboard.yourNextQuest": "Ваш следующий квест",
  "dashboard.startQuest": "Начать квест",
  "dashboard.exploreByInterest": "Выбрать по интересам",
  "dashboard.yourBadges": "Ваши значки",
  "dashboard.viewAllArrow": "Все →",
  "dashboard.topExplorers": "Топ исследователей",
  "dashboard.seeAllArrow": "Все →",
  "dashboard.allRoutes": "Все маршруты",
  "dashboard.viewAll8Arrow": "Все 8 →",
  "dashboard.chatWithLevaniWhatsapp": "Написать Левани в WhatsApp",

  // ── Explorer Pass ────────────────────────────────────────────────────────
  "explorerPass.title": "Explorer Pass",
  "explorerPass.subtitle": "Сохраните свой опыт во всех квестах",
  "explorerPass.yourName": "Ваше имя",
  "explorerPass.namePlaceholder": "Имя исследователя",
  "explorerPass.country": "Страна",
  "explorerPass.countryPlaceholder": "Откуда вы?",
  "explorerPass.imInto": "Мне интересно...",
  "explorerPass.saving": "Сохранение…",
  "explorerPass.updatePass": "Обновить Pass",
  "explorerPass.createPass": "Создать Explorer Pass",
  "explorerPass.continueAsGuest": "Продолжить как гость",
  "explorerPass.interestWine": "Вино",
  "explorerPass.interestMountains": "Горы",
  "explorerPass.interestHistory": "История",
  "explorerPass.interestFood": "Еда",
  "explorerPass.interestAdventure": "Приключения",
  "explorerPass.whatsappLabel": "Номер WhatsApp",
  "explorerPass.whatsappPlaceholder": "+995 555 12 34 56",
  "explorerPass.whatsappHelper": "Чтобы гид мог подтвердить бронирование и связаться с вами.",
  "explorerPass.supportLanguage": "Язык поддержки",
  "explorerPass.languageEnglish": "Английский",
  "explorerPass.languageRussian": "Русский",
  "explorerPass.benefitSaveXp": "Сохраняйте свой опыт",
  "explorerPass.benefitCollectBadges": "Собирайте значки",
  "explorerPass.benefitTrackBookings": "Следите за бронированиями",
  "explorerPass.benefitUnlockRewards": "Открывайте награды",
  "explorerPass.benefitStayConnected": "Оставайтесь на связи с гидом",

  // ── Daily Quest Challenge ────────────────────────────────────────────────
  "dailyQuest.top3Today": "Топ-3 сегодня",
  "dailyQuest.earnBonusSeat": "получают бесплатное место на любой тур.",
  "dailyQuest.rankingsArrow": "Рейтинг →",
  "dailyQuest.title": "Ежедневный квест-вызов",
  "dailyQuest.refreshesDaily": "Обновляется каждый день в полночь",
  "dailyQuest.descPrefix": "",
  "dailyQuest.top3Explorers": "3 лучших исследователя",
  "dailyQuest.descSuffix": "каждый день получают бесплатное место на любой тур Ivera. Выполняйте задания, получайте опыт и забирайте свою награду.",
  "dailyQuest.place": "место",
  "dailyQuest.rank1": "1-е",
  "dailyQuest.rank2": "2-е",
  "dailyQuest.rank3": "3-е",
  "dailyQuest.rank1Reward": "Бесплатное место + 500 опыта",
  "dailyQuest.rank2Reward": "Бесплатное место + 250 опыта",
  "dailyQuest.rank3Reward": "Бесплатное место + 100 опыта",
  "dailyQuest.seeTodaysRankings": "Смотреть рейтинг за сегодня",

  // ── Profile page ─────────────────────────────────────────────────────────
  "profile.explorerPassport": "✦ Паспорт исследователя",
  "profile.yourNamePlaceholder": "Ваше имя",
  "profile.save": "Сохранить",
  "profile.explorerFallback": "Исследователь",
  "profile.level": "Уровень",
  "profile.tours": "Туры",
  "profile.myBookings": "Мои бронирования",
  "profile.viewAll": "Все",
  "profile.viewMyTrip": "К поездке",
  "profile.yourNextAdventure": "Ваше следующее приключение",
  "profile.view": "Смотреть",
  "profile.passportStamps": "Печати в паспорте",
  "profile.startYourJourney": "Начните своё путешествие",
  "profile.journeyDesc": "Выполняйте квесты по всей Грузии, чтобы получать опыт, собирать значки и подниматься в рейтинге.",
  "profile.enterNameToBegin": "Введите имя, чтобы начать",
  "profile.beginAdventure": "Начать приключение",
  "profile.browseTours": "Смотреть туры →",

  // ── Leaderboard page ─────────────────────────────────────────────────────
  "leaderboard.title": "Рейтинг",
  "leaderboard.demoNote": "Демо · Получайте опыт за квесты, чтобы войти в настоящий рейтинг",
  "leaderboard.youSuffix": " (Вы)",
  "leaderboard.youFallback": "Вы",
  "leaderboard.completeToAppear": "Выполняйте квесты, чтобы попасть в рейтинг!",

  // ── Free Tbilisi Quest page ──────────────────────────────────────────────
  "freeQuest.freeQuestBadge": "БЕСПЛАТНЫЙ КВЕСТ",
  "freeQuest.title": "Ключ Тбилиси",
  "freeQuest.tryFree": "Попробуйте Ivera бесплатно 🗝️",
  "freeQuest.introPrefix": "Выполните 3 задания в центре Тбилиси, получите 200 опыта и откройте стартовый значок",
  "freeQuest.introBadgeName": " «Ключ Тбилиси»",
  "freeQuest.introSuffix": " — без оплаты и регистрации.",
  "freeQuest.continueAdventure": "Продолжите своё приключение 🗺️",
  "freeQuest.readyForFullDay": "Вы увидели, что умеет Ivera. Готовы к полноценному квесту на целый день?",
  "freeQuest.bookKakheti": "Забронировать Кахетию через WhatsApp",
  "freeQuest.bookKazbegi": "Забронировать Казбеги через WhatsApp",
  "freeQuest.viewKakhetiTour": "Тур по Кахетии",
  "freeQuest.viewKazbegiTour": "Тур по Казбеги",
  "freeQuest.missionsHeading": "3 задания · Центр Тбилиси",
  "freeQuest.questMasterHint": "Подсказка мастера квестов",
  "freeQuest.hintShown": "Подсказка показана",
  "freeQuest.needHint": "Нужна подсказка?",
  "freeQuest.demoComplete": "Демо-выполнение ✦",
  "freeQuest.bottomNote": "✦ Бесплатный квест — без оплаты. Опыт и значок сохраняются в вашем Explorer Pass.",
  "freeQuest.starterQuestBadge": "Бесплатный стартовый квест",
  "freeQuest.backHomeAriaLabel": "На главную",
  "freeQuest.unlockSpirit": "Откройте дух Тбилиси через 3 скрытых городских задания.",
  "freeQuest.missionsTimeXp": "3 задания · 20 минут · 200 опыта",
  "freeQuest.beginJourney": "Начать путешествие",
  "freeQuest.playAsGuestPrefix": "Играйте как гость или ",
  "freeQuest.createExplorerPassLink": "создайте Explorer Pass",
  "freeQuest.toSaveXpBadges": ", чтобы сохранить опыт и значки.",
  "freeQuest.cityOpensClue": "✦ Город раскрывает по одной подсказке ✦",
  "freeQuest.walkDiscoverUnlock": "✦ Бесплатный квест — без оплаты. Идите, открывайте, разблокируйте.",

  // ── Key of Tbilisi swipe journey ─────────────────────────────────────────
  "freeQuest.previousMissionAriaLabel": "Предыдущее задание",
  "freeQuest.nextMissionAriaLabel": "Следующее задание",
  "freeQuest.missionScenesAriaLabel": "Сцены заданий",
  "freeQuest.missionAriaLabel": "Задание",
  "freeQuest.doneStamp": "ГОТОВО",
  "freeQuest.unlocksAfterMission": "Открывается после задания {n}.",
  "freeQuest.openInGoogleMaps": "Открыть в Google Maps",
  "freeQuest.missionCompleteLabel": "Задание выполнено",
  "freeQuest.lockedLabel": "Заблокировано",
  "freeQuest.hintLabel": "Подсказка",
  "freeQuest.getHintAriaLabel": "Получить подсказку",
  "freeQuest.completeMission": "Выполнить задание",
  "freeQuest.missionCounter": "Задание {current} / {total}",
  "freeQuest.goToMissionAriaLabel": "Перейти к заданию {n}",
  "freeQuest.lockedSuffix": " (заблокировано)",
  "freeQuest.completedSuffix": " (выполнено)",

  // ── Key of Tbilisi spotlight (homepage) ──────────────────────────────────
  "freeQuest.adventureBeginsLabel": "✦ Приключение начинается ✦",
  "freeQuest.startFreeQuest": "Начать бесплатный квест",
  "freeQuest.freeToStartNote": "Бесплатный старт. Разработано местными грузинскими экспертами.",
  "freeQuest.preview1Title": "Сигнал площади Свободы",
  "freeQuest.preview1Location": "Площадь Свободы",
  "freeQuest.preview1Teaser": "Здесь начинается скрытая история города.",
  "freeQuest.preview2Title": "Шёпот старого города",
  "freeQuest.preview2Location": "Район Нарикала",
  "freeQuest.preview2Teaser": "Резные балконы хранят старые секреты.",
  "freeQuest.preview3Title": "Мост будущего",
  "freeQuest.preview3Location": "Мост Мира",
  "freeQuest.preview3Teaser": "Где река рассказывает о будущем.",

  // ── Key of Tbilisi quest completion ──────────────────────────────────────
  "freeQuest.questCompleteLabel": "✦ Квест завершён ✦",
  "freeQuest.unlockedKeyTitle": "Вы открыли Ключ Тбилиси",
  "freeQuest.firstQuestComplete": "Ваш первый квест Ivera завершён. Получено {xp} опыта.",
  "freeQuest.xpEarnedLabel": "Опыт получен",
  "freeQuest.missionsLabel": "Задания",
  "freeQuest.createExplorerPassTitle": "Создайте Explorer Pass",
  "freeQuest.saveXpBadgesRewards": "Сохраните свой опыт, значки и награды.",
  "freeQuest.readyForNextChapter": "Готовы к следующей главе Грузии?",
  "freeQuest.exploreAllQuestTours": "Все квест-туры",
  "freeQuest.viewYourProfile": "Посмотреть профиль →",
  "freeQuest.kakhetiTourTitle": "Квест «Вино и легенды Кахетии»",
  "freeQuest.kazbegiTourTitle": "Горный квест Казбеги",
  "freeQuest.tbilisiAtDuskAlt": "Старый Тбилиси в сумерках",

  // ── Language switcher ────────────────────────────────────────────────────
  "lang.switchTo": "Переключить язык",
};

const dictionaries: Record<Language, Record<DictionaryKey, string>> = { en, ru };

export function useTranslation() {
  const { language, setLanguage, toggleLanguage } = useLanguage();
  const dict = dictionaries[language];

  function t(key: DictionaryKey): string {
    return dict[key];
  }

  return { t, language, setLanguage, toggleLanguage };
}

/** Russian plural helper: picks the form matching `count` (1, 2-4, 5+). */
export function ruPlural(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** "{completed} / {total} missions" / "{completed} / {total} заданий" */
export function formatMissionsProgress(completed: number, total: number, language: Language): string {
  const word =
    language === "ru"
      ? ruPlural(total, "задание", "задания", "заданий")
      : total === 1
        ? "mission"
        : "missions";
  return `${completed} / ${total} ${word}`;
}

/** "{count} missions remaining" / "Осталось {count} заданий" */
export function formatMissionsRemaining(count: number, language: Language): string {
  if (language === "ru") {
    return `Осталось ${count} ${ruPlural(count, "задание", "задания", "заданий")}`;
  }
  return `${count} ${count === 1 ? "mission" : "missions"} remaining`;
}

/** "{remaining} XP to reach Level {nextLevel}" / "Осталось {remaining} XP до уровня {nextLevel}" */
export function formatXpToNextLevel(remaining: number, nextLevel: number, language: Language): string {
  if (language === "ru") {
    return `Осталось ${remaining} XP до уровня ${nextLevel}`;
  }
  return `${remaining} XP to reach Level ${nextLevel}`;
}

/** "{earned} / {total} earned" / "{earned} / {total} получено" */
export function formatBadgesEarned(earned: number, total: number, language: Language): string {
  return language === "ru" ? `${earned} / ${total} получено` : `${earned} / ${total} earned`;
}

/** Formats a "YYYY-MM-DD" date string as a localized short date. */
export function formatDate(dateStr: string, language: Language): string {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString(
      language === "ru" ? "ru-RU" : "en-GB",
      { day: "numeric", month: "short", year: "numeric" }
    );
  } catch {
    return dateStr;
  }
}
