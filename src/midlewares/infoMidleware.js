const JwtHelper = require("../helpers/jwtHelper.js").jwtHelper;
const jwtTokenCli = require("../config").claveJWTCli;
const jwtTokenPres = require("../config").claveJWTVend;
const myJwtHelperForPres = new JwtHelper(jwtTokenPres);
const myJwtHelperForClis = new JwtHelper(jwtTokenCli);

const getTokenFromParams = (req,res,next)=>{
    req.token = req.params.token;
    next();
  };
  
  const getTokenFromBody = (req,res,next)=>{
    req.token = req.body.token;
    next();
  };
  
  const getMailFromToken = (req,res,next)=>{
    try{
      req.mail = myJwtHelperForPres.verify(req.token).authData.mail;
      next()
    }
    catch(errorOfPrestador){
      try{
        req.mail = myJwtHelperForClis.verify(req.token).authData.mail;
        next();
      }
      catch(generalError){
        res.status(401).send("ACCESSO_DENEGADO");
      }  
    }
  };
  module.exports = {
    getTokenFromBody,
    getTokenFromParams,
    getMailFromToken      
  }
/**
 * //v2
router.use('/',  (req,res,next)=>{
    try{
        const decode= myJwtHelperForPres.verify(req.body.token);
        req.mail=decode.authData.mail;
        next();
    }
    catch(e){
        next()
    }
},
(req,res,next)=>{
    try{
        if(req.mail===undefined){
            const decode= myJwtHelperForClis.verify(req.body.token);
            req.mail=decode.authData.mail;
        }
        next();
    }
    catch(e){
        res.status(400).send("ACCESO_DENEGADO");
    }
});

module.exports=router;
//v1
module.exports=infoMidleware;

 * const infoMidleware =  (req,res,next)=>{
    try{
        const decode= myJwtHelper.verify(req.body.jwt);

    }
    catch(e){
        next()
        res.status(400).send("ACCESO_DENEGADO");
    }
    req.mail=decode.mail;
    next();
}
 */