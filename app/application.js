const $button = document.querySelector('#notification-button');
const $cancelButton = document.querySelector('#notification-cancel');
const $error = document.querySelector('#error');

try {
  if (!('serviceWorker' in navigator) || !('showTrigger' in Notification.prototype)) {
    throw 'ServiceWorker or Notification Trigger API is not supported'
  }

  function pad(num, size = 2) {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
  }

  // register the ServiceWorker
  navigator.serviceWorker.register('service-worker.js');

  // schedule notification
  $button.onclick = async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        alert('you need to allow push notifications');
      } else {
        const timestamp = new Date().getTime() + 10 * 1000;
        const scheduledTime = new Date(timestamp);
        reg.showNotification(
          'Scheduled Push Notification',
          {
            tag: timestamp, // a unique ID
            body: 'Hi there, it\'s ' + pad(scheduledTime.getHours()) + ':' + pad(scheduledTime.getMinutes()), // content of the push notification
            showTrigger: new TimestampTrigger(timestamp), // set the time for the push notification
            data: {
              url: window.location.href, // pass the current url to the notification
            },
            badge: './assets/badge.png',
            icon: './assets/icon.png',
          }
        );
        $button.setAttribute('disabled', 'disabled');
      }
    });
  };

  // cancel notifications
  $cancelButton.onclick = async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    const notifications = await reg.getNotifications({
      includeTriggered: true
    });
    notifications.forEach(notification => notification.close());
    alert(`${notifications.length} notification(s) cancelled`);
  };

  // listen to the postMessage Event
  navigator.serviceWorker.addEventListener('message', event => console.log(event.data));

} catch (e) {
  $button.style.display = 'none';
  $error.style.display = 'block';
  $error.innerHTML = e;
}
