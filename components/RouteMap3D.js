import { memo, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { G, Line, Circle, Polygon, Text as SvgText } from 'react-native-svg';
import { activeTrainsAt } from '../utils/trainStatus';
import { useI18n, mapText, field } from '../utils/i18n';
import { ROOM_COLORS } from './RouteMap';

// A simple 3D view of the SAME station drawing as RouteMap.
// It is an "oblique" projection: the flat plan is drawn slightly from the front
// and above, and things get a height - platforms are raised, stalls and rooms are
// boxes, the footbridge floats above the tracks. It is NOT a real 3D model.
//
// How it works: every point of the plan (x, y) plus a height z is turned into a
// screen point by project(). Then we draw boxes from the back to the front.

const START = '#15803d';
const END = '#b91c1c';
const ROUTE = '#1d4ed8';
const PX_PER_UNIT = 1.5;

const SHIFT = 0.5; // how far things slide sideways as they come closer
const DEPTH = 0.55; // how much of the plan's y direction is shown vertically
const PLATFORM_H = 6; // platforms are raised this much
const BRIDGE_Z = 22; // footbridge height
const TOP_MARGIN = 30; // room above the plan for tall things

// Makes a colour a bit darker (f < 1). Works with '#rrggbb'.
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

// Height of a place above the ground, so stairs and routes go up and down.
function zOf(place) {
  if (place.id.startsWith('bridge')) return BRIDGE_Z + 3;
  if (place.category === 'platform' || /^s\d+_/.test(place.id)) return PLATFORM_H;
  return 0;
}

function RouteMap3D({ station, path, fromId, toId, trains, closedIds }) {
  const { lang, t } = useI18n();
  const { width: screenWidth } = useWindowDimensions();
  const { places, links, placeById, decor } = station;
  const scrollRef = useRef(null);

  const W = decor.width;
  const H = decor.height;
  const unitsW = W + SHIFT * H;
  const unitsH = DEPTH * H + TOP_MARGIN + 14;

  const available = screenWidth - 32;
  const natural = unitsW * PX_PER_UNIT;
  const scrolls = natural > available;
  const pxWidth = scrolls ? natural : available;
  const scale = pxWidth / unitsW;
  const pxHeight = unitsH * scale;

  // plan point (x, y) at height z -> point on screen
  const project = (x, y, z = 0) => [x - SHIFT * y + SHIFT * H, DEPTH * y - z + TOP_MARGIN];
  const pts = (corners) => corners.map(([x, y, z]) => project(x, y, z).join(',')).join(' ');

  useEffect(() => {
    if (!scrolls || !toId || !scrollRef.current) return;
    const [sx] = project(placeById[toId].x, placeById[toId].y);
    scrollRef.current.scrollTo({ x: Math.max(0, sx * scale - available / 2), animated: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toId, scrolls, scale, available, placeById]);

  // A box seen from the front-right: front wall, right wall and top.
  function box(key, x0, y0, x1, y1, z0, z1, fill, stroke, sw = 0.8) {
    return (
      <G key={key}>
        <Polygon points={pts([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])} fill={shade(fill, 0.82)} stroke={stroke} strokeWidth={sw} />
        <Polygon points={pts([[x1, y1, z0], [x1, y0, z0], [x1, y0, z1], [x1, y1, z1]])} fill={shade(fill, 0.66)} stroke={stroke} strokeWidth={sw} />
        <Polygon points={pts([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])} fill={fill} stroke={stroke} strokeWidth={sw} />
      </G>
    );
  }
  // A flat rectangle lying at height z.
  function flat(key, x, y, w, h, z, fill, stroke, sw = 0.8, opacity) {
    return (
      <Polygon key={key} points={pts([[x, y, z], [x + w, y, z], [x + w, y + h, z], [x, y + h, z]])}
        fill={fill} stroke={stroke} strokeWidth={sw} fillOpacity={opacity} />
    );
  }

  const routeLinks = new Set();
  (path || []).forEach((id, i) => {
    if (i < path.length - 1) {
      routeLinks.add(`${id}|${path[i + 1]}`);
      routeLinks.add(`${path[i + 1]}|${id}`);
    }
  });
  const seen = new Set();
  const drawLinks = links.filter((l) => {
    const key = [l.a, l.b].sort().join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const seg = (l) => {
    const a = placeById[l.a];
    const b = placeById[l.b];
    const [x1, y1] = project(a.x, a.y, zOf(a));
    const [x2, y2] = project(b.x, b.y, zOf(b));
    return { x1, y1, x2, y2 };
  };

  // ---- flat things first (ground, floors, tracks, platform tops) ---------------
  const ground = [];
  decor.base.forEach((it, i) => {
    if (it.kind === 'ground') ground.push(flat(`g${i}`, it.x, it.y, it.w, it.h, 0, it.fill, 'none', 0));
    else if (it.kind === 'floor') ground.push(box(`f${i}`, it.x, it.y, it.x + it.w, it.y + it.h, 0, 3, it.fill, it.stroke, 1));
    else if (it.k === 'line' && it.stroke !== '#facc15') {
      const [x1, y1] = project(it.x1, it.y1, 0);
      const [x2, y2] = project(it.x2, it.y2, 0);
      ground.push(<Line key={`l${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={it.stroke} strokeWidth={it.sw} strokeDasharray={it.dash} />);
    }
  });
  const slabs = decor.geo.map((g) => box(`slab-${g.id}`, g.x - 15, g.top, g.x + 15, g.bottom, 0, PLATFORM_H, '#e7e5e4', '#a8a29e', 0.6));
  const edges = decor.geo.flatMap((g) =>
    [g.x - 13, g.x + 13].map((x) => {
      const [x1, y1] = project(x, g.top, PLATFORM_H);
      const [x2, y2] = project(x, g.bottom, PLATFORM_H);
      return <Line key={`edge-${g.id}-${x}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#facc15" strokeWidth="1.5" />;
    })
  );

  // ---- things with height, drawn back to front --------------------------------
  const solids = [];
  const add = (cx, cy, node) => solids.push({ depth: SHIFT * cx + cy, node });

  decor.base.forEach((it, i) => {
    if (it.kind === 'deck') {
      // shadow on the ground, then the floating deck
      solids.push({ depth: -1, node: flat(`shadow${i}`, it.x, it.y, it.w, it.h, 0, '#000000', 'none', 0, 0.12) });
      add(it.x + it.w / 2, it.y + it.h / 2, box(`deck${i}`, it.x, it.y, it.x + it.w, it.y + it.h, BRIDGE_Z, BRIDGE_Z + 3, it.fill, it.stroke, 0.8));
    }
    if (it.kind === 'buffer') add(it.x + it.w / 2, it.y, box(`buf${i}`, it.x, it.y, it.x + it.w, it.y + it.h, 0, 7, it.fill, it.fill, 0.5));
  });

  decor.geo.forEach((g) => {
    const here = activeTrainsAt(trains || [], g.id).find((x) => x.state === 'at_platform');
    if (!here) return;
    const color = here.delayMin > 0 ? '#f59e0b' : '#16a34a';
    for (let i = 0; i < g.coachN; i++) {
      const y0 = g.coachY0 + i * 26;
      add(g.trackX, y0 + 12, box(`coach-${g.id}-${i}`, g.trackX - 4.5, y0, g.trackX + 4.5, y0 + 24, 1, 11, i === 0 ? '#374151' : color, '#ffffff', 0.5));
    }
  });

  places.filter((p) => p.box).forEach((p) => {
    const colors = ROOM_COLORS[p.category] || ['#f1f5f9', '#94a3b8'];
    let outline = colors[1];
    let sw = 0.8;
    if (p.id === fromId) { outline = START; sw = 2; }
    if (p.id === toId) { outline = END; sw = 2; }
    const z0 = /^s\d+_/.test(p.id) ? PLATFORM_H : 0;
    const z1 = z0 + (p.box[0] >= 40 ? 16 : 10);
    add(p.x, p.y, box(`room-${p.id}`, p.x - p.box[0] / 2, p.y - p.box[1] / 2, p.x + p.box[0] / 2, p.y + p.box[1] / 2, z0, z1, colors[0], outline, sw));
  });
  solids.sort((a, b) => a.depth - b.depth);

  const platforms = places.filter((p) => p.category === 'platform');
  const dest = toId ? placeById[toId] : null;

  return (
    <View>
      <View
        style={[styles.box, { height: pxHeight + 2 }]}
        accessibilityRole="image"
        accessibilityLabel={t('mapLabel', { name: field(station, 'name', lang) })}
      >
        <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={scrolls}>
          <View style={{ width: pxWidth, height: pxHeight }}>
            <Svg width="100%" height="100%" viewBox={`0 0 ${unitsW} ${unitsH}`}>
              {ground}
              {slabs}
              {edges}

              {/* Walkways. Stairs and lifts slope up to the footbridge. */}
              {drawLinks.map((l) => <Line key={`edge-${l.a}-${l.b}`} {...seg(l)} stroke="#cbd5e1" strokeWidth="8" />)}
              {drawLinks.map((l) => <Line key={`walk-${l.a}-${l.b}`} {...seg(l)} stroke="#ffffff" strokeWidth="6" />)}

              {solids.map((s) => s.node)}

              {/* Closed platforms: a red cover on the platform top */}
              {decor.geo.filter((g) => (closedIds || []).includes(g.id)).map((g) => (
                <G key={`closed-${g.id}`}>
                  {flat(`cl-${g.id}`, g.x - 15, g.top, 30, g.bottom - g.top, PLATFORM_H + 0.5, '#b91c1c', '#b91c1c', 1, 0.45)}
                  <Line {...(() => { const [x1, y1] = project(g.x - 15, g.top, PLATFORM_H + 1); const [x2, y2] = project(g.x + 15, g.bottom, PLATFORM_H + 1); return { x1, y1, x2, y2 }; })()} stroke="#b91c1c" strokeWidth="1.5" />
                  <Line {...(() => { const [x1, y1] = project(g.x + 15, g.top, PLATFORM_H + 1); const [x2, y2] = project(g.x - 15, g.bottom, PLATFORM_H + 1); return { x1, y1, x2, y2 }; })()} stroke="#b91c1c" strokeWidth="1.5" />
                </G>
              ))}

              {/* The route, in blue, on top (white outline so it stays visible) */}
              {drawLinks.filter((l) => routeLinks.has(`${l.a}|${l.b}`)).map((l) => (
                <Line key={`rw-${l.a}-${l.b}`} {...seg(l)} stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
              ))}
              {drawLinks.filter((l) => routeLinks.has(`${l.a}|${l.b}`)).map((l) => (
                <Line key={`route-${l.a}-${l.b}`} {...seg(l)} stroke={ROUTE} strokeWidth="4" strokeLinecap="round" />
              ))}

              {/* Labels on top of the boxes */}
              {places.filter((p) => p.box).map((p) => {
                const z0 = /^s\d+_/.test(p.id) ? PLATFORM_H : 0;
                const [sx, sy] = project(p.x, p.y, z0 + (p.box[0] >= 40 ? 16 : 10));
                return (
                  <SvgText key={`lab-${p.id}`} x={sx} y={sy + 2.5} fontSize={p.box[0] < 40 ? 6.5 : 7} fill="#111827" textAnchor="middle">
                    {mapText(p.short, lang)}
                  </SvgText>
                );
              })}

              {/* Dots for places that are not rooms */}
              {places.filter((p) => !p.box && p.category !== 'corridor').map((p) => {
                const [sx, sy] = project(p.x, p.y, zOf(p));
                let color = '#64748b';
                let r = p.category === 'junction' ? 2.5 : 3.5;
                if (p.id === fromId || p.id === toId) return null; // drawn as pins below
                return <Circle key={p.id} cx={sx} cy={sy} r={r} fill={color} stroke="#ffffff" strokeWidth="1" />;
              })}

              {/* Pins: green = start, red = destination, standing up so they are easy to see */}
              {[[fromId, START], [toId, END]].map(([id, color]) => {
                if (!id) return null;
                const p = placeById[id];
                const top = zOf(p) + (p.box ? (p.box[0] >= 40 ? 16 : 10) : 0);
                const [bx, by] = project(p.x, p.y, zOf(p));
                const [tx, ty] = project(p.x, p.y, top + 16);
                return (
                  <G key={`pin-${id}`}>
                    <Line x1={bx} y1={by} x2={tx} y2={ty} stroke={color} strokeWidth="1.5" />
                    <Circle cx={tx} cy={ty} r="5.5" fill={color} stroke="#ffffff" strokeWidth="1.2" />
                  </G>
                );
              })}

              {/* Names written on the plan */}
              {decor.base.concat(decor.over).filter((it) => it.k === 'text' && !it.t.startsWith('Track')).map((it, i) => {
                const [sx, sy] = project(it.x, it.y, it.t === 'FOOTBRIDGE' ? BRIDGE_Z + 5 : 0);
                return (
                  <SvgText key={`tx${i}`} x={sx} y={sy} fontSize={it.fs} fill={it.fill} textAnchor={it.anchor} fontWeight={it.bold ? 'bold' : 'normal'}>
                    {mapText(it.t, lang)}
                  </SvgText>
                );
              })}

              {/* Platform names with the next train */}
              {platforms.map((p, i) => {
                const g = decor.geo[i];
                let color = '#111827';
                if (p.id === fromId) color = START;
                if (p.id === toId) color = END;
                const closed = (closedIds || []).includes(p.id);
                const next = activeTrainsAt(trains || [], p.id)[0];
                let line = '';
                if (closed) { line = mapText('CLOSED', lang); color = '#b91c1c'; }
                else if (next) line = next.state === 'at_platform' ? next.number : `${next.expected}${next.delayMin > 0 ? ` +${next.delayMin}` : ''}`;
                const [sx, sy] = project(g.x, g.boardY, 0);
                return (
                  <G key={`board-${p.id}`}>
                    <SvgText x={sx} y={sy} fontSize="9" fontWeight="bold" fill={color} textAnchor="middle">{mapText(p.short, lang)}</SvgText>
                    <SvgText x={sx} y={sy + 11} fontSize="7" fill={closed ? '#b91c1c' : '#374151'} textAnchor="middle">{line}</SvgText>
                  </G>
                );
              })}
            </Svg>
          </View>
        </ScrollView>
      </View>
      {scrolls && <Text style={styles.hint}>{t('wide')}</Text>}
    </View>
  );
}

export default memo(RouteMap3D);

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#eef2f7',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    marginBottom: 8,
    overflow: 'hidden',
  },
  hint: { fontSize: 13, color: '#555555', marginBottom: 4 },
});
