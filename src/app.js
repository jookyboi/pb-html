const express = require('express');
const bodyParser = require('body-parser');
const bot = require('./bot');

const app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Allow cross-domain requests
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/', function (req, res, next) {
    const postData = {input: req.body.input};

    if (req.body.clientName) {
        postData.client_name = req.body.clientName;
        bot.talk(postData, botResponseHandler);
    } else {
        bot.atalk(postData, botResponseHandler);
    }

    function botResponseHandler(err, botResponse) {
        if (err) {
            return next(err);
        }
        const resp = {text: botResponse.responses.join(' ')};
        if (botResponse.client_name) {
            resp.clientName = botResponse.client_name;
        }
        res.send(resp);
    }
});

module.exports = app;
