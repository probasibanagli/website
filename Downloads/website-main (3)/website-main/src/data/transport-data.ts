export interface MetroStation {
  id: string;
  name: string;
  line: 'Blue' | 'Green' | 'Both';
}

export interface MetroTimingsResult {
  from: string;
  to: string;
  duration: string;
  stopsCount: number;
  fare: number;
  route: string[];
  frequency: string;
  firstTrain: string;
  lastTrain: string;
  line: string;
}

export interface TrainSchedule {
  number: string;
  name: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  frequency: string;
  type: 'Local' | 'Fast' | 'Ladies Special' | 'MRTS';
}

export interface BusSchedule {
  number: string;
  from: string;
  to: string;
  firstBus: string;
  lastBus: string;
  frequency: string;
  stops: string[];
}

export interface OutstationDestination {
  name: string;
  distance: string;
  duration: string;
  trainDetails: string;
  busDetails: string;
  flightDetails?: string;
  taxiDetails: string;
  trainLink: string;
  busLink: string;
  taxiLink: string;
  flightLink?: string;
  color: string;
}

const rawMetroStations: MetroStation[] = [
  { id: 'airport', name: 'Chennai Airport', line: 'Blue' },
  { id: 'meenambakkam', name: 'Meenambakkam', line: 'Blue' },
  { id: 'nanganallur', name: 'Nanganallur Road', line: 'Blue' },
  { id: 'alandur', name: 'Alandur', line: 'Both' },
  { id: 'guindy', name: 'Guindy', line: 'Blue' },
  { id: 'saidapet', name: 'Saidapet', line: 'Blue' },
  { id: 'nandanam', name: 'Nandanam', line: 'Blue' },
  { id: 'teynampet', name: 'Teynampet', line: 'Blue' },
  { id: 'agdms', name: 'AG-DMS', line: 'Blue' },
  { id: 'thousand_lights', name: 'Thousand Lights', line: 'Blue' },
  { id: 'lic', name: 'LIC', line: 'Blue' },
  { id: 'govt_estate', name: 'Government Estate', line: 'Blue' },
  { id: 'central', name: 'Chennai Central', line: 'Both' },
  { id: 'high_court', name: 'High Court', line: 'Blue' },
  { id: 'mannadi', name: 'Mannadi', line: 'Blue' },
  { id: 'washermanpet', name: 'Washermanpet', line: 'Blue' },
  { id: 'st_thomas_mount', name: 'St. Thomas Mount', line: 'Green' },
  { id: 'ekkatuthangal', name: 'Ekkattuthangal', line: 'Green' },
  { id: 'ashok_nagar', name: 'Ashok Nagar', line: 'Green' },
  { id: 'vadapalani', name: 'Vadapalani', line: 'Green' },
  { id: 'arumbakkam', name: 'Arumbakkam', line: 'Green' },
  { id: 'cmbt', name: 'CMBT', line: 'Green' },
  { id: 'koyambedu', name: 'Koyambedu', line: 'Green' },
  { id: 'thirumangalam', name: 'Thirumangalam', line: 'Green' },
  { id: 'anna_nagar_tower', name: 'Anna Nagar Tower', line: 'Green' },
  { id: 'anna_nagar_east', name: 'Anna Nagar East', line: 'Green' },
  { id: 'shenoy_nagar', name: 'Shenoy Nagar', line: 'Green' },
  { id: 'aminjikarai', name: 'Aminjikarai', line: 'Green' },
  { id: 'kilpauk', name: 'Kilpauk', line: 'Green' },
  { id: 'nehru_park', name: 'Nehru Park', line: 'Green' },
  { id: 'egmore', name: 'Egmore', line: 'Green' },
];

// 1. Chennai Metro Stations (sorted alphabetically)
export const METRO_STATIONS: MetroStation[] = [...rawMetroStations].sort((a, b) => a.name.localeCompare(b.name));

