
const app = require('./server').app

app.get('/test', (req, res) => {
    const data = {
        "success": true,
        "data": "This is a test route"
    }
    res.json(data);
})