//Import modules
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');
var app = express();

//Model layer
var potionContainer = [];

//Viewmodel réteg
var statusTexts = {
    'new': 'New',
    'read': 'Read',
    'accepted': 'Accepted',
    'dropped': 'Dropped',
    'pending': 'Pending',
};
var statusClasses = {
    'new': 'primary',
    'read': 'info',
    'accepted': 'success',
    'dropped': 'dager',
    'pending': 'warning',
};

function decoratePotions(potionContainer) {
    return potionContainer.map(function (e) {
        e.statusText = statusTexts[e.status];
        e.statusClass = statusClasses[e.status];
        return e;
    });
}

//config
app.set('views', './views');
app.set('view engine', 'hbs');

//middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

//endpoints
app.get('/', function (req, res) {
    res.render('index');
});
app.get('/potions/list', function (req, res) {
    res.render('potions/list', {
        errors: decoratePotions(potionContainer),
        messages: req.flash('info')
    });
});
app.get('/potions/new', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('potions/new', {
        validationErrors: validationErrors,
        data: data,
    });
});
app.post('/potions/new', function (req, res) {
    req.checkBody('name', 'Error in field "name"').notEmpty().withMessage('Required');
    req.checkBody('effect', 'Error in field "effect"').notEmpty().withMessage('Required');
    req.sanitizeBody('ingredients').escape();
    req.checkBody('ingredients', 'Error in field "ingredients"').notEmpty().withMessage('Required, e.g.: Boomslang Skin, Bezoar, Unicorn Horn');
    
    var validationErrors = req.validationErrors(true);
    console.log(validationErrors);
    
    if (validationErrors) {
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/potions/new');
    }
    else {
        potionContainer.push({
            name: req.body.name,
            effect: req.body.effect,
            ingredients: req.body.ingredients,
            date: (new Date()).toLocaleString(),
            status: 'new'
        });
        req.flash('info', 'Recipe added successfully!');
        res.redirect('/potions/list');
    }
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