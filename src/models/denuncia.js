const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('denuncia', {
    id_denuncia: {
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
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_de_denuncia: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'denuncia',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_denuncia" },
        ]
      },
      {
        name: "id_denuncia",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_denuncia" },
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
    ]
  });
};
