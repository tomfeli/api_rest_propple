//TOM
const express = require("express");
const router = express.Router();
const { sequelize, usuario_cliente, usuario_prestador, transaccion, publicacion, rubro, liquidacion, valuacion, Op } = require("../services/db");
const { getTokenFromBody, getMailFromToken, getTokenFromParams } = require("../midlewares/infoMidleware.js");
const validateUsuarioPrestador = require("../midlewares/validateUsuarioPrestador");
const myMercadoPagoHelper = require("../helpers/mercadoPago/index");

router.post("/crearTransaccion", getTokenFromBody, getMailFromToken, async (req, res) => {
   try {
      await sequelize.query('CALL iniciarTransaccion (:mailComprador, :idPublicacion)',
         { replacements: { mailComprador: req.mail, idPublicacion: req.body.idPublicacion } });
      res.send("Success");
   }
   catch (e) {
      res.status(401).send(e);
   }
});

router.put('/formalizarTransaccion', getTokenFromBody, validateUsuarioPrestador, async (req, res) => {
   try {
      const { id_usuario_cliente } = await usuario_cliente.findOne({
         where: {
            mail: req.mail,
            visibility: true
         }
      });
      const { id_usuario_prestador } = await usuario_prestador.findOne({
         where: {
            id_usuario_cliente,
            visibility: true
         }
      })
      const myTransaccion = await transaccion.findOne({
         where: {
            id_transaccion: req.body.id_transaccion,
            id_usuario_prestador
         }
      });

      if (myTransaccion.presupuesto === null) {
         if (req.body.date_of_work !== null &&
            req.body.date_of_work !== undefined &&
            req.body.location !== null &&
            req.body.location !== undefined &&
            req.body.location_latitud !== null &&
            req.body.location_latitud !== undefined &&
            req.body.location_longitud !== null &&
            req.body.location_longitud !== undefined) {
            try {
               const dateArray = req.body.date_of_work.split("/");
               const date_of_work = new Date(dateArray[2], dateArray[1], dateArray[0]);
               await myTransaccion.update({
                  presupuesto: req.body.presupuesto,
                  fecha: date_of_work,
                  location: req.body.location,
                  location_latitud: req.body.location_latitud,
                  location_longitud: req.body.location_longitud,
                  id_estado: 2
               });
               res.send("Success");
            }
            catch (error) {
               res.status(401).send(error.message);
            }
         }
         else {
            res.status(401).send("Datos ingresados invalidos");
         }
      }
      else {
         res.status(401).send("La transaccion que trata de formalizar ya se encuentra formalizada");
      }
   }
   catch (error) {
      res.status(401).send(error.message);
   }
});

router.post('/abonarTransaccion', getTokenFromBody, getMailFromToken, async (req, res) => {
   try {
      const { id_usuario_cliente } = await usuario_cliente.findOne({
         where: {
            mail: req.mail,
            visibility: true
         }
      });

      const { presupuesto, id_publicacion, id_usuario_prestador } = await transaccion.findOne({
         where: {
            id_transaccion: req.body.id_transaccion,
            id_estado: 2,
            id_usuario_cliente: id_usuario_cliente
         }
      });
      const my_usuario_prestador = await usuario_prestador.findOne({
         where : {
            id_usuario_prestador
         }
      });
      
      const {alias} = await usuario_cliente.findOne({
         where : {
            id_usuario_cliente : my_usuario_prestador.id_usuario_cliente
         }
      });
      
      const {id_rubro} = await publicacion.findOne({
         where : {
            id_publicacion
         }
      })
      const {rubro_name} = await rubro.findOne({
         where : {
            id_rubro
         }
      }); 

      if (presupuesto) {
         try {
            //await myMercadoPagoHelper.createPayment(req.body.id_transaccion, presupuesto, req.mail);
            const data = {
               message:`ProppleService de ${rubro_name} de ${alias}`,
               id_transaccion : req.body.id_transaccion
            };

            const { init_point } = await myMercadoPagoHelper.createPayment(data, presupuesto, "test_user_49238205@testuser.com");
            res.send({ "init_point": init_point });
         }
         catch (error) {
            res.status(401).send(error.message);
         }
      }
      else {
         res.status(401).send("no se encontro la transaccion solicitada");
      }
   }
   catch (e) {
      res.status(401).send(e.message);
   }
});

