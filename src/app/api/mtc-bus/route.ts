import { NextResponse } from 'next/server';
import { MTC_BUS_ROUTES, ALL_MTC_STOPS, POPULAR_MTC_STOPS, MTCBusRoute } from '@/data/mtc-routes-data';

function norm(str: string): string {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/th/g, 't')
    .replace(/dh/g, 't')
    .replace(/sh/g, 's');
}

function findStopIndex(routeStops: string[], query: string): number {
  if (!query || !routeStops || routeStops.length === 0) return -1;
  const qLower = query.toLowerCase().trim();
  const qNorm = norm(query);

  // 1. Exact case-insensitive match
  let idx = routeStops.findIndex(s => s.toLowerCase().trim() === qLower);
  if (idx !== -1) return idx;

  // 2. Normalized exact match
  idx = routeStops.findIndex(s => norm(s) === qNorm);
  if (idx !== -1) return idx;

  // 3. Word starts-with or exact word match
  idx = routeStops.findIndex(s => {
    const words = s.toLowerCase().split(/[\s,/-]+/);
    return words.some(w => w === qLower || (qLower.length >= 3 && w.startsWith(qLower)));
  });
  if (idx !== -1) return idx;

  // 4. Substring inclusion
  idx = routeStops.findIndex(s => {
    const sNorm = norm(s);
    return sNorm.includes(qNorm) || (qNorm.length >= 4 && qNorm.includes(sNorm));
  });
  return idx;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from')?.trim() || '';
    const to = searchParams.get('to')?.trim() || '';
    const autocomplete = searchParams.get('autocomplete')?.trim() || '';

    // 1. Autocomplete Search
    if (autocomplete !== '') {
      const rawQ = autocomplete.toLowerCase().trim();
      const q = norm(autocomplete);

      if (!rawQ) {
        return NextResponse.json({ stops: POPULAR_MTC_STOPS.slice(0, 12), popular: true });
      }

      const startsWithMatches: string[] = [];
      const wordStartsWithMatches: string[] = [];
      const containsMatches: string[] = [];
      const seen = new Set<string>();

      for (const stop of ALL_MTC_STOPS) {
        const lowerStop = stop.toLowerCase().trim();
        const normStop = norm(stop);

        if (lowerStop.startsWith(rawQ) || (q.length >= 2 && normStop.startsWith(q))) {
          if (!seen.has(stop)) {
            seen.add(stop);
            startsWithMatches.push(stop);
          }
        } else {
          const words = lowerStop.split(/[\s,/-]+/);
          if (words.some(w => w.startsWith(rawQ))) {
            if (!seen.has(stop)) {
              seen.add(stop);
              wordStartsWithMatches.push(stop);
            }
          } else if (lowerStop.includes(rawQ) || (q.length >= 3 && normStop.includes(q))) {
            if (!seen.has(stop)) {
              seen.add(stop);
              containsMatches.push(stop);
            }
          }
        }
      }

      startsWithMatches.sort((a, b) => a.localeCompare(b));
      wordStartsWithMatches.sort((a, b) => a.localeCompare(b));
      containsMatches.sort((a, b) => a.localeCompare(b));

      const matches = [...startsWithMatches, ...wordStartsWithMatches, ...containsMatches].slice(0, 30);
      return NextResponse.json({ stops: matches, popular: false });
    }

    // 2. Direct list of popular stops if neither from nor to is provided
    if (!from && !to) {
      return NextResponse.json({ stops: ALL_MTC_STOPS, popular: POPULAR_MTC_STOPS });
    }

    // 3. Search routes: Direct matches
    const direct: any[] = [];
    MTC_BUS_ROUTES.forEach((r: MTCBusRoute) => {
      const fi = findStopIndex(r.stops, from);
      const ti = findStopIndex(r.stops, to);
      if (fi !== -1 && ti !== -1 && fi < ti) {
        direct.push({
          busNo: r.busNo,
          start: r.start,
          destination: r.destination,
          areaSection: r.areaSection,
          stops: r.stops,
          boardIndex: fi,
          alightIndex: ti,
          stopsCount: ti - fi
        });
      }
    });

    // 4. One-transfer journeys (if direct matches are fewer than 10)
    const transfers: any[] = [];
    if (direct.length < 10 && from && to) {
      const fromRoutes = MTC_BUS_ROUTES.filter((r: MTCBusRoute) => findStopIndex(r.stops, from) !== -1);
      const toRoutes = MTC_BUS_ROUTES.filter((r: MTCBusRoute) => findStopIndex(r.stops, to) !== -1);
      const seenTransfers = new Set<string>();

      for (const rA of fromRoutes) {
        const fi = findStopIndex(rA.stops, from);
        for (const rB of toRoutes) {
          if (rA.busNo === rB.busNo && rA.start === rB.start) continue;
          const tiB = findStopIndex(rB.stops, to);

          // Find common stop
          for (let a = fi + 1; a < rA.stops.length; a++) {
            const stopANorm = norm(rA.stops[a]);
            for (let b = 0; b < tiB; b++) {
              if (norm(rB.stops[b]) === stopANorm) {
                const key = `${rA.busNo}|${rB.busNo}|${stopANorm}`;
                if (!seenTransfers.has(key)) {
                  seenTransfers.add(key);
                  transfers.push({
                    busNoA: rA.busNo,
                    startA: rA.start,
                    destinationA: rA.destination,
                    stopsA: rA.stops,
                    busNoB: rB.busNo,
                    startB: rB.start,
                    destinationB: rB.destination,
                    stopsB: rB.stops,
                    transferStop: rA.stops[a],
                    boardIndexA: fi,
                    transferIndexA: a,
                    transferIndexB: b,
                    alightIndexB: tiB,
                    totalStops: (a - fi) + (tiB - b)
                  });
                }
                break;
              }
            }
          }
        }
      }
    }

    // Sort transfer matches by least number of stops in Leg 1 + Leg 2
    transfers.sort((x, y) => x.totalStops - y.totalStops);

    const limitedTransfers = transfers.slice(0, 12);

    return NextResponse.json({
      direct,
      transfers: limitedTransfers,
      totalDirect: direct.length,
      totalTransfers: transfers.length
    });
  } catch (error: any) {
    console.error('Error in MTC Bus API:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
