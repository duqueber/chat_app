var express = require('express');
var bodyParser = require('body-parser');
var middleware = require ('./middleware');
var cors = require ('cors');


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
const PORT = 5020;

app.get('/api/v1/user', middleware.handleGetUser);

app.listen(PORT, function() {
    console.log('Server started on port: ' + PORT);
});
