const jwtHelper =require('../src/helpers/jwtHelper.js').jwtHelper;
const config = require('../src/config.js'); 
const myJwtCli = new jwtHelper(config.claveJWTCli);
const myJwtVend = new jwtHelper(config.claveJWTVend);

test(`Test jwt token client`, ()=>{
    let ejemplo = {
        hola : "hola",
        nombre : "tom",
        edad : 4
    }
    let myToken = myJwtCli.sign(ejemplo);
    let response = myJwtCli.verify(myToken.token);
    expect(response.authData.edad).toBe(4);
    expect(response.authData.hola).toBe("hola");
    expect(response.authData.nombre).toBe("tom");
})
test(`Test jwt token solder`, ()=>{
    let ejemplo = {
        hola : "hola",
        nombre : "tom",
        edad : 4
    }
    let myToken = myJwtVend.sign(ejemplo);
    let response = myJwtVend.verify(myToken.token);
    expect(response.authData.edad).toBe(4);
    expect(response.authData.hola).toBe("hola");
    expect(response.authData.nombre).toBe("tom");
})
test(`Test jwt token client with owner solder`, ()=>{
    let ejemplo = {
        hola : "hola",
        nombre : "tom",
        edad : 4
    }
    let myToken = myJwtCli.sign(ejemplo);
    try{
    let response = myJwtVend.verify(myToken.token);
    }
    catch(e){
        expect(e.message).toBe("Autorizacion denegada")
    }
})