/* global io v */

// connect the socket
const socket = io.connect(window.location.href);

// get elements
const input = document.getElementById('input');
const sendButton = document.getElementById('send-button');
const history = document.getElementById('history');

// our color
const ourColor = `#${Math.floor(Math.random() * 4095).toString(16).padStart(3, '0')}`;

// prevent enter from adding a line break
document.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); } });

// remove styling from copy paste
input.addEventListener('paste', (e) => {
  // cancel paste
  e.preventDefault();

  // get text representation of clipboard
  const text = (e.originalEvent || e).clipboardData.getData('text/plain');

  // insert text manually
  document.execCommand('insertHTML', false, text);
});

// calculate the color the font should be depending on a background color
// for a hex with a length of 4
function fontColor(color) {
  const r = parseInt(color.charAt(1), 16);
  const g = parseInt(color.charAt(2), 16);
  const b = parseInt(color.charAt(3), 16);
  return Math.max(r, g, b) > 10 ? 'black' : 'white';
}

// add a bubble
function addBubble(color, message, myBubble = false) {
  // create a bubble
  const bubble = document.createElement('div');
  bubble.className = `bubble ${myBubble ? 'my-bubble' : ''}`;
  bubble.innerHTML = v.escapeHtml(v.unescapeHtml(message));
  bubble.style.backgroundColor = color;
  bubble.style.color = fontColor(color);

  // add the bubble
  history.appendChild(bubble);

  // scroll down
  history.scrollTop = history.scrollHeight;
}

// post a message
function postMessage() {
  // get the data
  const data = { message: input.innerText, color: ourColor };
  if (data.message !== '') {
    // add the bubble
    addBubble(data.color, input.innerText, true);

    // emit the message
    socket.emit('message', data);
    input.innerText = '';
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
