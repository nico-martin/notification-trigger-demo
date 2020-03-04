// listen to the install event
self.addEventListener('install', event => console.log('SW installed', event));

// listen to a notification click
self.addEventListener('notificationclick', event => {
  event.waitUntil(self.clients.matchAll().then(clients => {
    if (clients.length) { // check if at least one tab is already open
      clients[0].focus();
      clients[0].postMessage('Push notification clicked!');
    } else {
      self.clients.openWindow('/');
    }
  }));
});

// listen to the notification close
self.addEventListener('notificationclose', event => {
  event.waitUntil(self.clients.matchAll().then(clients => {
    if (clients.length) { // check if at least one tab is already open
      clients[0].postMessage('Push notification clicked!');
    }
  }));
});
