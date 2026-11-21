import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type BoardMode = 'Departures' | 'Arrivals';
type BoardItem = {
  number: string;
  name: string;
  otherStation: string;
  time: string;
  platform: string;
};

const board: Record<BoardMode, BoardItem[]> = {
  Departures: [
    { number: 'DEMO-01', name: 'Sample Local', otherStation: 'Example City', time: '09:10', platform: '1' },
    { number: 'DEMO-02', name: 'Sample Express', otherStation: 'Hilltown', time: '09:35', platform: '2' },
    { number: 'DEMO-03', name: 'Sample Passenger', otherStation: 'Riverside', time: '10:05', platform: '3' },
  ],
  Arrivals: [
    { number: 'DEMO-04', name: 'Sample Local', otherStation: 'Example City', time: '09:20', platform: '1' },
    { number: 'DEMO-05', name: 'Sample Express', otherStation: 'Hilltown', time: '09:50', platform: '2' },
    { number: 'DEMO-06', name: 'Sample Passenger', otherStation: 'Riverside', time: '10:15', platform: '3' },
  ],
};

export default function TrainsScreen() {
  const [mode, setMode] = useState<BoardMode>('Departures');
  const [search, setSearch] = useState('');
  const items = useMemo(() => {
    const query = search.trim().toLowerCase();
    return board[mode].filter((item) =>
      `${item.number} ${item.name} ${item.otherStation} ${item.platform}`.toLowerCase().includes(query),
    );
  }, [mode, search]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>DEMO TRAIN BOARD</Text>
        <Text style={styles.title}>Train information</Text>
        <Text style={styles.subtitle}>Demo Junction · sample schedule</Text>
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            These trains, times and platforms are fictional. No live railway API is connected.
          </Text>
        </View>

        <View style={styles.toggle} accessibilityRole="tablist">
          {(['Departures', 'Arrivals'] as BoardMode[]).map((item) => (
            <Pressable
              key={item}
              onPress={() => setMode(item)}
              style={[styles.toggleOption, mode === item && styles.toggleSelected]}
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === item }}>
              <Text style={[styles.toggleText, mode === item && styles.toggleTextSelected]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search train, destination or platform"
          placeholderTextColor="#777777"
          style={styles.search}
          accessibilityLabel="Search sample trains"
        />

        <View style={styles.boardHeading}>
          <Text style={styles.sectionTitle}>{mode}</Text>
          <Text style={styles.count}>{items.length} trains</Text>
        </View>
        {items.map((item) => (
          <View style={styles.trainCard} key={item.number}>
            <View style={styles.cardTop}>
              <Text style={styles.trainNumber}>{item.number}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <Text style={styles.trainName}>{item.name}</Text>
            <Text style={styles.stationLine}>
              {mode === 'Departures' ? 'To' : 'From'} {item.otherStation}
            </Text>
            <View style={styles.cardBottom}>
              <Text style={styles.platform}>Platform {item.platform}</Text>
              <Text style={styles.status}>Sample schedule</Text>
            </View>
          </View>
        ))}
        {items.length === 0 && <Text style={styles.empty}>No matching sample trains.</Text>}
        <Text style={styles.footer}>Confirm actual train information on official railway channels.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F7F4' },
  content: { padding: 20, paddingTop: 12, paddingBottom: 30, maxWidth: 720, width: '100%', alignSelf: 'center' },
  eyebrow: { color: '#72551C', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, marginTop: 8 },
  title: { color: '#202924', fontSize: 29, fontWeight: '800', marginTop: 7 },
  subtitle: { color: '#68736D', fontSize: 14, marginTop: 3 },
  notice: { backgroundColor: '#FFF4D9', borderRadius: 8, padding: 11, marginTop: 16 },
  noticeText: { color: '#624811', fontSize: 13, lineHeight: 18 },
  toggle: { flexDirection: 'row', backgroundColor: '#E9ECE9', borderRadius: 9, padding: 3, marginTop: 18 },
  toggleOption: { flex: 1, minHeight: 39, alignItems: 'center', justifyContent: 'center', borderRadius: 7 },
  toggleSelected: { backgroundColor: '#FFFFFF' },
  toggleText: { color: '#66716B', fontSize: 14, fontWeight: '600' },
  toggleTextSelected: { color: '#27664F', fontWeight: '800' },
  search: { backgroundColor: '#FFFFFF', borderColor: '#D7DDD8', borderWidth: 1, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: '#202924', marginTop: 12 },
  boardHeading: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 21, marginBottom: 9 },
  sectionTitle: { color: '#303B35', fontSize: 16, fontWeight: '800' },
  count: { color: '#778079', fontSize: 12 },
  trainCard: { backgroundColor: '#FFFFFF', borderColor: '#E0E3E0', borderWidth: 1, borderRadius: 9, padding: 13, marginBottom: 9 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trainNumber: { color: '#27664F', fontSize: 12, fontWeight: '800', letterSpacing: 0.4 },
  time: { color: '#202924', fontSize: 18, fontWeight: '800' },
  trainName: { color: '#303B35', fontSize: 15, fontWeight: '700', marginTop: 7 },
  stationLine: { color: '#68736D', fontSize: 13, marginTop: 3 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopColor: '#ECEEEC', borderTopWidth: 1, paddingTop: 9, marginTop: 11 },
  platform: { color: '#303B35', fontSize: 13, fontWeight: '700' },
  status: { color: '#778079', fontSize: 12 },
  empty: { color: '#68736D', fontSize: 14, paddingVertical: 14 },
  footer: { color: '#737C76', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 11 },
});
