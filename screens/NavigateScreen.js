import { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { DATA_SOURCE_NOTE } from '../data/stationList';
import { findRoute, findNearest } from '../utils/findRoute';
import { activeTrainsAt } from '../utils/trainStatus';
import PlaceSelector from '../components/PlaceSelector';
import RouteMap from '../components/RouteMap';

export default function NavigateScreen({
  station,
  fromId,
  setFromId,
  toId,
  setToId,
  stepFreeOnly,
  setStepFreeOnly,
  trains,
  trackedTrain,
  onStopTracking,
}) {
  // useMemo = only recalculate the route when one of these three values changes.
  const route = useMemo(
    () => (toId && fromId !== toId ? findRoute(station, fromId, toId, stepFreeOnly) : null),
    [station, fromId, toId, stepFreeOnly]
  );

  // Trains still to come at the platform you are heading to (if it is a platform).
  const { placeById } = station;
  const trainsHere = toId ? activeTrainsAt(trains, toId) : [];

  // Emergency buttons: set the destination to the nearest police booth / medical room.
  function goToNearest(category) {
    const nearest = findNearest(station, fromId, category, stepFreeOnly);
    if (nearest) setToId(nearest.id);
  }

  function speak() {
    // The route can disappear if a selection changes before this handler runs.
    if (!route || !Array.isArray(route.steps) || route.steps.length === 0) return;
    Speech.stop(); // stop anything already being read
    Speech.speak(route.steps.join('. '), { language: 'en-IN' });
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Station Navigator</Text>
      <Text style={styles.subtitle}>
        {station.name} ({station.id}), {station.city} - {station.platforms} platforms
      </Text>
      <Text style={styles.sourceNote}>
        {DATA_SOURCE_NOTE}
        {station.note ? ` ${station.note}` : ''}
      </Text>

      {trackedTrain && (
        <View style={styles.tracking}>
          <Text style={styles.trackingTitle}>
            Tracking {trackedTrain.name} ({trackedTrain.number})
          </Text>
          {trackedTrain.platformChanged && (
            <Text style={styles.changed}>
              PLATFORM CHANGED: now {placeById[trackedTrain.platformId].name} (was{' '}
              {placeById[trackedTrain.previousPlatformId].name}). Directions are updated.
            </Text>
          )}
          <Text style={styles.trackingText}>
            {placeById[trackedTrain.platformId].name} - expected {trackedTrain.expected} -{' '}
            {trackedTrain.delayText}. {trackedTrain.whenText}.
          </Text>
          <Pressable onPress={onStopTracking} accessibilityRole="button">
            <Text style={styles.stopTracking}>Stop tracking</Text>
          </Pressable>
        </View>
      )}

      <PlaceSelector title="From" selectedId={fromId} onSelect={setFromId} choices={station.choosable} placeById={placeById} />
      <PlaceSelector title="To" selectedId={toId} onSelect={setToId} choices={station.choosable} placeById={placeById} />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Step-free route only (no stairs)</Text>
        <Switch
          value={stepFreeOnly}
          onValueChange={setStepFreeOnly}
          accessibilityLabel="Step-free route only"
        />
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, styles.police]}
          onPress={() => goToNearest('police')}
          accessibilityRole="button"
          accessibilityLabel="Directions to the nearest police help booth"
        >
          <Text style={styles.buttonText}>Nearest Police</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.medical]}
          onPress={() => goToNearest('medical')}
          accessibilityRole="button"
          accessibilityLabel="Directions to the nearest medical room"
        >
          <Text style={styles.buttonText}>Nearest Medical</Text>
        </Pressable>
      </View>

      <View style={styles.result}>
        <Text style={styles.heading}>Directions</Text>
        {!toId && <Text style={styles.hint}>Choose a destination above.</Text>}
        {toId && fromId === toId && <Text style={styles.hint}>You are already here.</Text>}
        {toId && fromId !== toId && !route && (
          <Text style={styles.hint}>No {stepFreeOnly ? 'step-free ' : ''}route found.</Text>
        )}
        {route && Array.isArray(route.steps) && route.steps.length > 0 && (
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

      {trainsHere.length > 0 && (
        <View style={styles.result}>
          <Text style={styles.heading}>Trains at {placeById[toId].name} (sample)</Text>
          {trainsHere.map((t) => (
            <Text key={t.id} style={styles.line}>
              {t.expected} - {t.name} ({t.number}) - {t.delayText}. {t.whenText}.
            </Text>
          ))}
        </View>
      )}

      <Text style={[styles.heading, styles.mapHeading]}>Station map</Text>
      <RouteMap station={station} path={route ? route.path : null} fromId={fromId} toId={toId} trains={trains} />
      <Text style={styles.legend}>
        <Text style={{ color: '#15803d', fontWeight: 'bold' }}>Green = start</Text>
        {'   '}
        <Text style={{ color: '#b91c1c', fontWeight: 'bold' }}>Red = destination</Text>
        {'   '}
        <Text style={{ color: '#1d4ed8', fontWeight: 'bold' }}>Blue line = route</Text>
      </Text>
      <Text style={styles.legend}>
        Schematic drawing, not to scale. This is NOT the real layout of {station.name}. Sample trains only.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#555555' },
  sourceNote: { fontSize: 12, color: '#6b7280', marginBottom: 12 },
  heading: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  mapHeading: { marginTop: 16 },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchLabel: { fontSize: 16, flex: 1, marginRight: 12 },
  result: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 14, marginBottom: 12 },
  hint: { fontSize: 16, color: '#555555' },
  total: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  step: { fontSize: 18, marginBottom: 6 },
  line: { fontSize: 16, marginBottom: 4 },
  tracking: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#15803d', borderRadius: 8, padding: 12, marginBottom: 12 },
  trackingTitle: { fontSize: 16, fontWeight: 'bold', color: '#15803d' },
  trackingText: { fontSize: 15, marginTop: 4 },
  changed: { fontSize: 15, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#7c3aed', padding: 6, borderRadius: 4, marginTop: 6 },
  stopTracking: { color: '#1d4ed8', fontWeight: '600', fontSize: 15, marginTop: 8 },
  legend: { fontSize: 13, color: '#555555', marginBottom: 4 },
  buttonRow: { flexDirection: 'row', marginBottom: 12 },
  button: {
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  police: { backgroundColor: '#1e3a8a' },
  medical: { backgroundColor: '#b91c1c' },
  buttonLight: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#1d4ed8' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  buttonTextDark: { color: '#1d4ed8' },
});
