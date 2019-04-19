
// require packages
const express = require('express');
let io = require('socket.io');
const escapeHTML = require('escape-html');

// get our port
const port = process.env.PORT || 3000;

// make an app
const app = express();
app.use('/', express.static('public'));

// the list of active namespaces
let namespaces = []

function namespaceConnection(req, res){
  //get the namespace
  let namespace = req.params.namespace

  // if the namespace is not in the list, add it
  if (namespaces.indexOf(namespace) === -1){
    namespaces.push(namespace)
    io.of(`/${namespace}`).on('connection', connection)
  }

  // serve
  res.sendFile(__dirname + '/public/index.html');
}
// namespace paths
app.get('/:namespace', namespaceConnection)

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
    const newData = {
      message: escapeHTML(data.message),
      color: data.color,
    };

    if (newData.color.charAt(0) !== '#') { return { status: 'error' }; }
    if (newData.color.length !== 4) { return { status: 'error' }; }
    if (Number.isNaN(parseInt(newData.color.substring(1), 16))) { return { status: 'error' }; }

    // emit the message to everyone but the client
    socket.broadcast.emit('message', newData);

    return { status: 'success' };
  });
}

io.of(`/`).on('connection', connection)
// connection event
//io.of('/').on('connection', connection);
