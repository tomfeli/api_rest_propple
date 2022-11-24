const mailSender = require('../src/helpers/mailHelper/index.js');
mailSender.sendFile("fiszsontom@gmail.com","test","probando texto y path to s3","mail/images/userIcon.jpg").catch((error)=>{
    console.log(error)
});
