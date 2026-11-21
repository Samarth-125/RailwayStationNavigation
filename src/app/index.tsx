import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Place = { id: string; name: string; type: string; icon: string };
type Connection = {
  from: string;
  to: string;
  text: string;
  stepFree: boolean;
};

const places: Place[] = [
  { id: 'entrance', name: 'Main Entrance', type: 'Start point', icon: '🚪' },
  { id: 'concourse', name: 'Main Concourse', type: 'Station area', icon: '🏛️' },
  { id: 'ticket', name: 'Ticket Counter', type: 'Tickets', icon: '🎫' },
  { id: 'restroom', name: 'Restroom', type: 'Facilities', icon: '🚻' },
  { id: 'food', name: 'Food Court', type: 'Food', icon: '🍽️' },
  { id: 'waiting', name: 'Waiting Room', type: 'Facilities', icon: '🪑' },
  { id: 'lift', name: 'Lift', type: 'Step-free access', icon: '🛗' },
  { id: 'platform1', name: 'Platform 1', type: 'Platform', icon: '🚉' },
  { id: 'platform2', name: 'Platform 2', type: 'Platform', icon: '🚉' },
];

const connections: Connection[] = [
  { from: 'entrance', to: 'concourse', text: 'Walk straight into the main concourse.', stepFree: true },
  { from: 'concourse', to: 'ticket', text: 'Turn left toward the ticket counter.', stepFree: true },
  { from: 'concourse', to: 'restroom', text: 'Follow the restroom signs.', stepFree: true },
  { from: 'concourse', to: 'food', text: 'Continue toward the food court.', stepFree: true },
  { from: 'concourse', to: 'waiting', text: 'Walk to the waiting room.', stepFree: true },
  { from: 'concourse', to: 'platform1', text: 'Use the stairs to Platform 1.', stepFree: false },
  { from: 'concourse', to: 'platform2', text: 'Use the stairs to Platform 2.', stepFree: false },
  { from: 'concourse', to: 'lift', text: 'Walk to the lift beside the concourse.', stepFree: true },
  { from: 'lift', to: 'platform1', text: 'Take the lift to Platform 1.', stepFree: true },
  { from: 'lift', to: 'platform2', text: 'Take the lift to Platform 2.', stepFree: true },
];

