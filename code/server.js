const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const { port } = require('./config');

app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: ['http://192.168.0.5:3000', 'http://localhost:3000', '*', 'http://192.168.0.13:3000', 'http://192.168.0.10:3000']
}))

app.use(express.json());


const routes = require('./server/routes/router');
app.use('/api', routes);


app.use(bodyParser.json());

app.get('/', async(req, res) => {
    res.send(`<h1>Hello, this is only a simple server :-) </h1>`)
})


app.listen(port, (err) => {
    if (err) {
        console.log('Error: ' + err);
    } else {
        console.log("Server is listening at port " + port);
    }
})