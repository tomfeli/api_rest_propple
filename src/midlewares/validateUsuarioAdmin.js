const JwtHelper = require("../helpers/jwtHelper.js").jwtHelper;
const jwtTokenAdmin = require("../config").claveJWTAdmin;
const myJwtHelperForAdmin = new JwtHelper(jwtTokenAdmin);

const validateUsuarioAdmin = (req,res,next)=>{
    try{
        myJwtHelperForAdmin.verify(req.token).authData.mail;
        next();
      }
      catch(generalError){
        res.status(401).send("ACCESSO_DENEGADO");
      }  
}
module.exports=validateUsuarioAdmin;