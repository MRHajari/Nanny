const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const { port } = require('./config');

app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
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
        console.log('Eroor: ' + err);
    } else {
        console.log("Server is listening at port " + port);
    }
})