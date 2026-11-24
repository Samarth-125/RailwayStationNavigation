import { baseTrains, demoSteps } from '../data/sampleTrains';
import { toMinutes } from '../utils/trainStatus';

// SAMPLE (made-up) trains for the demo.
// The demo clock starts at the first step's time and runs by itself (hooks/useTrains.js).
// Given a clock time, this works out the trains as they would look at that moment:
// every step whose time has come has already happened.
// Live data (if you add a key) is in services/liveTrainService.js.
//
// Returns: { source: 'SAMPLE', nowMin, note, noteHi, trains: [ { id, number, name, route,
//            scheduled, delayMin?, platformId, previousPlatformId? } ] }
export function getTrainsAt(nowMin) {
  const trains = {};
  baseTrains.forEach((t) => (trains[t.id] = { ...t }));

  let current = null; // the latest step that has happened
  demoSteps.forEach((step) => {
    if (toMinutes(step.now) > nowMin) return;
    current = step;
    Object.entries(step.changes).forEach(([id, change]) => {
      const train = trains[id];
      if (change.platformId && change.platformId !== train.platformId) {
        train.previousPlatformId = train.platformId; // remember the old platform
      }
      Object.assign(train, change);
    });
  });

  return {
    source: 'SAMPLE',
    nowMin,
    note: current ? current.note : '',
    noteHi: current ? current.noteHi : '',
    trains: Object.values(trains),
  };
}

export const DEMO_START = toMinutes(demoSteps[0].now); // 10:00
export const DEMO_END = toMinutes('11:50'); // the demo stops here (everything has left)
