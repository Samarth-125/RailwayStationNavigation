import { useMemo } from 'react';
import { ScrollView, View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { DATA_SOURCE_NOTE, DATA_SOURCE_NOTE_HI } from '../data/stationList';
import { findRoute, findNearest, isClosedPlace } from '../utils/findRoute';
import { useI18n, nameText, field, stepText, delayText, whenText } from '../utils/i18n';
import { activeTrainsAt } from '../utils/trainStatus';
import PlaceSelector from '../components/PlaceSelector';
import RouteMap from '../components/RouteMap';
import ClosedPlatforms from '../components/ClosedPlatforms';

export default function NavigateScreen({
  station,
  fromId,
  setFromId,
  toId,
  setToId,
  stepFreeOnly,
  setStepFreeOnly,
  closedIds,
  toggleClosed,
  trains,
  trainSource,
  trackedTrain,
  onStopTracking,
}) {
  const { lang, t } = useI18n();
  // useMemo = only recalculate the route when one of these values changes.
  const route = useMemo(
    () => (toId && fromId !== toId ? findRoute(station, fromId, toId, stepFreeOnly, closedIds) : null),
    [station, fromId, toId, stepFreeOnly, closedIds]
  );
  const destClosed = Boolean(toId) && isClosedPlace(toId, closedIds);
  const pname = (id) => (id ? nameText(placeById[id].name, lang) : t('platformUnknown'));

  // Trains still to come at the platform you are heading to (if it is a platform).
  const { placeById } = station;
  const trainsHere = toId ? activeTrainsAt(trains, toId) : [];

  // Emergency buttons: set the destination to the nearest police booth / medical room.
  function goToNearest(category) {
    const nearest = findNearest(station, fromId, category, stepFreeOnly, closedIds);
    if (nearest) setToId(nearest.id);
  }

  function speak() {
    Speech.stop(); // stop anything already being read
    Speech.speak(route.steps.map((s) => stepText(s, station, lang)).join('. '), {
      language: lang === 'hi' ? 'hi-IN' : 'en-IN',
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('title')}</Text>
      <Text style={styles.subtitle}>
        {t('subtitle', { name: field(station, 'name', lang), id: station.id, city: field(station, 'city', lang), n: station.platforms })}
      </Text>
      <Text style={styles.sourceNote}>
        {lang === 'hi' ? DATA_SOURCE_NOTE_HI : DATA_SOURCE_NOTE}
        {station.note ? ` ${field(station, 'note', lang)}` : ''}
      </Text>

      {trackedTrain && (
        <View style={styles.tracking}>
          <Text style={styles.trackingTitle}>
            {t('tracking', { name: field(trackedTrain, 'name', lang), num: trackedTrain.number })}
          </Text>
          {trackedTrain.platformChanged && trackedTrain.previousPlatformId && trackedTrain.platformId && (
            <Text style={styles.changed}>
              {t('platformChangedNow', { now: pname(trackedTrain.platformId), was: pname(trackedTrain.previousPlatformId) })}
            </Text>
          )}
          {trackedTrain.platformId && isClosedPlace(trackedTrain.platformId, closedIds) && (
            <Text style={styles.closedBanner}>{t('trackedClosed')}</Text>
          )}
          <Text style={styles.trackingText}>
            {t('trackingLine', { p: pname(trackedTrain.platformId), e: trackedTrain.expected, delay: delayText(trackedTrain, lang), when: whenText(trackedTrain, lang) })}
          </Text>
          <Pressable onPress={onStopTracking} accessibilityRole="button">
            <Text style={styles.stopTracking}>{t('stopTracking')}</Text>
          </Pressable>
        </View>
      )}

      <PlaceSelector title={t('from')} selectedId={fromId} onSelect={setFromId} choices={station.choosable} placeById={placeById} closedIds={closedIds} />
      <PlaceSelector title={t('to')} selectedId={toId} onSelect={setToId} choices={station.choosable} placeById={placeById} closedIds={closedIds} />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>{t('stepFree')}</Text>
        <Switch
          value={stepFreeOnly}
          onValueChange={setStepFreeOnly}
          accessibilityLabel={t('stepFreeLabel')}
        />
      </View>

      <ClosedPlatforms station={station} closedIds={closedIds} onToggle={toggleClosed} />

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, styles.police]}
          onPress={() => goToNearest('police')}
          accessibilityRole="button"
          accessibilityLabel={t('nearestPoliceLabel')}
        >
          <Text style={styles.buttonText}>{t('nearestPolice')}</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.medical]}
          onPress={() => goToNearest('medical')}
          accessibilityRole="button"
          accessibilityLabel={t('nearestMedicalLabel')}
        >
          <Text style={styles.buttonText}>{t('nearestMedical')}</Text>
        </Pressable>
      </View>

      <View style={styles.result}>
        <Text style={styles.heading}>{t('directions')}</Text>
        {!toId && <Text style={styles.hint}>{t('chooseDest')}</Text>}
        {toId && fromId === toId && <Text style={styles.hint}>{t('alreadyHere')}</Text>}
        {destClosed && fromId !== toId && <Text style={styles.closedBanner}>{t('destClosed')}</Text>}
        {toId && fromId !== toId && !route && !destClosed && (
          <Text style={styles.hint}>{stepFreeOnly ? t('noRouteStepFree') : t('noRoute')}</Text>
        )}
        {route && (
          <View>
            <Text style={styles.total}>{t('aboutMeters', { m: route.totalMeters })}</Text>
            {route.steps.map((step, index) => (
              <Text key={index} style={styles.step}>
                {index + 1}. {stepText(step, station, lang)}
              </Text>
            ))}
            <View style={styles.buttonRow}>
              <Pressable style={styles.button} onPress={speak} accessibilityRole="button">
                <Text style={styles.buttonText}>{t('readAloud')}</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonLight]}
                onPress={() => Speech.stop()}
                accessibilityRole="button"
              >
                <Text style={[styles.buttonText, styles.buttonTextDark]}>{t('stop')}</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {trainsHere.length > 0 && (
        <View style={styles.result}>
          <Text style={styles.heading}>{t(trainSource === 'LIVE' ? 'trainsAtLive' : 'trainsAt', { p: pname(toId) })}</Text>
          {trainsHere.map((tr) => (
            <Text key={tr.id} style={styles.line}>
              {tr.expected} - {field(tr, 'name', lang)} ({tr.number}) - {delayText(tr, lang)}. {whenText(tr, lang)}.
            </Text>
          ))}
        </View>
      )}

      <Text style={[styles.heading, styles.mapHeading]}>{t('stationMap')}</Text>
      <RouteMap station={station} path={route ? route.path : null} fromId={fromId} toId={toId} trains={trains} closedIds={closedIds} />
      <Text style={styles.legend}>
        <Text style={{ color: '#15803d', fontWeight: 'bold' }}>{t('legendStart')}</Text>
        {'   '}
        <Text style={{ color: '#b91c1c', fontWeight: 'bold' }}>{t('legendDest')}</Text>
        {'   '}
        <Text style={{ color: '#1d4ed8', fontWeight: 'bold' }}>{t('legendRoute')}</Text>
      </Text>
      <Text style={styles.legend}>
        {t(trainSource === 'LIVE' ? 'schematicLive' : 'schematic', { name: field(station, 'name', lang) })}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#555555' },
  sourceNote: { fontSize: 12, color: '#6b7280', marginBottom: 12 },
  heading: { fontSize: 19, fontWeight: 'bold', marginBottom: 8, color: '#0f172a' },
  mapHeading: { marginTop: 16 },
  switchRow: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchLabel: { fontSize: 16, flex: 1, marginRight: 12 },
  result: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 14, shadowColor: '#000000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  hint: { fontSize: 16, color: '#555555' },
  total: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  step: { fontSize: 18, marginBottom: 8, lineHeight: 25 },
  line: { fontSize: 16, marginBottom: 4 },
  tracking: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#15803d', borderRadius: 14, padding: 14, marginBottom: 14 },
  trackingTitle: { fontSize: 16, fontWeight: 'bold', color: '#15803d' },
  trackingText: { fontSize: 15, marginTop: 4 },
  changed: { fontSize: 15, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#7c3aed', padding: 6, borderRadius: 4, marginTop: 6 },
  closedBanner: { fontSize: 15, fontWeight: 'bold', color: '#ffffff', backgroundColor: '#b91c1c', padding: 6, borderRadius: 4, marginTop: 6 },
  stopTracking: { color: '#1d4ed8', fontWeight: '600', fontSize: 15, marginTop: 8 },
  legend: { fontSize: 13, color: '#555555', marginBottom: 4 },
  buttonRow: { flexDirection: 'row', marginBottom: 12 },
  button: {
    backgroundColor: '#1d4ed8',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  police: { backgroundColor: '#1e3a8a' },
  medical: { backgroundColor: '#b91c1c' },
  buttonLight: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#1d4ed8' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  buttonTextDark: { color: '#1d4ed8' },
});
