import React, { useState, useEffect } from 'react';
import { holdSeats, releaseSeats, checkout, getTrip } from '../services/api';
import { joinTrip, leaveTrip, onSeatUpdate, onNotification } from '../services/socket';
export default function SeatMap({ tripId }) {
  const [trip, setTrip] = useState(null);
  const [selected, setSelected] = useState([]);
  const [holds, setHolds] = useState({});
  useEffect(() => {
    (async () => {
      const t = await getTrip(tripId);
      setTrip(t);
    })();
    joinTrip(tripId);
    onSeatUpdate((msg) => {
      setTrip(prev => {
        if (!prev) return prev;
        const seats = prev.Seats.map(s => s.id === msg.seatId ? { ...s, status: msg.status === 'sold' ? 'sold' : s.status } : s);
        return { ...prev, Seats: seats };
      });
    });
    onNotification((n) => {});
    return () => leaveTrip(tripId);
  }, [tripId]);
  if (!trip) return <div>Loading</div>;
  const seats = trip.Seats.slice().sort((a,b)=> (a.row - b.row) || (a.number - b.number));
  const rows = {};
  seats.forEach(s => { rows[s.row] = rows[s.row] || []; rows[s.row].push(s); });
  function toggleSelect(seat) {
    if (seat.status === 'sold') return;
    if (selected.includes(seat.id)) setSelected(selected.filter(x=>x!==seat.id));
    else setSelected([...selected, seat.id]);
  }
  async function handleHold() {
    const payload = { tripId, seatIds: selected, passengerName: 'Guest', passengerEmail: 'guest@example.com' };
    const res = await holdSeats(payload);
    const okSeats = res.results.filter(r=>r.ok).map(r=>r.seatId);
    setHolds(prev => {
      const next = {...prev};
      okSeats.forEach(id => next[id] = Date.now());
      return next;
    });
  }
  async function handleRelease() {
    await releaseSeats({ tripId, seatIds: selected });
    setSelected([]);
  }
  async function handleCheckout() {
    const payload = { tripId, seatIds: selected, passengerName: 'Guest', passengerEmail: 'guest@example.com', paymentRef: 'demo-pay-123' };
    const res = await checkout(payload);
    if (res.ok) {
      setSelected([]);
      alert('Purchase successful');
    } else alert('Purchase failed');
  }
  return (
    <div>
      <h2>{trip.routeFrom} → {trip.routeTo}</h2>
      <div style={{ display: 'grid', gap: 8 }}>
        {Object.keys(rows).map(r => (
          <div key={r} style={{ display: 'flex', gap: 8 }}>
            {rows[r].map(seat => {
              const isSelected = selected.includes(seat.id);
              const style = { width: 70, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: seat.status === 'sold' ? 'not-allowed' : 'pointer', background: seat.status === 'sold' ? '#ccc' : isSelected ? '#4caf50' : '#eee' };
              return <div style={style} key={seat.id} onClick={()=>toggleSelect(seat)}>{seat.code}<div style={{fontSize:10}}>{seat.price}</div></div>;
            })}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={handleHold} disabled={selected.length===0}>Hold Selected</button>
        <button onClick={handleRelease} disabled={selected.length===0}>Release Selected</button>
        <button onClick={handleCheckout} disabled={selected.length===0}>Checkout</button>
      </div>
    </div>
  );
}