const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Trip', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    organizerName: { type: DataTypes.STRING, allowNull: false },
    routeFrom: { type: DataTypes.STRING, allowNull: false },
    routeTo: { type: DataTypes.STRING, allowNull: false },
    departAt: { type: DataTypes.DATE, allowNull: false },
    arriveAt: { type: DataTypes.DATE, allowNull: false },
    busType: { type: DataTypes.STRING, allowNull: false },
    saleStart: { type: DataTypes.DATE, allowNull: false },
    saleEnd: { type: DataTypes.DATE, allowNull: false }
  }, { timestamps: true, tableName: 'trips' });
};