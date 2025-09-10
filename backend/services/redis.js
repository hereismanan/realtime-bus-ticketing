const Redis = require('ioredis');
const dotenv = require('dotenv');
dotenv.config();
const redis = new Redis(process.env.REDIS_URL);
const HOLD_PREFIX = 'hold';
const makeHoldKey = (tripId, seatId) => `${HOLD_PREFIX}:${tripId}:${seatId}`;
async function setHold(tripId, seatId, payload, ttl) {
  const key = makeHoldKey(tripId, seatId);
  const exists = await redis.exists(key);
  if (exists) return false;
  await redis.set(key, JSON.stringify(payload), 'EX', ttl);
  return true;
}
async function getHold(tripId, seatId) {
  const key = makeHoldKey(tripId, seatId);
  const raw = await redis.get(key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
async function releaseHold(tripId, seatId) {
  const key = makeHoldKey(tripId, seatId);
  await redis.del(key);
}
async function extendHold(tripId, seatId, ttl) {
  const key = makeHoldKey(tripId, seatId);
  return await redis.expire(key, ttl);
}
async function listHoldsForTrip(tripId) {
  const pattern = `${HOLD_PREFIX}:${tripId}:*`;
  const keys = await redis.keys(pattern);
  const holds = [];
  for (const k of keys) {
    const raw = await redis.get(k);
    try {
      holds.push({ key: k, value: JSON.parse(raw) });
    } catch {}
  }
  return holds;
}
module.exports = { setHold, getHold, releaseHold, extendHold, listHoldsForTrip, redis };