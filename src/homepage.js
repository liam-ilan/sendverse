/*!
 * sendverse
 * Copyright(c) 2019 Liam Ilan
 * MIT Licensed
 */
 
const roomName = document.getElementById('room-name');
const enter = document.getElementById('enter');
const onlineCount = document.getElementById('online-count');

// request josn function
async function reqJson(url, method = 'GET', data = null) {
  // set fetch options
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  // add body if content exists
  if (data) {
    options.body = JSON.stringify(data);
  }

  // await the fetch from the url
  const res = await window.fetch(url, options);

  // await until the json promise is resolved
  const json = await res.json();
  return json;
}

async function putCount() {
  const countJSON = await reqJson('/data/count');
  onlineCount.innerHTML = `Online: ${countJSON.online}`;
}

enter.addEventListener('click', () => {
  window.location.href += encodeURIComponent(roomName.value);
});

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    window.location.href += encodeURIComponent(roomName.value);
  }
});

putCount();
