// The stations in the demo.
// REAL: station names, codes, cities and platform counts (taken from Wikipedia;
//       NOT checked against an official Indian Railways source, and counts change).
// NOT REAL: the maps. Every map is a schematic made from a template, so the
//       position of stalls, lifts, police booths etc. is made up for the demo.
//
// layout: 'through' = building on one side, footbridge over the tracks.
//         'terminus' = tracks end at a hall; all platforms at ground level.
//         This is only a drawing style for the demo. It is not a claim about
//         the real station.

export const STATION_LIST = [
  { id: 'NDLS', name: 'New Delhi', city: 'Delhi', platforms: 16, layout: 'through' },
  {
    id: 'DLI', name: 'Old Delhi (Delhi Junction)', city: 'Delhi', platforms: 16, layout: 'through', uncertain: true,
    note: 'Wikipedia gives both 16 and 18 platforms. This station has a Kashmere Gate side. "Kashmere Gate" itself is listed as a Metro interchange and bus terminal, not a separate railway station.',
    search: 'kashmere gate kashmiri gate',
  },
  { id: 'NZM', name: 'Hazrat Nizamuddin', city: 'Delhi', platforms: 9, layout: 'through' },
  { id: 'CSMT', name: 'Mumbai CSMT', city: 'Mumbai', platforms: 18, layout: 'terminus', search: 'chhatrapati shivaji victoria terminus vt' },
  { id: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', platforms: 9, layout: 'terminus', search: 'bct' },
  { id: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', platforms: 7, layout: 'terminus', search: 'kurla' },
  {
    id: 'HWH', name: 'Howrah Junction', city: 'Kolkata', platforms: 23, layout: 'terminus', uncertain: true,
    note: 'Wikipedia lists 24 platforms but says 23 are in operation; a few are under construction.',
  },
  { id: 'MAS', name: 'Chennai Central', city: 'Chennai', platforms: 17, layout: 'terminus', search: 'madras mgr' },
  { id: 'SBC', name: 'KSR Bengaluru', city: 'Bengaluru', platforms: 10, layout: 'through', search: 'bangalore city' },
  { id: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', platforms: 10, layout: 'through' },
  { id: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', platforms: 12, layout: 'through', note: 'Some platforms may be closed for construction, so fewer may be usable.', search: 'kalupur' },
  { id: 'PUNE', name: 'Pune Junction', city: 'Pune', platforms: 6, layout: 'through' },
  { id: 'JP', name: 'Jaipur Junction', city: 'Jaipur', platforms: 8, layout: 'through', uncertain: true, note: 'Platform numbering is unusual (for example 1A, 1B, 2A), so the count is approximate.' },
  { id: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', platforms: 9, layout: 'through', note: 'More platforms are under construction.' },
  { id: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', platforms: 11, layout: 'through', uncertain: true, note: 'The count may be out of date.', search: 'benares kashi' },
  { id: 'PNBE', name: 'Patna Junction', city: 'Patna', platforms: 10, layout: 'through' },
  { id: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', platforms: 6, layout: 'through' },
  { id: 'GHY', name: 'Guwahati', city: 'Guwahati', platforms: 7, layout: 'through' },
  { id: 'ERS', name: 'Ernakulam Junction', city: 'Kochi', platforms: 6, layout: 'through', search: 'cochin' },
  { id: 'CNB', name: 'Kanpur Central', city: 'Kanpur', platforms: 10, layout: 'through', uncertain: true, note: 'More platforms are under construction.' },
  { id: 'JAT', name: 'Jammu Tawi', city: 'Jammu', platforms: 7, layout: 'terminus', note: 'The platform count rose after a recent remodelling.' },
  { id: 'VSKP', name: 'Visakhapatnam Junction', city: 'Visakhapatnam', platforms: 8, layout: 'through', uncertain: true, note: 'More platforms are planned.', search: 'vizag' },
];

export const DATA_SOURCE_NOTE =
  'Station names and platform counts are from Wikipedia and may be out of date. Maps are schematic and made up.';
