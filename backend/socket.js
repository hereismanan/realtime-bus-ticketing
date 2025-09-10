let ioInstance = null;
function initSocket(server) {
  const { Server } = require('socket.io');
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    socket.on('joinTrip', (tripId) => {
      socket.join(`trip:${tripId}`);
    });
    socket.on('leaveTrip', (tripId) => {
      socket.leave(`trip:${tripId}`);
    });
  });
  ioInstance = io;
  return io;
}
function emitSeatUpdate(tripId, payload) {
  if (!ioInstance) return;
  ioInstance.to(`trip:${tripId}`).emit('seatUpdate', payload);
}
function emitNotification(tripId, payload) {
  if (!ioInstance) return;
  ioInstance.to(`trip:${tripId}`).emit('notification', payload);
}
module.exports = { initSocket, emitSeatUpdate, emitNotification };