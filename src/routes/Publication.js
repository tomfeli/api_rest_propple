//FEDE
const router = require("express").Router();
const { sequelize, publicacion, comentario, usuario_cliente, usuario_prestador, rubro, postulacion, usuario_prestador_x_rubro } = require('../services/db');
const { getTokenFromParams, getMailFromToken, getTokenFromBody } = require("../midlewares/infoMidleware.js");
const { storageRef, ref, uploadBytes, uploadString, getDownloadURL, deleteObject } = require('../services/firebase');
const { getDistance } = require('../helpers/distance-matrix-helper')
const validateUsuarioPrestador = require("../midlewares/validateUsuarioPrestador");

// OBTENER LISTADO DE PUBLICACIONES (POR RUBRO) - OK

// router.get('/getPublications/:token/:rubro', getTokenFromParams, getMailFromToken, async function (req, res,) {
//    try {
//       const { id_rubro } = await rubro.findOne({ where: { visibility: true, rubro_name: req.params.rubro } });
//       res.status(200).json(await publicacion.findAll({ where: { visibility: true, id_rubro } }));
//    } catch (err) {
//       console.error(`Error while getting publication `, err.message);
//    }
// })

// OBTENER LISTADO DE PUBLICACIONES (CON FILTRO) - OK

router.get('/getPublications/:token/:precio/:puntuacion/:ubicacion/:rubro', getTokenFromParams, getMailFromToken, async function (req, res,) {
   try {

      let order = []
      req.params.puntuacion == 1 ? order.push( ['puntuacion', 'DESC'] ) : false
      req.params.precio == 1 ? order.push( ['precio_x_hora', 'ASC'] ) : false

      const coordenadasUbicacion = req.params.ubicacion.split(",")
      const origins = [[parseFloat(coordenadasUbicacion[0]), parseFloat(coordenadasUbicacion[1])]];
      const { id_rubro } = await rubro.findOne({ where: { visibility: true, rubro_name: req.params.rubro } });
      let publicaciones
      if (order.length != 0) {
         publicaciones = await publicacion.findAll({ where: { visibility: true, id_rubro }, order: order });
      } else {
         publicaciones = await publicacion.findAll({ where: { visibility: true, id_rubro } });
      }
      publicaciones = publicaciones.map((value) => {
         return value.dataValues;
      })
      
      publicaciones = publicaciones.sort((a, b) => {
         return a.distance - b.distance
      });

      publicaciones = await Promise.all(publicaciones.map(async function (publi) {
         const destinations = [[publi.location_latitud, publi.location_longitud]];
         const distance = await getDistance(origins, destinations);
         const { id_usuario_cliente } = await usuario_prestador.findOne({ where: { id_usuario_prestador: publi.id_usuario_prestador } });
         const { url_download_image } = await usuario_cliente.findByPk(id_usuario_cliente)
         const publi_extended = { ...publi, distance, url_download_image }
         return publi_extended;
      }));
      
      res.json(publicaciones)
   } catch (err) {
      console.error("Error while getting publications: ", err.message);
   }
});

// GET PUBLICACION POR ID (DETAILS) - OK

router.get('/getPublication/:token/:id', getTokenFromParams, getMailFromToken, async function (req, res,) {
   try {
      let publication = await publicacion.findByPk(req.params.id, { where: { visibility: true } });
      const { id_usuario_cliente } = await usuario_prestador.findOne({ where: { id_usuario_prestador: publication.id_usuario_prestador } });
      const { url_download_image, user_name, user_last_name, phone } = await usuario_cliente.findByPk(id_usuario_cliente)
      publication = publication.dataValues
      publication = { ...publication, user_name, user_last_name, phone, url_download_image }
      res.json(publication)
      console.log("OK: Publicacion encontrada");
   } catch (err) {
      console.error("Error while getting publication: ", err.message);
   }
});

//GET PUBLICACIONES FOR PRESTADOR 
router.get('/getPublicationsForPrestador/:token' , getTokenFromParams, validateUsuarioPrestador, async function (req, res) {
   try {
      const {id_usuario_cliente} = await usuario_cliente.findOne({
         where : {
            mail : req.mail,
            visibility : true
         }
      });

      const {id_usuario_prestador} = await usuario_prestador.findOne({
         where : {
            id_usuario_cliente,
            visibility : true
         }
      });

      let publicaciones = await publicacion.findAll({
         where : {
            id_usuario_prestador
         }
      });
      
      publicaciones = await Promise.all(publicaciones.map(async (publicacion)=>{
         
         let {rubro_name} = await rubro.findOne({
            where : {
               id_rubro : publicacion.id_rubro
            }
         });
         return {
            id_publicacion : publicacion.id_publicacion,
            show : (publicacion.location_latitud !== 0 || publicacion.location_longitud !== 0),
            visibility : publicacion.visibility,
            rubro_name
         }
      }));

      res.send(publicaciones); 

   }
   catch(error){
      res.status(401).send(error.message);
   }
});

