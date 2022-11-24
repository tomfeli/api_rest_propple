const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuario_cliente', {
    id_usuario_cliente: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    alias: {
      type: DataTypes.STRING(54),
      allowNull: false
    },
    mail: {
      type: DataTypes.STRING(54),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(54),
      allowNull: false
    },
    url_image: {
      type: DataTypes.STRING(54),
      allowNull: true
    },
    user_name: {
      type: DataTypes.STRING(54),
      allowNull: false
    },
    user_last_name: {
      type: DataTypes.STRING(54),
      allowNull: false
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
    gender: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    url_download_image: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'usuario_cliente',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_usuario_cliente" },
        ]
      },
      {
        name: "id_usuario_cliente",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_usuario_cliente" },
        ]
      },
      {
        name: "alias",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "alias" },
          { name: "mail" },
        ]
      },
    ]
  });
};
