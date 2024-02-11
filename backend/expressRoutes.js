
const app = require('./server').app
const allConnectedRespondents = require('./socketServer.js')
const cors = require('cors');
app.use(cors({
    origin: 'https://www.bendwidth.com' // This should match the domain of your frontend app
}))
app.get('/test', (req, res) => {
    const data = {
        "success": true,
        "data": "This is a test route"
    }
    res.json(data);
})

app.get('/check-respondent', (req, res) => {
    const uuid = req.url.slice(24);
    const respondent = allConnectedRespondents[uuid]
    if (respondent) {
        res.json({joined: true, name: respondent.userName})
    } else {
        res.json({joined: false});
    }   
})