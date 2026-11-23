import { useState, memo } from 'react';
import {
  Modal, View, Text, TextInput, Pressable, FlatList, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STATION_LIST } from '../data/stationList';

// A bar at the top ("Station: New Delhi (NDLS)"). Tapping opens a searchable list.
function StationSelector({ station, onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Search by name, code, city, or an old/other name (like "kashmere gate").
  const q = query.trim().toLowerCase();
  const shown = STATION_LIST.filter((s) =>
    `${s.name} ${s.id} ${s.city} ${s.search || ''}`.toLowerCase().includes(q)
  );

  function choose(id) {
    onSelect(id);
    setOpen(false);
    setQuery('');
  }

  return (
    <View>
      <Pressable
        style={styles.bar}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Station: ${station.name}. Tap to change station.`}
      >
        <Text style={styles.barText} numberOfLines={1}>
          Station: {station.name} ({station.id})  ▾
        </Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose a station</Text>
            <Pressable onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel="Close">
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.search}
            placeholder="Search name, code or city (try: kashmere gate)"
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            accessibilityLabel="Search stations"
          />
          <FlatList
            data={shown}
            keyExtractor={(s) => s.id}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={styles.empty}>No station found.</Text>}
            renderItem={({ item }) => {
              const selected = item.id === station.id;
              return (
                <Pressable
                  style={[styles.row, selected && styles.rowSelected]}
                  onPress={() => choose(item.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.rowName, selected && styles.rowNameSelected]}>
                    {selected ? '✓  ' : ''}{item.name}
                  </Text>
                  <Text style={styles.rowInfo}>
                    {item.id} - {item.city} - {item.platforms} platforms
                  </Text>
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

export default memo(StationSelector);

const styles = StyleSheet.create({
  bar: { backgroundColor: '#1e293b', paddingVertical: 10, paddingHorizontal: 14 },
  barText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  modal: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  close: { fontSize: 18, color: '#1d4ed8', fontWeight: '600', padding: 6 },
  search: {
    borderWidth: 1,
    borderColor: '#9ca3af',
    borderRadius: 8,
    margin: 12,
    padding: 10,
    fontSize: 16,
  },
  empty: { padding: 16, fontSize: 16, color: '#555555' },
  row: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  rowSelected: { backgroundColor: '#eff6ff' },
  rowName: { fontSize: 18 },
  rowNameSelected: { fontWeight: 'bold', color: '#1d4ed8' },
  rowInfo: { fontSize: 14, color: '#555555', marginTop: 2 },
});
