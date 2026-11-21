import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { getTrains } from '../services/trainService';
import { placeById } from '../data/stationData';

export default function TrainsScreen({ onGoToPlatform }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trains, setTrains] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTrains();
      setTrains(result.trains);
    } catch (e) {
      setError('Could not load trains. Please try again.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load(); // load once when the screen first appears
  }, [load]);

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Train board (SAMPLE)</Text>
        <Pressable onPress={load} accessibilityRole="button" accessibilityLabel="Refresh trains">
          <Text style={styles.refresh}>Refresh</Text>
        </Pressable>
      </View>
      <Text style={styles.note}>Made-up trains and times for the demo. Not a real timetable.</Text>

      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={trains}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.trainName}>
                {item.name} ({item.number})
              </Text>
              <Text style={styles.line}>Departs {item.time} - {item.status}</Text>
              <Text style={styles.line}>{placeById[item.platformId].name}</Text>
              <Pressable
                style={styles.button}
                onPress={() => onGoToPlatform(item.platformId)}
                accessibilityRole="button"
                accessibilityLabel={`Directions to ${placeById[item.platformId].name} for ${item.name}`}
              >
                <Text style={styles.buttonText}>Directions to platform</Text>
              </Pressable>
            </View>
          )}
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
  note: { color: '#555555', marginBottom: 12 },
  loader: { marginTop: 24 },
  error: { color: '#b91c1c', fontSize: 16 },
  card: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 14, marginBottom: 12 },
  trainName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  line: { fontSize: 16, marginBottom: 2 },
  button: {
    backgroundColor: '#1d4ed8',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
