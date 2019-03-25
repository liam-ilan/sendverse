/* global io */

// connect the socket
const socket = io.connect(window.location.href);

// get elements
const input = document.getElementById('input');
const sendButton = document.getElementById('send-button');
const history = document.getElementById('history');

// our color
const ourColor = `#${Math.floor(Math.random() * 4095).toString(16)}`;

// prevent enter from adding a line break
document.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); } });

// calculate the color the font should be depending on a background color
// for a hex with a length of 4
function fontColor(color) {
  const r = parseInt(color.charAt(1), 16);
  const g = parseInt(color.charAt(2), 16);
  const b = parseInt(color.charAt(3), 16);
  return Math.max(r, g, b) > 10 ? 'black' : 'white';
}

// add a bubble
function addBubble(color, message) {
  // create a bubble
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = message;
  bubble.style.backgroundColor = color;
  bubble.style.color = fontColor(ourColor);

  // add the bubble
  history.appendChild(bubble);

  // scroll down
  history.scrollTop = history.scrollHeight;
}

// post a message
function postMessage() {
  // get the data
  const data = { message: input.innerHTML, color: ourColor };
  if (data.message !== '') {
    // add the bubble
    addBubble(data.color, data.message);

    // emit the message
    socket.emit('message', data);
    input.innerHTML = '';
  }
}

// on every message
socket.on('message', (data) => {
  addBubble(data.color, data.message);
});

// when you click the sendbutton, post the message
sendButton.addEventListener('click', postMessage);

// when you press enter, post the message
input.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') { postMessage(e); }
});
