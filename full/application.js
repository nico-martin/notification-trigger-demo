const $button = document.querySelector('#notification-button');
const $featureDetection = document.querySelector('#feature-detection');

if (!('serviceWorker' in navigator) || !('showTrigger' in Notification.prototype)) {
  $button.style.display = 'none';
  $featureDetection.style.display = 'block';
} else {

  // register the ServiceWorker
  navigator.serviceWorker.register('service-worker.js');

  // listen to the message event.
  navigator.serviceWorker.addEventListener('message', async event => {
    if (event.data?.type === 'notification-clicked' || event.data?.type === 'notification-closed') {
      console.log(
        event.data?.type === 'notification-clicked'
          ? 'Notification "Demo Push Notification" clicked.'
          : 'Notification "Demo Push Notification" closed.'
      );
    }
  });

  // c
  $button.onclick = async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        alert('you need to allow push notifications');
      } else {
        const timestamp = new Date().getTime() + 10 * 1000;
        reg.showNotification(
          'Demo Push Notification',
          {
            tag: timestamp, // a unique ID
            body: 'Hello World', // content of the push notification
            showTrigger: new TimestampTrigger(timestamp), // set the time for the push notification
            data: {
              url: window.location.href, // pass the current url to the notification
            },
            badge: './assets/badge.png',
            icon: './assets/icon.png',
          });
      }
    });
  };
}
