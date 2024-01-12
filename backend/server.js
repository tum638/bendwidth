// This is where we create the express and socket.io server.

// Native Node imports.
const fs = require('fs'); // File system module.
const https = require('https');

//Other imports
const express = require('express');
const socketio = require('socket.io');
const app = express();

//...
app.use(express.static(__dirname + '/public'))

// Getting certifications
const key = fs.readFileSync('./certs/cert.key');
const cert = fs.readFileSync('./certs/cert.crt');

//... 
const expressServer = https.createServer({ key, cert }, app);
const io = socketio(expressServer, {
    cors: ['https://localhost:3000', 'https://localhost:3001']
})

//..
expressServer.listen(9000);

module.exports = {io, expressServer, app}