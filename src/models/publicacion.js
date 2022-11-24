const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('publicacion', {
    id_publicacion: {
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
    id_rubro: {
      type: DataTypes.TINYINT,
      allowNull: false,
      references: {
        model: 'rubro',
        key: 'id_rubro'
      }
    },
    title: {
      type: DataTypes.STRING(54),
      allowNull: false
    },
    publicacion_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    precio_x_hora: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(54),
      allowNull: true
    },
    location_latitud: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    location_longitud: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    cant_transacciones: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    puntuacion: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 5
    }
  }, {
    sequelize,
    tableName: 'publicacion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_publicacion" },
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
        name: "id_rubro",
        using: "BTREE",
        fields: [
          { name: "id_rubro" },
        ]
      },
    ]
  });
};
