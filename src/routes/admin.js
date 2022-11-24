const router = require("express").Router();
const { claveJWTAdmin } = require("../config");
const { getTokenFromBody, getTokenFromParams } = require("../midlewares/infoMidleware");
const validateUsuarioAdmin = require("../midlewares/validateUsuarioAdmin");
const authenticationHelper = require("../helpers/authenticationHelper");
const { usuario_admin, usuario_cliente, usuario_prestador, publicacion, comentario, sequelize, denuncia, transaccion, Op, liquidacion, usuario_prestador_x_rubro} = require("../services/db");
const myAuthentitacationHelper = new authenticationHelper();
const jwtHelper = require("../helpers/jwtHelper").jwtHelper;
const jwtHelperAdmin = new jwtHelper(claveJWTAdmin);
const axios = require("axios");
router.post('/createAdmin', async (req, res, next) => {
   try {
      const user = await myAuthentitacationHelper.createUserWithEmailAndPassword(req.body.mail, req.body.pass);
      try {
         await usuario_admin.create({ id: user.reloadUserInfo.localId });
         res.send('Success');
      }
      catch (error) {
         await myAuthentitacationHelper.deleteUser();
         res.status(401).send(error.message);
      }
   }
   catch (error) {
      res.status(401).send(error.message);
   }

});

router.post('/logIn', async (req, res, next) => {
   try {
      console.log(req.body.pass);
      const logInResponse = await myAuthentitacationHelper.signInWithEmailAndPassword(req.body.mail, req.body.pass);
      //console.log(logInResponse.reloadUserInfo.emailVerified)
      if (logInResponse.reloadUserInfo.emailVerified) {
         if (await usuario_admin.findOne({ where: { id: logInResponse.reloadUserInfo.localId } })) {
            console.log("entre")
            res.send({ "jwt": jwtHelperAdmin.sign({ id: logInResponse.reloadUserInfo.email }) });
         } else {
            res.status(401).send("Error: Usuario inexistente");
         }
      }
      else {
         res.status(401).send("Error: Su mail aun no fue verificado");
      }
   }
   catch (error) {
      res.status(401).send("Error al loguearse");
   }
});

router.get('/getPostulaciones/:token', getTokenFromParams, validateUsuarioAdmin, async (req, res) => {
   try {
      const postulaciones = await sequelize.query(`CALL get_postulaciones_for_admin()`);
      res.send(postulaciones);
   }
   catch (error) {
      res.status(401).send("Error: " + error.message);
   }
})

router.put('/aprobarORechazarPostulacion', getTokenFromBody, validateUsuarioAdmin, async (req, res) => {
   try {
      await sequelize.query(`CALL aprobarRechazarPostulacion(:aproved,
           :id_usuario_cliente_in,
           :id_postulacion_in,
           :id_rubro_in)`,
         {
            replacements: {
               aproved: req.body.approved,
               id_usuario_cliente_in: req.body.id_usuario_cliente,
               id_postulacion_in: req.body.id_postulacion,
               id_rubro_in: req.body.id_rubro
            }
         });
      res.send("Success");
   }
   catch (error) {
      res.status(401).send("Error: " + error.message);
   }
});

//LISTAUSUARIOS
//trae todos los usuarios
router.get('/getAll/:token', getTokenFromParams, validateUsuarioAdmin, async function (req, res, next) {
   try {
      const userListClient = await usuario_cliente.findAll();
      userListClient = await Promise.all(userListClient.map(async (user) => {
         try {
            const { id_usuario_prestador } = await usuario_prestador.findOne({ where: { id_usuario_cliente: user.id_usuario_cliente } });
            const is_admin = (id_usuario_prestador == null || id_usuario_prestador == undefined) ? false : true;
            const user_extended = { ...user, is_admin, error: null };
            return user_extended;
         }
         catch (err) {
            return { ...user, is_admin: null, error: err.message };
         }
      }))
      res.json(userListClient);
   } catch (err) {
      console.error(`Error while getting user `, err.message);
   }
});

