// listen to the install event
self.addEventListener('install', event => console.log('SW installed', event));

const sendNotificationDoneMessage = (notification, action = 'clicked') =>
  self.clients.matchAll().then(clients => {
    // Send the event to the client(s)
    clients.forEach(client => {
      client.postMessage({
        type: 'notification-' + action,
        messageId: notification.tag,
      });
    });
  });

// listen to a notification click
self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const url = notification.data.url; // get the url passed from the app
  console.log(notification);

  // get all bowser tabs controlled by this SW
  const eventWaitUntilFullfilled = self.clients.matchAll().then(clients => {
    // open the application on the client
    // check if there is already a tab with the url that should be opened
    let windowToFocus = false;
    clients.forEach(windowClient => {
      if (windowClient.url === url) {
        windowClient.focus(); // focus if url match
        windowToFocus = windowClient;
      }
    });

    if (!windowToFocus) {
      // if no window already open, open a new
      self.clients
        .openWindow(url)
        .then(windowClient => (windowClient ? windowClient.focus() : null));
    }

    // close the notification
    notification.close();
    return sendNotificationDoneMessage(notification);
  });

  // waitUntil needs a promise as argument. If not, the client.focus() and self.clients.openWindow() will fail
  event.waitUntil(eventWaitUntilFullfilled);
});

// listen to the notification close
self.addEventListener('notificationclose', event =>
  event.waitUntil(sendNotificationDoneMessage(event.notification, 'closed'))
);