router.get('/success', async (req, res) => {
   try {
      //update status and set id_payment
      const miTransaccion = await transaccion.findOne({
         where:
         {
            id_transaccion: req.query.id_transaccion,
            id_estado: 2
         }
      })
      if (miTransaccion) {
         await miTransaccion.update({
            id_estado: 4,
            id_payment: req.query.payment_id
         });
         res.send("Success");
      } else {
         res.status(401).send("no se encontro usuario con esas especificaciones");
      }
   }
   catch (error) {
      res.status(401).send(error.message);
   }
});

//revisar si hace falta logica aca
router.get('/failure', async (req, res) => {
   res.send("Success");
});

//revisar si hace falta logica aca
router.get('/pending', async (req, res) => {
   res.send("Success");
});

router.post('/finalizarTransaccion', getTokenFromBody, validateUsuarioPrestador, async (req, res) => {
   const { id_usuario_cliente } = await usuario_cliente.findOne({
      where: {
         mail: req.mail,
         visibility: true
      }
   });

   const { id_usuario_prestador } = await usuario_prestador.findOne({
      where: {
         id_usuario_cliente,
         visibility: true
      }
   });

   const myTransaccion = await transaccion.findOne({
      where: {
         id_transaccion: req.body.id_transaccion,
         id_estado: 4,
         id_usuario_prestador
      }
   });

   if (myTransaccion) {
      await myTransaccion.update({
         id_estado: 5
      });
      await liquidacion.create({
         id_usuario: id_usuario_cliente,
         id_transaccion: myTransaccion.id_transaccion,
         fecha_liquidacion: new Date(Date.now()).toDateString(),
         cantidad: myTransaccion.presupuesto,
         is_devolucion: false
      });
      res.send("Success");
   }
   else {
      res.status(401).send("No se encontro la transaccion solicitada");
   }
})

router.put('/deleteTransaccionIniciada', getTokenFromBody, validateUsuarioPrestador, async (req, res) => {
   try {

      const { id_usuario_cliente } = await usuario_cliente.findOne({
         where: {
            mail: req.mail,
            visibility: true
         }
      });

      const { id_usuario_prestador } = await usuario_prestador.findOne({
         where: {
            id_usuario_cliente: id_usuario_cliente,
            visibility: true
         }
      });

      const my_transaccion = await transaccion.findOne({
         where: {
            id_transaccion: req.body.id_transaccion,
            id_usuario_prestador,
            id_estado: 1
         }
      });

      if (my_transaccion.presupuesto === null) {
         try {
            await my_transaccion.update({
               id_estado: 3
            });
            res.send("Success");
         }
         catch (error) {
            res.status(401).send(error.message);
         }
      }
      else {
         res.status(401).send("La transaccion que trata de formalizar ya se encuentra formalizada");
      }
   }
   catch (error) {
      res.status(401).send(error.message);
   }
});

router.put('/deleteTransaccionPresupuestada', getTokenFromBody, getMailFromToken, async (req, res) => {
   try {

      const myUsuario = await usuario_cliente.findOne({
         where: {
            mail: req.mail,
            visibility: true
         }
      });

      const my_transaccion = await transaccion.findOne({
         where: {
            id_transaccion: req.body.id_transaccion,
            id_usuario_cliente: myUsuario.id_usuario_cliente,
            id_estado: 2
         }
      });
      if (my_transaccion.presupuesto !== null) {
         if (my_transaccion.fecha !== null &&
            my_transaccion.fecha !== undefined &&
            my_transaccion.location !== null &&
            my_transaccion.location !== undefined &&
            my_transaccion.location_latitud !== null &&
            my_transaccion.location_latitud !== undefined &&
            my_transaccion.location_longitud !== null &&
            my_transaccion.location_longitud !== undefined) {
            try {
               await my_transaccion.update({
                  id_estado: 3
               });
               res.send("Success");
            }
            catch (error) {
               res.status(401).send(error.message);
            }
         }
         else {
            res.status(401).send("");
         }
      }
      else {
         res.status(401).send("La transaccion que trata de formalizar ya se encuentra formalizada");
      }
   }
   catch (error) {
      res.status(401).send(error.message);
   }
});

