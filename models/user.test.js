//npm test

var expect = require("chai").expect;

var Waterline = require('waterline');
var waterlineConfig = require('../config/waterline');
var userCollection = require('./user');
var errorCollection = require('./potion');
var bcrypt = require('bcryptjs');


var User;

before(function (done) {
    // ORM indítása
    var orm = new Waterline();

    orm.loadCollection(Waterline.Collection.extend(userCollection));
    orm.loadCollection(Waterline.Collection.extend(errorCollection));
    waterlineConfig.connections.default.adapter = 'memory';

    orm.initialize(waterlineConfig, function(err, models) {
        if(err) throw err;
        User = models.collections.user;
        done();
    });
});

describe('UserModel', function () {
    function getUserData() {
        return {
            username: 'hl',
            email: 'hl@hl.com',
            password: 'hl',
            role: 'potionMaster'
        };
    }

    beforeEach(function (done) {
        User.destroy({}, function (err) {
            done();
        });
    });
    
    it('should be able to create a user', function () {
        return User.create({
            username: 'hl',
            email: 'hl@hl.com',
            password: 'hl',
            role: 'potionMaster'
        })
        .then(function (user) {
            expect(user.username).to.equal('h1');
            expect(user.email).to.equal('hl@hl.com');
            expect(bcrypt.compareSync('h1', user.password)).to.be.true;
            expect(user.role).to.equal('potionMaster');
        });
    });
    
    it('should be able to find a user', function() {
        return User.create(getUserData())
        .then(function(user) {
            return User.findOneByUsername(user.username);
        })
        .then(function (user) {
            expect(user.username).to.equal('h1');
            expect(user.email).to.equal('hl@hl.com');
            expect(bcrypt.compareSync('h1', user.password)).to.be.true;
            expect(user.role).to.equal('potionMaster');
        });
    });
    it('should be able to update a user', function() {
        var role = 'advancedPotionMaster';
        
        return User.create(getUserData())
        .then(function(user) {
            var id = user.id;
            return User.update(id, { role: role });
        })
        .then(function (userArray) {
            var user = userArray.shift();
            expect(user.username).to.equal('h1');
            expect(user.email).to.equal('hl@hl.com');
            expect(bcrypt.compareSync('h1', user.password)).to.be.true;
            expect(user.role).to.equal('advancedPotionMaster');
        });
    });
});