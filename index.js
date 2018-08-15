const http = require('http');
const app = require('./app');

const port = parseInt(process.env.PORT, 10) || 5500;

app.set('port', port);

const server = http.createServer(app);
server.listen(port);

/*const app = require('./app');
const port = process.env.PORT || 5000;


app.listen(port,() => console.log(`server has been started ${port}`)); */