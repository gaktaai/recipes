//Import modules
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var flash = require('connect-flash');

var Waterline = require('waterline');

var waterlineConfig = require('./config/waterline');
var potionCollection = require('./models/potion');
var userCollection = require('./models/user');

var indexController = require('./controllers/index');
var potionController = require('./controllers/potion');
var loginController = require('./controllers/login');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Local Strategy for sign-up
passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },   
    function(req, username, password, done) {
        req.app.models.user.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (user) {
                return done(null, false, { message: 'Létező username.' });
            }
            req.app.models.user.create(req.body)
            .then(function (user) {
                return done(null, user);
            })
            .catch(function (err) {
                return done(null, false, { message: err.details });
            })
        });
    }
));

passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },
    function(req, username, password, done) {
        req.app.models.user.findOne({ username: username }, function(err, user) {
            if (err) { return done(err); }
            if (!user || !user.validPassword(password)) {
                return done(null, false, { message: 'Helytelen adatok.' });
            }
            return done(null, user);
        });
    }
));


// Middleware segédfüggvények
function setLocalsForLayout() {
    return function (req, res, next) {
        res.locals.loggedIn = req.isAuthenticated();
        res.locals.user = req.user;
        next();
    }
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/login');
    }
}

function andRestrictTo(role) {
    console.log(role);
    return function(req, res, next) {
        if (req.user.role == role) {
            next();
        }
        else {
            res.redirect('/potions/list');
        }
    }
}

var app = express();

//config
app.set('views', './views');
app.set('view engine', 'hbs');

//middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(session({
    cookie: { maxAge: 600000 },
    secret: 'titkos szoveg',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(setLocalsForLayout());

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

//endpoints
app.use('/', indexController);
app.use('/potions', ensureAuthenticated, potionController);
app.get('/potions/all', andRestrictTo('advancedPotionMaster'), ensureAuthenticated, function(req, res) {
    req.app.models.potion.find().then(function (potions) {
        res.render('potions/all', {
            potions: decoratePotions(potions)
        });
    });
});
app.use('/login', loginController);

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

// ORM példány
var orm = new Waterline();
orm.loadCollection(Waterline.Collection.extend(potionCollection));
orm.loadCollection(Waterline.Collection.extend(userCollection));

// ORM indítása
orm.initialize(waterlineConfig, function(err, models) {
    if(err) throw err;
    
    app.models = models.collections;
    app.connections = models.connections;
    
    // Start Server
    var port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log('Server is started.');
    });
    
    console.log("ORM is started.");
});