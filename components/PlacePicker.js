import { memo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { places } from '../data/stationData';

// Only real destinations, not helper places like "Concourse".
const choices = places.filter((p) => p.category !== 'junction');

// A row of tappable buttons. Used for both "From" and "To".
// memo = React skips redrawing it when nothing about it changed.
function PlacePicker({ title, selectedId, onSelect }) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.chipRow}>
        {choices.map((p) => {
          const selected = p.id === selectedId;
          return (
            <Pressable
              key={p.id}
              onPress={() => onSelect(p.id)}
              accessibilityRole="button"
              accessibilityLabel={`${title} ${p.name}`}
              accessibilityState={{ selected }}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {p.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default memo(PlacePicker);

const styles = StyleSheet.create({
  section: { marginBottom: 16 },
  heading: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { backgroundColor: '#1d4ed8' },
  chipText: { color: '#1d4ed8', fontSize: 16 },
  chipTextSelected: { color: '#ffffff', fontWeight: 'bold' },
});
