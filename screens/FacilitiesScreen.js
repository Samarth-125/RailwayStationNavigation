import { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { CATEGORIES, placeById } from '../data/stationData';
import { findNearest } from '../utils/findRoute';

export default function FacilitiesScreen({ fromId, stepFreeOnly, onGoTo }) {
  // Find the nearest place of every category. Only redone when the start point
  // or the step-free setting changes.
  const items = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        cat,
        nearest: findNearest(fromId, cat.key, stepFreeOnly),
      })),
    [fromId, stepFreeOnly]
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nearest facilities</Text>
      <Text style={styles.note}>
        From: {placeById[fromId].name}. Step-free: {stepFreeOnly ? 'On' : 'Off'}. Change both
        on the Navigate tab.
      </Text>

      {items.map(({ cat, nearest }) => (
        <Pressable
          key={cat.key}
          disabled={!nearest}
          onPress={() => onGoTo(nearest.id)}
          accessibilityRole="button"
          accessibilityLabel={
            nearest
              ? `${cat.label}. Nearest: ${placeById[nearest.id].name}, ${nearest.meters} metres. Show directions.`
              : `${cat.label}. Not reachable with the current settings.`
          }
          style={[styles.card, !nearest && styles.cardDisabled]}
        >
          <View>
            <Text style={styles.label}>{cat.label}</Text>
            {nearest ? (
              <Text style={styles.line}>
                {nearest.meters === 0
                  ? 'You are here'
                  : `${placeById[nearest.id].name} - ${nearest.meters} m`}
              </Text>
            ) : (
              <Text style={styles.line}>Not reachable step-free</Text>
            )}
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  note: { color: '#555555', marginBottom: 12 },
  card: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 14, marginBottom: 10 },
  cardDisabled: { opacity: 0.5 },
  label: { fontSize: 18, fontWeight: '600' },
  line: { fontSize: 16, marginTop: 2 },
});
