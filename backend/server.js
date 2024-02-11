// This is where we create the express and socket.io server.

// Native Node imports.
const fs = require('fs'); // File system module.
const https = require('https');
const http = require('http');

//Other imports
const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const app = express();

// Setup CORS
const corsOptions = {
    origin: 'https://www.bendwidth.com', // Allow only your front-end domain
    optionsSuccessStatus: 200 // For legacy browser support
  };

app.use(cors(corsOptions));

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