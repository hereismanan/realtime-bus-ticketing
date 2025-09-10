import axios from 'axios';
const api = axios.create({ baseURL: '/' });
export async function createTrip(payload) { return api.post('/api/trips', payload).then(r => r.data); }
export async function getTrip(tripId) { return api.get(`/api/trips/${tripId}`).then(r => r.data); }
export async function holdSeats(payload) { return api.post('/api/holds/hold', payload).then(r => r.data); }
export async function releaseSeats(payload) { return api.post('/api/holds/release', payload).then(r => r.data); }
export async function checkout(payload) { return api.post('/api/purchase/checkout', payload).then(r => r.data); }
export default api;