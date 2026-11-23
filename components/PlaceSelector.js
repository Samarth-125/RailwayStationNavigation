import { useState, memo } from 'react';
import { useI18n, nameText } from '../utils/i18n';
import { isClosedPlace } from '../utils/findRoute';
import { Modal, SafeAreaView, View, Text, Pressable, FlatList, StyleSheet } from 'react-native';

// A compact field ("From: Main Entrance"). Tapping it opens a full-screen list.
// This keeps the main screen short, so directions and the map stay visible.
function PlaceSelector({ title, selectedId, onSelect, choices, placeById, closedIds }) {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const label = (id) =>
    nameText(placeById[id].name, lang) + (isClosedPlace(id, closedIds) ? t('closedSuffix') : '');
  const selectedName = selectedId ? label(selectedId) : t('choosePlace');

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
        accessibilityLabel={`${title}: ${selectedName}. ${t('tapChange')}`}
      >
        <Text style={styles.fieldTitle}>{title}</Text>
        <Text style={styles.fieldValue}>{selectedName}  ▾</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel={t('close')}>
              <Text style={styles.close}>{t('close')}</Text>
            </Pressable>
          </View>
          <FlatList
            data={choices}
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
                    {selected ? '✓  ' : ''}{label(item.id)}
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
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
