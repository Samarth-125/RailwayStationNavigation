import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Line, Circle, Text as SvgText } from 'react-native-svg';
import { places, links, placeById } from '../data/stationData';

// A simple schematic map (not to scale). The route is drawn in blue.
// path = list of place ids on the route, e.g. ['entrance', 'concourse', 'p1'].
function RouteMap({ path, fromId, toId }) {
  const onRoute = new Set(path || []);
  const routeLinks = new Set();
  (path || []).forEach((id, i) => {
    if (i < path.length - 1) {
      routeLinks.add(`${id}|${path[i + 1]}`);
      routeLinks.add(`${path[i + 1]}|${id}`);
    }
  });

  // Stairs and lift between the same two places share one line on the map.
  const drawn = new Set();
  const lines = links.filter((l) => {
    const key = [l.a, l.b].sort().join('|');
    if (drawn.has(key)) return false;
    drawn.add(key);
    return true;
  });

  return (
    <View
      style={styles.box}
      accessibilityRole="image"
      accessibilityLabel="Schematic map of the sample station. Use the written directions to follow the route."
    >
      <Svg width="100%" height="100%" viewBox="0 0 300 200">
        {lines.map((l) => {
          const a = placeById[l.a];
          const b = placeById[l.b];
          const active = routeLinks.has(`${l.a}|${l.b}`);
          return (
            <Line
              key={`${l.a}-${l.b}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={active ? '#1d4ed8' : '#9ca3af'}
              strokeWidth={active ? 4 : 1.5}
            />
          );
        })}

        {places.map((p) => {
          let color = '#6b7280';
          if (onRoute.has(p.id)) color = '#1d4ed8';
          if (p.id === fromId) color = '#15803d'; // green = start
          if (p.id === toId) color = '#b91c1c'; // red = destination
          const big = p.id === fromId || p.id === toId;
          return (
            <G key={p.id}>
              <Circle cx={p.x} cy={p.y} r={big ? 7 : 4} fill={color} />
              <SvgText x={p.x} y={p.y + 15} fontSize="8" fill="#111827" textAnchor="middle">
                {p.short}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

export default memo(RouteMap);

const styles = StyleSheet.create({
  box: {
    aspectRatio: 1.5,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 16,
  },
});
