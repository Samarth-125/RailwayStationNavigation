import { memo, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { G, Line, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { activeTrainsAt } from '../utils/trainStatus';

// Colours of the rooms and stalls. [fill, outline]
const ROOM_COLORS = {
  ticket: ['#e0f2fe', '#7dd3fc'],
  help: ['#e0f2fe', '#7dd3fc'],
  police: ['#dbeafe', '#1d4ed8'],
  medical: ['#fee2e2', '#b91c1c'],
  restroom: ['#ede9fe', '#a78bfa'],
  waiting: ['#fef3c7', '#f59e0b'],
  food: ['#ffedd5', '#fb923c'],
  water: ['#cffafe', '#22d3ee'],
  atm: ['#dcfce7', '#4ade80'],
};

const START = '#15803d'; // green
const END = '#b91c1c'; // red
const ROUTE = '#1d4ed8'; // blue
const PX_PER_UNIT = 1.05; // how big the map is drawn on screen

// If a place is a room (has a box), a line should stop at the room's wall,
// not poke through its middle. This finds that point on the wall.
function edgePoint(p, q) {
  if (!p.box) return { x: p.x, y: p.y };
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const tx = dx !== 0 ? p.box[0] / 2 / Math.abs(dx) : Infinity;
  const ty = dy !== 0 ? p.box[1] / 2 / Math.abs(dy) : Infinity;
  const t = Math.min(tx, ty, 1);
  return { x: p.x + dx * t, y: p.y + dy * t };
}

// Draws one drawing instruction from the station's "decor" list.
function drawItem(item, key) {
  if (item.k === 'rect') {
    return (
      <Rect key={key} x={item.x} y={item.y} width={item.w} height={item.h} rx={item.rx}
        fill={item.fill} stroke={item.stroke} strokeWidth={item.sw} />
    );
  }
  if (item.k === 'line') {
    return (
      <Line key={key} x1={item.x1} y1={item.y1} x2={item.x2} y2={item.y2}
        stroke={item.stroke} strokeWidth={item.sw} strokeDasharray={item.dash} />
    );
  }
  return (
    <SvgText key={key} x={item.x} y={item.y} fontSize={item.fs} fill={item.fill}
      textAnchor={item.anchor} fontWeight={item.bold ? 'bold' : 'normal'}>
      {item.t}
    </SvgText>
  );
}

// A floor-plan style map (not to scale) of one station: building, platforms,
// railway tracks, stalls, and trains standing at platforms.
// Big stations are wider than the screen, so the map scrolls sideways.
function RouteMap({ station, path, fromId, toId, trains }) {
  const { width: screenWidth } = useWindowDimensions();
  const { places, links, placeById, decor } = station;
  const scrollRef = useRef(null);

  const available = screenWidth - 32;
  const natural = decor.width * PX_PER_UNIT;
  const scrolls = natural > available;
  const pxWidth = scrolls ? natural : available;
  const scale = pxWidth / decor.width;
  const pxHeight = decor.height * scale;

  // When the destination changes, slide the map so it is in view.
  useEffect(() => {
    if (!scrolls || !toId || !scrollRef.current) return;
    const x = Math.max(0, placeById[toId].x * scale - available / 2);
    scrollRef.current.scrollTo({ x, animated: true });
  }, [toId, scrolls, scale, available, placeById]);

  const routeLinks = new Set();
  (path || []).forEach((id, i) => {
    if (i < path.length - 1) {
      routeLinks.add(`${id}|${path[i + 1]}`);
      routeLinks.add(`${path[i + 1]}|${id}`);
    }
  });

  // Stairs and lift between the same two places share one line on the map.
  const seen = new Set();
  const drawLinks = links.filter((l) => {
    const key = [l.a, l.b].sort().join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  function linkPoints(l) {
    const a = placeById[l.a];
    const b = placeById[l.b];
    const p1 = edgePoint(a, b);
    const p2 = edgePoint(b, a);
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
  }

  const platforms = places.filter((p) => p.category === 'platform');

  return (
    <View>
      <View
        style={[styles.box, { height: pxHeight + 2 }]}
        accessibilityRole="image"
        accessibilityLabel={`Schematic map of ${station.name} with platforms, tracks and stalls. Use the written directions to follow the route.`}
      >
        <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={scrolls}>
          <View style={{ width: pxWidth, height: pxHeight }}>
            <Svg width="100%" height="100%" viewBox={`0 0 ${decor.width} ${decor.height}`}>
              {/* Ground, building, platforms, tracks (from the station template) */}
              {decor.base.map((item, i) => drawItem(item, `b${i}`))}

              {/* Corridors and walkways: grey edge first, then white on top */}
              {drawLinks.map((l) => (
                <Line key={`edge-${l.a}-${l.b}`} {...linkPoints(l)} stroke="#cbd5e1" strokeWidth="9" />
              ))}
              {drawLinks.map((l) => (
                <Line key={`walk-${l.a}-${l.b}`} {...linkPoints(l)} stroke="#ffffff" strokeWidth="7" />
              ))}

              {/* Trains standing at their platform (coaches on the track) */}
              {decor.geo.map((g) => {
                const here = activeTrainsAt(trains || [], g.id).find((t) => t.state === 'at_platform');
                if (!here) return null;
                const color = here.delayMin > 0 ? '#f59e0b' : '#16a34a';
                return (
                  <G key={`train-${g.id}`}>
                    {Array.from({ length: g.coachN }).map((_, i) => (
                      <Rect key={i} x={g.trackX - 4.5} y={g.coachY0 + i * 26} width="9" height="24" rx="2"
                        fill={i === 0 ? '#1f2937' : color} stroke="#ffffff" strokeWidth="0.8" />
                    ))}
                  </G>
                );
              })}

              {/* Rooms and stalls */}
              {places.filter((p) => p.box).map((p) => {
                const colors = ROOM_COLORS[p.category] || ['#f1f5f9', '#94a3b8'];
                let outline = colors[1];
                let width = 1;
                if (p.id === fromId) { outline = START; width = 3; }
                if (p.id === toId) { outline = END; width = 3; }
                return (
                  <G key={p.id}>
                    <Rect x={p.x - p.box[0] / 2} y={p.y - p.box[1] / 2} width={p.box[0]} height={p.box[1]}
                      rx="3" fill={colors[0]} stroke={outline} strokeWidth={width} />
                    <SvgText x={p.x} y={p.y + 2.5} fontSize={p.box[0] < 40 ? 6.5 : 7} fill="#111827" textAnchor="middle">
                      {p.short}
                    </SvgText>
                  </G>
                );
              })}

              {/* The route, in blue, on top of everything */}
              {drawLinks
                .filter((l) => routeLinks.has(`${l.a}|${l.b}`))
                .map((l) => (
                  <Line key={`route-${l.a}-${l.b}`} {...linkPoints(l)} stroke={ROUTE} strokeWidth="4" strokeLinecap="round" />
                ))}

              {/* Dots for places that are not rooms */}
              {places
                .filter((p) => !p.box && p.category !== 'corridor')
                .map((p) => {
                  let color = '#64748b';
                  let r = p.category === 'junction' ? 2.5 : 4;
                  if (p.id === fromId) { color = START; r = 7; }
                  if (p.id === toId) { color = END; r = 7; }
                  return <Circle key={p.id} cx={p.x} cy={p.y} r={r} fill={color} stroke="#ffffff" strokeWidth="1" />;
                })}

              {decor.over.map((item, i) => drawItem(item, `o${i}`))}

              {/* Next to each platform: its name, and the next train (number if it is
                  standing there, otherwise the expected time and delay) */}
              {platforms.map((p, i) => {
                const g = decor.geo[i];
                let color = '#111827';
                if (p.id === fromId) color = START;
                if (p.id === toId) color = END;
                const next = activeTrainsAt(trains || [], p.id)[0];
                let line = '';
                if (next) {
                  line = next.state === 'at_platform'
                    ? next.number
                    : `${next.expected}${next.delayMin > 0 ? ` +${next.delayMin}` : ''}`;
                }
                return (
                  <G key={`board-${p.id}`}>
                    <SvgText x={g.x} y={g.boardY} fontSize="9" fontWeight="bold" fill={color} textAnchor="middle">
                      {p.short}
                    </SvgText>
                    <SvgText x={g.x} y={g.boardY2} fontSize="7" fill="#374151" textAnchor="middle">
                      {line}
                    </SvgText>
                  </G>
                );
              })}
            </Svg>
          </View>
        </ScrollView>
      </View>
      {scrolls && <Text style={styles.hint}>This station is wide. Scroll the map sideways.</Text>}
    </View>
  );
}

export default memo(RouteMap);

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#eef2f7',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  hint: { fontSize: 13, color: '#555555', marginBottom: 4 },
});