// GET PUBLICACION POR ID (DETAILS) FOR PRESTADOR- OK

router.get('/getPublicationForPrestador/:token/:id', getTokenFromParams, validateUsuarioPrestador, async function (req, res,) {
   try {

      let {id_usuario_cliente, url_download_image, user_name, user_last_name, phone } = await usuario_cliente.findOne({
         where : {
            mail : req.mail,
            visibility : true
         }
      });

      const {id_usuario_prestador} = await usuario_prestador.findOne({
         where : {
            id_usuario_cliente,
            visibility : true
         }
      });

      let publication = await publicacion.findByPk(req.params.id, { where: id_usuario_prestador });
      
      const {rubro_name} = await rubro.findOne({
         where : {
            id_rubro : publication.id_rubro
         }
      });

      if(publication){
      publication = publication.dataValues
      publication = { ...publication,
         user_name,
         user_last_name,
         phone,
         url_download_image,
         rubro_name,
         show : (publication.location_latitud !== 0 || publication.location_longitud !== 0)
      }
      res.json(publication)
      }
      else{
         res.status(401).send("la publicacion que busca no existe");
      }
      
   } catch (err) {
      console.error("Error while getting publication: ", err.message);
   }
});

// POST COMENTARIO - OK

router.post('/postComentario', getTokenFromBody, getMailFromToken, async function (req, res) {
   try {
      const { id_usuario_cliente } = await usuario_cliente.findOne({ where: { mail: req.mail } });
      const Mycomentario = await comentario.create({
         id_publicacion: req.body.id_publicacion,
         id_usuario_cliente: id_usuario_cliente,
         content: req.body.content,
         visibility: true,
         date_of_creation: new Date(Date.now())
      });
      res.json(Mycomentario);
      console.log("OK: Comentario publicado");
   } catch (err) {
      res.status(400).send("Error while posting comentario: " + err.message);
   }
});

// POST RESPUESTA - OK

//req.body.id_publicacion
//req.body.id_comentario

router.post('/postRespuesta', getTokenFromBody, validateUsuarioPrestador, async function (req, res) {
   try {
      const { id_usuario_cliente } = await usuario_cliente.findOne({ where: { mail: req.mail, visibility: true } });
      const { id_usuario_prestador } = await usuario_prestador.findOne({ where: { id_usuario_cliente } })
      const publi = await publicacion.findByPk(req.body.id_publicacion)
      if (id_usuario_prestador == publi.id_usuario_prestador) {
         const myComentario = await comentario.findByPk(req.body.id_comentario);
         const com = await myComentario.update({
            answer: req.body.answer,
         });
         res.json(com);
      } else {
         res.status(400).send("acceso denegado");
      }
   } catch (err) {
      res.status(400).send("Error while posting comentario: " + err.message);
   }
});

// GET COMENTARIO POR ID - OK

router.get('/getComentario/:token/:id', getTokenFromParams, getMailFromToken, async function (req, res,) {
   try {
      let comentarios = await comentario.findAll({ where: { visibility: true, id_publicacion: req.params.id } });
      const { id_usuario_prestador } = await publicacion.findByPk(req.params.id, { where: { visibility: true } });
      const { id_usuario_cliente } = await usuario_prestador.findOne({ where: { id_usuario_prestador: id_usuario_prestador } });
      const { url_download_image } = await usuario_cliente.findByPk(id_usuario_cliente)
      console.log(url_download_image)
      const foto_prestador = url_download_image
      comentarios = comentarios.map((value) => {
         return value.dataValues;
      })
      comentarios = await Promise.all(comentarios.map(async function (comentario) {
         const id_cliente = comentario.id_usuario_cliente
         const { url_download_image } = await usuario_cliente.findByPk(id_cliente)
         const foto_cliente = url_download_image
         const myComentario = { ...comentario, foto_cliente, foto_prestador }
         return myComentario;
      }))
      comentarios = comentarios.sort((a, b) => {
         return new Date(b.date_of_creation).getTime() - new Date(a.date_of_creation).getTime()
      })
      res.json(comentarios)
   } catch (err) {
      console.error("Error while getting comentario: ", err.message);
   }
});

