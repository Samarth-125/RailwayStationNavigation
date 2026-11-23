import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useI18n, mapText } from '../utils/i18n';

// DEMO switch: mark platforms as closed (for example for repairs).
// Routes then avoid them. A real app would get this from the railway, not from a button.
export default function ClosedPlatforms({ station, closedIds, onToggle }) {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const platforms = station.places.filter((p) => p.category === 'platform');
  const closedNames = platforms.filter((p) => closedIds.includes(p.id)).map((p) => mapText(p.short, lang));
  const summary = closedNames.length === 0 ? t('closedNone') : closedNames.join(', ');

  return (
    <View style={styles.box}>
      <Pressable
        onPress={() => setOpen(!open)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${t('closedTitle')}: ${summary}`}
      >
        <Text style={styles.header}>
          {t('closedTitle')}: {summary}  {open ? '▴' : '▾'}
        </Text>
      </Pressable>
      {open && (
        <View>
          <Text style={styles.hint}>{t('closedHint')}</Text>
          <View style={styles.chips}>
            {platforms.map((p) => {
              const closed = closedIds.includes(p.id);
              return (
                <Pressable
                  key={p.id}
                  style={[styles.chip, closed && styles.chipClosed]}
                  onPress={() => onToggle(p.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: closed }}
                  accessibilityLabel={`${p.name}${closed ? ` - ${t('closedWord')}` : ''}`}
                >
                  <Text style={[styles.chipText, closed && styles.chipTextClosed]}>
                    {mapText(p.short, lang)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: '#000000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  header: { fontSize: 15, fontWeight: '600', color: '#111827' },
  hint: { fontSize: 13, color: '#555555', marginTop: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  chip: { borderWidth: 1, borderColor: '#9ca3af', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, marginBottom: 8 },
  chipClosed: { backgroundColor: '#b91c1c', borderColor: '#b91c1c' },
  chipText: { fontSize: 14, color: '#111827' },
  chipTextClosed: { color: '#ffffff', fontWeight: 'bold' },
});
