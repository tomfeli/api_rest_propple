const paymentHelper = require("../helpers/mercadoPago/mercadoPagoHelper.js");
class PaymentService {
    constructor() {
      this.paymentHelper = new paymentHelper();
    }
  
    async getPaymentLink(req, res) {
      try {
        const payment = await this.paymentHelper.createPayment(req.body.idPayment,
          req.body.unit_price,
          req.body.payer_mail
          );
          //updatear en la tabla de payment que corresponda 
        return res.json(payment);
      } catch (error) {
        console.log(error);
  
        return res
          .status(500)
          .json({ error: true, msg: "Failed to create payment" });
      }
    }
  
}
  
  module.exports = PaymentService;