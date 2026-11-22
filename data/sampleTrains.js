// SAMPLE DATA ONLY - made-up trains, routes and times.
// These are NOT real trains, timings or platforms.

// Trains as first planned. Times are "HH:MM".
export const baseTrains = [
  { id: 't1', number: 'DEMO-101', name: 'Sample Express', route: 'Sample City A to Sample City B', scheduled: '10:15', platformId: 'p1' },
  { id: 't2', number: 'DEMO-202', name: 'Demo Intercity', route: 'Sample City C to Sample City A', scheduled: '10:40', platformId: 'p2' },
  { id: 't3', number: 'DEMO-303', name: 'Test Passenger', route: 'Sample City B to Sample City D', scheduled: '11:05', platformId: 'p3' },
  { id: 't4', number: 'DEMO-404', name: 'Example Mail', route: 'Sample City D to Sample City C', scheduled: '11:30', platformId: 'p2' },
];

// A pretend story, so you can show delays and platform changes in the demo.
// Each step moves the demo clock forward and changes some trains.
// Changes add up: step 3 also includes everything from steps 1 and 2.
export const demoSteps = [
  { now: '10:00', note: 'All trains on time.', changes: {} },
  { now: '10:10', note: 'Demo Intercity is delayed.', changes: { t2: { delayMin: 12 } } },
  {
    now: '10:20',
    note: 'Sample Express is a little late. Test Passenger moves to Platform 1.',
    changes: { t1: { delayMin: 8 }, t3: { platformId: 'p1' } },
  },
  { now: '10:25', note: 'Sample Express is at the platform. Demo Intercity delay grows.', changes: { t2: { delayMin: 25 } } },
  { now: '11:00', note: 'Example Mail is delayed too.', changes: { t4: { delayMin: 10 } } },
];
