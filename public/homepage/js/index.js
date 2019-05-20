const roomName = document.getElementById('room-name');
const enter = document.getElementById('enter');

enter.addEventListener('click', () => {
  window.location.href += encodeURIComponent(roomName.value);
});

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    window.location.href += encodeURIComponent(roomName.value);
  }
});
