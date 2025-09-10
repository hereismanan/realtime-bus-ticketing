const express = require('express');
const router = express.Router();
const { getHold, releaseHold } = require('../services/redis');
const { Trip, Seat, Booking, sequelize } = require('../models');
const { emitSeatUpdate, emitNotification } = require('../socket');
const { bookingPdfStream } = require('../services/pdf');
const { sendBookingEmail } = require('../services/email');
router.post('/checkout', async (req, res) => {
  const { tripId, seatIds, passengerName, passengerEmail, paymentRef } = req.body;
  const t = await sequelize.transaction();
  try {
    const seats = [];
    for (const seatId of seatIds) {
      const hold = await getHold(tripId, seatId);
      if (!hold || hold.passengerEmail !== passengerEmail) {
        await t.rollback();
        return res.status(400).json({ error: 'Invalid or missing hold for some seats' });
      }
      const seat = await Seat.findByPk(seatId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!seat || seat.status === 'sold') {
        await t.rollback();
        return res.status(400).json({ error: 'Seat no longer available' });
      }
      seats.push(seat);
    }
    const bookings = [];
    for (const seat of seats) {
      await Seat.update({ status: 'sold' }, { where: { id: seat.id }, transaction: t });
      const booking = await Booking.create({
        tripId,
        seatId: seat.id,
        passengerName,
        passengerEmail,
        pricePaid: seat.price,
        paymentRef
      }, { transaction: t });
      bookings.push(booking);
      await releaseHold(tripId, seat.id);
      emitSeatUpdate(tripId, { seatId: seat.id, status: 'sold' });
    }
    await t.commit();
    const trip = await Trip.findByPk(tripId);
    for (const booking of bookings) {
      const pdfDoc = bookingPdfStream(booking.toJSON(), trip.toJSON(), { code: booking.seatId });
      const buffers = [];
      pdfDoc.on('data', (d) => buffers.push(d));
      pdfDoc.on('end', async () => {
        const pdfBase64 = Buffer.concat(buffers).toString('base64');
        await sendBookingEmail(passengerEmail, 'Booking Confirmation', `<p>Booking successful</p>`, [
          { content: pdfBase64, filename: `invoice-${booking.id}.pdf`, type: 'application/pdf', disposition: 'attachment' }
        ]);
      });
    }
    emitNotification(tripId, { type: 'purchase_success', passengerEmail });
    res.json({ ok: true, bookings });
  } catch (err) {
    try { await t.rollback(); } catch {}
    res.status(500).json({ error: String(err) });
  }
});
module.exports = router;