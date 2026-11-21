import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const mapRows = [
  ['🎫 Ticket Counter', '🏛️ Main Concourse', '🍽️ Food Court'],
  ['🚻 Restroom', '🚪 Main Entrance', '🪑 Waiting Room'],
  ['🛗 Lift', '🚉 Platform 1', '🚉 Platform 2'],
];

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <Text style={styles.eyebrow}>SAMPLE STATION</Text>
        <Text style={styles.title}>Station map</Text>
        <Text style={styles.subtitle}>
          A simple diagram of the demo locations. It is not a measured floor plan.
        </Text>
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>DEMO · NOT LIVE INFORMATION</Text>
          <Text style={styles.noticeText}>
            All locations and connections shown here are fictional sample data.
          </Text>
        </View>
        <View style={styles.map} accessibilityLabel="Illustrative sample station map">
          {mapRows.map((row, rowIndex) => (
            <View style={styles.mapRow} key={`row-${rowIndex}`}>
              {row.map((label, columnIndex) => (
                <View style={styles.node} key={label}>
                  <Text style={styles.nodeText}>{label}</Text>
                  {columnIndex < row.length - 1 && <View style={styles.connector} />}
                </View>
              ))}
            </View>
          ))}
        </View>
        <Text style={styles.noteTitle}>How to use this map</Text>
        <Text style={styles.note}>
          Choose a destination on the Home tab to see sample walking directions from the Main Entrance.
          Turn on Step-free route to avoid connections marked as stairs.
        </Text>
        <Text style={styles.note}>
          The diagram is for a student demonstration. Follow station signs and ask railway staff for
          current directions.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F5' },
  page: { padding: 20, paddingBottom: 36, maxWidth: 720, width: '100%', alignSelf: 'center' },
  eyebrow: { color: '#467568', fontSize: 11, fontWeight: '900', letterSpacing: 1.2, marginTop: 8 },
  title: { color: '#172C27', fontSize: 31, fontWeight: '800', marginTop: 5 },
  subtitle: { color: '#65766F', fontSize: 15, lineHeight: 22, marginTop: 5 },
  notice: { backgroundColor: '#FFF2D8', borderColor: '#E8C27C', borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 18 },
  noticeTitle: { color: '#754300', fontSize: 12, fontWeight: '900', letterSpacing: 0.7 },
  noticeText: { color: '#674B23', fontSize: 14, lineHeight: 20, marginTop: 4 },
  map: { backgroundColor: '#FFFFFF', borderColor: '#DFE8E3', borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 22, gap: 12 },
  mapRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  node: { flex: 1, minHeight: 76, borderRadius: 12, backgroundColor: '#E8F2EE', paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center' },
  nodeText: { color: '#173E33', fontSize: 12, fontWeight: '700', textAlign: 'center' },
  connector: { width: 8, height: 3, backgroundColor: '#6C9B8D' },
  noteTitle: { color: '#172C27', fontSize: 18, fontWeight: '800', marginTop: 23 },
  note: { color: '#53675F', fontSize: 14, lineHeight: 21, marginTop: 9 },
});
