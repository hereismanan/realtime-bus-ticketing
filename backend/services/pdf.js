const PDFDocument = require('pdfkit');
function bookingPdfStream(booking, trip, seat) {
  const doc = new PDFDocument({ size: 'A4' });
  doc.fontSize(20).text('Ticket Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Booking ID: ${booking.id}`);
  doc.text(`Passenger: ${booking.passengerName}`);
  doc.text(`Email: ${booking.passengerEmail}`);
  doc.text(`Trip: ${trip.routeFrom} -> ${trip.routeTo}`);
  doc.text(`Departure: ${trip.departAt}`);
  doc.text(`Seat: ${seat.code}`);
  doc.text(`Price: ${booking.pricePaid}`);
  doc.end();
  return doc;
}
module.exports = { bookingPdfStream };