// Helper function to simulate Metro Route timing & path
export const getMetroTimings = (fromId: string, toId: string): MetroTimingsResult | null => {
  const fromStation = METRO_STATIONS.find(s => s.id === fromId);
  const toStation = METRO_STATIONS.find(s => s.id === toId);

  if (!fromStation || !toStation || fromId === toId) return null;

  // Simple hardcoded line routes order
  const blueLineOrder = ['airport', 'meenambakkam', 'nanganallur', 'alandur', 'guindy', 'saidapet', 'nandanam', 'teynampet', 'agdms', 'thousand_lights', 'lic', 'govt_estate', 'central', 'high_court', 'mannadi', 'washermanpet'];
  const greenLineOrder = ['st_thomas_mount', 'alandur', 'ekkatuthangal', 'ashok_nagar', 'vadapalani', 'arumbakkam', 'cmbt', 'koyambedu', 'thirumangalam', 'anna_nagar_tower', 'anna_nagar_east', 'shenoy_nagar', 'aminjikarai', 'kilpauk', 'nehru_park', 'egmore', 'central'];

  let route: string[] = [];
  let line = '';

  const fromInBlue = blueLineOrder.indexOf(fromId);
  const toInBlue = blueLineOrder.indexOf(toId);
  const fromInGreen = greenLineOrder.indexOf(fromId);
  const toInGreen = greenLineOrder.indexOf(toId);

  if (fromInBlue !== -1 && toInBlue !== -1) {
    // Both on Blue Line
    const start = Math.min(fromInBlue, toInBlue);
    const end = Math.max(fromInBlue, toInBlue);
    const stations = blueLineOrder.slice(start, end + 1).map(id => METRO_STATIONS.find(s => s.id === id)?.name || id);
    route = fromInBlue < toInBlue ? stations : [...stations].reverse();
    line = 'Blue Line';
  } else if (fromInGreen !== -1 && toInGreen !== -1) {
    // Both on Green Line
    const start = Math.min(fromInGreen, toInGreen);
    const end = Math.max(fromInGreen, toInGreen);
    const stations = greenLineOrder.slice(start, end + 1).map(id => METRO_STATIONS.find(s => s.id === id)?.name || id);
    route = fromInGreen < toInGreen ? stations : [...stations].reverse();
    line = 'Green Line';
  } else {
    // Require transfer. Try to transfer at Alandur or Central
    let transferStation = 'Alandur';
    let path1: string[] = [];
    let path2: string[] = [];

    // Check if Central is a better transfer point
    const useCentral = (fromId === 'egmore' || toId === 'egmore' || fromId === 'washermanpet' || toId === 'washermanpet');

    if (useCentral) {
      transferStation = 'Chennai Central';
      if (fromInBlue !== -1) {
        const centralIdxB = blueLineOrder.indexOf('central');
        const start = Math.min(fromInBlue, centralIdxB);
        const end = Math.max(fromInBlue, centralIdxB);
        const p1 = blueLineOrder.slice(start, end + 1).map(id => METRO_STATIONS.find(s => s.id === id)?.name || id);
        path1 = fromInBlue < centralIdxB ? p1 : [...p1].reverse();

        const centralIdxG = greenLineOrder.indexOf('central');
        const start2 = Math.min(centralIdxG, toInGreen);
        const end2 = Math.max(centralIdxG, toInGreen);
        const p2 = greenLineOrder.slice(start2, end2 + 1).map(id => METRO_STATIONS.find(s => s.id === id)?.name || id);
        path2 = centralIdxG < toInGreen ? p2 : [...p2].reverse();
      } else {
        const centralIdxG = greenLineOrder.indexOf('central');
        const start = Math.min(fromInGreen, centralIdxG);
        const end = Math.max(fromInGreen, centralIdxG);
        const p1 = greenLineOrder.slice(start, end + 1).map(id => METRO_STATIONS.find(s => s.id === id)?.name || id);
        path1 = fromInGreen < centralIdxG ? p1 : [...p1].reverse();

        const centralIdxB = blueLineOrder.indexOf('central');
        const start2 = Math.min(centralIdxB, toInBlue);
        const end2 = Math.max(centralIdxB, toInBlue);
        const p2 = blueLineOrder.slice(start2, end2 + 1).map(id => METRO_STATIONS.find(s => s.id === id)?.name || id);
        path2 = centralIdxB < toInBlue ? p2 : [...p2].reverse();
      }
    } else {
      // Transfer at Alandur
      if (fromInBlue !== -1) {
        const alandurIdxB = blueLineOrder.indexOf('alandur');
        const start = Math.min(fromInBlue, alandurIdxB);
        const end = Math.max(fromInBlue, alandurIdxB);
        const p1 = blueLineOrder.slice(start, end + 1).map(id => METRO_STATIONS.find(s => s.id === id)?.name || id);
        path1 = fromInBlue < alandurIdxB ? p1 : [...p1].reverse();

        const alandurIdxG = greenLineOrder.indexOf('alandur');
        const start2 = Math.min(alandurIdxG, toInGreen);
        const end2 = Math.max(alandurIdxG, toInGreen);
        const p2 = greenLineOrder.slice(start2, end2 + 1).map(id => METRO_STATIONS.find(s => s.id === id)?.name || id);
        path2 = alandurIdxG < toInGreen ? p2 : [...p2].reverse();
      } else {
        const alandurIdxG = greenLineOrder.indexOf('alandur');
        const start = Math.min(fromInGreen, alandurIdxG);
        const end = Math.max(fromInGreen, alandurIdxG);
        const p1Mapped = greenLineOrder.slice(start, end + 1).map(id => METRO_STATIONS.find(s => s.id === id)?.name || id);
        path1 = fromInGreen < alandurIdxG ? p1Mapped : [...p1Mapped].reverse();

        const alandurIdxB = blueLineOrder.indexOf('alandur');
        const start2 = Math.min(alandurIdxB, toInBlue);
        const end2 = Math.max(alandurIdxB, toInBlue);
        const p2 = blueLineOrder.slice(start2, end2 + 1).map(id => METRO_STATIONS.find(s => s.id === id)?.name || id);
        path2 = alandurIdxB < toInBlue ? p2 : [...p2].reverse();
      }
    }

    route = [...path1, ...path2.slice(1)];
    line = `Transfer via ${transferStation} (Blue ↔ Green)`;
  }

  const stopsCount = route.length - 1;
  const durationMin = stopsCount * 2 + (line.includes('Transfer') ? 5 : 0);
  const fare = Math.min(60, 10 + Math.floor(stopsCount / 2) * 5);

  return {
    from: fromStation.name,
    to: toStation.name,
    duration: `${durationMin} mins`,
    stopsCount,
    fare,
    route,
    frequency: 'Peak: 5 mins | Off-Peak: 9 mins',
    firstTrain: '05:00 AM',
    lastTrain: '11:00 PM',
    line,
  };
};

