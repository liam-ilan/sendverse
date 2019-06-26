const path = require('path');

module.exports = {
  entry: {
    chatroom: './src/chatroom.js',
    homepage: './src/homepage.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/js/')
  },
  watch: true,
  watchOptions: {
    ignored: ['../app.js', 'node_modules']
  }
};