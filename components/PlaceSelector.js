import { useState, memo } from 'react';
import { Modal, SafeAreaView, View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { choosablePlaces, placeById } from '../data/stationData';

// A compact field ("From: Main Entrance"). Tapping it opens a full-screen list.
// This keeps the main screen short, so directions and the map stay visible.
function PlaceSelector({ title, selectedId, onSelect }) {
  const [open, setOpen] = useState(false);
  const selectedName = selectedId ? placeById[selectedId].name : 'Choose a place';

  function choose(id) {
    onSelect(id);
    setOpen(false);
  }

  return (
    <View>
      <Pressable
        style={styles.field}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${title}: ${selectedName}. Tap to change.`}
      >
        <Text style={styles.fieldTitle}>{title}</Text>
        <Text style={styles.fieldValue}>{selectedName}  ▾</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel="Close">
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>
          <FlatList
            data={choosablePlaces}
            keyExtractor={(p) => p.id}
            renderItem={({ item }) => {
              const selected = item.id === selectedId;
              return (
                <Pressable
                  style={[styles.row, selected && styles.rowSelected]}
                  onPress={() => choose(item.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.rowText, selected && styles.rowTextSelected]}>
                    {selected ? '✓  ' : ''}{item.name}
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

export default memo(PlaceSelector);

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    borderColor: '#1d4ed8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  fieldTitle: { fontSize: 13, color: '#555555' },
  fieldValue: { fontSize: 18, fontWeight: '600', color: '#1d4ed8' },
  modal: { flex: 1, backgroundColor: '#ffffff' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold' },
  close: { fontSize: 18, color: '#1d4ed8', fontWeight: '600', padding: 6 },
  row: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  rowSelected: { backgroundColor: '#eff6ff' },
  rowText: { fontSize: 18 },
  rowTextSelected: { fontWeight: 'bold', color: '#1d4ed8' },
});
