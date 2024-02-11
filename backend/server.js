// This is where we create the express and socket.io server.

// Native Node imports.
const fs = require('fs'); // File system module.
const https = require('https');
const http = require('http');

//Other imports
const express = require('express');
const socketio = require('socket.io');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://www.bendwidth.com'); // Allow only your front-end domain
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // Add other CORS headers as needed
    next();
  });
//...
app.use(express.static(__dirname + '/public'))

// Getting certifications
// const key = fs.readFileSync('./certs/cert.key');
// const cert = fs.readFileSync('./certs/cert.crt');

//... 
// const expressServer = https.createServer({ key, cert }, app);
const expressServer = http.createServer({}, app);
const io = socketio(expressServer, {
    cors: ['https://localhost:3000',
        'https://localhost:3001',
        'https://www.bendwidth.com'
    ]
})

//..
expressServer.listen(9000);

module.exports = {io, expressServer, app}