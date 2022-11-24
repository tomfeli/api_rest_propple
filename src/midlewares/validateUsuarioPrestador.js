const JwtHelper = require("../helpers/jwtHelper.js").jwtHelper;
const jwtTokenPres = require("../config").claveJWTVend;
const myJwtHelperForPres = new JwtHelper(jwtTokenPres);
const router = require("express").Router();
const validateUsuarioPrestador = (req, res, next) => {
  try {
    req.mail = myJwtHelperForPres.verify(req.token).authData.mail;
    next();
  }
  catch (generalError) {
    res.status(401).send("ACCESSO_DENEGADO");
  }
}
module.exports = validateUsuarioPrestador;