import { View, Text, Pressable, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { toClock } from '../utils/trainStatus';

// Shows each sample train: which platform, when it comes, delays, platform changes.
// The data comes from App.js (hooks/useTrains.js).
export default function TrainsScreen({ station, trainData, trackedTrainId, onTrack }) {
  const { placeById } = station;
  const { trains, nowMin, note, loading, error, reload, nextUpdate, resetDemo, isLastStep } = trainData;

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Train board (SAMPLE)</Text>
        <Pressable onPress={reload} accessibilityRole="button" accessibilityLabel="Refresh trains">
          <Text style={styles.refresh}>Refresh</Text>
        </Pressable>
      </View>

      {/* Demo controls: they replay a pretend story. Remove when real data is connected. */}
      <View style={styles.demo}>
        <Text style={styles.demoTitle}>Demo clock: {toClock(nowMin)}</Text>
        <Text style={styles.demoNote}>{note}</Text>
        <View style={styles.demoButtons}>
          <Pressable
            style={[styles.demoButton, isLastStep && styles.demoButtonOff]}
            onPress={nextUpdate}
            disabled={isLastStep}
            accessibilityRole="button"
          >
            <Text style={styles.demoButtonText}>Next demo update</Text>
          </Pressable>
          <Pressable style={styles.demoButtonLight} onPress={resetDemo} accessibilityRole="button">
            <Text style={styles.demoButtonLightText}>Restart demo</Text>
          </Pressable>
        </View>
      </View>

      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={trains}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => {
            const platform = placeById[item.platformId].name;
            const finished = item.state === 'departed' || item.state === 'cancelled';
            const tracking = item.id === trackedTrainId;
            return (
              <View style={[styles.card, finished && styles.cardFinished]}>
                <Text style={styles.trainName}>
                  {item.name} ({item.number})
                </Text>
                <Text style={styles.route}>{item.route}</Text>

                {item.platformChanged && (
                  <Text style={styles.changed}>
                    PLATFORM CHANGED: was {placeById[item.previousPlatformId].name}
                  </Text>
                )}
                <Text style={styles.platform}>{platform}</Text>

                <Text style={styles.line}>
                  Scheduled {item.scheduled} - Expected {item.expected}
                </Text>
                <Text style={[styles.line, item.delayMin > 0 && styles.late]}>
                  {item.delayText}. {item.whenText}.
                </Text>

                {!finished && (
                  <Pressable
                    style={[styles.button, tracking && styles.buttonOn]}
                    onPress={() => onTrack(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Track ${item.name} and get directions to ${platform}`}
                  >
                    <Text style={styles.buttonText}>
                      {tracking ? 'Tracking - show directions' : `Track and go to ${platform}`}
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
  refresh: { color: '#1d4ed8', fontSize: 16, fontWeight: '600', padding: 8 },
  demo: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#f59e0b', borderRadius: 8, padding: 12, marginBottom: 12 },
  demoTitle: { fontSize: 16, fontWeight: 'bold' },
  demoNote: { fontSize: 14, color: '#555555', marginBottom: 8 },
  demoButtons: { flexDirection: 'row' },
  demoButton: { backgroundColor: '#b45309', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14, marginRight: 8 },
  demoButtonOff: { opacity: 0.4 },
  demoButtonText: { color: '#ffffff', fontWeight: 'bold' },
  demoButtonLight: { borderWidth: 1, borderColor: '#b45309', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14 },
  demoButtonLightText: { color: '#b45309', fontWeight: 'bold' },
  loader: { marginTop: 24 },
  error: { color: '#b91c1c', fontSize: 16 },
  card: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 14, marginBottom: 12 },
  cardFinished: { opacity: 0.5 },
  trainName: { fontSize: 18, fontWeight: '600' },
  route: { fontSize: 14, color: '#555555', marginBottom: 6 },
  changed: { fontSize: 15, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#7c3aed', padding: 6, borderRadius: 4, marginBottom: 4 },
  platform: { fontSize: 20, fontWeight: 'bold', color: '#1d4ed8' },
  line: { fontSize: 16, marginTop: 2 },
  late: { color: '#b45309', fontWeight: '600' },
  button: { backgroundColor: '#1d4ed8', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 8 },
  buttonOn: { backgroundColor: '#15803d' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