router.get("/getCompras/:token", getTokenFromParams, getMailFromToken, async (req, res) => {
   try {
      const { id_usuario_cliente } = await usuario_cliente.findOne({
         where: {
            mail: req.mail,
            visibility: true
         }
      });
      let transacciones = await transaccion.findAll({
         where:
         {
            id_usuario_cliente: id_usuario_cliente,
         },
         order: ["id_estado"]
      });

      let response = {
         inicial: [],
         pendientes: [],
         proximos: [],
         cancelados: [],
         finalizados: [],
         comentados: []
      }

      await Promise.all(transacciones.map(async (transaccion) => {
         const { id_usuario_cliente } = await usuario_prestador.findOne({
            where: {
               id_usuario_prestador: transaccion.dataValues.id_usuario_prestador
            }
         });

         const { alias, url_download_image, phone } = await usuario_cliente.findOne({
            where: {
               id_usuario_cliente: id_usuario_cliente
            }
         });

         const { id_rubro } = await publicacion.findOne({
            where: {
               id_publicacion: transaccion.dataValues.id_publicacion
            }
         });

         const { rubro_name } = await rubro.findOne({
            where: {
               id_rubro
            }
         });

         let myTransaccion = {
            id_transaccion: transaccion.dataValues.id_transaccion,
            id_usuario_prestador: transaccion.dataValues.id_usuario_prestador,
            id_usuario_cliente: transaccion.dataValues.id_usuario_cliente,
            id_publicacion: transaccion.dataValues.id_publicacion,
            id_estado: transaccion.dataValues.id_estado,
            id_valuacion: transaccion.dataValues.id_valuacion,
            presupuesto: transaccion.dataValues.presupuesto,
            fecha: transaccion.dataValues.fecha,
            location: transaccion.dataValues.location,
            location_latitud: transaccion.dataValues.location_latitud,
            location_longitud: transaccion.dataValues.location_longitud,
            rubro_name,
            alias,
            url_download_image,
            phone
         }
         switch (transaccion.dataValues.id_estado) {
            case 1:
               response.inicial.push(myTransaccion);
               break;
            case 2:
               response.pendientes.push(myTransaccion);
               break;
            case 3:
               response.cancelados.push(myTransaccion);
               break;
            case 4:
               response.proximos.push(myTransaccion);
               break;
            case 5:
            case 6:
               response.finalizados.push(myTransaccion);
               break;
            
            default:
               break;
         }
      }));
      res.send(response);
   }
   catch (error) {
      res.status(401).send(error.message);
   }
});