router.put('/deleteUser', getTokenFromBody, validateUsuarioAdmin, async function (req, res, next) {
   try {
      
      //delete usuario_cliente
      await usuario_cliente.update(
         {
         visibility: false
         },
         {
            where :{
               id_usuario_cliente : req.body.id_usuario_cliente 
            }
         }
      );
      //delete comentarios
      await comentario.update(
         {
            visibility: false
         },
         {
            where: {
               id_usuario_cliente : req.body.id_usuario_cliente
            }
         }
      );

      //get transacciones de cliente
      let myTransacciones = await transaccion.findAll({
         where : {
            id_usuario_cliente : req.body.id_usuario_cliente,
            [Op.or] : {
               id_estado : 1,
               id_estado : 2,
               id_estado : 4
            }
         }
      });

      //delete transacciones segun id estado 
      await Promise.all(myTransacciones.map(async (transaccion)=>{
         
         switch (transaccion.dataValues.id_estado) {
            case 1:
               await transaccion.update({
                  id_estado : 3
               });
               break;
            case 2:
               await transaccion.update({
                  id_estado : 3
               }); 
               break;
            case 4:
               await transaccion.update({
                  id_estado : 3
               });

               await liquidacion.create({
                  id_usuario: req.body.id_usuario_cliente,
                  id_transaccion: transaccion.dataValues.id_transaccion,
                  fecha_liquidacion: new Date(Date.now()).toDateString(),
                  cantidad: transaccion.dataValues.presupuesto,
                  is_devolucion: true
               });
               break;
            default:
               break;
         }
      }));

      //if usuario es admin
      if (req.body.is_admin === 1) {
         try {
            const {id_usuario_prestador} = await usuario_prestador.findOne({
               where : {
                  id_usuario_cliente : req.body.id_usuario_cliente
               }
            });
            
            //delete usuario prestador
            await usuario_prestador.update(
               {
               visibility : false
               },
               {
                  where : {
                     id_usuario_prestador
                  }
               }
            );

            //delete usuario_prestador_x_rubro
            await usuario_prestador_x_rubro.update(
               {
               visibility : false
               },
               {
                  where : {
                     id_usuario_prestador
                  }
               }
            );
         
            //delte publicaciones del prestador
            await publicacion.update(
               {
               visibility : false
               },
               {
                  where : {
                     id_usuario_prestador
                  }
               }
            );

            //get transacciones del prestador
            let myTransaccionesXPrestador = await transaccion.findAll({
               where : {
                  id_usuario_prestador,
                  [Op.or] : {
                     id_estado : 1,
                     id_estado : 2,
                     id_estado : 4
                  }
               }
            });

            //delete transacciones segun id estado 
            await Promise.all(myTransaccionesXPrestador.map(async (transaccion)=>{

               switch (transaccion.dataValues.id_estado) {
                  case 1:
                     await transaccion.update({
                        id_estado : 3
                     });
                     break;
                  case 2:
                     await transaccion.update({
                        id_estado : 3
                     }); 
                     break;
                  case 4:
                     await transaccion.update({
                        id_estado : 3
                     });
                     await liquidacion.create({
                        id_usuario: transaccion.id_usuario_cliente,
                        id_transaccion: transaccion.dataValues.id_transaccion,
                        fecha_liquidacion: new Date(Date.now()).toDateString(),
                        cantidad: transaccion.dataValues.presupuesto,
                        is_devolucion: true
                     });
                     break;
                  default:
                     break;
               }
            }));  
         }
         catch (error) {
            res.status(401).send("Error: " + error.message);
         };
      }
      res.send("Success");
   }
   catch (error) {
      res.status(401).send("Error: " + error.message);
   }
});

/// GET DENUNCIAS

