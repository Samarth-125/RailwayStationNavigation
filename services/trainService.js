import { sampleTrains } from '../data/sampleTrains';

// THE ONLY PLACE THAT KNOWS WHERE TRAIN DATA COMES FROM.
// Right now it returns made-up sample trains.
// If you ever get permitted access to a real train-data source, replace the
// body of this function (and keep the same return shape) - no screen needs to change.
//
// Returns: { source: 'SAMPLE', trains: [ { id, number, name, time, platformId, status } ] }
export async function getTrains() {
  await new Promise((resolve) => setTimeout(resolve, 400)); // pretend network delay
  return { source: 'SAMPLE', trains: sampleTrains };
}
