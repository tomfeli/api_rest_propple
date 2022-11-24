const express = require('express');
const {usuario_cliente,usuario_prestador} = require('../services/db');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwtHelper = require("../helpers/jwtHelper").jwtHelper;
const jwtConfig =require('../config');
const authenticationHelper = require("../helpers/authenticationHelper");
const myAuthentitacationHelper = new authenticationHelper();

//login
router.post('/login', async function(req, res, next) {
    console.log("login");
    const usuario = req.body;
    try {
      const usuarioAux =  await usuario_cliente.findOne({ where: {visibility: true, mail:req.body.mail} });
      
      if (usuarioAux) {
        const logInResponse= await myAuthentitacationHelper.signInWithEmailAndPassword(usuario.mail,usuario.user_password);
        
        if(logInResponse.reloadUserInfo.emailVerified){
          let jwtSecret=jwtConfig.claveJWTCli;
          let rol = "cliente"
         
          if(await usuario_prestador.findOne({ where: {id_usuario_cliente: usuarioAux.id_usuario_cliente} })){
            jwtSecret = jwtConfig.claveJWTVend;
            rol = "cliente - prestador"
          }
          let myjwtHelper = new jwtHelper(jwtSecret);
          res.send({"jwt": myjwtHelper.sign({alias: usuarioAux.alias,mail: usuarioAux.mail,phone:usuarioAux.phone}),rol});
          console.log('accion exitosa - InicioSesion');

          }else{
            res.status(401).send("Error, no verificaste el mail");
          }
       }
       else { 
        res.status(401).send("Error, no existe usuario activo con ese mail");
      }
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error Occured");
      }

    
  });
  module.exports=router;