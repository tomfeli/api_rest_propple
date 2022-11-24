const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pago', {
    id_pago: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_transaccion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'transaccion',
        key: 'id_transaccion'
      }
    },
    id_mercado_pago: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(54),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'pago',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pago" },
        ]
      },
      {
        name: "id_transaccion",
        using: "BTREE",
        fields: [
          { name: "id_transaccion" },
        ]
      },
    ]
  });
};
