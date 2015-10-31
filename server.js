var express = require('express');
var app = express();

//middlewares
app.use(express.static('public'));

//endpoints
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/potions/list', function (req, res) {
    res.sendFile(__dirname + '/potions.html');
});
app.get('/potions/new', function (req, res) {
    res.sendFile(__dirname + '/newpotion.html');
});
app.get('/potions/all', function (req, res) {
    res.sendFile(__dirname + '/allpotions.html');
});
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});
app.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/signup.html');
});

var port = process.env.PORT || 3000;
app.listen(port);