/* global io */

// connect the socket
const socket = io.connect(window.location.href);

// get elements
const input = document.getElementById('input');
const sendButton = document.getElementById('send-button');
const history = document.getElementById('history');

// prevent enter from adding a line break
document.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); } });

// add a bubble
function addBubble(type, message) {
  // create a bubble
  const bubble = document.createElement('BUTTON');
  bubble.className = `bubble ${type}`;
  bubble.innerHTML = message;

  // add the bubble
  history.appendChild(bubble);

  // scroll down
  history.scrollTop = history.scrollHeight;
}

// post a message
function postMessage() {
  // get the data
  const data = { message: input.innerHTML };
  if (data.message !== '') {
    // add the bubble
    addBubble('my-bubble', data.message);

    // emit the message
    socket.emit('message', data);
    input.innerHTML = '';
  }
}

socket.on('message', (data) => {
  addBubble('external-bubble', data.message);
});

// when you click the sendbutton, post the message
sendButton.addEventListener('click', postMessage);

// when you press enter, post the message
input.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') { postMessage(e); }
});
