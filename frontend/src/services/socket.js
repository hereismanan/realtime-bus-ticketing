import { io } from 'socket.io-client';
let socket;
export function connectSocket() {
  socket = io();
  return socket;
}
export function joinTrip(tripId) {
  if (!socket) connectSocket();
  socket.emit('joinTrip', tripId);
}
export function leaveTrip(tripId) {
  if (socket) socket.emit('leaveTrip', tripId);
}
export function onSeatUpdate(cb) {
  if (!socket) connectSocket();
  socket.on('seatUpdate', cb);
}
export function onNotification(cb) {
  if (!socket) connectSocket();
  socket.on('notification', cb);
}