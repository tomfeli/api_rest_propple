const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('postulacion', {
    id_postulacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_usuario_cliente: {
      type: DataTypes.STRING(100),
      allowNull: true,
      references: {
        model: 'usuario_cliente',
        key: 'id_usuario_cliente'
      }
    },
    id_rubro: {
      type: DataTypes.TINYINT,
      allowNull: true,
      references: {
        model: 'rubro',
        key: 'id_rubro'
      }
    },
    fecha_postulacion: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    aprovado: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    url_cv: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'postulacion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_postulacion" },
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
        name: "id_rubro",
        using: "BTREE",
        fields: [
          { name: "id_rubro" },
        ]
      },
    ]
  });
};
