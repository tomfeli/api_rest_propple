const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('comentario', {
    id_comentario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'publicacion',
        key: 'id_publicacion'
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
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    date_of_creation: {
      type: DataTypes.DATE,
      allowNull: true
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'comentario',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_comentario" },
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
    ]
  });
};
