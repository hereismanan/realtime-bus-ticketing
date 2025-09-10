const express = require('express');
const router = express.Router();
const { Trip, Seat } = require('../models');
router.post('/', async (req, res) => {
  const { organizerName, routeFrom, routeTo, departAt, arriveAt, busType, saleStart, saleEnd, layout, price } = req.body;
  const trip = await Trip.create({ organizerName, routeFrom, routeTo, departAt, arriveAt, busType, saleStart, saleEnd });
  const seats = [];
  for (let r = 0; r < layout.rows; r++) {
    for (let s = 0; s < layout.seatsPerRow; s++) {
      const code = `R${r + 1}S${s + 1}`;
      seats.push({ tripId: trip.id, row: r + 1, number: s + 1, code, price });
    }
  }
  await Seat.bulkCreate(seats);
  const full = await Trip.findByPk(trip.id, { include: Seat });
  res.json(full);
});
router.get('/:tripId', async (req, res) => {
  const trip = await Trip.findByPk(req.params.tripId, { include: Seat });
  if (!trip) return res.status(404).json({ error: 'Not found' });
  res.json(trip);
});
module.exports = router;