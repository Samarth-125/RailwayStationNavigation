import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { links, places, STATION_NAME } from '@/data/stationData';

const facilities = places.filter((place) => place.type === 'Facility');
const platforms = places.filter((place) => place.type === 'Platform');

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>SAMPLE STATION</Text>
        <Text style={styles.title}>Station map</Text>
        <Text style={styles.subtitle}>{STATION_NAME} · diagram not to scale</Text>
        <View style={styles.notice}>
          <Text style={styles.noticeText}>Demo layout only. Locations and paths are sample data.</Text>
        </View>

        <Text style={styles.sectionTitle}>Facilities</Text>
        <View style={styles.list}>
          {facilities.map((place) => (
            <View style={styles.placeRow} key={place.id}>
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.area}>Concourse</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Platforms</Text>
        <View style={styles.list}>
          {platforms.map((place) => (
            <View style={styles.placeRow} key={place.id}>
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.area}>{place.id === 'p1' ? 'Ground level' : 'Footbridge'}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Sample connections</Text>
        <Text style={styles.connectionText}>
          Main Entrance → Concourse → Facilities and Platform 1. Platforms 2 and 3 connect through
          the footbridge by stairs or lift.
        </Text>
        <Text style={styles.connectionCount}>{links.length} sample route links in the demo</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F7F4' },
  content: { padding: 20, paddingBottom: 30, maxWidth: 720, width: '100%', alignSelf: 'center' },
  eyebrow: { color: '#72551C', fontSize: 11, fontWeight: '800', letterSpacing: 0.6, marginTop: 8 },
  title: { color: '#202924', fontSize: 29, fontWeight: '800', marginTop: 7 },
  subtitle: { color: '#68736D', fontSize: 14, marginTop: 3 },
  notice: { backgroundColor: '#FFF4D9', borderRadius: 8, padding: 11, marginTop: 16 },
  noticeText: { color: '#624811', fontSize: 13, lineHeight: 18 },
  sectionTitle: { color: '#303B35', fontSize: 16, fontWeight: '800', marginTop: 21, marginBottom: 8 },
  list: { backgroundColor: '#FFFFFF', borderColor: '#E0E3E0', borderWidth: 1, borderRadius: 9, paddingHorizontal: 13 },
  placeRow: { minHeight: 46, borderBottomColor: '#ECEEEC', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  placeName: { color: '#303B35', fontSize: 14, fontWeight: '600' },
  area: { color: '#778079', fontSize: 12 },
  connectionText: { color: '#59645E', fontSize: 14, lineHeight: 21 },
  connectionCount: { color: '#778079', fontSize: 12, marginTop: 8 },
});
