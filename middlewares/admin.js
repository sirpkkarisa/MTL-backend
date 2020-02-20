const socketio = require('socket.io');
const server = require('../server');

const io = socketio(server);
io.on('connection', (socket) => {
    console.log('socket connected');
    socket.on('admin', (data) => {
        console.log('hello');
    })
});
exports.admin = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = new Buffer.from(token, 'base64').toString().split(':');
        const username = decodedToken[0];
        const password = decodedToken[1];
        if (password !== process.env.PASSWORD || username !== process.env.USERS) {
        res.status(401)
            .json({
            error: 'Unauthorized',
            });
        } else {
        next();
        }
    } catch (error) {
        res.status(401)
        .json({
            status: 'error',
            error: `${error}`,
        })
    }
}