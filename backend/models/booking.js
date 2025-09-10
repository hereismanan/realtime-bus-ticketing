const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Booking', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tripId: { type: DataTypes.UUID, allowNull: false },
    seatId: { type: DataTypes.UUID, allowNull: false },
    passengerName: { type: DataTypes.STRING, allowNull: false },
    passengerEmail: { type: DataTypes.STRING, allowNull: false },
    pricePaid: { type: DataTypes.FLOAT, allowNull: false },
    paymentRef: { type: DataTypes.STRING }
  }, { timestamps: true, tableName: 'bookings' });
};