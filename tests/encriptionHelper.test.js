const encriptionHelper = require("../src/helpers/encriptionHelper.js")
const myEncriptionHelper = new encriptionHelper();

test(`test de encripcion con texto valido y confirmacion okey`, 
async ()=>{
    let pass = "1234";
    let hash = await myEncriptionHelper.generateHash(pass);
    let result = await myEncriptionHelper.compare(pass, hash);
    expect(result).toBe(true);
})

test(`test de encripcion con texto valido y confirmacion erronea`, 
async ()=>{
    let pass = "1234";
    let hash = await myEncriptionHelper.generateHash(pass);
    let result = await myEncriptionHelper.compare("1236", hash);
    expect(result).toBe(false);
})