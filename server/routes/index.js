const usersController = require('../controllers').users;
const checkedToken = require('../middleware/checkedToken');

module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Api'
    }));
    app.post('/api/users', usersController.create);
    app.post('/api/auth', usersController.auth);
    app.post('/api/token', usersController.token);

    app.get('/api/secure',checkedToken, (req, res) => {
        res.send('i am secret');
    });
}