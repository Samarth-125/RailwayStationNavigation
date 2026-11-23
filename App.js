import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigateScreen from './screens/NavigateScreen';
import TrainsScreen from './screens/TrainsScreen';
import FacilitiesScreen from './screens/FacilitiesScreen';
import StationSelector from './components/StationSelector';
import useTrains from './hooks/useTrains';
import { getStation } from './data/buildStation';

const TABS = ['Navigate', 'Trains', 'Facilities'];

export default function App() {
  const [tab, setTab] = useState('Navigate');
  const [stationId, setStationId] = useState('NDLS');
  // Shared by all tabs, so switching tabs does not lose your choices.
  const [fromId, setFromId] = useState('entrance');
  const [chosenToId, setChosenToId] = useState(null); // destination picked by hand
  const [trackedTrainId, setTrackedTrainId] = useState(null); // train being followed
  const [stepFreeOnly, setStepFreeOnly] = useState(false);
  const trainData = useTrains();

  const station = getStation(stationId); // built once per station, then remembered

  // If you are tracking a train, the destination is that train's CURRENT platform.
  // So when the platform changes, the route updates by itself.
  const trackedTrain = trainData.trains.find((t) => t.id === trackedTrainId) || null;
  const toId = trackedTrain ? trackedTrain.platformId : chosenToId;

  function setToId(placeId) {
    setTrackedTrainId(null); // picking a place by hand stops tracking
    setChosenToId(placeId);
  }

  // A new station has different places, so start fresh.
  function chooseStation(id) {
    setStationId(id);
    setFromId('entrance');
    setChosenToId(null);
    setTrackedTrainId(null);
    setTab('Navigate');
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

  return (
    <SafeAreaView style={styles.screen}>
      {/* Demo warning: always visible, on every tab */}
      <View style={styles.banner} accessibilityRole="alert">
        <Text style={styles.bannerText}>
          DEMO - SAMPLE DATA ONLY. This is not live or official railway information.
        </Text>
      </View>

      <StationSelector station={station} onSelect={chooseStation} />

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
            trains={trainData.trains}
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
          />
        )}
        {tab === 'Facilities' && (
          <FacilitiesScreen
            station={station}
            fromId={fromId}
            stepFreeOnly={stepFreeOnly}
            onGoTo={goTo}
          />
        )}
      </View>

      <View style={styles.tabBar}>
        {TABS.map((name) => {
          const selected = tab === name;
          return (
            <Pressable
              key={name}
              style={styles.tab}
              onPress={() => setTab(name)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
            >
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>{name}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  banner: { backgroundColor: '#b45309', padding: 10 },
  bannerText: { color: '#ffffff', fontWeight: 'bold', textAlign: 'center' },
  body: { flex: 1 },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  tabText: { fontSize: 16, color: '#555555' },
  tabTextSelected: { color: '#1d4ed8', fontWeight: 'bold' },
});
