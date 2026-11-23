// SETTINGS FOR LIVE TRAIN DATA.
//
// The app works without this: it shows clearly-labelled SAMPLE trains.
// To try live data you need your own free API key:
//   1. Go to https://railradar.in and create a free account / API key
//      (their docs say the free plan allows about 300 requests per day).
//   2. Paste the key between the quotes below.
//   3. Open the Trains tab and turn on "Use live data".
//
// IMPORTANT
// - RailRadar is a THIRD-PARTY service. It is NOT run by Indian Railways, so the
//   app labels it that way. Data can be late or wrong.
// - A key stored inside a mobile app can be copied by anyone who has the app.
//   Fine for your own testing and demo. For a real release, keep the key on your own
//   small server and let the app talk to that server.
// - Do not post this file with your key in it (GitHub, WhatsApp, etc.).
export const LIVE = {
  providerName: 'RailRadar',
  baseUrl: 'https://api.railradar.in',
  apiKey: '', // <-- paste your key here
  hours: 4, // how many hours of trains to load
  refreshMs: 5 * 60 * 1000, // auto-refresh every 5 minutes (keeps you inside the free limit)
};
