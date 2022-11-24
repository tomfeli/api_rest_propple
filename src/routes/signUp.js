const express = require('express');
const {usuario_cliente,usuario_prestador} = require('../services/db');
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("../config");
const authenticationHelper = require("../helpers/authenticationHelper");
const myAuthentitacationHelper = new authenticationHelper();
const { storageRef, ref, deleteObject, uploadString ,getDownloadURL } = require('../services/firebase');
var fs = require('fs');

const verificarDatos = (datos)=>{
    datos.alias = (datos.alias == undefined || datos.alias === "")?null:datos.alias; 
    datos.mail = (datos.mail == undefined || datos.mail === "")?null:datos.mail; 
    datos.phone = (datos.phone == undefined || datos.phone === "")?null:datos.phone; 
    datos.user_name = (datos.user_name == undefined || datos.user_name === "")?null:datos.user_name; 
    datos.user_last_name = (datos.user_last_name == undefined || datos.user_last_name === "")?null:datos.user_last_name; 
    return datos;
};


router.post('/signup', async function(req, res) {
    const usuario = verificarDatos(req.body);
  
    try {
    const usuEncontrado = await usuario_cliente.findOne({where:{mail:usuario.mail}});//trae el usuario
    //si no lo encuentra es un arrayvacio
        if (!usuEncontrado) {     
            try {
               const user = await myAuthentitacationHelper.createUserWithEmailAndPassword(usuario.mail,usuario.user_password);   
               try{
                const str = (`imagenes/${usuario.alias}.jpg`).toString()//creo la carpeta del storage con su img(si esta creada referencia a la ruta)
                const usuarioCreado = await usuario_cliente.create(
                { 
                    id_usuario_cliente: user.reloadUserInfo.localId,   
                    alias: usuario.alias,
                    mail: usuario.mail,
                    phone: usuario.phone,
                    url_image: str,
                    url_download_image : "aux",
                    user_name: usuario.user_name,
                    user_last_name: usuario.user_last_name,
                    location: usuario.location,
                    location_latitud: usuario.location_latitud,
                    location_longitud: usuario.location_longitud,
                    gender: usuario.gender,
                    date_of_birth: usuario.date_of_birth,
                    visibility : true
                });
                try {//convierto en base64 la url de la foto default y lo subo en storage EN FIREBASE 
                  const fileRef = await ref(storageRef, str)
                  var imageAsBase64 = await fs.readFileSync('./src/public/foto_base.jpg', 'base64');
                  const fotobase64 = `data:text/plain;base64,${imageAsBase64}`;
                  await uploadString(fileRef, fotobase64, 'data_url');
                  try{
                    const url_download_image = await getDownloadURL(fileRef)
                    await usuarioCreado.update({
                      url_download_image
                    });
                    res.send('Success')
                  }
                  catch(err) {
                    await deleteObject(fileRef);
                    await usuario_cliente.destroy({where: {id_usuario_cliente: user.reloadUserInfo.localId}})
                    await myAuthentitacationHelper.deleteUser();
                    res.status(400).send("Error while updating userData: " + err.message);  
                  } 
                }catch (err) {
                  await usuario_cliente.destroy({where: {id_usuario_cliente: user.reloadUserInfo.localId}})
                  await myAuthentitacationHelper.deleteUser();
                  res.status(400).send("Error while uploading image: " + err.message);
                }
                  } catch(e){
                       await myAuthentitacationHelper.deleteUser();
                       res.status(401).send(e.message);
                     }
              } catch (error) {
                res.status(401).send("error: " + error.message);
              }
        } else {
           console.log('Error, ya existe el usuario');
           res.status(401).send('Wrong')
        }
    } catch (error) {
       console.log(error.message);
       res.status(401).send('Wrong');
    } 
  });
  module.exports=router;