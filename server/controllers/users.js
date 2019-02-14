const User = require('../models').Users;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config.js');

module.exports = {
    create(req, res) {
        if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('password')) {
           return res.status(400).send({message: 'no Password or Email'})
        } else {
            const salt = bcrypt.genSaltSync(10);
            const password = bcrypt.hashSync(req.body.password, salt);
            return User.create({
                email: req.body.email,
                password: password,
            })
                .then(user => res.status(201).send(user))
                .catch(error => res.status(400).send(error));
        }
    },
    auth(req, res) {
        if (!req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('password')) {
            return res.status(400).send({message: 'no Password or Email'})
        }
        return User.findOne({
            where: {email: req.body.email}
        }).then((user) => {
            const {email, id} = user;
            const passwordResult = bcrypt.compareSync(req.body.password, user.password);

            if (passwordResult) {
                const userInfo = {
                    email,id
                };

                const token = jwt.sign(userInfo, CONFIG.jwtSecret, {expiresIn: CONFIG.jwtTokenLife});
                const refreshToken = jwt.sign(userInfo, CONFIG.jwtSecret, {expiresIn: CONFIG.jwtRefreshTokenLife});
                const response = {
                    token, refreshToken
                }
                res.status(200).send(response);
            } else {
                res.status(400).send('Логин или пароль не верны');
            }

        })
            .catch(error => res.status(400).send({messages: error || 'error'}));
    },
    token (req, res) {
        const refreshToken = req.body.refreshToken;
        if (refreshToken) {
            jwt.verify(refreshToken, CONFIG.jwtSecret, (err, decoded) => {
                if (err) {
                    return res.status(401).json({error: true, type: err.name, messages: err.message});
                } else {

                    return res.status(200).json({message: 'New Token and RefreshToken'});
                }
            });
        } else {
            res.status(401).send( {message: 'No refresh token'});
        }
    }
}