const usersController = require('../controllers').users;

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Api'
    }));
    app.post('/api/users', usersController.create);
    app.post('/api/auth', usersController.auth);
}