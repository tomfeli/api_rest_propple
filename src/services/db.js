const dbConfig =require('../config').connection;
const { Sequelize,Op, DataTypes } = require('@sequelize/core');
const comentarioModel = require('../models/comentario');
const estadoModel = require('../models/estado');
const pagoModel = require('../models/pago');
const postulacionModel = require('../models/postulacion');
const publicacionModel = require('../models/publicacion');
const rubroModel = require('../models/rubro');
const transaccionModel = require('../models/transaccion');
const usuario_clienteModel = require('../models/usuario_cliente');
const usuario_prestadorModel = require('../models/usuario_prestador');
const usuario_prestador_x_rubroModel = require('../models/usuario_prestador_x_rubro');
const valuacionModel = require('../models/valuacion');
const usuario_adminModel = require('../models/usuario_admin');
const denunciaModel = require('../models/denuncia');
const liquidacionModel = require('../models/liquidacion')

const sequelize = new Sequelize(`${dbConfig.database}`,`${dbConfig.user}`,`${dbConfig.password}`,{
    host: `${dbConfig.host}`, 
    dialect: 'mysql',
    logging: false
});

const comentario = comentarioModel(sequelize,Sequelize);
const estado = estadoModel(sequelize,Sequelize);
const pago = pagoModel(sequelize,Sequelize);
const postulacion = postulacionModel(sequelize,Sequelize);
const publicacion = publicacionModel(sequelize,Sequelize);
const rubro = rubroModel(sequelize,Sequelize);
const transaccion = transaccionModel(sequelize,Sequelize);
const usuario_cliente = usuario_clienteModel(sequelize,Sequelize);
const usuario_prestador = usuario_prestadorModel(sequelize,Sequelize);
const usuario_prestador_x_rubro = usuario_prestador_x_rubroModel(sequelize,Sequelize);
const valuacion = valuacionModel(sequelize,Sequelize);
const usuario_admin = usuario_adminModel(sequelize, Sequelize);
const denuncia = denunciaModel(sequelize, Sequelize)
const liquidacion = liquidacionModel(sequelize,Sequelize)


sequelize.sync({force: false}).then(()=>{console.log("Tablas sincronizadas");})

module.exports = {
    sequelize,
    comentario,
    estado ,
    pago ,
    postulacion ,
    publicacion ,
    rubro ,
    transaccion ,
    usuario_cliente ,
    usuario_prestador,
    usuario_prestador_x_rubro ,
    valuacion,
    usuario_admin,
    Op,
    denuncia,
    liquidacion
}


