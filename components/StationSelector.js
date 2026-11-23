import { useState, memo } from 'react';
import {
  Modal, SafeAreaView, View, Text, TextInput, Pressable, FlatList, StyleSheet,
} from 'react-native';
import { STATION_LIST } from '../data/stationList';
import { useI18n, field } from '../utils/i18n';

// A bar at the top ("Station: New Delhi (NDLS)"). Tapping opens a searchable list.
function StationSelector({ station, onSelect }) {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Search by name, code, city, or an old/other name (like "kashmere gate").
  const q = query.trim().toLowerCase();
  const shown = STATION_LIST.filter((s) =>
    `${s.name} ${s.nameHi || ''} ${s.id} ${s.city} ${s.cityHi || ''} ${s.search || ''}`.toLowerCase().includes(q)
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
        accessibilityLabel={`${t('station')}: ${field(station, 'name', lang)}. ${t('tapChangeStation')}`}
      >
        <View style={styles.barLeft}>
          <Text style={styles.barLabel}>{t('station').toUpperCase()}</Text>
          <Text style={styles.barName} numberOfLines={1}>{field(station, 'name', lang)}</Text>
          <Text style={styles.barInfo} numberOfLines={1}>
            {station.id} · {field(station, 'city', lang)} · {t('platformsCount', { n: station.platforms })}
          </Text>
        </View>
        <Text style={styles.barArrow}>▾</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('chooseStation')}</Text>
            <Pressable onPress={() => setOpen(false)} accessibilityRole="button" accessibilityLabel={t('close')}>
              <Text style={styles.close}>{t('close')}</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.search}
            placeholder={t('searchPlaceholder')}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            accessibilityLabel={t('searchLabel')}
          />
          <FlatList
            data={shown}
            keyExtractor={(s) => s.id}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<Text style={styles.empty}>{t('noStation')}</Text>}
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
                    {selected ? '✓  ' : ''}{field(item, 'name', lang)}
                  </Text>
                  <Text style={styles.rowInfo}>
                    {item.id} - {field(item, 'city', lang)} - {t('platformsCount', { n: item.platforms })}
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
  bar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  barLeft: { flex: 1 },
  barLabel: { color: '#94a3b8', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  barName: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  barInfo: { color: '#cbd5e1', fontSize: 13, marginTop: 1 },
  barArrow: { color: '#ffffff', fontSize: 20, marginLeft: 8 },
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
