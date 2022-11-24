const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('liquidacion', {
    id_liquidacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_usuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
      references: {
        model: 'usuario_cliente',
        key: 'id_usuario_cliente'
      }
    },
    id_transaccion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'transaccion',
        key: 'id_transaccion'
      }
    },
    fecha_liquidacion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_devolucion: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'liquidacion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_liquidacion" },
        ]
      },
      {
        name: "id_liquidacion",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_liquidacion" },
        ]
      },
      {
        name: "id_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
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