function getRoute(destinationId: string, stepFreeOnly: boolean) {
  const queue: { id: string; steps: { text: string; nextId: string }[] }[] = [
    { id: 'entrance', steps: [] },
  ];
  const visited = new Set(['entrance']);

  while (queue.length) {
    const current = queue.shift()!;
    if (current.id === destinationId) return current.steps;

    for (const connection of connections) {
      if (stepFreeOnly && !connection.stepFree) continue;
      if (connection.from !== current.id && connection.to !== current.id) continue;
      const nextId = connection.from === current.id ? connection.to : connection.from;
      if (visited.has(nextId)) continue;
      visited.add(nextId);
      queue.push({
        id: nextId,
        steps: [...current.steps, { text: connection.text, nextId }],
      });
    }
  }
  return null;
}

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [stepFreeOnly, setStepFreeOnly] = useState(false);
  const [destinationId, setDestinationId] = useState<string | null>(null);
  const filteredPlaces = useMemo(() => {
    const value = query.trim().toLowerCase();
    return places.filter(
      (place) =>
        place.id !== 'entrance' &&
        (place.name.toLowerCase().includes(value) || place.type.toLowerCase().includes(value)),
    );
  }, [query]);
  const destination = places.find((place) => place.id === destinationId);
  const route = destinationId ? getRoute(destinationId, stepFreeOnly) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.topLine}>
          <View>
            <Text style={styles.eyebrow}>RAILWAY STATION GUIDE</Text>
            <Text style={styles.title}>Where to?</Text>
          </View>
          <Text style={styles.trainIcon}>🚆</Text>
        </View>

        <View style={styles.demoBanner} accessibilityRole="alert">
          <Text style={styles.demoTitle}>DEMO · SAMPLE DATA</Text>
          <Text style={styles.demoText}>
            Fictional station map. Not live railway information or an official railway app.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Find a place</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search platforms, food, restrooms..."
          placeholderTextColor="#718096"
          style={styles.search}
          accessibilityLabel="Search station facilities and platforms"
          returnKeyType="search"
        />

        <View style={styles.accessibilityRow}>
          <View style={styles.accessibilityCopy}>
            <Text style={styles.accessibilityTitle}>Step-free route</Text>
            <Text style={styles.accessibilityHint}>Avoid stairs where sample routes allow</Text>
          </View>
          <Switch
            value={stepFreeOnly}
            onValueChange={setStepFreeOnly}
            accessibilityLabel="Use step-free routes and avoid stairs"
          />
        </View>

        <Text style={styles.sectionTitle}>Popular places</Text>
        <View style={styles.placeList}>
          {filteredPlaces.map((place) => (
            <Pressable
              key={place.id}
              onPress={() => {
                setDestinationId(place.id);
                setQuery('');
              }}
              accessibilityRole="button"
              accessibilityLabel={`${place.name}, ${place.type}`}
              style={({ pressed }) => [
                styles.placeCard,
                destinationId === place.id && styles.placeCardSelected,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.placeIcon}>{place.icon}</Text>
              <View style={styles.placeCopy}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeType}>{place.type}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
          ))}
          {filteredPlaces.length === 0 && (
            <Text style={styles.empty}>No matching sample locations.</Text>
          )}
        </View>

        {destination && (
          <View style={styles.routeCard}>
            <Text style={styles.routeEyebrow}>ROUTE FROM MAIN ENTRANCE</Text>
            <Text style={styles.routeTitle}>To {destination.name}</Text>
            {route === null ? (
              <Text style={styles.empty}>No route is available in this sample map.</Text>
            ) : route.length === 0 ? (
              <Text style={styles.routeStep}>You are already at this location.</Text>
            ) : (
              route.map((step, index) => {
                const nextPlace = places.find((place) => place.id === step.nextId);
                return (
                  <View style={styles.stepRow} key={`${step.nextId}-${index}`}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                    <View style={styles.stepCopy}>
                      <Text style={styles.stepText}>{step.text}</Text>
                      <Text style={styles.nextPlace}>Next · {nextPlace?.name}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        <Text style={styles.footer}>Demo routes are examples only. Check station signs and staff.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F5' },
  page: { padding: 20, paddingBottom: 36, maxWidth: 720, width: '100%', alignSelf: 'center' },
  topLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  eyebrow: { color: '#467568', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#172C27', fontSize: 34, fontWeight: '800', marginTop: 5 },
  trainIcon: { fontSize: 34 },
  demoBanner: { backgroundColor: '#FFF2D8', borderColor: '#E8C27C', borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 20 },
  demoTitle: { color: '#754300', fontSize: 12, fontWeight: '900', letterSpacing: 0.8 },
  demoText: { color: '#674B23', fontSize: 14, lineHeight: 20, marginTop: 4 },
  sectionTitle: { color: '#172C27', fontSize: 19, fontWeight: '800', marginTop: 23, marginBottom: 10 },
  search: { backgroundColor: '#FFFFFF', borderColor: '#D6E1DC', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, paddingVertical: 13, color: '#172C27', fontSize: 15 },
  accessibilityRow: { backgroundColor: '#E8F2EE', borderRadius: 12, marginTop: 12, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  accessibilityCopy: { flex: 1, paddingRight: 12 },
  accessibilityTitle: { color: '#173E33', fontSize: 15, fontWeight: '800' },
  accessibilityHint: { color: '#526C64', fontSize: 12, marginTop: 3 },
  placeList: { gap: 8 },
  placeCard: { minHeight: 66, backgroundColor: '#FFFFFF', borderColor: '#DFE8E3', borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center' },
  placeCardSelected: { borderColor: '#24715D', borderWidth: 2 },
  pressed: { opacity: 0.75 },
  placeIcon: { fontSize: 23, width: 38 },
  placeCopy: { flex: 1 },
  placeName: { color: '#172C27', fontSize: 15, fontWeight: '700' },
  placeType: { color: '#687B74', fontSize: 12, marginTop: 3 },
  arrow: { color: '#3B7666', fontSize: 26, paddingHorizontal: 5 },
  empty: { color: '#64766F', fontSize: 14, lineHeight: 21, paddingVertical: 10 },
  routeCard: { backgroundColor: '#FFFFFF', borderColor: '#D8E4DE', borderWidth: 1, borderRadius: 14, padding: 16, marginTop: 22 },
  routeEyebrow: { color: '#467568', fontSize: 11, fontWeight: '900', letterSpacing: 0.8 },
  routeTitle: { color: '#172C27', fontSize: 21, fontWeight: '800', marginTop: 4, marginBottom: 8 },
  routeStep: { color: '#172C27', fontSize: 15, marginTop: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 13 },
  stepNumber: { width: 27, height: 27, overflow: 'hidden', borderRadius: 14, backgroundColor: '#24715D', color: '#FFFFFF', textAlign: 'center', textAlignVertical: 'center', fontWeight: '800' },
  stepCopy: { flex: 1, marginLeft: 10 },
  stepText: { color: '#20352F', fontSize: 14, lineHeight: 20, fontWeight: '600' },
  nextPlace: { color: '#687B74', fontSize: 12, marginTop: 3 },
  footer: { color: '#65766F', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 22 },
});
