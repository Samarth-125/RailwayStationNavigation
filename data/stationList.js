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
  { id: 'NDLS', nameHi: 'नई दिल्ली', cityHi: 'दिल्ली', name: 'New Delhi', city: 'Delhi', platforms: 16, layout: 'through' },
  {
    id: 'DLI', nameHi: 'पुरानी दिल्ली (दिल्ली जंक्शन)', cityHi: 'दिल्ली', noteHi: 'विकिपीडिया में 16 और 18 दोनों प्लेटफॉर्म लिखे हैं। इस स्टेशन का एक कश्मीरी गेट वाला हिस्सा है। "कश्मीरी गेट" खुद मेट्रो इंटरचेंज और बस टर्मिनल के रूप में दर्ज है, अलग रेलवे स्टेशन नहीं।', name: 'Old Delhi (Delhi Junction)', city: 'Delhi', platforms: 16, layout: 'through', uncertain: true,
    note: 'Wikipedia gives both 16 and 18 platforms. This station has a Kashmere Gate side. "Kashmere Gate" itself is listed as a Metro interchange and bus terminal, not a separate railway station.',
    search: 'kashmere gate kashmiri gate',
  },
  { id: 'NZM', nameHi: 'हज़रत निज़ामुद्दीन', cityHi: 'दिल्ली', name: 'Hazrat Nizamuddin', city: 'Delhi', platforms: 9, layout: 'through' },
  { id: 'CSMT', nameHi: 'मुंबई सीएसएमटी', cityHi: 'मुंबई', name: 'Mumbai CSMT', city: 'Mumbai', platforms: 18, layout: 'terminus', search: 'chhatrapati shivaji victoria terminus vt' },
  { id: 'MMCT', nameHi: 'मुंबई सेंट्रल', cityHi: 'मुंबई', name: 'Mumbai Central', city: 'Mumbai', platforms: 9, layout: 'terminus', search: 'bct' },
  { id: 'LTT', nameHi: 'लोकमान्य तिलक टर्मिनस', cityHi: 'मुंबई', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', platforms: 7, layout: 'terminus', search: 'kurla' },
  {
    id: 'HWH', nameHi: 'हावड़ा जंक्शन', cityHi: 'कोलकाता', noteHi: 'विकिपीडिया में 24 प्लेटफॉर्म लिखे हैं, पर कहा गया है कि 23 चालू हैं; कुछ निर्माणाधीन हैं।', name: 'Howrah Junction', city: 'Kolkata', platforms: 23, layout: 'terminus', uncertain: true,
    note: 'Wikipedia lists 24 platforms but says 23 are in operation; a few are under construction.',
  },
  { id: 'MAS', nameHi: 'चेन्नई सेंट्रल', cityHi: 'चेन्नई', name: 'Chennai Central', city: 'Chennai', platforms: 17, layout: 'terminus', search: 'madras mgr' },
  { id: 'SBC', nameHi: 'केएसआर बेंगलुरु', cityHi: 'बेंगलुरु', name: 'KSR Bengaluru', city: 'Bengaluru', platforms: 10, layout: 'through', search: 'bangalore city' },
  { id: 'SC', nameHi: 'सिकंदराबाद जंक्शन', cityHi: 'हैदराबाद', name: 'Secunderabad Junction', city: 'Hyderabad', platforms: 10, layout: 'through' },
  { id: 'ADI', nameHi: 'अहमदाबाद जंक्शन', cityHi: 'अहमदाबाद', noteHi: 'निर्माण के कारण कुछ प्लेटफॉर्म बंद हो सकते हैं, इसलिए कम प्लेटफॉर्म उपयोग में हो सकते हैं।', name: 'Ahmedabad Junction', city: 'Ahmedabad', platforms: 12, layout: 'through', note: 'Some platforms may be closed for construction, so fewer may be usable.', search: 'kalupur' },
  { id: 'PUNE', nameHi: 'पुणे जंक्शन', cityHi: 'पुणे', name: 'Pune Junction', city: 'Pune', platforms: 6, layout: 'through' },
  { id: 'JP', nameHi: 'जयपुर जंक्शन', cityHi: 'जयपुर', noteHi: 'प्लेटफॉर्म की संख्या असामान्य है (जैसे 1A, 1B, 2A), इसलिए गिनती अनुमानित है।', name: 'Jaipur Junction', city: 'Jaipur', platforms: 8, layout: 'through', uncertain: true, note: 'Platform numbering is unusual (for example 1A, 1B, 2A), so the count is approximate.' },
  { id: 'LKO', nameHi: 'लखनऊ चारबाग', cityHi: 'लखनऊ', noteHi: 'और प्लेटफॉर्म निर्माणाधीन हैं।', name: 'Lucknow Charbagh', city: 'Lucknow', platforms: 9, layout: 'through', note: 'More platforms are under construction.' },
  { id: 'BSB', nameHi: 'वाराणसी जंक्शन', cityHi: 'वाराणसी', noteHi: 'गिनती पुरानी हो सकती है।', name: 'Varanasi Junction', city: 'Varanasi', platforms: 11, layout: 'through', uncertain: true, note: 'The count may be out of date.', search: 'benares kashi' },
  { id: 'PNBE', nameHi: 'पटना जंक्शन', cityHi: 'पटना', name: 'Patna Junction', city: 'Patna', platforms: 10, layout: 'through' },
  { id: 'BPL', nameHi: 'भोपाल जंक्शन', cityHi: 'भोपाल', name: 'Bhopal Junction', city: 'Bhopal', platforms: 6, layout: 'through' },
  { id: 'GHY', nameHi: 'गुवाहाटी', cityHi: 'गुवाहाटी', name: 'Guwahati', city: 'Guwahati', platforms: 7, layout: 'through' },
  { id: 'ERS', nameHi: 'एर्नाकुलम जंक्शन', cityHi: 'कोच्चि', name: 'Ernakulam Junction', city: 'Kochi', platforms: 6, layout: 'through', search: 'cochin' },
  { id: 'CNB', nameHi: 'कानपुर सेंट्रल', cityHi: 'कानपुर', noteHi: 'और प्लेटफॉर्म निर्माणाधीन हैं।', name: 'Kanpur Central', city: 'Kanpur', platforms: 10, layout: 'through', uncertain: true, note: 'More platforms are under construction.' },
  { id: 'JAT', nameHi: 'जम्मू तवी', cityHi: 'जम्मू', noteHi: 'हाल के पुनर्निर्माण के बाद प्लेटफॉर्म की संख्या बढ़ी है।', name: 'Jammu Tawi', city: 'Jammu', platforms: 7, layout: 'terminus', note: 'The platform count rose after a recent remodelling.' },
  { id: 'VSKP', nameHi: 'विशाखापत्तनम जंक्शन', cityHi: 'विशाखापत्तनम', name: 'Visakhapatnam Junction', city: 'Visakhapatnam', platforms: 8, layout: 'through', uncertain: true, noteHi: 'और प्लेटफॉर्म प्रस्तावित हैं।', note: 'More platforms are planned.', search: 'vizag' },
];

export const DATA_SOURCE_NOTE =
  'Station names and platform counts are from Wikipedia and may be out of date. Maps are schematic and made up.';

export const DATA_SOURCE_NOTE_HI = 'स्टेशनों के नाम और प्लेटफॉर्म की संख्या विकिपीडिया से ली गई हैं और पुरानी हो सकती हैं। नक्शे सिर्फ़ योजनाबद्ध और बनाए हुए हैं।';
