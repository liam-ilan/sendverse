// require packages
const express = require('express');
let io = require('socket.io');

// get our port
const port = process.env.PORT || 3000;

// make an app
const app = express();
app.use(express.static('public'));

// listen on the port
const server = app.listen(port);

// setup sockets
io = io(server);

// on a connection function
function connection(socket) {

  // when the client diconnects
  socket.on('disconnect', () => ({ status: 'left' }));

  // on every message sent from THIS socket
  socket.on('message', (data) => {
    // emit the message to everyone but the client
    socket.broadcast.emit('message', data);

    return { status: 'success' };
  });
}

// connection event
io.sockets.on('connection', connection);

