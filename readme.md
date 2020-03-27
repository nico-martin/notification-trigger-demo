# Notification Trigger Demo
This is a demo webpapp to showcase the [Notification Trigger API](https://web.dev/notification-triggers/).

It registers a ServiceWorker and let's you schedule notifications based on the `new TimestampTrigger()`. There is also some communication between the ServiceWorker and the Application using `postMessage`.