const rawLocalTrains: TrainSchedule[] = [
  { number: '40001', name: 'Chennai Beach to Chengalpattu Fast', from: 'Chennai Beach', to: 'Chengalpattu', departure: '05:30 AM', arrival: '06:45 AM', frequency: 'Daily', type: 'Fast' },
  { number: '40003', name: 'Chennai Beach to Tambaram Local', from: 'Chennai Beach', to: 'Tambaram', departure: '06:00 AM', arrival: '06:55 AM', frequency: 'Daily', type: 'Local' },
  { number: '40005', name: 'Chennai Beach to Tambaram Ladies Special', from: 'Chennai Beach', to: 'Tambaram', departure: '08:15 AM', arrival: '09:10 AM', frequency: 'Mon-Sat', type: 'Ladies Special' },
  { number: '40101', name: 'Chennai Beach to Velachery MRTS', from: 'Chennai Beach', to: 'Velachery', departure: '05:00 AM', arrival: '05:45 AM', frequency: 'Daily', type: 'MRTS' },
  { number: '43001', name: 'Chennai Central to Avadi Local', from: 'Chennai Central', to: 'Avadi', departure: '06:15 AM', arrival: '07:05 AM', frequency: 'Daily', type: 'Local' },
  { number: '43201', name: 'Chennai Central to Tiruvallur Fast', from: 'Chennai Central', to: 'Tiruvallur', departure: '07:00 AM', arrival: '08:00 AM', frequency: 'Daily', type: 'Fast' },
  { number: '43401', name: 'Chennai Central to Arakkonam Fast', from: 'Chennai Central', to: 'Arakkonam', departure: '08:00 AM', arrival: '09:20 AM', frequency: 'Daily', type: 'Fast' },
  { number: '40002', name: 'Chengalpattu to Chennai Beach Fast', from: 'Chengalpattu', to: 'Chennai Beach', departure: '07:15 AM', arrival: '08:30 AM', frequency: 'Daily', type: 'Fast' },
  { number: '40004', name: 'Tambaram to Chennai Beach Local', from: 'Tambaram', to: 'Chennai Beach', departure: '07:30 AM', arrival: '08:25 AM', frequency: 'Daily', type: 'Local' },
  { number: '40006', name: 'Tambaram to Chennai Beach Ladies Special', from: 'Tambaram', to: 'Chennai Beach', departure: '09:30 AM', arrival: '10:25 AM', frequency: 'Mon-Sat', type: 'Ladies Special' },
  { number: '40102', name: 'Velachery to Chennai Beach MRTS', from: 'Velachery', to: 'Chennai Beach', departure: '06:00 AM', arrival: '06:45 AM', frequency: 'Daily', type: 'MRTS' },
  { number: '43002', name: 'Avadi to Chennai Central Local', from: 'Avadi', to: 'Chennai Central', departure: '07:30 AM', arrival: '08:20 AM', frequency: 'Daily', type: 'Local' },
  { number: '43202', name: 'Tiruvallur to Chennai Central Fast', from: 'Tiruvallur', to: 'Chennai Central', departure: '08:30 AM', arrival: '09:30 AM', frequency: 'Daily', type: 'Fast' },
  { number: '43402', name: 'Arakkonam to Chennai Central Fast', from: 'Arakkonam', to: 'Chennai Central', departure: '09:40 AM', arrival: '11:00 AM', frequency: 'Daily', type: 'Fast' },
];

