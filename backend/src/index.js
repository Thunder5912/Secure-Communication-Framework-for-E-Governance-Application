const fs = require('fs');
const https = require('https');
const express = require('express');
const routes = require('./routes');
const config = require('./config');


const app = express();
app.use(express.json());
app.use('/api', routes);


// HTTPS options - server key and cert issued by dev CA
const httpsOptions = {
key: fs.readFileSync(config.serverKeyPath),
cert: fs.readFileSync(config.serverCertPath),
ca: fs.readFileSync(config.caCertPath),
// Uncomment to request client certs for mTLS
requestCert: true,
rejectUnauthorized: false // in dev you may accept and check later
};


https.createServer(httpsOptions, app).listen(config.port, () => {
console.log(`Secure API listening on https://localhost:${config.port}`);
});
