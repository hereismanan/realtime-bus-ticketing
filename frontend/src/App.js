import React, { useState } from 'react';
import SeatMap from './components/SeatMap';
import { createTrip } from './services/api';
export default function App() {
  const [tripId, setTripId] = useState(null);
  async function makeDemoTrip() {
    const layout = { rows: 5, seatsPerRow: 4 };
    const payload = { organizerName: 'DemoOrg', routeFrom: 'CityA', routeTo: 'CityB', departAt: new Date().toISOString(), arriveAt: new Date(Date.now()+3600*1000).toISOString(), busType: 'AC', saleStart: new Date().toISOString(), saleEnd: new Date(Date.now()+86400*1000).toISOString(), layout, price: 299 };
    const trip = await createTrip(payload);
    setTripId(trip.id);
  }
  return (
    <div style={{ padding: 20 }}>
      <h1>Real-Time Bus Ticketing</h1>
      {!tripId ? <div><button onClick={makeDemoTrip}>Create Demo Trip</button></div> : <SeatMap tripId={tripId} />}
    </div>
  );
}