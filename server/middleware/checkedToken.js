const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, CONFIG.jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(401).json({error: true, type: err.name, messages: err.message});
            }
            req.decoded = decoded;
            next();
        })
    } else {
        return res.status(403).send({
            error: true,
            messages: 'Access denied'
        })
    }
}