const express = require('express');
const bcrypt = require('bcryptjs');
const { usuario_cliente, Op } = require('../services/db');
const router = express.Router();
const authenticationHelper = require("../helpers/authenticationHelper");
const myAuthentitacationHelper = new authenticationHelper();
const { getTokenFromParams, getTokenFromBody, getMailFromToken } = require("../midlewares/infoMidleware.js");
const { storageRef, ref, uploadBytes, uploadString, getDownloadURL } = require('../services/firebase');

//LISTAUSUARIOS
//trae todos los usuarios
router.get('/getAll', async function(req,res,){
  try{
    const userListClient = await usuario_cliente.findAll();
    res.json(userListClient);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});

//USUARIOXMAIL
//trae un usuario en base al token
router.get('/getOne/:token', getTokenFromParams, getMailFromToken, async function (req, res,) {
  try {
    const userClientByID = await usuario_cliente.findOne({
      where:
      {
        mail: req.mail,
        visibility: true
      }
    });
    res.json(userClientByID);
  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});

//PUT//
//updateuser --> update de todo el usuario 
router.put('/updateUser', getTokenFromBody, getMailFromToken, async function (req, res) {
  try {
    const usuario_encontrado = await usuario_cliente.findOne({ where: { mail: req.mail, visibility: true } });
    const usuario_con_mismo_alias = await usuario_cliente.findOne({ where: { mail: { [Op.not]: req.mail }, alias: req.body.alias, visibility: true } }); //valida que lo que envio no tenga mismo mail

    if (usuario_encontrado && !usuario_con_mismo_alias) {
      try {//updateo foto del storage usando la misma url(la cambia subiendolo) del stoage guardada en usaurio y la foto que me mandan ya en base64
        let img = usuario_encontrado.url_download_image
        if (req.body.url_image !== "") {
          const fileRef = await ref(storageRef, usuario_encontrado.url_image)
          const buff = Buffer.from(req.body.url_image, 'base64');
          await uploadBytes(fileRef, buff, "base64");
          const url_download_image = await getDownloadURL(fileRef);
          img = url_download_image
        }
        await usuario_encontrado.update({
          alias: req.body.alias,
          phone: req.body.phone,
          user_name: req.body.user_name,
          user_last_name: req.body.user_last_name,
          location: req.body.location,
          location_latitud: parseFloat(req.body.location_latitud),
          location_longitud: parseFloat(req.body.location_longitud),
          gender: req.body.gender,
          date_of_birth: req.body.date_of_birth,
          gender: req.body.gender,
          url_download_image: img
          //puede cambiar aca mail y contra?
        });
        res.send("Success");
      } catch (err) {
        res.status(400).send("Error while updating image: " + err.message);
      }

    } else {
      res.status(401).send("Error: nuevo alias invalido");
      console.log('Error, ya existe un usuario con ese alias');
    }
  }
  catch (error) {
    res.status(401).send("Error: " + error);
    console.log('Error, falopa');
  }
});

//passwordchange --> cambia la contraseña verificando la contra vieja
router.put('/passwordChange', getTokenFromBody, getMailFromToken, async function (req, res,) {
  const autenticationHelperForPasswordChange = new authenticationHelper();
  try {
    const userClientByID = await usuario_cliente.findOne({ where: { mail: req.mail, visibility: true } });
    if (userClientByID) {
      try {
        await autenticationHelperForPasswordChange.signInWithEmailAndPassword(req.mail, req.body.user_password);
        try {
          await autenticationHelperForPasswordChange.updatePassword(req.body.new_user_password);
          res.send("Contraseña cambiada");
        } catch (error) {
          res.status(401).send(error.message)
        }
      }
      catch (error) {
        res.status(401).send(error.message)
      }
    } else {
      console.log('Error, no existe un usuario con ese mail');
      res.status(401).send('Wrong');
    }
  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});

router.put('/recoverPassword', async function (req, res,) {
  try {
    const userClientByID = await usuario_cliente.findOne({ where: { mail: req.body.mail, visibility: true } });
    if (userClientByID) {
      try {
        await myAuthentitacationHelper.sendPasswordResetEmail(req.body.mail);
        res.send("Mail enviado para cambio de contraseña")
      }
      catch (error) {
        res.status(401).send(error.message)
      }
    } else {
      console.log('Error, no existe un usuario con ese mail');
      res.status(401).send('Wrong');
    }
  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});


//DELETE//
//delete(en realidad put) --> cambia visibility de usuario en base a req.mail
router.put('/delete', getTokenFromBody, getMailFromToken, async function (req, res) {

  try {
    const usuario_encontrado = await usuario_cliente.findOne({ where: { mail: req.mail, visibility: true } });

    if (usuario_encontrado) {
      usuario_encontrado.update({ visibility: false })

      console.log('Usuario desactivado con exito');
      res.send("Success");

    } else {
      console.log('Error, no existe un usuario con ese mail');
      res.status(401).send('Wrong')
    }

  } catch (err) {
    console.error(`Error while getting user `, err.message);
  }
});

module.exports = router;