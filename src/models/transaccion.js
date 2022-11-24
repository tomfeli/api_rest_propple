const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaccion', {
    id_transaccion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_usuario_prestador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario_prestador',
        key: 'id_usuario_prestador'
      }
    },
    id_usuario_cliente: {
      type: DataTypes.STRING(100),
      allowNull: false,
      references: {
        model: 'usuario_cliente',
        key: 'id_usuario_cliente'
      }
    },
    id_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'publicacion',
        key: 'id_publicacion'
      }
    },
    id_estado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estado',
        key: 'id_estado'
      }
    },
    id_valuacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'valuacion',
        key: 'id_valuacion'
      }
    },
    presupuesto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(54),
      allowNull: false
    },
    location_latitud: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    location_longitud: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    id_payment: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "id_payment"
    }
  }, {
    sequelize,
    tableName: 'transaccion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_transaccion" },
        ]
      },
      {
        name: "id_payment",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_payment" },
        ]
      },
      {
        name: "id_usuario_prestador",
        using: "BTREE",
        fields: [
          { name: "id_usuario_prestador" },
        ]
      },
      {
        name: "id_usuario_cliente",
        using: "BTREE",
        fields: [
          { name: "id_usuario_cliente" },
        ]
      },
      {
        name: "id_publicacion",
        using: "BTREE",
        fields: [
          { name: "id_publicacion" },
        ]
      },
      {
        name: "id_estado",
        using: "BTREE",
        fields: [
          { name: "id_estado" },
        ]
      },
      {
        name: "id_valuacion",
        using: "BTREE",
        fields: [
          { name: "id_valuacion" },
        ]
      },
    ]
  });
};
