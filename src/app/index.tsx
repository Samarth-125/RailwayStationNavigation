import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { places, STATION_NAME } from '@/data/stationData';
import { findRoute } from '@/utils/findRoute';

type PickerTarget = 'from' | 'to' | null;
const destinations = places.filter((place) => place.type !== 'Hidden');

export default function HomeScreen() {
  const [fromId, setFromId] = useState('entrance');
  const [toId, setToId] = useState<string | null>(null);
  const [stepFreeOnly, setStepFreeOnly] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [search, setSearch] = useState('');

  const from = places.find((place) => place.id === fromId);
  const to = places.find((place) => place.id === toId);
  const route = useMemo(
    () => findRoute(fromId, toId, stepFreeOnly),
    [fromId, toId, stepFreeOnly],
  );
  const filteredPlaces = destinations.filter((place) =>
    place.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  function selectPlace(id: string) {
    if (pickerTarget === 'from') setFromId(id);
    if (pickerTarget === 'to') setToId(id);
    setPickerTarget(null);
    setSearch('');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.demoTag}>SAMPLE DEMO · NOT LIVE DATA</Text>
        <Text style={styles.title}>Station directions</Text>
        <Text style={styles.stationName}>{STATION_NAME} · sample station</Text>

        <View style={styles.warning} accessibilityRole="alert">
          <Text style={styles.warningText}>
            Sample map and distances only. Not an official railway app.
          </Text>
        </View>

        <Text style={styles.label}>From</Text>
        <Pressable
          style={styles.pickerButton}
          onPress={() => setPickerTarget('from')}
          accessibilityRole="button"
          accessibilityLabel={`Starting point: ${from?.name}. Change starting point.`}>
          <Text style={styles.pickerValue}>{from?.name ?? 'Choose a starting point'}</Text>
          <Text style={styles.change}>Change</Text>
        </Pressable>

        <View style={styles.destinationHeading}>
          <Text style={styles.label}>To</Text>
          <View style={styles.smallActions}>
            {toId && (
              <Pressable onPress={() => setToId(null)} accessibilityRole="button">
                <Text style={styles.smallAction}>Clear</Text>
              </Pressable>
            )}
            {toId && (
              <Pressable
                onPress={() => {
                  setFromId(toId);
                  setToId(fromId);
                }}
                accessibilityRole="button"
                accessibilityLabel="Swap start and destination">
                <Text style={styles.smallAction}>Swap</Text>
              </Pressable>
            )}
          </View>
        </View>
        <Pressable
          style={styles.pickerButton}
          onPress={() => setPickerTarget('to')}
          accessibilityRole="button"
          accessibilityLabel={`Destination: ${to?.name ?? 'not selected'}. Choose destination.`}>
          <Text style={[styles.pickerValue, !to && styles.placeholder]}>
            {to?.name ?? 'Choose a facility or platform'}
          </Text>
          <Text style={styles.change}>Choose</Text>
        </Pressable>

        <View style={styles.accessRow}>
          <View style={styles.accessCopy}>
            <Text style={styles.accessTitle}>Step-free route</Text>
            <Text style={styles.accessHint}>Avoid stairs. Uses lifts where available.</Text>
          </View>
          <Switch
            value={stepFreeOnly}
            onValueChange={setStepFreeOnly}
            accessibilityLabel="Use a step-free route and avoid stairs"
          />
        </View>

        <View style={styles.directions}>
          <Text style={styles.sectionTitle}>Directions</Text>
          {!to && <Text style={styles.message}>Choose where you want to go.</Text>}
          {to && fromId === toId && <Text style={styles.message}>You are already here.</Text>}
          {to && fromId !== toId && !route && (
            <Text style={styles.message}>No matching route in this sample map.</Text>
          )}
          {route && fromId !== toId && (
            <>
              <Text style={styles.distance}>About {route.totalMeters} m</Text>
              <Text style={styles.routeHint}>Sample distance from {from?.name}</Text>
              {route.steps.map((step, index) => (
                <View style={styles.stepRow} key={`${index}-${step.text}`}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <View style={styles.stepCopy}>
                    <Text style={styles.stepText}>{step.text}</Text>
                    <Text style={styles.stepDistance}>{step.meters} m</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>

        <Text style={styles.footer}>For real directions, follow station signs or ask railway staff.</Text>
      </ScrollView>

      <Modal
        visible={pickerTarget !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setPickerTarget(null)}>
        <View style={styles.modalBackdrop}>
          <SafeAreaView style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {pickerTarget === 'from' ? 'Choose starting point' : 'Choose destination'}
              </Text>
              <Pressable
                onPress={() => {
                  setPickerTarget(null);
                  setSearch('');
                }}
                accessibilityRole="button"
                accessibilityLabel="Close location picker">
                <Text style={styles.close}>Close</Text>
              </Pressable>
            </View>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search locations"
              placeholderTextColor="#777777"
              style={styles.search}
              accessibilityLabel="Search sample station locations"
            />
            <ScrollView keyboardShouldPersistTaps="handled">
              {filteredPlaces.map((place) => (
                <Pressable
                  key={place.id}
                  onPress={() => selectPlace(place.id)}
                  style={styles.placeOption}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: pickerTarget === 'from' ? place.id === fromId : place.id === toId,
                  }}>
                  <Text style={styles.optionName}>{place.name}</Text>
                  <Text style={styles.optionType}>{place.type}</Text>
                </Pressable>
              ))}
              {filteredPlaces.length === 0 && <Text style={styles.message}>No locations found.</Text>}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F7F4' },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 30, maxWidth: 720, width: '100%', alignSelf: 'center' },
  demoTag: { color: '#72551C', fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  title: { color: '#202924', fontSize: 29, fontWeight: '800', marginTop: 7 },
  stationName: { color: '#68736D', fontSize: 14, marginTop: 3 },
  warning: { backgroundColor: '#FFF4D9', borderRadius: 8, padding: 11, marginTop: 16 },
  warningText: { color: '#624811', fontSize: 13, lineHeight: 18 },
  label: { color: '#303B35', fontSize: 14, fontWeight: '700', marginBottom: 7 },
  pickerButton: { minHeight: 52, backgroundColor: '#FFFFFF', borderColor: '#D7DDD8', borderWidth: 1, borderRadius: 9, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pickerValue: { color: '#202924', fontSize: 15, fontWeight: '600' },
  placeholder: { color: '#7A837E', fontWeight: '400' },
  change: { color: '#27664F', fontSize: 13, fontWeight: '700' },
  destinationHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  smallActions: { flexDirection: 'row', gap: 16 },
  smallAction: { color: '#27664F', fontSize: 13, fontWeight: '700' },
  accessRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: '#E1E4E1', borderBottomWidth: 1, marginTop: 11, paddingVertical: 8 },
  accessCopy: { flex: 1, paddingRight: 10 },
  accessTitle: { color: '#303B35', fontSize: 14, fontWeight: '700' },
  accessHint: { color: '#737C76', fontSize: 12, marginTop: 3 },
  directions: { backgroundColor: '#FFFFFF', borderColor: '#E0E3E0', borderWidth: 1, borderRadius: 10, padding: 14, marginTop: 20 },
  sectionTitle: { color: '#202924', fontSize: 17, fontWeight: '800' },
  message: { color: '#6C756F', fontSize: 14, lineHeight: 20, marginTop: 10 },
  distance: { color: '#27664F', fontSize: 18, fontWeight: '800', marginTop: 12 },
  routeHint: { color: '#778079', fontSize: 12, marginTop: 2, marginBottom: 6 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 },
  stepNumber: { width: 23, height: 23, borderRadius: 12, overflow: 'hidden', backgroundColor: '#E6F0EA', color: '#27664F', textAlign: 'center', textAlignVertical: 'center', fontWeight: '800', fontSize: 12 },
  stepCopy: { flex: 1, marginLeft: 9 },
  stepText: { color: '#303B35', fontSize: 14, lineHeight: 19 },
  stepDistance: { color: '#778079', fontSize: 12, marginTop: 2 },
  footer: { color: '#737C76', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 19 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  modalSheet: { maxHeight: '82%', backgroundColor: '#F7F7F4', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 18 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  modalTitle: { color: '#202924', fontSize: 19, fontWeight: '800' },
  close: { color: '#27664F', fontSize: 14, fontWeight: '700' },
  search: { backgroundColor: '#FFFFFF', borderColor: '#D7DDD8', borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 11, fontSize: 15, color: '#202924', marginBottom: 10 },
  placeOption: { paddingVertical: 13, borderBottomColor: '#E1E4E1', borderBottomWidth: 1 },
  optionName: { color: '#202924', fontSize: 15, fontWeight: '600' },
  optionType: { color: '#778079', fontSize: 12, marginTop: 2 },
});
