const axios = require("axios");

class mercadoPagoHelper {
  constructor(path) {
    this.path = path;
  }
  async createPayment(idPayment, unit_price, payer_mail) {
    const url = "https://api.mercadopago.com/checkout/preferences";

    const body = {
      payer_email: payer_mail,
      items: [
        {
          title: idPayment.message,//corresponde al id de la bd del payment
          quantity: 1,//siempre 1
          unit_price: unit_price//precio acordado
        }
      ],
      //rutas que actualizan el estado del pago
      back_urls: {
        failure: "https:///payment/failure",
        pending: "/payment/pending",
        success: `${this.path}/transaccion/success/?id_transaccion=${idPayment.id_transaccion}`
      },
      auto_return : "approved",
      payment_methods : {
        excluded_payment_types : 
          [
            {
              id : "ticket"
            }
          ],
        installments : 12
      }
    };
    const payment = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });

    return payment.data;
  }

  async createReembolso(idPayment) {
    const url = `https://api.mercadopago.com/v1/payments/${idPayment}/refunds`;
    const reembolso = await axios.post(url, {
      headers: {
        //"X-Idempotency-Key": 
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN_2}`
      }
    });
    return reembolso.data;
  }
}
module.exports = mercadoPagoHelper