// POST POSTULACION - OK

/*

ACLARACION:
enviar en el body el objeto con el siguiente formato:

"file": {
   "mime": "application/pdf",
   "data": "..............."
}

*/

router.post('/postPostulacion', getTokenFromBody, getMailFromToken, async function (req, res) {
   try {
      const buff = Buffer.from(req.body.data, 'base64');
      const str = (`postulaciones/${req.body.rubro_name}/${req.mail}${new Date(Date.now()).toString()}.jpeg`).toString()
      const fileRef = ref(storageRef, str)
      await uploadBytes(fileRef, buff, "base64");
      const url_cv = await getDownloadURL(fileRef);
      try {
         const { id_usuario_cliente } = await usuario_cliente.findOne({ where: { mail: req.mail, visibility: true } });
         if (id_usuario_cliente) {
            const { id_rubro } = await rubro.findOne({ where: { rubro_name: req.body.rubro_name } });
            const { id_usuario_prestador } = await usuario_cliente.findOne({ where: { id_usuario_cliente: id_usuario_cliente, visibility: true } });
            if (id_usuario_prestador) {
               const { id_usuario_prestador_x_rubro } = await usuario_prestador_x_rubro.findOne({ where: { id_usuario_prestador, id_rubro } })
            }
            const myPostulacion = await postulacion.findOne({ where: { id_usuario_cliente, id_rubro } })
            if ((myPostulacion === undefined || myPostulacion === null) && (!id_usuario_prestador || (id_usuario_prestador && !id_usuario_prestador_x_rubro))) {
               try {
                  await postulacion.create({
                     id_usuario_cliente: id_usuario_cliente,
                     id_rubro: id_rubro,
                     fecha_postulacion: new Date(Date.now()).toDateString(),
                     url_cv: url_cv
                  })
                  res.status(200).send("Carga correcta")
               }
               catch (err) {
                  deleteObject(fileRef);
                  res.status(401).send(err.message);
               }
            }
            else {
               deleteObject(fileRef);
               res.status(401).send("Error: este usuario ya es prestador de este rubro")
            }
         }
         else {
            deleteObject(fileRef);
            res.status(401).send("El usuario que intenta realizar esta accion no existe");
         }
      }
      catch (err) {
         deleteObject(fileRef);
         res.status(401).send("Error: " + err.message);
      }
   } catch (err) {
      deleteObject(fileRef);
      res.status(400).send("Error while uploading postulation: " + err.message);
   }
});

// UPDATE PUBLICACION - OK

router.put('/updatePublication', getTokenFromBody, validateUsuarioPrestador, async function (req, res) {
   try {
      const myPublicacion = await publicacion.findOne({ where: { id_publicacion: req.body.id_publicacion} });
      const publicacion_id_prestador = myPublicacion.id_usuario_prestador;
      const { id_usuario_cliente } = await usuario_cliente.findOne({ where: { mail: req.mail, visibility: true } });
      const { id_usuario_prestador } = await usuario_prestador.findOne({ where: { id_usuario_cliente } })
      if (id_usuario_prestador == publicacion_id_prestador) {
         await myPublicacion.update({
            title: req.body.title,
            publicacion_description: req.body.publicacion_description,
            precio_x_hora: req.body.precio_x_hora,
            location: req.body.location,
            location_latitud: parseFloat(req.body.location_latitud),
            location_longitud: parseFloat(req.body.location_longitud)
         })
         res.status(200).send("OK: Publicacion editada");
      }
      else {
         res.status(401).send("Error: al editar la publicacion");
      }
   }
   catch (error) {
      res.status(401).send("Error: " + error);
   }
});

router.put('/changeVisibility', getTokenFromBody, validateUsuarioPrestador, async (req, res) =>{
   try {
      const myPublicacion = await publicacion.findOne({ where: { id_publicacion: req.body.id_publicacion} });
      const publicacion_id_prestador = myPublicacion.id_usuario_prestador
      const { id_usuario_cliente } = await usuario_cliente.findOne({ where: { mail: req.mail, visibility: true } });
      const { id_usuario_prestador } = await usuario_prestador.findOne({ where: { id_usuario_cliente } })
      if (id_usuario_prestador == publicacion_id_prestador) {
         await myPublicacion.update({
         visibility : !myPublicacion.visibility
         });
         res.send("Success");
      }
      else{
         res.status(401).send("Usted no es el dueño de esta pubicacion");
      }
   }
   catch(error){
      res.status(401).send(error.message);
   }
})
module.exports = router;