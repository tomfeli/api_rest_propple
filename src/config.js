require('dotenv').config();
const connection = {
    host: 'db-propple-main.cqjdkpwcrocd.us-east-1.rds.amazonaws.com',
    port:'3306',
    user: 'master',
    password:'master123',
    database:'ProppleTest'
};
const mailConfig={
    service:'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
    tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
    },
}; 
const listPerPage = 3;
const claveJWTCli ="comoCliMeManejoPendejo(?)";
const claveJWTVend = "comoVendMeMaoPindijo(?)";
const claveJWTAdmin = "developerCredentialAdnmin";
const PATH_FOR_REPORTS = "https://propple-bucket.s3.amazonaws.com";//path to s3 with read permission
const PORT = process.env.PORT || 5000;
const PATH_BACK_END = process.env.URL || `http://localhost:${ PORT }`;
const bodyConfirmacionMail =(name,link)=>{ return (`<p>Bienvenido a Propple ${name}. </p></br>`+
` <p>Este mail contiene un link para la coinfirmacion de su mail. <p></br>`+
`<link>${link}</link>`)};
module.exports = {
    PORT,
    connection,
    listPerPage,
    claveJWTCli,
    claveJWTVend,
    claveJWTAdmin,
    mailConfig,
    PATH_FOR_REPORTS,
    PATH_BACK_END,
    bodyConfirmacionMail
}