const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usuario_prestador_x_rubro', {
    id: {
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
    visibility: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'usuario_prestador_x_rubro',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
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
