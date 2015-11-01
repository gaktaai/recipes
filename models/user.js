var bcrypt = require('bcryptjs');
module.exports = {
    identity: 'user',
    connection: 'default',
    attributes: {
        username: {
            type: 'string',
            required: true,
            unique: true,
        },
        email: {
            type: 'string',
            required: true,
            unique: true,
        },
        password: {
            type: 'string',
            required: true,
        },
        role: {
            type: 'string',
            enum: ['potionMaster', 'advancedPotionMaster'],
            required: true,
            defaultsTo: 'potionMaster'
        },
        
        potions: {
            collection: 'potion',
            via: 'username'
        },
        validPassword: function (password) {
            return bcrypt.compareSync(password, this.password);
        }
    },
    
    beforeCreate: function(values, next) {
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) {
                return next(err);
            }
            values.password = hash;
            next();
        });
    }
};