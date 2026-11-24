// SAMPLE DATA ONLY - made-up trains, routes and times.
// These are NOT real trains, timings or platforms.

// Trains as first planned. Times are "HH:MM".
export const baseTrains = [
  { id: 't1', number: 'DEMO-101', name: 'Sample Express', nameHi: 'सैंपल एक्सप्रेस', route: 'Sample City A to Sample City B', routeHi: 'नमूना शहर A से नमूना शहर B', scheduled: '10:15', platformId: 'p1' },
  { id: 't2', number: 'DEMO-202', name: 'Demo Intercity', nameHi: 'डेमो इंटरसिटी', route: 'Sample City C to Sample City A', routeHi: 'नमूना शहर C से नमूना शहर A', scheduled: '10:40', platformId: 'p2' },
  { id: 't3', number: 'DEMO-303', name: 'Test Passenger', nameHi: 'टेस्ट पैसेंजर', route: 'Sample City B to Sample City D', routeHi: 'नमूना शहर B से नमूना शहर D', scheduled: '11:05', platformId: 'p3' },
  { id: 't5', number: 'DEMO-505', name: 'Sample Superfast', nameHi: 'सैंपल सुपरफास्ट', route: 'Sample City A to Sample City D', routeHi: 'नमूना शहर A से नमूना शहर D', scheduled: '10:30', platformId: 'p4' },
  { id: 't6', number: 'DEMO-606', name: 'Demo Local', nameHi: 'डेमो लोकल', route: 'Sample City E to Sample City B', routeHi: 'नमूना शहर E से नमूना शहर B', scheduled: '11:15', platformId: 'p5' },
  { id: 't4', number: 'DEMO-404', name: 'Example Mail', nameHi: 'एग्ज़ाम्पल मेल', route: 'Sample City D to Sample City C', routeHi: 'नमूना शहर D से नमूना शहर C', scheduled: '11:30', platformId: 'p2' },
];

// A pretend story, so you can show delays and platform changes in the demo.
// The demo clock runs by itself. When it reaches a step's time ('now'), that step's
// changes happen. Changes add up: the 10:20 step also includes the earlier ones.
export const demoSteps = [
  { now: '10:00', note: 'All trains on time.', noteHi: 'सभी ट्रेनें समय पर हैं।', changes: {} },
  { now: '10:05', note: 'Sample Express is a little late.', noteHi: 'सैंपल एक्सप्रेस थोड़ी देरी से है।', changes: { t1: { delayMin: 8 } } },
  { now: '10:10', note: 'Demo Intercity is delayed.', noteHi: 'डेमो इंटरसिटी देरी से है।', changes: { t2: { delayMin: 12 } } },
  { now: '10:20', note: 'Test Passenger moves to Platform 1.', noteHi: 'टेस्ट पैसेंजर प्लेटफॉर्म 1 पर आएगी।', changes: { t3: { platformId: 'p1' } } },
  { now: '10:25', note: 'Sample Express is at the platform. Demo Intercity delay grows.', noteHi: 'सैंपल एक्सप्रेस प्लेटफॉर्म पर है। डेमो इंटरसिटी की देरी बढ़ गई।', changes: { t2: { delayMin: 25 } } },
  { now: '11:00', note: 'Example Mail is delayed too.', noteHi: 'एग्ज़ाम्पल मेल भी देरी से है।', changes: { t4: { delayMin: 10 } } },
  { now: '11:10', note: 'Demo Local is delayed.', noteHi: 'डेमो लोकल देरी से है।', changes: { t6: { delayMin: 15 } } },
];
