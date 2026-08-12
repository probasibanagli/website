const run = async () => {
  const fromRes = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=Chennai&limit=1', {
    headers: {
      'User-Agent': 'TestApp/1.0'
    }
  });
  const fromData = await fromRes.json();
  const toRes = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=Vellore&limit=1', {
    headers: {
      'User-Agent': 'TestApp/1.0'
    }
  });
  const toData = await toRes.json();
  console.log(fromData[0].lat, fromData[0].lon);
  console.log(toData[0].lat, toData[0].lon);
  
  const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${fromData[0].lon},${fromData[0].lat};${toData[0].lon},${toData[0].lat}?overview=false`);
  const routeData = await routeRes.json();
  console.log('Distance:', routeData.routes[0].distance, 'Duration:', routeData.routes[0].duration);
};

run().catch(console.error);
