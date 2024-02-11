
const app = require('./server').app
const allConnectedRespondents = require('./socketServer.js')

app.get('/test', (req, res) => {
    const data = {
        "success": true,
        "data": "This is a test route"
    }
    res.json(data);
})

app.post('/respondentConnected', (req, res)=> {
    console.log(req.body)
   res.json({message: req.body})
})