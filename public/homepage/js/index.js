const roomName = document.getElementById('room-name');
const enter = document.getElementById('enter');

enter.addEventListener('click', () => {
  window.location.href += encodeURIComponent(roomName.value);
});
