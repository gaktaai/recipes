// controllers/error.js
var express = require('express');
var router = express.Router();

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

router.get('/list', function (req, res) {
    req.app.models.potion.find().then(function (potions) {
        res.render('potions/list', {
            potions: decoratePotions(potions),
            messages: req.flash('info')
        });
    });
});

router.get('/new', function (req, res) {
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    
    res.render('potions/new', {
        validationErrors: validationErrors,
        data: data,
    });
});

router.post('/new', function (req, res) {
    req.checkBody('name', 'Error in field "name"').notEmpty().withMessage('Required');
    req.checkBody('effect', 'Error in field "effect"').notEmpty().withMessage('Required');
    req.sanitizeBody('ingredients').escape();
    req.checkBody('ingredients', 'Error in field "ingredients"').notEmpty().withMessage('Required, e.g.: Boomslang Skin, Bezoar, Unicorn Horn');
    
    var validationErrors = req.validationErrors(true);
    
    if (validationErrors) {
        req.flash('validationErrors', validationErrors);
        req.flash('data', req.body);
        res.redirect('/potions/new');
    }
    else {
        req.app.models.potion.create({
            name: req.body.name,
            effect: req.body.effect,
            ingredients: req.body.ingredients,
            date: (new Date()).toLocaleString(),
            status: 'new',
            user: req.user,
        })
        .then(function (error) {
            req.flash('info', 'Recipe added successfully!');
            res.redirect('/potions/list');
        })
        .catch(function (err) {
            console.log(err);
        });
    }
});

router.get('/all/edit/:id', function(req, res) {
    var id = req.params.id;
    var validationErrors = (req.flash('validationErrors') || [{}]).pop();
    var data = (req.flash('data') || [{}]).pop();
    /*
    req.app.models.potion.findOne({ id: id}).then(function (potions) {
        res.render('potions/new', {
            potion: potions,
            validationErrors: validationErrors,
            data: data,
        }); 
    });
    */
});

router.get('/all/delete/:id', function(req, res) {
    var id = req.params.id;

    req.app.models.potion.destroy({ id: id}).then(function (potions) {
        res.render('potions/all', {
            potions: decoratePotions(potions),
            messages: req.flash('info')
        });
    });
});

module.exports = router;