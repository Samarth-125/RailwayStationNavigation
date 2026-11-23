import { View, Text, Pressable, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { toClock } from '../utils/trainStatus';
import { isClosedPlace } from '../utils/findRoute';
import { useI18n, nameText, field, delayText, whenText } from '../utils/i18n';

// Shows each sample train: which platform, when it comes, delays, platform changes.
// The data comes from App.js (hooks/useTrains.js).
export default function TrainsScreen({ station, trainData, trackedTrainId, onTrack, closedIds }) {
  const { lang, t } = useI18n();
  const { placeById } = station;
  const { trains, nowMin, note, noteHi, loading, error, reload, nextUpdate, resetDemo, isLastStep } = trainData;

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('trainBoard')}</Text>
        <Pressable onPress={reload} accessibilityRole="button" accessibilityLabel={t('refreshLabel')}>
          <Text style={styles.refresh}>{t('refresh')}</Text>
        </Pressable>
      </View>

      {/* Demo controls: they replay a pretend story. Remove when real data is connected. */}
      <View style={styles.demo}>
        <Text style={styles.demoTitle}>{t('demoClock', { t: toClock(nowMin) })}</Text>
        <Text style={styles.demoNote}>{lang === 'hi' && noteHi ? noteHi : note}</Text>
        <View style={styles.demoButtons}>
          <Pressable
            style={[styles.demoButton, isLastStep && styles.demoButtonOff]}
            onPress={nextUpdate}
            disabled={isLastStep}
            accessibilityRole="button"
          >
            <Text style={styles.demoButtonText}>{t('nextUpdate')}</Text>
          </Pressable>
          <Pressable style={styles.demoButtonLight} onPress={resetDemo} accessibilityRole="button">
            <Text style={styles.demoButtonLightText}>{t('restart')}</Text>
          </Pressable>
        </View>
      </View>

      {loading && <ActivityIndicator size="large" style={styles.loader} />}
      {error && <Text style={styles.error}>{t('loadError')}</Text>}

      {!loading && !error && (
        <FlatList
          data={trains}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => {
            const platform = nameText(placeById[item.platformId].name, lang);
            const closed = isClosedPlace(item.platformId, closedIds);
            const finished = item.state === 'departed' || item.state === 'cancelled';
            const tracking = item.id === trackedTrainId;
            return (
              <View style={[styles.card, finished && styles.cardFinished]}>
                <Text style={styles.trainName}>
                  {field(item, 'name', lang)} ({item.number})
                </Text>
                <Text style={styles.route}>{field(item, 'route', lang)}</Text>

                {item.platformChanged && (
                  <Text style={styles.changed}>
                    {t('platformChangedWas', { p: nameText(placeById[item.previousPlatformId].name, lang) })}
                  </Text>
                )}
                {closed && !finished && <Text style={styles.closed}>{t('closedBadge')}</Text>}
                <Text style={styles.platform}>{platform}</Text>

                <Text style={styles.line}>
                  {t('scheduledExpected', { s: item.scheduled, e: item.expected })}
                </Text>
                <Text style={[styles.line, item.delayMin > 0 && styles.late]}>
                  {delayText(item, lang)}. {whenText(item, lang)}.
                </Text>

                {!finished && (
                  <Pressable
                    style={[styles.button, tracking && styles.buttonOn]}
                    onPress={() => onTrack(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={t('trackLabel', { name: field(item, 'name', lang), p: platform })}
                  >
                    <Text style={styles.buttonText}>
                      {tracking ? t('trackingShow') : t('trackGo', { p: platform })}
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
  demo: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#f59e0b', borderRadius: 14, padding: 14, marginBottom: 14 },
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
  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 14, shadowColor: '#000000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardFinished: { opacity: 0.5 },
  trainName: { fontSize: 18, fontWeight: '600' },
  route: { fontSize: 14, color: '#555555', marginBottom: 6 },
  changed: { fontSize: 15, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#7c3aed', padding: 6, borderRadius: 4, marginBottom: 4 },
  closed: { fontSize: 15, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#b91c1c', padding: 6, borderRadius: 4, marginBottom: 4 },
  platform: { fontSize: 20, fontWeight: 'bold', color: '#1d4ed8' },
  line: { fontSize: 16, marginTop: 2 },
  late: { color: '#b45309', fontWeight: '600' },
  button: { backgroundColor: '#1d4ed8', borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 8 },
  buttonOn: { backgroundColor: '#15803d' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
