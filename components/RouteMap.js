import { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Line, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { places, links, placeById } from '../data/stationData';
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
const MAP_W = 340;
const MAP_H = 330;

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
const TRACK_OFFSET = 27; // each platform has its track just to its right
const COACHES = 8;

// A simple floor-plan style map (not to scale): station building, platforms,
// railway tracks, footbridge, stalls, and trains standing at platforms.
// path = place ids on the route. trains = sample trains (already enriched).
function RouteMap({ path, fromId, toId, trains }) {
  const routeLinks = new Set();
  (path || []).forEach((id, i) => {
    if (i < path.length - 1) {
      routeLinks.add(`${id}|${path[i + 1]}`);
      routeLinks.add(`${path[i + 1]}|${id}`);
    }
  });

  return (
    <View
      style={styles.box}
      accessibilityRole="image"
      accessibilityLabel="Map of the sample station with platforms, tracks and stalls. Use the written directions to follow the route."
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
        {/* Ground */}
        <Rect x="0" y="0" width={MAP_W} height={MAP_H} fill="#eef2f7" />

        {/* Road in front of the station */}
        <Rect x="0" y="266" width="150" height="14" fill="#cbd5e1" />
        <SvgText x="130" y="276" fontSize="6" fill="#475569" textAnchor="end">ROAD</SvgText>

        {/* Station building */}
        <Rect x="10" y="22" width="140" height="244" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
        <SvgText x="80" y="15" fontSize="7" fill="#64748b" textAnchor="middle">STATION BUILDING</SvgText>

        {/* Platforms (grey strips with yellow safety edges) and their tracks */}
        {platforms.map((p, i) => {
          const trackX = p.x + TRACK_OFFSET;
          return (
            <G key={`pf-${p.id}`}>
              <Rect x={p.x - 15} y="25" width="30" height="245" fill="#e7e5e4" />
              <Line x1={p.x - 13} y1="25" x2={p.x - 13} y2="270" stroke="#facc15" strokeWidth="1.5" />
              <Line x1={p.x + 13} y1="25" x2={p.x + 13} y2="270" stroke="#facc15" strokeWidth="1.5" />
              <Line x1={trackX} y1="25" x2={trackX} y2="270" stroke="#a8a29e" strokeWidth="10" strokeDasharray="1.5,3" />
              <Line x1={trackX - 4} y1="25" x2={trackX - 4} y2="270" stroke="#57534e" strokeWidth="1.2" />
              <Line x1={trackX + 4} y1="25" x2={trackX + 4} y2="270" stroke="#57534e" strokeWidth="1.2" />
              <SvgText x={trackX} y="279" fontSize="6" fill="#57534e" textAnchor="middle">{`Track ${i + 1}`}</SvgText>
            </G>
          );
        })}

        {/* Footbridge over the tracks */}
        <Rect x="70" y="33" width="256" height="14" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
        <SvgText x="180" y="43" fontSize="7" fill="#475569" textAnchor="middle">FOOTBRIDGE</SvgText>

        {/* Corridors and walkways: grey edge first, then white on top */}
        {drawLinks.map((l) => (
          <Line key={`edge-${l.a}-${l.b}`} {...linkPoints(l)} stroke="#cbd5e1" strokeWidth="9" />
        ))}
        {drawLinks.map((l) => (
          <Line key={`walk-${l.a}-${l.b}`} {...linkPoints(l)} stroke="#ffffff" strokeWidth="7" />
        ))}

        {/* Trains standing at their platform (coaches on the track) */}
        {platforms.map((p) => {
          const here = activeTrainsAt(trains || [], p.id).find((t) => t.state === 'at_platform');
          if (!here) return null;
          const color = here.delayMin > 0 ? '#f59e0b' : '#16a34a';
          const trackX = p.x + TRACK_OFFSET;
          return (
            <G key={`train-${p.id}`}>
              {Array.from({ length: COACHES }).map((_, i) => (
                <Rect
                  key={i}
                  x={trackX - 4.5}
                  y={54 + i * 26}
                  width="9"
                  height="24"
                  rx="2"
                  fill={i === 0 ? '#1f2937' : color}
                  stroke="#ffffff"
                  strokeWidth="0.8"
                />
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
              <Rect
                x={p.x - p.box[0] / 2}
                y={p.y - p.box[1] / 2}
                width={p.box[0]}
                height={p.box[1]}
                rx="3"
                fill={colors[0]}
                stroke={outline}
                strokeWidth={width}
              />
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
            <Line
              key={`route-${l.a}-${l.b}`}
              {...linkPoints(l)}
              stroke={ROUTE}
              strokeWidth="4"
              strokeLinecap="round"
            />
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
        <SvgText x="80" y="291" fontSize="7" fontWeight="bold" fill="#111827" textAnchor="middle">Entrance</SvgText>
        <SvgText x="112" y="144" fontSize="7" fill="#475569" textAnchor="middle">Concourse</SvgText>

        {/* Under each platform: its name, and the next train (number if it is
            standing there, otherwise the expected time and delay) */}
        {platforms.map((p) => {
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
              <SvgText x={p.x} y="291" fontSize="9" fontWeight="bold" fill={color} textAnchor="middle">
                {p.short}
              </SvgText>
              <SvgText x={p.x} y="302" fontSize="7" fill="#374151" textAnchor="middle">
                {line}
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
    aspectRatio: MAP_W / MAP_H,
    backgroundColor: '#eef2f7',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
});
