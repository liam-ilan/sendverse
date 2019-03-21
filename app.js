// require packages
const express = require('express');
const Mongo = require('mongodb');
let io = require('socket.io');

require('dotenv').config();

// set up mongodb
const { MongoClient } = Mongo;
const mongoURI = process.env.MONGODB_URI;
const mongoOptions = { useNewUrlParser: true };

// get our port
const port = process.env.PORT || 3000;

// make an app
const app = express();
app.use(express.static('public'));

// connect to the db
let db = MongoClient.connect(mongoURI, mongoOptions, (err, client) => {
  // set up the client
  if (err) return { fail: 'database error' };
  const dbName = mongoURI.substr(mongoURI.lastIndexOf('/') + 1);
  db = client.db(dbName);

  // listen on the port
  const server = app.listen(port);

  // setup sockets
  io = io(server);

  // on a connection function
  function connection(socket) {
    // find the last 100 messages sent
    db.collection('history').find().sort({ $natural: -1 }).limit(100)
      .sort({ $natural: 1 })
      .toArray()
      .then((res) => {
      // send them to the client
        socket.emit('history', res);

        // when the client diconnects
        socket.on('disconnect', () => ({ status: 'left' }));

        // on every message sent from THIS socket
        socket.on('message', (data) => {
        // add the message to the database
          db.collection('history').insertOne(data, (error) => {
            // if there is an error
            if (error) return socket.emit({ fail: 'database error' });

            // emit the message to everyone but the client
            socket.broadcast.emit('message', data);

            return { status: 'success' };
          });
        });
      });
  }

  // connection event
  io.sockets.on('connection', connection);

  // return something (to make eslint happy)
  return { status: 'success' };
});
