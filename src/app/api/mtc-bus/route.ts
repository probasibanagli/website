import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface BusRoute {
  busNo: string;
  start: string;
  destination: string;
  routeStops: string;
  areaSection: string;
  stops: string[];
}

// In-memory cache for loaded data
let cachedRoutes: BusRoute[] | null = null;
let cachedStops: string[] | null = null;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function loadData() {
  if (cachedRoutes && cachedStops) {
    return { routes: cachedRoutes, stops: cachedStops };
  }

  const projectRoot = process.cwd();
  const csvPath = path.join(projectRoot, 'all_mtc_bus_routes.csv');

  if (!fs.existsSync(csvPath)) {
    throw new Error('all_mtc_bus_routes.csv not found in the project root directory');
  }

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const csvLines = csvContent.split(/\r?\n/).slice(1); // Skip header row
  const routesList: BusRoute[] = [];
  const allStopsSet = new Set<string>();

  for (const line of csvLines) {
    if (!line.trim()) continue;
    const parts = parseCSVLine(line);
    if (parts.length < 3) continue;

    const busNo = parts[0];
    const start = parts[1];
    const destination = parts[2];
    const routeStops = parts[3] || '';

    if (!busNo || !start || !destination) continue;

    // Build unique list of stops for this route in order
    const stops: string[] = [start];
    if (routeStops) {
      const intermediate = routeStops.split(',').map(s => s.trim()).filter(Boolean);
      stops.push(...intermediate);
    }
    stops.push(destination);

    // Deduplicate consecutive identical stops to keep route paths clean
    const cleanStops: string[] = [];
    stops.forEach(s => {
      if (cleanStops.length === 0 || cleanStops[cleanStops.length - 1] !== s) {
        cleanStops.push(s);
      }
    });

    // Add stops to global unique set
    cleanStops.forEach(s => allStopsSet.add(s));

    routesList.push({
      busNo,
      start,
      destination,
      routeStops,
      areaSection: '', // not present in the new CSV
      stops: cleanStops
    });
  }

  cachedRoutes = routesList;
  cachedStops = Array.from(allStopsSet).sort();

  return { routes: cachedRoutes, stops: cachedStops };
}

function norm(str: string): string {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[.,'()]/g, '');
}

function findStopIndex(routeStops: string[], query: string): number {
  const q = norm(query);
  return routeStops.findIndex(s => norm(s).includes(q));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from')?.trim() || '';
    const to = searchParams.get('to')?.trim() || '';
    const autocomplete = searchParams.get('autocomplete')?.trim() || '';

    const { routes, stops } = loadData();

    // 1. Autocomplete Search
    if (autocomplete) {
      const q = norm(autocomplete);
      if (!q) {
        return NextResponse.json({ stops: [] });
      }
      // Return top 8 matches matching the query
      const matches = stops.filter(s => norm(s).includes(q)).slice(0, 8);
      return NextResponse.json({ stops: matches });
    }

    // 2. Direct list of all stops if from/to are not provided
    if (!from || !to) {
      return NextResponse.json({ stops });
    }

    // 3. Search routes: Direct matches
    const direct: any[] = [];
    routes.forEach(r => {
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
          alightIndex: ti
        });
      }
    });

    // 4. One-transfer journeys (if direct matches are fewer than 8)
    const transfers: any[] = [];
    if (direct.length < 8) {
      const fromRoutes = routes.filter(r => findStopIndex(r.stops, from) !== -1);
      const toRoutes = routes.filter(r => findStopIndex(r.stops, to) !== -1);
      const seen = new Set<string>();

      fromRoutes.forEach(rA => {
        const fi = findStopIndex(rA.stops, from);
        toRoutes.forEach(rB => {
          if (rA.busNo === rB.busNo && rA.start === rB.start) return;
          const tiB = findStopIndex(rB.stops, to);

          // Find common stop
          for (let a = fi + 1; a < rA.stops.length; a++) {
            const stopA = norm(rA.stops[a]);
            for (let b = 0; b < tiB; b++) {
              if (norm(rB.stops[b]) === stopA) {
                const key = `${rA.busNo}|${rB.busNo}|${stopA}`;
                if (seen.has(key)) continue;
                seen.add(key);

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
                  alightIndexB: tiB
                });
                break;
              }
            }
          }
        });
      });
    }

    // Sort transfer matches by least number of stops in Leg 1 + Leg 2
    transfers.sort((x, y) => {
      const stopsX = (x.transferIndexA - x.boardIndexA) + (x.alightIndexB - x.transferIndexB);
      const stopsY = (y.transferIndexA - y.boardIndexA) + (y.alightIndexB - y.transferIndexB);
      return stopsX - stopsY;
    });

    const limitedTransfers = transfers.slice(0, 6);

    return NextResponse.json({
      direct,
      transfers: limitedTransfers
    });
  } catch (error: any) {
    console.error('Error in MTC Bus API:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
