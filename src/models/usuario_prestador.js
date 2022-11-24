const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuario_prestador', {
    id_usuario_prestador: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_usuario_cliente: {
      type: DataTypes.STRING(100),
      allowNull: false,
      references: {
        model: 'usuario_cliente',
        key: 'id_usuario_cliente'
      }
    },
    puntuacion: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'usuario_prestador',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
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
    ]
  });
};
