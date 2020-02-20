const http = require('http');
const app = require('./app');
const socketio = require('socket.io');

app.set('port', process.env.PORT || 7002);
const server = http.createServer(app);
const PORT = process.env.PORT || 7002;

const io = socketio(server);
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
io.of('/auth/create-user')
  .on('connection', (socket) => {
    socket.on('admin', (data) => {
      if (data.username !== process.env.USERS || data.password !== process.env.PASSWORD) {
        socket.emit('notadmin', {msg: 'Unauthorized'});
        return;
      }
      socket.emit('isadmin', {msg: 'Admin'});
    })
    // socket.on('disconnect', () => console.log('left'))
  })
module.exports = server;