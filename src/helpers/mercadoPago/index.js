const mercadoPagoHelper = require("./mercadoPagoHelper");
const urlConfig = require("../../config.js").PATH_BACK_END;
const paymentService=new mercadoPagoHelper(urlConfig);
module.exports=paymentService;