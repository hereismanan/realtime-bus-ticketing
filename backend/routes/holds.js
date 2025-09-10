const express = require('express');
const router = express.Router();
const { setHold, getHold, releaseHold } = require('../services/redis');
const { Seat } = require('../models');
const { emitSeatUpdate, emitNotification } = require('../socket');
const ttl = parseInt(process.env.HOLD_TTL_SECONDS || '120', 10);
router.post('/hold', async (req, res) => {
  const { tripId, seatIds, passengerName, passengerEmail } = req.body;
  const results = [];
  for (const seatId of seatIds) {
    const seat = await Seat.findByPk(seatId);
    if (!seat) { results.push({ seatId, ok: false, reason: 'no seat' }); continue; }
    if (seat.status === 'sold') { results.push({ seatId, ok: false, reason: 'sold' }); continue; }
    const payload = { passengerName, passengerEmail, ts: Date.now() };
    const ok = await setHold(tripId, seatId, payload, ttl);
    if (ok) {
      emitSeatUpdate(tripId, { seatId, status: 'held', holdBy: passengerEmail, ttl });
      results.push({ seatId, ok: true });
    } else {
      results.push({ seatId, ok: false, reason: 'already held' });
    }
  }
  res.json({ results });
});
router.post('/release', async (req, res) => {
  const { tripId, seatIds } = req.body;
  for (const seatId of seatIds) {
    await releaseHold(tripId, seatId);
    emitSeatUpdate(tripId, { seatId, status: 'available' });
    emitNotification(tripId, { type: 'hold_released', seatId });
  }
  res.json({ ok: true });
});
module.exports = router;