import { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { CATEGORIES } from '../data/buildStation';
import { findNearest } from '../utils/findRoute';
import { useI18n, nameText, field } from '../utils/i18n';

export default function FacilitiesScreen({ station, fromId, stepFreeOnly, closedIds, onGoTo }) {
  const { lang, t } = useI18n();
  const { placeById } = station;
  const pname = (id) => nameText(placeById[id].name, lang);
  // Find the nearest place of every category. Only redone when the start point
  // or the step-free setting changes.
  const items = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        cat,
        nearest: findNearest(station, fromId, cat.key, stepFreeOnly, closedIds),
      })),
    [station, fromId, stepFreeOnly, closedIds]
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('facTitle')}</Text>
      <Text style={styles.note}>{t('samplePositions', { name: field(station, 'name', lang) })}</Text>
      <Text style={styles.note}>
        {t('facFrom', { from: pname(fromId), on: stepFreeOnly ? t('on') : t('off') })}
      </Text>

      {/* Real information: Ministry of Railways press release on the 139 helpline.
          Check it is still current before you rely on it. */}
      <View style={styles.helpline}>
        <Text style={styles.helplineTitle}>{t('helplineTitle')}</Text>
        <Text style={styles.helplineText}>{t('helplineText')}</Text>
      </View>

      {items.map(({ cat, nearest }) => (
        <Pressable
          key={cat.key}
          disabled={!nearest}
          onPress={() => onGoTo(nearest.id)}
          accessibilityRole="button"
          accessibilityLabel={
            nearest
              ? t('facLabel', { cat: t(`cat_${cat.key}`), place: pname(nearest.id), m: nearest.meters })
              : t('facLabelNone', { cat: t(`cat_${cat.key}`) })
          }
          style={[
            styles.card,
            (cat.key === 'police' || cat.key === 'medical') && styles.cardEmergency,
            !nearest && styles.cardDisabled,
          ]}
        >
          <View>
            <Text style={styles.label}>{t(`cat_${cat.key}`)}</Text>
            {nearest ? (
              <Text style={styles.line}>
                {nearest.meters === 0
                  ? t('youAreHere')
                  : `${pname(nearest.id)} - ${t('meters', { m: nearest.meters })}`}
              </Text>
            ) : (
              <Text style={styles.line}>{t('notReachable')}</Text>
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
  helpline: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#b91c1c',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  helplineTitle: { fontSize: 18, fontWeight: 'bold', color: '#b91c1c' },
  helplineText: { fontSize: 15, marginTop: 2 },
  card: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 14, marginBottom: 10 },
  cardEmergency: { borderLeftWidth: 5, borderLeftColor: '#b91c1c' },
  cardDisabled: { opacity: 0.5 },
  label: { fontSize: 18, fontWeight: '600' },
  line: { fontSize: 16, marginTop: 2 },
});
