// require packages
const express = require('express')
const Mongo = require('mongodb')
let io;
require('dotenv').config()

// set up mongodb
const MongoClient = Mongo.MongoClient
const mongoURI = process.env.MONGODB_URI
const mongoOptions = { useNewUrlParser: true }

// get our port
const port = process.env.PORT || 3000

// make an app
const app = express();
app.use(express.static('public'));

// connect to the db
let db = MongoClient.connect(mongoURI, mongoOptions, (err, client) => {

  // set up the client
  if (err) return console.log({ fail: 'database error' })
  const dbName = mongoURI.substr(mongoURI.lastIndexOf('/') + 1)
  db = client.db(dbName)

  // listen on the port
  const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

  // socket.io
  io = require('socket.io')(server)

  // connection event
  io.sockets.on('connection', connection);
})

// on a connection
function connection(socket){
  console.log('new user')
  socket.on('disconnect', function(){
    console.log('user exited')
  })
}

