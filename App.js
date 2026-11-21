import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigateScreen from './screens/NavigateScreen';
import TrainsScreen from './screens/TrainsScreen';
import FacilitiesScreen from './screens/FacilitiesScreen';

const TABS = ['Navigate', 'Trains', 'Facilities'];

export default function App() {
  const [tab, setTab] = useState('Navigate');
  // Shared by all tabs, so switching tabs does not lose your choices.
  const [fromId, setFromId] = useState('entrance');
  const [toId, setToId] = useState(null);
  const [stepFreeOnly, setStepFreeOnly] = useState(false);

  // Other tabs call this: set the destination, then jump to the Navigate tab.
  function goTo(placeId) {
    setToId(placeId);
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

      <View style={styles.body}>
        {tab === 'Navigate' && (
          <NavigateScreen
            fromId={fromId}
            setFromId={setFromId}
            toId={toId}
            setToId={setToId}
            stepFreeOnly={stepFreeOnly}
            setStepFreeOnly={setStepFreeOnly}
          />
        )}
        {tab === 'Trains' && <TrainsScreen onGoToPlatform={goTo} />}
        {tab === 'Facilities' && (
          <FacilitiesScreen fromId={fromId} stepFreeOnly={stepFreeOnly} onGoTo={goTo} />
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
