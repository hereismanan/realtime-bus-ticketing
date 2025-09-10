const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Seat', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    tripId: { type: DataTypes.UUID, allowNull: false },
    row: { type: DataTypes.INTEGER, allowNull: false },
    number: { type: DataTypes.INTEGER, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM('available','sold'), allowNull: false, defaultValue: 'available' }
  }, { timestamps: true, tableName: 'seats', indexes: [{ fields: ['tripId'] }] });
};