router.get("/getVentas/:token", getTokenFromParams, validateUsuarioPrestador, async (req, res) => {
   try {
      const { id_usuario_cliente } = await usuario_cliente.findOne({
         where: {
            mail: req.mail,
            visibility: true
         }
      });

      const { id_usuario_prestador } = await usuario_prestador.findOne({
         where: {
            id_usuario_cliente: id_usuario_cliente
         }
      });

      const group = 'id_estado';
      let transacciones = await transaccion.findAll({
         where:
         {
            id_usuario_prestador
         },
         order: ["id_estado"]
      });

      let response = {
         inicial: [],
         pendientes: [],
         proximos: [],
         cancelados: [],
         finalizados: [],
         comentados: []
      }
      await Promise.all(transacciones.map(async function (transaccion) {
         const { alias, url_download_image, phone } = await usuario_cliente.findOne({
            where: {
               id_usuario_cliente: transaccion.dataValues.id_usuario_cliente
            }
         });

         const { id_rubro } = await publicacion.findOne({
            where: {
               id_publicacion: transaccion.dataValues.id_publicacion
            }
         });

         const { rubro_name } = await rubro.findOne({
            where: {
               id_rubro
            }
         });

         let myTransaccion = {
            id_transaccion: transaccion.dataValues.id_transaccion,
            id_usuario_prestador: transaccion.dataValues.id_usuario_prestador,
            id_usuario_cliente: transaccion.dataValues.id_usuario_cliente,
            id_publicacion: transaccion.dataValues.id_publicacion,
            id_estado: transaccion.dataValues.id_estado,
            id_valuacion: transaccion.dataValues.id_valuacion,
            presupuesto: transaccion.dataValues.presupuesto,
            fecha: transaccion.dataValues.fecha,
            location: transaccion.dataValues.location,
            location_latitud: transaccion.dataValues.location_latitud,
            location_longitud: transaccion.dataValues.location_longitud,
            rubro_name,
            alias,
            url_download_image,
            phone
         }
         switch (transaccion.dataValues.id_estado) {
            case 1:
               response.inicial.push(myTransaccion);
               break;
            case 2:
               response.pendientes.push(myTransaccion);
               break;
            case 3:
               response.cancelados.push(myTransaccion);
               break;
            case 4:
               response.proximos.push(myTransaccion);
               break;
            case 5:
            case 6:
               response.finalizados.push(myTransaccion);
               break;

            default:
               break;
         }
      }));
      res.send(response);
   }
   catch (error) {
      res.status(401).send(error.message);
   }
});

router.post("/deleteTransaccionAbonada", getTokenFromBody, validateUsuarioPrestador, async (req, res) => {
   try {
      const { id_usuario_cliente } = await usuario_cliente.findOne({
         where: {
            mail: req.mail,
            visibility: true
         }
      });
      const { id_usuario_prestador } = await usuario_prestador.findOne({
         where: {
            id_usuario_cliente
         }
      })
      const myTransaccion = await transaccion.findOne({
         where: {
            id_transaccion: req.body.id_transaccion
         }
      })
      if (id_usuario_prestador && id_usuario_prestador === myTransaccion.id_usuario_prestador) {
         await myTransaccion.update({
            id_estado: 3
         });

         await liquidacion.create({
            id_usuario: myTransaccion.id_usuario_cliente,
            id_transaccion: myTransaccion.id_transaccion,
            fecha_liquidacion: new Date(Date.now()),
            cantidad: myTransaccion.presupuesto,
            is_devolucion: true
         });
         res.send("Success");
      }
      else {
         res.status(401).send("acceso denegado a este usuario");
      }
   }
   catch (error) {
      res.status(401).send(error.message);
   }
})

router.get("/getTransaccionesAFinalizar/:token", getTokenFromParams, validateUsuarioPrestador, async (req, res) => {
   try {
      const { id_usuario_cliente } = await usuario_cliente.findOne({ where: { mail: req.mail, visibility: true } });
      const { id_usuario_prestador } = await usuario_prestador.findOne({ where: { id_usuario_cliente } });


      let my_transacciones = await transaccion.findAll({ where: { id_estado: 4, id_usuario_prestador } });
      my_transacciones = await Promise.all(my_transacciones.map(async (transaccion) => {

         const fechaActual = Date.now();
         let dateFormat = transaccion.dataValues.fecha.split("-");
         dateFormat = dateFormat.map((element) => {
            return parseInt(element);
         });
         const myDate = new Date(dateFormat[0], (dateFormat[1]-2), dateFormat[2]);
         
         if (myDate.getTime() < fechaActual) {
            console.log("entre");
            const { alias } = await usuario_cliente.findOne({
               where: {
                  id_usuario_cliente: transaccion.dataValues.id_usuario_cliente
               }
            });

            const { id_rubro } = await publicacion.findOne({
               where: {
                  id_publicacion: transaccion.dataValues.id_publicacion
               }
            });

            const { rubro_name } = await rubro.findOne({
               where: {
                  id_rubro
               }
            });

            transaccion.dataValues.location = `completo la visita de ${rubro_name} a ${alias}?`;
            return transaccion.dataValues;
         }
      }));
      let response =[];
      my_transacciones.forEach(transaccion => {
         if(transaccion !==undefined && transaccion !== null)
         {
            response.push(transaccion)
         }
      });
      res.send(response)
   }
   catch (error) {
      res.status(401).send(error.message);
   }
   //buscar transacciones del prestador en el que estes que tengan id_status 4 y cuya fecha sea menor a la actual 
});

