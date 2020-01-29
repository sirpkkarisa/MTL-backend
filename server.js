const http = require('http');
const app = require('./app');

app.set('port', process.env.PORT || 7001);
const server = http.createServer(app);
const PORT = process.env.PORT || 7001;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
