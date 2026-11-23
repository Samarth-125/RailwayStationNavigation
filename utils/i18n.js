import { createContext, useContext } from 'react';

// Language support: English ('en') and Hindi ('hi').
// All screen text lives in STRINGS below. Place names, map labels, directions and
// train texts are turned into Hindi by the small helpers further down.

export const LangContext = createContext('en');

const STRINGS = {
  en: {
    demoBanner: 'DEMO - SAMPLE DATA ONLY. This is not live or official railway information.',
    tabNavigate: 'Navigate', tabTrains: 'Trains', tabFacilities: 'Facilities',
    switchLang: 'हिन्दी', switchLangLabel: 'Switch to Hindi',
    station: 'Station', tapChangeStation: 'Tap to change station.',
    chooseStation: 'Choose a station', close: 'Close',
    searchPlaceholder: 'Search name, code or city (try: kashmere gate)', searchLabel: 'Search stations',
    noStation: 'No station found.', platformsCount: '{n} platforms',
    title: 'Station Navigator', from: 'From', to: 'To', choosePlace: 'Choose a place', tapChange: 'Tap to change.',
    stepFree: 'Step-free route only (no stairs)', stepFreeLabel: 'Step-free route only',
    nearestPolice: 'Nearest Police', nearestMedical: 'Nearest Medical',
    nearestPoliceLabel: 'Directions to the nearest police help booth',
    nearestMedicalLabel: 'Directions to the nearest medical room',
    directions: 'Directions', chooseDest: 'Choose a destination above.', alreadyHere: 'You are already here.',
    noRoute: 'No route found.', noRouteStepFree: 'No step-free route found.',
    destClosed: 'This place is on a closed platform. Please ask station staff for help.',
    aboutMeters: 'About {m} m (sample distances)', meters: '{m} m',
    readAloud: 'Read aloud', stop: 'Stop',
    trainsAt: 'Trains at {p} (sample)', stationMap: 'Station map',
    legendStart: 'Green = start', legendDest: 'Red = destination', legendRoute: 'Blue line = route',
    schematic: 'Schematic drawing, not to scale. This is NOT the real layout of {name}. Sample trains only.',
    wide: 'This station is wide. Scroll the map sideways.',
    mapLabel: 'Schematic map of {name} with platforms, tracks and stalls. Use the written directions to follow the route.',
    subtitle: '{name} ({id}), {city} - {n} platforms',
    tracking: 'Tracking {name} ({num})', stopTracking: 'Stop tracking',
    platformChangedNow: 'PLATFORM CHANGED: now {now} (was {was}). Directions are updated.',
    trackingLine: '{p} - expected {e} - {delay}. {when}.',
    trackedClosed: 'This platform is closed. Please ask station staff for help.',
    closedTitle: 'Closed platforms (demo)', closedNone: 'none',
    closedHint: 'Tap a platform to mark it closed or open. Routes avoid closed platforms. (Demo switch - a real app would get this from the railway.)',
    closedWord: 'CLOSED', closedBadge: 'PLATFORM CLOSED', closedSuffix: ' (CLOSED)',
    pf: 'PF {n}',
    trainBoard: 'Train board (SAMPLE)', refresh: 'Refresh', refreshLabel: 'Refresh trains',
    demoClock: 'Demo clock: {t}', nextUpdate: 'Next demo update', restart: 'Restart demo',
    loadError: 'Could not load trains. Please try again.',
    platformChangedWas: 'PLATFORM CHANGED: was {p}',
    scheduledExpected: 'Scheduled {s} - Expected {e}',
    trackingShow: 'Tracking - show directions', trackGo: 'Track and go to {p}',
    trackLabel: 'Track {name} and get directions to {p}',
    delayed: 'Delayed {n} min', onTime: 'On time',
    cancelled: 'Cancelled', departed: 'Departed', atPlatform: 'At the platform now', arrivesIn: 'Arrives in {n} min',
    facTitle: 'Nearest facilities', samplePositions: '{name} (sample positions)',
    facFrom: 'From: {from}. Step-free: {on}. Change both on the Navigate tab.', on: 'On', off: 'Off',
    helplineTitle: 'Railway helpline: 139',
    helplineText: "Indian Railways' Rail Madad helpline. For security or medical help, press 1.",
    youAreHere: 'You are here', notReachable: 'Not reachable with the current settings',
    facLabel: '{cat}. Nearest: {place}, {m} metres. Show directions.',
    facLabelNone: '{cat}. Not reachable with the current settings.',
    cat_police: 'Police help', cat_medical: 'Medical help', cat_restroom: 'Restrooms',
    cat_food: 'Food and tea stalls', cat_water: 'Drinking water', cat_atm: 'ATM',
    cat_help: 'Help desk', cat_waiting: 'Waiting room', cat_ticket: 'Ticket counter',
    stepStairs: 'Take the stairs to {to} ({m} m)', stepLift: 'Take the lift to {to} ({m} m)',
    stepRamp: 'Take the ramp to {to} ({m} m)', stepWalk: 'Walk to {to} ({m} m)',
  },
  hi: {
    demoBanner: 'डेमो - केवल नमूना डेटा। यह लाइव या आधिकारिक रेलवे जानकारी नहीं है।',
    tabNavigate: 'रास्ता', tabTrains: 'ट्रेनें', tabFacilities: 'सुविधाएँ',
    switchLang: 'English', switchLangLabel: 'अंग्रेज़ी में बदलें',
    station: 'स्टेशन', tapChangeStation: 'स्टेशन बदलने के लिए छुएँ।',
    chooseStation: 'स्टेशन चुनें', close: 'बंद करें',
    searchPlaceholder: 'नाम, कोड या शहर खोजें (जैसे: kashmere gate)', searchLabel: 'स्टेशन खोजें',
    noStation: 'कोई स्टेशन नहीं मिला।', platformsCount: '{n} प्लेटफॉर्म',
    title: 'स्टेशन नेविगेटर', from: 'कहाँ से', to: 'कहाँ तक', choosePlace: 'जगह चुनें', tapChange: 'बदलने के लिए छुएँ।',
    stepFree: 'केवल बिना सीढ़ी वाला रास्ता', stepFreeLabel: 'केवल बिना सीढ़ी वाला रास्ता',
    nearestPolice: 'नज़दीकी पुलिस', nearestMedical: 'नज़दीकी चिकित्सा',
    nearestPoliceLabel: 'नज़दीकी पुलिस सहायता केंद्र का रास्ता',
    nearestMedicalLabel: 'नज़दीकी चिकित्सा कक्ष का रास्ता',
    directions: 'रास्ता बताइए', chooseDest: 'ऊपर गंतव्य चुनें।', alreadyHere: 'आप पहले से यहीं हैं।',
    noRoute: 'कोई रास्ता नहीं मिला।', noRouteStepFree: 'बिना सीढ़ी वाला कोई रास्ता नहीं मिला।',
    destClosed: 'यह जगह बंद प्लेटफॉर्म पर है। कृपया स्टेशन कर्मचारी से मदद लें।',
    aboutMeters: 'लगभग {m} मी (नमूना दूरी)', meters: '{m} मी',
    readAloud: 'बोलकर सुनाएँ', stop: 'रोकें',
    trainsAt: '{p} पर ट्रेनें (नमूना)', stationMap: 'स्टेशन का नक्शा',
    legendStart: 'हरा = शुरुआत', legendDest: 'लाल = गंतव्य', legendRoute: 'नीली रेखा = रास्ता',
    schematic: 'योजनाबद्ध चित्र, पैमाने के अनुसार नहीं। यह {name} का असली नक्शा नहीं है। केवल नमूना ट्रेनें।',
    wide: 'यह स्टेशन चौड़ा है। नक्शे को बगल में खिसकाएँ।',
    mapLabel: '{name} का योजनाबद्ध नक्शा, जिसमें प्लेटफॉर्म, पटरियाँ और स्टॉल हैं। रास्ते के लिए लिखे निर्देश देखें।',
    subtitle: '{name} ({id}), {city} - {n} प्लेटफॉर्म',
    tracking: '{name} ({num}) को ट्रैक कर रहे हैं', stopTracking: 'ट्रैकिंग बंद करें',
    platformChangedNow: 'प्लेटफॉर्म बदला: अब {now} (पहले {was})। रास्ता अपडेट हो गया है।',
    trackingLine: '{p} - अपेक्षित {e} - {delay}। {when}।',
    trackedClosed: 'यह प्लेटफॉर्म बंद है। कृपया स्टेशन कर्मचारी से मदद लें।',
    closedTitle: 'बंद प्लेटफॉर्म (डेमो)', closedNone: 'कोई नहीं',
    closedHint: 'प्लेटफॉर्म को बंद या चालू करने के लिए छुएँ। रास्ता बंद प्लेटफॉर्म से बचकर जाएगा। (डेमो स्विच - असली ऐप में यह जानकारी रेलवे से आएगी।)',
    closedWord: 'बंद', closedBadge: 'प्लेटफॉर्म बंद', closedSuffix: ' (बंद)',
    pf: 'प्ले. {n}',
    trainBoard: 'ट्रेन बोर्ड (नमूना)', refresh: 'ताज़ा करें', refreshLabel: 'ट्रेनें ताज़ा करें',
    demoClock: 'डेमो घड़ी: {t}', nextUpdate: 'अगला डेमो अपडेट', restart: 'डेमो फिर से शुरू करें',
    loadError: 'ट्रेनें लोड नहीं हो सकीं। कृपया फिर कोशिश करें।',
    platformChangedWas: 'प्लेटफॉर्म बदला: पहले {p}',
    scheduledExpected: 'निर्धारित {s} - अपेक्षित {e}',
    trackingShow: 'ट्रैक हो रही है - रास्ता दिखाएँ', trackGo: 'ट्रैक करें और {p} पर जाएँ',
    trackLabel: '{name} को ट्रैक करें और {p} का रास्ता पाएँ',
    delayed: '{n} मिनट देरी से', onTime: 'समय पर',
    cancelled: 'रद्द', departed: 'रवाना हो चुकी', atPlatform: 'अभी प्लेटफॉर्म पर है', arrivesIn: '{n} मिनट में पहुँचेगी',
    facTitle: 'नज़दीकी सुविधाएँ', samplePositions: '{name} (नमूना स्थान)',
    facFrom: 'कहाँ से: {from}। बिना सीढ़ी: {on}। दोनों "रास्ता" टैब पर बदलें।', on: 'चालू', off: 'बंद',
    helplineTitle: 'रेलवे हेल्पलाइन: 139',
    helplineText: 'भारतीय रेल की रेल मदद हेल्पलाइन। सुरक्षा या चिकित्सा सहायता के लिए 1 दबाएँ।',
    youAreHere: 'आप यहीं हैं', notReachable: 'मौजूदा सेटिंग में पहुँचना संभव नहीं',
    facLabel: '{cat}। सबसे नज़दीक: {place}, {m} मीटर। रास्ता दिखाएँ।',
    facLabelNone: '{cat}। मौजूदा सेटिंग में पहुँचना संभव नहीं।',
    cat_police: 'पुलिस सहायता', cat_medical: 'चिकित्सा सहायता', cat_restroom: 'शौचालय',
    cat_food: 'खाने और चाय के स्टॉल', cat_water: 'पीने का पानी', cat_atm: 'एटीएम',
    cat_help: 'सहायता डेस्क', cat_waiting: 'प्रतीक्षालय', cat_ticket: 'टिकट काउंटर',
    stepStairs: '{to} तक सीढ़ियों से जाएँ ({m} मी)', stepLift: '{to} तक लिफ्ट से जाएँ ({m} मी)',
    stepRamp: '{to} तक रैंप से जाएँ ({m} मी)', stepWalk: '{to} तक पैदल चलें ({m} मी)',
  },
};

