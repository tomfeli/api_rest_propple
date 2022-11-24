const jwt =require('jsonwebtoken');
class jwtHelper{
    constructor(secretKey){
        this.secret = secretKey;
    }
    sign(payload){
        const token = jwt.sign(payload,this.secret)
        return {token};
    }
    verify(token){
        return jwt.verify(token,this.secret,(error,authData)=>{
            if(error) throw new Error("Autorizacion denegada");
            return {authData};
        });
    }
}
module.exports={
    jwtHelper
}