// GET TRANSACCIONES A VALUAR

router.get("/getTransaccionesAValuar/:token", getTokenFromParams, getMailFromToken, async (req, res) => {
   try {
      const { id_usuario_cliente } = await usuario_cliente.findOne({ where: { mail: req.mail, visibility: true } });
      let my_transacciones = await transaccion.findAll({ where: { id_estado: 5, id_usuario_cliente } });
      my_transacciones = my_transacciones.map((value) => {
         return value.dataValues;
      })
      my_transacciones = await Promise.all(my_transacciones.map(async function (transaccion) {
         const id_publicacion = transaccion.id_publicacion
         const { id_rubro } = await publicacion.findOne({ where: { id_publicacion } })
         const { rubro_name } = await rubro.findOne({ where: { id_rubro } })
         const id_usuario_prestador = transaccion.id_usuario_prestador
         const prestador = await usuario_prestador.findOne({ where: { id_usuario_prestador } });
         const { url_download_image, alias } = await usuario_cliente.findByPk(prestador.id_usuario_cliente)
         return { ...transaccion, url_download_image, alias, rubro_name };
      }))
      res.send(my_transacciones)
   }
   catch (error) {
      res.status(401).send(error.message);
   }
});

// VALUAR TRANSACCION
//id
//comentario
//puntaje
router.post("/valuarTransaccion", getTokenFromBody, getMailFromToken, async (req, res) => {
   try {
      const {id_usuario_cliente} = await usuario_cliente.findOne({
         where : {
            mail : req.mail
         }
      });

      const my_transaccion = await transaccion.findOne({
         where :{
            id_transaccion : req.body.id_transaccion,
            id_usuario_cliente,
            id_estado : 5   
         }
      });
      
      const my_publication = await publicacion.findOne({ 
         where: { 
            id_publicacion: my_transaccion.id_publicacion
         }
      });

      if (req.body.comentario !== "" && req.body.puntaje !== 0) {
         
         const myValuacion = await valuacion.create({
            puntaje: req.body.puntaje,
            comentario: req.body.comentario,
            visibility : true
         });

         await my_transaccion.update({
            id_estado: 6,
            id_valuacion: myValuacion.id_valuacion
         });

         let transacciones = await transaccion.findAll({
            raw : true, 
            where: {
               id_publicacion: my_publication.id_publicacion,
               id_estado : 6
            }
         });

         const puntajes = await Promise.all(transacciones.map(async(transaccion)=>{
            const {puntaje} = await valuacion.findOne({
               where : {
                  id_valuacion : transaccion.id_valuacion
               }
            });
            return puntaje;
         }));

         const puntajeTotal = puntajes.reduce((puntaje1, puntaje2) =>  puntaje1 + puntaje2);

         const cantTransacciones = my_publication.cant_transacciones + 1
         const puntuacion = Math.round(puntajeTotal / cantTransacciones)
         console.log(puntuacion)

         await my_publication.update({
            cant_transacciones: cantTransacciones,
            puntuacion: puntuacion
         });

      } else {
         await my_transaccion.update({
            id_estado: 6
         })
      }
      res.send("Success");
   }
   catch (error) {
      res.status(401).send(error.message);
   }
});

module.exports = router;
