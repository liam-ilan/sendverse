/* global io v */
const socket = io.connect(window.location.href.toLowerCase());

const share = document.getElementById('share');
const input = document.getElementById('input');
const sendButton = document.getElementById('send-button');
const history = document.getElementById('history');

// color of your messages. Each participant has their color chosen at random.
const ourColor = `#${Math.floor(Math.random() * 4095).toString(16).padStart(3, '0')}`;

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
  const bubble = document.createElement('div');
  bubble.className = `bubble ${myBubble ? 'my-bubble' : ''}`;
  bubble.innerHTML = v.escapeHtml(v.unescapeHtml(message));
  bubble.style.backgroundColor = color;
  bubble.style.color = fontColor(color);

  history.appendChild(bubble);

  // scroll down to keep recent messages in view
  history.scrollTop = history.scrollHeight;
}

// post a message
function postMessage() {
  const data = { message: input.innerText, color: ourColor };

  if (data.message !== '') {
    addBubble(data.color, input.innerText, true);

    // emit the message
    socket.emit('message', data);
    input.innerText = '';
  }
}

// when you click the sendbutton, post the message
sendButton.addEventListener('click', postMessage);

// remove styling from copy paste
input.addEventListener('paste', (e) => {
  // cancel paste
  e.preventDefault();

  // get text representation of clipboard
  const text = (e.originalEvent || e).clipboardData.getData('text/plain');

  // insert text manually
  document.execCommand('insertHTML', false, text);
});

// prevent enter from adding a line break in input so that Enter sends message.
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    postMessage(e);
  }
});

// Copy Link functionality.
share.addEventListener('click', () => {
  const element = document.createElement('textarea'); // set temp element.
  element.contentEditable = 'true';
  element.readOnly = 'false';
  element.innerHTML = window.location.href; // this is what we want copied.
  document.body.appendChild(element);

  if (!!navigator.platform.match(/iPhone|iPod|iPad/)) {
    const range = document.createRange();
    range.selectNodeContents(element);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    element.setSelectionRange(0, 999999);
  } else {
    element.select();
  }

  document.execCommand('copy');
  document.body.removeChild(element); // cleanup.

  // button UI
  share.innerHTML = 'Copied';
  window.setTimeout(() => { share.innerHTML = 'Copy Link'; }, 1000);
});

// Listen to server events.
socket.on('message', (data) => {
  addBubble(data.color, data.message);
});
