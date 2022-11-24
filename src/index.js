const express = require("express");
const app = express();
const config= require("./config.js");
const userRouter = require('./routes/UserClient');
const logIn = require('./routes/logIn');
const SignUp = require('./routes/signUp');
const transaccion = require('./routes/Transaction');
const publication = require('./routes/Publication');
const admin = require('./routes/admin');
const denuncia = require('./routes/denuncia');
require('dotenv').config()
const cors = require('cors');
app.use(cors());
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({extended : true}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//siscroniozar con la base
require('./services/db');
//rutas
app.use("/transaccion",transaccion);
app.use(SignUp);
app.use(logIn);
app.use(denuncia);
app.use("/user", userRouter);
app.use("/publication",publication)
app.use("/admin", admin);
/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});
app.get("/",(req,res)=>{
    //console.log(app._router.stack);
    res.json("entre");
});
app.listen(config.PORT, ()=>{
    console.log(`Example app listening at ${config.PATH_BACK_END}`);
});
