import { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { STATION_NAME } from '../data/stationData';
import { findRoute } from '../utils/findRoute';
import PlacePicker from '../components/PlacePicker';
import RouteMap from '../components/RouteMap';

export default function NavigateScreen({
  fromId,
  setFromId,
  toId,
  setToId,
  stepFreeOnly,
  setStepFreeOnly,
}) {
  // useMemo = only recalculate the route when one of these three values changes.
  const route = useMemo(
    () => (toId && fromId !== toId ? findRoute(fromId, toId, stepFreeOnly) : null),
    [fromId, toId, stepFreeOnly]
  );

  function speak() {
    // The selected route can become null if the start or destination changes.
    if (!route || route.steps.length === 0) return;
    Speech.stop(); // stop anything already being read
    Speech.speak(route.steps.join('. '), { language: 'en-IN' });
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Station Navigator</Text>
      <Text style={styles.subtitle}>{STATION_NAME}</Text>

      <PlacePicker title="From" selectedId={fromId} onSelect={setFromId} />
      <PlacePicker title="To" selectedId={toId} onSelect={setToId} />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Step-free route only (no stairs)</Text>
        <Switch
          value={stepFreeOnly}
          onValueChange={setStepFreeOnly}
          accessibilityLabel="Step-free route only"
        />
      </View>

      <RouteMap path={route ? route.path : null} fromId={fromId} toId={toId} />

      <View style={styles.result}>
        <Text style={styles.heading}>Directions</Text>
        {!toId && <Text style={styles.hint}>Choose a destination above.</Text>}
        {toId && fromId === toId && <Text style={styles.hint}>You are already here.</Text>}
        {toId && fromId !== toId && !route && (
          <Text style={styles.hint}>No {stepFreeOnly ? 'step-free ' : ''}route found.</Text>
        )}
        {route && (
          <View>
            <Text style={styles.total}>About {route.totalMeters} m (sample distances)</Text>
            {route.steps.map((step, index) => (
              <Text key={index} style={styles.step}>
                {index + 1}. {step}
              </Text>
            ))}
            <View style={styles.buttonRow}>
              <Pressable style={styles.button} onPress={speak} accessibilityRole="button">
                <Text style={styles.buttonText}>Read aloud</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonLight]}
                onPress={() => Speech.stop()}
                accessibilityRole="button"
              >
                <Text style={[styles.buttonText, styles.buttonTextDark]}>Stop</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#555555', marginBottom: 12 },
  heading: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: { fontSize: 16, flex: 1, marginRight: 12 },
  result: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 14 },
  hint: { fontSize: 16, color: '#555555' },
  total: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  step: { fontSize: 18, marginBottom: 6 },
  buttonRow: { flexDirection: 'row', marginTop: 10 },
  button: {
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  buttonLight: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#1d4ed8' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  buttonTextDark: { color: '#1d4ed8' },
});