// 2. Local Trains (Suburban Rails) - sorted alphabetically by Train Name
export const LOCAL_TRAINS: TrainSchedule[] = [...rawLocalTrains].sort((a, b) => a.name.localeCompare(b.name));

// 3. MTC Buses - sorted alphabetically by Bus Number
export const MTC_BUSES: BusSchedule[] = [
  { number: '102', from: 'Broadway', to: 'Kelambakkam', firstBus: '05:15 AM', lastBus: '10:00 PM', frequency: 'Every 15 mins', stops: ['Broadway', 'Central', 'Mylapore', 'Adyar', 'Sholinganallur', 'Kelambakkam'] },
  { number: '18A', from: 'Broadway', to: 'Tambaram', firstBus: '04:30 AM', lastBus: '11:00 PM', frequency: 'Every 8 mins', stops: ['Broadway', 'Central', 'LIC', 'Saidapet', 'Guindy', 'Chromepet', 'Tambaram'] },
  { number: '19B', from: 'Saidapet', to: 'Kovalam', firstBus: '05:45 AM', lastBus: '09:30 PM', frequency: 'Every 20 mins', stops: ['Saidapet', 'Adyar', 'Thiruvanmiyur', 'Sholinganallur', 'Kovalam'] },
  { number: '21G', from: 'Broadway', to: 'Tambaram', firstBus: '04:50 AM', lastBus: '10:40 PM', frequency: 'Every 10 mins', stops: ['Broadway', 'Royapettah', 'Mylapore', 'Adyar', 'Guindy', 'Chromepet', 'Tambaram'] },
  { number: '21H', from: 'Broadway', to: 'Tambaram', firstBus: '05:00 AM', lastBus: '09:50 PM', frequency: 'Every 15 mins', stops: ['Broadway', 'Triplicane', 'Mylapore', 'Guindy', 'Tambaram'] },
  { number: '500C', from: 'Chennai Central', to: 'Chengalpattu', firstBus: '05:00 AM', lastBus: '09:30 PM', frequency: 'Every 30 mins', stops: ['Central', 'Egmore', 'Guindy', 'Tambaram', 'Vandalur', 'Chengalpattu'] },
  { number: '570', from: 'CMBT (Koyambedu)', to: 'Siruseri IT Park', firstBus: '05:00 AM', lastBus: '10:30 PM', frequency: 'Every 12 mins', stops: ['CMBT', 'Vadapalani', 'Guindy', 'Velachery', 'Sholinganallur', 'Navalur', 'Siruseri'] },
  { number: '570S', from: 'CMBT (Koyambedu)', to: 'Siruseri IT Park', firstBus: '05:30 AM', lastBus: '09:45 PM', frequency: 'Every 15 mins', stops: ['CMBT', 'Guindy', 'Sholinganallur', 'Siruseri'] },
  { number: '91', from: 'Thiruvanmiyur', to: 'Tambaram', firstBus: '05:30 AM', lastBus: '10:15 PM', frequency: 'Every 15 mins', stops: ['Thiruvanmiyur', 'Velachery', 'Kamakshi Hospital', 'Chromepet', 'Tambaram'] },
  { number: 'A1', from: 'Chennai Central', to: 'Thiruvanmiyur', firstBus: '05:00 AM', lastBus: '11:00 PM', frequency: 'Every 12 mins', stops: ['Central', 'Broadway', 'Marina Beach', 'Mylapore', 'Adyar', 'Thiruvanmiyur'] },
  { number: 'D70', from: 'Velachery', to: 'Ambattur', firstBus: '05:10 AM', lastBus: '10:20 PM', frequency: 'Every 15 mins', stops: ['Velachery', 'Guindy', 'Vadapalani', 'Koyambedu', 'Ambattur'] },
  { number: 'V51', from: 'T. Nagar', to: 'Tambaram', firstBus: '05:20 AM', lastBus: '10:00 PM', frequency: 'Every 18 mins', stops: ['T. Nagar', 'Saidapet', 'Guindy', 'Velachery', 'Tambaram'] },
].sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true, sensitivity: 'base' }));

