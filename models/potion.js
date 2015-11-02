module.exports = {
    identity: 'potion',
    connection: 'default',
    attributes: {
        name: {
            type: 'string',
            required: true,
            unique: true,
        },
        effect: {
            type: 'string',
            required: true,
        },
        ingredients: {
            type: 'string',
            required: true,
        },
        date: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        status: {
            type: 'string',
            enum: ['new', 'read', 'success', 'rejected', 'pending'],
            required: true,
        },
        username: {
            model: 'user',
            via: 'username'
        },
    }
}