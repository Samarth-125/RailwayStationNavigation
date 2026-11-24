import { useState } from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet } from 'react-native';
import NavigateScreen from './screens/NavigateScreen';
import TrainsScreen from './screens/TrainsScreen';
import FacilitiesScreen from './screens/FacilitiesScreen';
import StationSelector from './components/StationSelector';
import { LangContext, t as translate } from './utils/i18n';
import useTrains from './hooks/useTrains';
import { getStation } from './data/buildStation';

const TABS = [
  { key: 'Navigate', label: 'tabNavigate', icon: '🧭' },
  { key: 'Trains', label: 'tabTrains', icon: '🚆' },
  { key: 'Facilities', label: 'tabFacilities', icon: '🏥' },
];

export default function App() {
  const [tab, setTab] = useState('Navigate');
  const [stationId, setStationId] = useState('NDLS');
  // Shared by all tabs, so switching tabs does not lose your choices.
  const [fromId, setFromId] = useState('entrance');
  const [chosenToId, setChosenToId] = useState(null); // destination picked by hand
  const [trackedTrainId, setTrackedTrainId] = useState(null); // train being followed
  const [stepFreeOnly, setStepFreeOnly] = useState(false);
  const [lang, setLang] = useState('en'); // 'en' or 'hi'
  const [closedIds, setClosedIds] = useState([]); // platforms marked closed (demo switch)
  const [destStationId, setDestStationId] = useState(null); // the "To" station in the From/To form
  const [useLive, setUseLive] = useState(false); // false = SAMPLE trains, true = live (needs a key in config.js)

  const station = getStation(stationId); // built once per station, then remembered
  const trainData = useTrains(station, useLive);

  // If you are tracking a train, the destination is that train's CURRENT platform.
  // So when the platform changes, the route updates by itself.
  const trackedTrain = trainData.trains.find((t) => t.id === trackedTrainId) || null;
  const toId = trackedTrain ? trackedTrain.platformId : chosenToId; // (null if the platform is not announced)

  function setToId(placeId) {
    setTrackedTrainId(null); // picking a place by hand stops tracking
    setChosenToId(placeId);
  }

  // A new station has different places, so start fresh.
  function chooseStation(id, keepTab = false) {
    setStationId(id);
    if (id === destStationId) setDestStationId(null);
    setFromId('entrance');
    setChosenToId(null);
    setTrackedTrainId(null);
    setClosedIds([]);
    if (!keepTab) setTab('Navigate');
  }

  // The "swap" button in the form: From becomes To and To becomes From.
  function swapStations() {
    if (!destStationId) return;
    const oldFrom = stationId;
    chooseStation(destStationId, true);
    setDestStationId(oldFrom);
  }

  function toggleClosed(platformId) {
    setClosedIds((ids) => (ids.includes(platformId) ? ids.filter((i) => i !== platformId) : [...ids, platformId]));
  }

  // Facilities tab: go to a place.
  function goTo(placeId) {
    setToId(placeId);
    setTab('Navigate');
  }

  // Trains tab: follow a train and get directions to its platform.
  function trackTrain(trainId) {
    setTrackedTrainId(trainId);
    setTab('Navigate');
  }

  const t = (key) => translate(lang, key);

  return (
    <LangContext.Provider value={lang}>
    <SafeAreaView style={styles.screen}>
      {/* Demo warning: always visible, on every tab */}
      <View style={[styles.banner, trainData.source === 'LIVE' && styles.bannerLive]} accessibilityRole="alert">
        <Text style={styles.bannerText}>
          {trainData.source === 'LIVE' ? t('liveBanner') : t('demoBanner')}
        </Text>
      </View>

      <View style={styles.topRow}>
        <View style={styles.stationBar}>
          <StationSelector station={station} onSelect={chooseStation} />
        </View>
        <Pressable
          style={styles.langButton}
          onPress={() => setLang(lang === 'en' ? 'hi' : 'en')}
          accessibilityRole="button"
          accessibilityLabel={t('switchLangLabel')}
        >
          <Text style={styles.langText}>{t('switchLang')}</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        {tab === 'Navigate' && (
          <NavigateScreen
            station={station}
            fromId={fromId}
            setFromId={setFromId}
            toId={toId}
            setToId={setToId}
            stepFreeOnly={stepFreeOnly}
            setStepFreeOnly={setStepFreeOnly}
            closedIds={closedIds}
            toggleClosed={toggleClosed}
            trains={trainData.trains}
            trainSource={trainData.source}
            trackedTrain={trackedTrain}
            onStopTracking={() => setTrackedTrainId(null)}
          />
        )}
        {tab === 'Trains' && (
          <TrainsScreen
            station={station}
            trainData={trainData}
            trackedTrainId={trackedTrainId}
            onTrack={trackTrain}
            closedIds={closedIds}
            useLive={useLive}
            setUseLive={setUseLive}
            destStationId={destStationId}
            onChangeFrom={(id) => chooseStation(id, true)}
            onChangeTo={setDestStationId}
            onSwap={swapStations}
          />
        )}
        {tab === 'Facilities' && (
          <FacilitiesScreen
            station={station}
            fromId={fromId}
            stepFreeOnly={stepFreeOnly}
            closedIds={closedIds}
            onGoTo={goTo}
          />
        )}
      </View>

      <View style={styles.tabBar}>
        {TABS.map(({ key, label, icon }) => {
          const selected = tab === key;
          return (
            <Pressable
              key={key}
              style={[styles.tab, selected && styles.tabSelected]}
              onPress={() => setTab(key)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
            >
              <Text style={styles.tabIcon}>{icon}</Text>
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>{t(label)}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
    </LangContext.Provider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  banner: { backgroundColor: '#b45309', paddingVertical: 6, paddingHorizontal: 12 },
  bannerLive: { backgroundColor: '#0f766e' },
  bannerText: { color: '#ffffff', fontWeight: 'bold', textAlign: 'center', fontSize: 12 },
  topRow: { flexDirection: 'row', backgroundColor: '#0f172a', alignItems: 'center' },
  stationBar: { flex: 1 },
  langButton: { backgroundColor: '#1d4ed8', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14, marginRight: 14 },
  langText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  body: { flex: 1, backgroundColor: '#f1f5f9' },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#ffffff' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderTopWidth: 3, borderTopColor: 'transparent' },
  tabSelected: { borderTopColor: '#1d4ed8' },
  tabIcon: { fontSize: 20 },
  tabText: { fontSize: 13, color: '#555555' },
  tabTextSelected: { color: '#1d4ed8', fontWeight: 'bold' },
});
