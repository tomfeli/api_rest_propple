var DataTypes = require("sequelize").DataTypes;
var _comentario = require("./comentario");
var _denuncia = require("./denuncia");
var _estado = require("./estado");
var _liquidacion = require("./liquidacion");
var _pago = require("./pago");
var _postulacion = require("./postulacion");
var _publicacion = require("./publicacion");
var _rubro = require("./rubro");
var _transaccion = require("./transaccion");
var _usuario_admin = require("./usuario_admin");
var _usuario_cliente = require("./usuario_cliente");
var _usuario_prestador = require("./usuario_prestador");
var _usuario_prestador_x_rubro = require("./usuario_prestador_x_rubro");
var _valuacion = require("./valuacion");

function initModels(sequelize) {
  var comentario = _comentario(sequelize, DataTypes);
  var denuncia = _denuncia(sequelize, DataTypes);
  var estado = _estado(sequelize, DataTypes);
  var liquidacion = _liquidacion(sequelize, DataTypes);
  var pago = _pago(sequelize, DataTypes);
  var postulacion = _postulacion(sequelize, DataTypes);
  var publicacion = _publicacion(sequelize, DataTypes);
  var rubro = _rubro(sequelize, DataTypes);
  var transaccion = _transaccion(sequelize, DataTypes);
  var usuario_admin = _usuario_admin(sequelize, DataTypes);
  var usuario_cliente = _usuario_cliente(sequelize, DataTypes);
  var usuario_prestador = _usuario_prestador(sequelize, DataTypes);
  var usuario_prestador_x_rubro = _usuario_prestador_x_rubro(sequelize, DataTypes);
  var valuacion = _valuacion(sequelize, DataTypes);

  transaccion.belongsTo(estado, { as: "id_estado_estado", foreignKey: "id_estado"});
  estado.hasMany(transaccion, { as: "transaccions", foreignKey: "id_estado"});
  comentario.belongsTo(publicacion, { as: "id_publicacion_publicacion", foreignKey: "id_publicacion"});
  publicacion.hasMany(comentario, { as: "comentarios", foreignKey: "id_publicacion"});
  transaccion.belongsTo(publicacion, { as: "id_publicacion_publicacion", foreignKey: "id_publicacion"});
  publicacion.hasMany(transaccion, { as: "transaccions", foreignKey: "id_publicacion"});
  postulacion.belongsTo(rubro, { as: "id_rubro_rubro", foreignKey: "id_rubro"});
  rubro.hasMany(postulacion, { as: "postulacions", foreignKey: "id_rubro"});
  publicacion.belongsTo(rubro, { as: "id_rubro_rubro", foreignKey: "id_rubro"});
  rubro.hasMany(publicacion, { as: "publicacions", foreignKey: "id_rubro"});
  usuario_prestador_x_rubro.belongsTo(rubro, { as: "id_rubro_rubro", foreignKey: "id_rubro"});
  rubro.hasMany(usuario_prestador_x_rubro, { as: "usuario_prestador_x_rubros", foreignKey: "id_rubro"});
  liquidacion.belongsTo(transaccion, { as: "id_transaccion_transaccion", foreignKey: "id_transaccion"});
  transaccion.hasMany(liquidacion, { as: "liquidacions", foreignKey: "id_transaccion"});
  pago.belongsTo(transaccion, { as: "id_transaccion_transaccion", foreignKey: "id_transaccion"});
  transaccion.hasMany(pago, { as: "pagos", foreignKey: "id_transaccion"});
  comentario.belongsTo(usuario_cliente, { as: "id_usuario_cliente_usuario_cliente", foreignKey: "id_usuario_cliente"});
  usuario_cliente.hasMany(comentario, { as: "comentarios", foreignKey: "id_usuario_cliente"});
  denuncia.belongsTo(usuario_cliente, { as: "id_usuario_cliente_usuario_cliente", foreignKey: "id_usuario_cliente"});
  usuario_cliente.hasMany(denuncia, { as: "denuncia", foreignKey: "id_usuario_cliente"});
  liquidacion.belongsTo(usuario_cliente, { as: "id_usuario_usuario_cliente", foreignKey: "id_usuario"});
  usuario_cliente.hasMany(liquidacion, { as: "liquidacions", foreignKey: "id_usuario"});
  postulacion.belongsTo(usuario_cliente, { as: "id_usuario_cliente_usuario_cliente", foreignKey: "id_usuario_cliente"});
  usuario_cliente.hasMany(postulacion, { as: "postulacions", foreignKey: "id_usuario_cliente"});
  transaccion.belongsTo(usuario_cliente, { as: "id_usuario_cliente_usuario_cliente", foreignKey: "id_usuario_cliente"});
  usuario_cliente.hasMany(transaccion, { as: "transaccions", foreignKey: "id_usuario_cliente"});
  usuario_prestador.belongsTo(usuario_cliente, { as: "id_usuario_cliente_usuario_cliente", foreignKey: "id_usuario_cliente"});
  usuario_cliente.hasMany(usuario_prestador, { as: "usuario_prestadors", foreignKey: "id_usuario_cliente"});
  denuncia.belongsTo(usuario_prestador, { as: "id_usuario_prestador_usuario_prestador", foreignKey: "id_usuario_prestador"});
  usuario_prestador.hasMany(denuncia, { as: "denuncia", foreignKey: "id_usuario_prestador"});
  publicacion.belongsTo(usuario_prestador, { as: "id_usuario_prestador_usuario_prestador", foreignKey: "id_usuario_prestador"});
  usuario_prestador.hasMany(publicacion, { as: "publicacions", foreignKey: "id_usuario_prestador"});
  transaccion.belongsTo(usuario_prestador, { as: "id_usuario_prestador_usuario_prestador", foreignKey: "id_usuario_prestador"});
  usuario_prestador.hasMany(transaccion, { as: "transaccions", foreignKey: "id_usuario_prestador"});
  usuario_prestador_x_rubro.belongsTo(usuario_prestador, { as: "id_usuario_prestador_usuario_prestador", foreignKey: "id_usuario_prestador"});
  usuario_prestador.hasMany(usuario_prestador_x_rubro, { as: "usuario_prestador_x_rubros", foreignKey: "id_usuario_prestador"});
  transaccion.belongsTo(valuacion, { as: "id_valuacion_valuacion", foreignKey: "id_valuacion"});
  valuacion.hasMany(transaccion, { as: "transaccions", foreignKey: "id_valuacion"});

  return {
    comentario,
    denuncia,
    estado,
    liquidacion,
    pago,
    postulacion,
    publicacion,
    rubro,
    transaccion,
    usuario_admin,
    usuario_cliente,
    usuario_prestador,
    usuario_prestador_x_rubro,
    valuacion,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