// 4. Outstation Destinations
export const OUTSTATION_DESTINATIONS: OutstationDestination[] = [
  {
    name: 'Bangalore',
    distance: '350 km',
    duration: '6 hrs',
    trainDetails: 'Vande Bharat Express (20607), Shatabdi (12007) - daily',
    busDetails: 'KSRTC, SETC, National Sleeper - hourly schedules available',
    flightDetails: 'IndiGo, Air India - 1 hr duration, daily direct flights',
    taxiDetails: 'DropTaxi, RedTaxi Outstation, Savaari. Estimate: ₹4,800 - ₹6,200 (One-Way)',
    trainLink: 'https://www.irctc.co.in/',
    busLink: 'https://www.redbus.in/bus-tickets/chennai-to-bangalore',
    flightLink: 'https://www.google.com/travel/flights',
    taxiLink: 'https://www.droptaxi.in/',
    color: 'bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-300'
  },
  {
    name: 'Pondicherry',
    distance: '150 km',
    duration: '3 hrs',
    trainDetails: 'MS PDY Express (16115) - runs daily from Chennai Egmore',
    busDetails: 'TNSTC ECR Bypass, PRTC AC Buses - departures every 15 mins',
    taxiDetails: 'DropTaxi, Savaari, RedTaxi. Estimate: ₹2,100 - ₹2,800 (One-Way)',
    trainLink: 'https://www.irctc.co.in/',
    busLink: 'https://www.redbus.in/bus-tickets/chennai-to-pondicherry',
    taxiLink: 'https://www.droptaxi.in/',
    color: 'bg-green-50 text-green-700 border-green-100 hover:border-green-300'
  },
  {
    name: 'Tirupati',
    distance: '135 km',
    duration: '3 hrs',
    trainDetails: 'Sapthagiri Express (16057), Garudadri Express (16203) - daily',
    busDetails: 'APSRTC, APSRTC Saptagiri AC - departures every 20 mins',
    taxiDetails: 'DropTaxi, Savaari outstation cabs. Estimate: ₹1,900 - ₹2,500 (One-Way)',
    trainLink: 'https://www.irctc.co.in/',
    busLink: 'https://www.redbus.in/bus-tickets/chennai-to-tirupati',
    taxiLink: 'https://www.droptaxi.in/',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-100 hover:border-yellow-300'
  },
  {
    name: 'Coimbatore',
    distance: '500 km',
    duration: '7.5 hrs',
    trainDetails: 'Kovai Express (12675), Vande Bharat (20643) - daily',
    busDetails: 'SETC Sleeper, private operators (SRS, KPN) - overnight coaches',
    flightDetails: 'IndiGo direct flights - 1.2 hrs duration',
    taxiDetails: 'DropTaxi, RedTaxi Outstation. Estimate: ₹6,500 - ₹8,000 (One-Way)',
    trainLink: 'https://www.irctc.co.in/',
    busLink: 'https://www.redbus.in/bus-tickets/chennai-to-coimbatore',
    flightLink: 'https://www.google.com/travel/flights',
    taxiLink: 'https://www.redtaxi.co.in/',
    color: 'bg-purple-50 text-purple-700 border-purple-100 hover:border-purple-300'
  },
  {
    name: 'Madurai',
    distance: '460 km',
    duration: '7 hrs',
    trainDetails: 'Tejas Express (22671), Pandian Express (12637) - daily',
    busDetails: 'SETC, Parveen Travels, SRM Sleeper - high frequency overnight',
    flightDetails: 'IndiGo direct flights from Chennai Airport - 1.1 hrs',
    taxiDetails: 'DropTaxi, RedTaxi Outstation. Estimate: ₹6,000 - ₹7,500 (One-Way)',
    trainLink: 'https://www.irctc.co.in/',
    busLink: 'https://www.redbus.in/bus-tickets/chennai-to-madurai',
    flightLink: 'https://www.google.com/travel/flights',
    taxiLink: 'https://www.droptaxi.in/',
    color: 'bg-red-50 text-red-700 border-red-100 hover:border-red-300'
  },
  {
    name: 'Vellore',
    distance: '140 km',
    duration: '2.5 hrs',
    trainDetails: 'Lalbagh Express (12607), Brindavan Express (12639) - daily',
    busDetails: 'TNSTC Bypass AC, private transport - every 10 mins',
    taxiDetails: 'DropTaxi, Savaari, RedTaxi. Estimate: ₹2,000 - ₹2,600 (One-Way)',
    trainLink: 'https://www.irctc.co.in/',
    busLink: 'https://www.redbus.in/bus-tickets/chennai-to-vellore',
    taxiLink: 'https://www.droptaxi.in/',
    color: 'bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-300'
  },
  {
    name: 'Ooty',
    distance: '560 km',
    duration: '11 hrs',
    trainDetails: 'Nilgiri Express (12671) overnight to Mettupalayan + Toy Train',
    busDetails: 'SETC Sleeper, Private Sleeper to Ooty directly - daily overnight',
    taxiDetails: 'DropTaxi, Savaari. Estimate: ₹8,000 - ₹10,000 (One-Way hill ride)',
    trainLink: 'https://www.irctc.co.in/',
    busLink: 'https://www.redbus.in/bus-tickets/chennai-to-ooty',
    taxiLink: 'https://www.droptaxi.in/',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-300'
  },
  {
    name: 'Kodaikanal',
    distance: '520 km',
    duration: '10 hrs',
    trainDetails: 'Pandian Express (12637) to Kodai Road Station + 2 hrs taxi',
    busDetails: 'SETC AC Sleeper, private bus networks - daily overnight',
    taxiDetails: 'DropTaxi, Savaari. Estimate: ₹7,500 - ₹9,500 (One-Way hill ride)',
    trainLink: 'https://www.irctc.co.in/',
    busLink: 'https://www.redbus.in/bus-tickets/chennai-to-kodaikanal',
    taxiLink: 'https://www.droptaxi.in/',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:border-indigo-300'
  },
  {
    name: 'Hyderabad',
    distance: '630 km',
    duration: '11 hrs',
    trainDetails: 'Charminar Express (12759), Chennai SF Express (12603) - daily',
    busDetails: 'Orange Travels, Kaveri Travels - multiple overnight AC coaches',
    flightDetails: 'Direct flights by IndiGo and Alliance Air - 1.2 hrs',
    taxiDetails: 'Savaari outstation cabs. Estimate: ₹9,000 - ₹12,000 (One-Way)',
    trainLink: 'https://www.irctc.co.in/',
    busLink: 'https://www.redbus.in/bus-tickets/chennai-to-hyderabad',
    flightLink: 'https://www.google.com/travel/flights',
    taxiLink: 'https://www.savaari.com/',
    color: 'bg-pink-50 text-pink-700 border-pink-100 hover:border-pink-300'
  },
  {
    name: 'Rameswaram',
    distance: '560 km',
    duration: '10 hrs',
    trainDetails: 'Boat Mail Express (16701) daily from Chennai Egmore',
    busDetails: 'SETC Super Deluxe, private sleepers - daily overnight service',
    taxiDetails: 'DropTaxi, Savaari outstation. Estimate: ₹8,000 - ₹9,500 (One-Way)',
    trainLink: 'https://www.irctc.co.in/',
    busLink: 'https://www.redbus.in/bus-tickets/chennai-to-rameswaram',
    taxiLink: 'https://www.droptaxi.in/',
    color: 'bg-rose-50 text-rose-700 border-rose-100 hover:border-rose-300'
  },
  {
    name: 'Kanyakumari',
    distance: '700 km',
    duration: '12 hrs',
    trainDetails: 'Kanyakumari Express (12633), Ananthapuri Express (16823) - daily',
    busDetails: 'SETC AC Sleeper, SRM Travels - daily overnight coaches',
    taxiDetails: 'DropTaxi, Savaari outstation. Estimate: ₹9,500 - ₹12,000 (One-Way)',
    trainLink: 'https://www.irctc.co.in/',
    busLink: 'https://www.redbus.in/bus-tickets/chennai-to-kanyakumari',
    taxiLink: 'https://www.droptaxi.in/',
    color: 'bg-cyan-50 text-cyan-700 border-cyan-100 hover:border-cyan-300'
  },
  {
    name: 'Mahabalipuram',
    distance: '55 km',
    duration: '1.2 hrs',
    trainDetails: 'No direct train. Take suburban rail to Chengalpattu + 45 min bus',
    busDetails: 'MTC Bus 102S, 588, 599, TNSTC ECR buses - every 10 mins',
    taxiDetails: 'Ola, Uber, Rapido, DropTaxi. Estimate: ₹900 - ₹1,300 (One-Way)',
    trainLink: 'https://www.irctc.co.in/',
    busLink: 'https://www.redbus.in/bus-tickets/chennai-to-mahabalipuram',
    taxiLink: 'https://book.olacabs.com/',
    color: 'bg-teal-50 text-teal-700 border-teal-100 hover:border-teal-300'
  }
];

// One Way Taxi Providers details
export const ONE_WAY_TAXI_PROVIDERS = [
  {
    name: 'DropTaxi',
    desc: 'Charges strictly for one-way drops in Tamil Nadu, Pondicherry, and Bangalore. No return fare.',
    baseRate: '₹13 - ₹16 per km',
    tollPolicy: 'Tolls & State Permits extra',
    url: 'https://www.droptaxi.in/'
  },
  {
    name: 'RedTaxi Outstation',
    desc: 'Premium outstation service across Tamil Nadu. Highly clean cars, professional drivers.',
    baseRate: '₹14 - ₹17 per km',
    tollPolicy: 'Tolls included in selected packages',
    url: 'https://www.redtaxi.co.in/'
  },
  {
    name: 'Savaari Cabs',
    desc: 'Reliable nationwide outstation cab provider. Round-trip and one-way options available.',
    baseRate: '₹15 - ₹19 per km',
    tollPolicy: 'All-inclusive pricing plans available',
    url: 'https://www.savaari.com/'
  }
];
