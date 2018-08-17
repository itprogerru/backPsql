const User = require('../models').Users;
const bcrypt = require('bcryptjs');
module.exports = {
    create(req, res) {
        const salt = bcrypt.genSaltSync(10);
        const password = bcrypt.hashSync(req.body.password, salt);
        return User.create({
            email: req.body.email,
            password: password,
        })
            .then(user => res.status(201).send(user))
            .catch(error => res.status(400).send(error));
    }
}