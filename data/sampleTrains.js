import { STATION_LIST } from './stationList';
import { toClock, toMinutes } from '../utils/trainStatus';

// SAMPLE DATA ONLY - made-up trains, routes, times and platforms.
// These are NOT real trains and NOT a real timetable.
//
// For every station we make up ONE train to each of the other stations, so the
// "From -> To" form always has an answer. Everything is worked out from the station
// codes, so it is the same every time you run the app (no random numbers):
//  - the PLATFORM depends on the pair (From, To), so different destinations use
//    different platforms, and the platform is always one that exists at that station;
//  - some trains get delayed and some change platform while the demo clock runs.

const FIRST_TRAIN = 10 * 60 + 10; // first train is due at 10:10
const GAP = 4; // then one more train every 4 minutes
const BEFORE_DELAY = 12; // a delay is announced this many minutes before the train is due
const BEFORE_CHANGE = 8; // a platform change is announced this many minutes before

// Turns text into the same number every time.
function hash(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = (h * 33 + text.charCodeAt(i)) >>> 0;
  return h;
}

const cache = {};

// Returns { trains, steps } for one station (built once, then remembered).
//   trains: the planned trains.
//   steps: things that happen at a clock time (a delay, a platform change).
export function buildSampleStory(station) {
  if (cache[station.id]) return cache[station.id];

  // The other stations, in an order that looks mixed-up but never changes.
  const others = STATION_LIST.filter((s) => s.id !== station.id).sort(
    (a, b) => hash(station.id + a.id) - hash(station.id + b.id)
  );

  const trains = [];
  const steps = [
    {
      now: '10:00',
      note: 'Sample trains only. This is not a real timetable.',
      noteHi: 'केवल नमूना ट्रेनें। यह असली समय-सारणी नहीं है।',
      changes: {},
    },
  ];

  others.forEach((dest, i) => {
    const h = hash(`${station.id}>${dest.id}`);
    const id = `${station.id}-${dest.id}`;
    const due = FIRST_TRAIN + i * GAP;
    const platformNo = 1 + (h % station.platforms);
    const name = `Sample ${dest.name} Express`;
    const nameHi = `सैंपल ${dest.nameHi} एक्सप्रेस`;

    trains.push({
      id,
      number: `DEMO-${100 + (h % 900)}`,
      name,
      nameHi,
      route: `${station.name} to ${dest.name}`,
      routeHi: `${station.nameHi} से ${dest.nameHi}`,
      destId: dest.id, // lets the From/To form pick the right trains
      scheduled: toClock(due),
      platformId: `p${platformNo}`,
    });

    if (i % 3 === 0) {
      steps.push({
        now: toClock(Math.max(601, due - BEFORE_DELAY)),
        note: `${name} is delayed.`,
        noteHi: `${nameHi} देरी से है।`,
        changes: { [id]: { delayMin: 5 + (h % 4) * 5 } }, // 5, 10, 15 or 20 minutes
      });
    }
    if (i % 7 === 2) {
      const newNo = 1 + (platformNo % station.platforms); // the next platform
      steps.push({
        now: toClock(Math.max(601, due - BEFORE_CHANGE)),
        note: `${name} moves to Platform ${newNo}.`,
        noteHi: `${nameHi} प्लेटफॉर्म ${newNo} पर आएगी।`,
        changes: { [id]: { platformId: `p${newNo}` } },
      });
    }
  });

  steps.sort((a, b) => toMinutes(a.now) - toMinutes(b.now));
  cache[station.id] = { trains, steps };
  return cache[station.id];
}