router.get('/getDenuncias/:token', getTokenFromParams, validateUsuarioAdmin, async (req, res) => {
   try {
      let matrix_denuncias = []
      let array_denuncias = []
      let i = 0
      const denuncias_ordenadas = await denuncia.findAll({ order: sequelize.literal('id_usuario_prestador ASC') });
      let current_id = denuncias_ordenadas[0].id_usuario_prestador
      let previous_id = current_id
      while (i < denuncias_ordenadas.length) {
         current_id = denuncias_ordenadas[i].id_usuario_prestador
         const denuncia_aux = {
            id_denuncia: denuncias_ordenadas[i].id_denuncia,
            id_usuario_cliente: denuncias_ordenadas[i].id_usuario_cliente,
            comentario: denuncias_ordenadas[i].comentario,
            fecha_de_denuncia: denuncias_ordenadas[i].fecha_de_denuncia,
            estado: denuncias_ordenadas[i].estado,

         }
         if (current_id == previous_id) {
            array_denuncias.push(denuncia_aux)
         } else {
            console.log(array_denuncias[0]);
            const {id_usuario_cliente} = await usuario_prestador.findOne({
               where : {
                  id_usuario_prestador : previous_id
               }
            }); 
   
            const {alias} = await usuario_cliente.findOne({
               where: {
                  id_usuario_cliente
               }
            });

            matrix_denuncias.push({ id_usuario_prestador: previous_id, alias, denuncias: [...array_denuncias] })
            array_denuncias = []
            array_denuncias.push(denuncia_aux)
         }
         previous_id = current_id
         i++
      }
      
      const {id_usuario_cliente} = await usuario_prestador.findOne({
         where : {
            id_usuario_prestador : previous_id
         }
      }); 

      const {alias} = await usuario_cliente.findOne({
         where: {
            id_usuario_cliente
         }
      });

      matrix_denuncias.push({ id_usuario_prestador: previous_id, alias,  denuncias: [...array_denuncias] })
      res.send(matrix_denuncias);
   }
   catch (error) {
      res.status(401).send("Error: " + error.message);
   }
})

/// GET DENUNCIA BY ID DENUNCIA

router.get('/getDenuncia/:id/:token', getTokenFromParams, validateUsuarioAdmin, async (req, res) => {
   try {
      const myDenuncia = await denuncia.findOne({ where: { id_denuncia: req.params.id } });
      res.json(myDenuncia)
   }
   catch (error) {
      res.status(401).send("Error: " + error.message);
   }
})

/// GET DENUNCIA BY ID USUARIO

router.get('/getUserDenuncias/:id/:token', getTokenFromParams, validateUsuarioAdmin, async (req, res) => {
   try {
      const myDenuncia = await denuncia.findAll({ where: { id_usuario_prestador: req.params.id } });
      
      const {id_usuario_cliente,  visibility} = await usuario_prestador.findOne({
         where : {
            id_usuario_prestador : req.params.id
         }
      });

      const {alias} = await usuario_cliente.findOne({
         where :{
            id_usuario_cliente
         }
      });
         
      const response = {
         denuncias : myDenuncia,
         id_usuario_cliente,
         visibility,
         alias
      };
      res.json(response);
   }
   catch (error) {
      res.status(401).send("Error: " + error.message);
   }
})

router.get('/getLiquidaciones/:token/:from/:to', getTokenFromParams, validateUsuarioAdmin, async (req,res)=> {
   try{
      let response = await sequelize.query(`select * from liquidacion
      where fecha_liquidacion
      between DATE("${req.params.from}") and DATE("${req.params.to}");`)
      // console.log(response[0])
      // let fixedResponse = []
      // let arrSize = response.length
      // let arrIndex = 0
      // while (arrIndex < arrSize) {
      //    const objSize = response[arrIndex].length
      //    let i = 0
      //    while (i < objSize)
      //    {
      //       fixedResponse.push(response[arrIndex][i])
      //       i++
      //    }
      //    arrIndex++
      // }
      // res.send(fixedResponse);
      res.send(response[0]);
   }
   catch(error){
      res.status(401).send(error.message);
   }
   
})


module.exports = router;