
// require packages
const express = require('express');
let io = require('socket.io');
const voca = require('voca');

// current count of online people
let currentCount = 0

// get our port
const port = process.env.PORT || 3000;

// make an app
const app = express({ static: true });
app.use('/', express.static('public'));

// redirect trailing slash
app.use((req, res, next) => {
  if (req.url.substr(-1) === '/' && (req.url.split('/').length - 1 > 1)) res.redirect(301, req.url.slice(0, -1));
  else next();
});

// the list of active namespaces
const namespaces = [];

// on a connection function
function connection(socket) {
  // add to count
  currentCount += 1

  // when the client diconnects
  socket.on('disconnect', () => {

    // remove 1 from count
    if(currentCount !== 0){
      currentCount -= 1
    }

  });

  // on every message sent from THIS socket
  socket.on('message', (data) => {

    // set up data
    const newData = {
      message: voca.escapeHtml(data.message),
      color: data.color,
    };

    // validate
    if (newData.color.charAt(0) !== '#') { return { status: 'error' }; }
    if (newData.color.length !== 4) { return { status: 'error' }; }
    if (Number.isNaN(parseInt(newData.color.substring(1), 16))) { return { status: 'error' }; }

    // emit the message to everyone but the client
    socket.broadcast.emit('message', newData);

    return { status: 'success' };
  });
}

// namespace paths
app.get('/:namespace', (req, res) => {
  // get the namespace
  let { namespace } = req.params;

  // lowercase
  namespace = namespace.toLowerCase();

  // if the namespace is not in the list, add it
  if (namespaces.indexOf(namespace) === -1) {
    namespaces.push(namespace);
    io.of(`/${namespace}`).on('connection', connection);
  }

  // serve
  res.sendFile(`${__dirname}/public/chatroom/index.html`);
});

// main path
app.get('/', (req, res) => {

  // serve
  res.sendFile(`${__dirname}/public/homepage/index.html`);
});

// get count
app.get('/data/count', (req, res) => {
  res.json({online: currentCount})
})

// listen on the port
const server = app.listen(port);

// setup sockets
io = io(server);
