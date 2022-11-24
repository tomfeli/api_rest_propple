const router = require("express").Router();
const { sequelize, denuncia, usuario_cliente } = require('../services/db');
const { getTokenFromParams, getMailFromToken, getTokenFromBody } = require("../midlewares/infoMidleware.js");

//ENVIAR DENUNCIA

router.post('/denuncia', getTokenFromBody, getMailFromToken, async function (req, res) {
    try {
        const { id_usuario_cliente } = await usuario_cliente.findOne({ where: { mail: req.mail } });
        const Mydenuncia = await denuncia.create({
            id_usuario_prestador: req.body.id_usuario_prestador,
            id_usuario_cliente: id_usuario_cliente,
            comentario: req.body.comentario,
            fecha_de_denuncia: new Date(Date.now())
        });
        res.json(Mydenuncia);
    } catch (err) {
        res.status(400).send("Error while sending denuncia: " + err.message);
    }
});



module.exports=router