const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('valuacion', {
    id_valuacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    puntaje: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'valuacion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_valuacion" },
        ]
      },
    ]
  });
};
