const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});
const Trip = require('./trip')(sequelize);
const Seat = require('./seat')(sequelize);
const Booking = require('./booking')(sequelize);
Trip.hasMany(Seat, { foreignKey: 'tripId' });
Seat.belongsTo(Trip, { foreignKey: 'tripId' });
Trip.hasMany(Booking, { foreignKey: 'tripId' });
Booking.belongsTo(Trip, { foreignKey: 'tripId' });
Seat.hasOne(Booking, { foreignKey: 'seatId' });
Booking.belongsTo(Seat, { foreignKey: 'seatId' });
module.exports = { sequelize, Trip, Seat, Booking };