// Looks up a text and fills in {placeholders}.
export function t(lang, key, vars = {}) {
  const text = (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
  return text.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

// Every screen calls this: const { lang, t } = useI18n();
export function useI18n() {
  const lang = useContext(LangContext);
  return { lang, t: (key, vars) => t(lang, key, vars) };
}

// ---- Place names (they are built in English in data/buildStation.js) ----------
const NAMES_HI = {
  'Main Entrance': 'मुख्य प्रवेश द्वार',
  Corridor: 'गलियारा',
  'Restrooms (Concourse)': 'शौचालय (कॉनकोर्स)',
  ATM: 'एटीएम',
  'Waiting Room': 'प्रतीक्षालय',
  'Medical Room (First Aid)': 'चिकित्सा कक्ष (प्राथमिक उपचार)',
  Concourse: 'कॉनकोर्स (मुख्य हॉल)',
  'Police Help Booth': 'पुलिस सहायता केंद्र',
  'Ticket Counter': 'टिकट काउंटर',
  'Help Desk': 'सहायता डेस्क',
  'Footbridge (station end)': 'पैदल पुल (स्टेशन की ओर)',
  'Food Court (Concourse)': 'फूड कोर्ट (कॉनकोर्स)',
};
const STALLS_HI = {
  'Food Court': 'फूड कोर्ट',
  'Snack Stall': 'नाश्ता स्टॉल',
  'Tea Stall': 'चाय स्टॉल',
  'Drinking Water': 'पीने का पानी',
  Restrooms: 'शौचालय',
};

export function nameText(name, lang) {
  if (lang !== 'hi') return name;
  if (NAMES_HI[name]) return NAMES_HI[name];
  let m = /^Platform (\d+)$/.exec(name);
  if (m) return `प्लेटफॉर्म ${m[1]}`;
  m = /^Footbridge \(above Platform (\d+)\)$/.exec(name);
  if (m) return `पैदल पुल (प्लेटफॉर्म ${m[1]} के ऊपर)`;
  m = /^(.+) \(Platform (\d+)\)$/.exec(name);
  if (m && STALLS_HI[m[1]]) return `${STALLS_HI[m[1]]} (प्लेटफॉर्म ${m[2]})`;
  return name;
}

// ---- Short labels drawn on the map -------------------------------------------
const MAP_HI = {
  Entrance: 'प्रवेश', Concourse: 'कॉनकोर्स', Restroom: 'शौचालय', ATM: 'एटीएम', Waiting: 'प्रतीक्षा',
  '+ Medical': '+ चिकित्सा', Police: 'पुलिस', Tickets: 'टिकट', 'Help Desk': 'सहायता', Water: 'पानी',
  Food: 'खाना', Snack: 'नाश्ता', Tea: 'चाय', WC: 'शौचालय', ROAD: 'सड़क',
  'STATION BUILDING': 'स्टेशन भवन', FOOTBRIDGE: 'पैदल पुल',
  'STATION CONCOURSE - all platforms are at ground level': 'स्टेशन हॉल - सभी प्लेटफॉर्म ज़मीन के स्तर पर',
  CLOSED: 'बंद',
};
export function mapText(text, lang) {
  if (lang !== 'hi') return text;
  if (MAP_HI[text]) return MAP_HI[text];
  let m = /^Track (\d+)$/.exec(text);
  if (m) return `ट्रैक ${m[1]}`;
  m = /^PF (\d+)$/.exec(text);
  if (m) return `प्ले. ${m[1]}`;
  return text;
}

// ---- Station and train fields that have a Hindi twin (name / nameHi) ---------
export function field(obj, key, lang) {
  return (lang === 'hi' && obj[`${key}Hi`]) || obj[key];
}

// ---- Directions and train sentences -------------------------------------------
// step = { mode, toId, meters } from utils/findRoute.js
export function stepText(step, station, lang) {
  const to = nameText(station.placeById[step.toId].name, lang);
  const key = { stairs: 'stepStairs', lift: 'stepLift', ramp: 'stepRamp' }[step.mode] || 'stepWalk';
  return t(lang, key, { to, m: step.meters });
}

export function delayText(train, lang) {
  return train.delayMin > 0 ? t(lang, 'delayed', { n: train.delayMin }) : t(lang, 'onTime');
}

export function whenText(train, lang) {
  if (train.state === 'cancelled') return t(lang, 'cancelled');
  if (train.state === 'departed') return t(lang, 'departed');
  if (train.state === 'at_platform') return t(lang, 'atPlatform');
  return t(lang, 'arrivesIn', { n: train.etaMin });
}
