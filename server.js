var express = require('express');
var app = express();

//config
app.set('views', './views');
app.set('view engine', 'hbs');

//middlewares
app.use(express.static('public'));

//endpoints
app.get('/', function (req, res) {
    res.render('index');
});
app.get('/potions/list', function (req, res) {
    res.render('potions/list');
});
app.get('/potions/new', function (req, res) {
    res.render('potions/new');
});
app.get('/potions/all', function (req, res) {
    res.render('potions/all');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/signup', function (req, res) {
    res.render('signup');
});

var port = process.env.PORT || 3000;
app.listen(port);