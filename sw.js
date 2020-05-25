self.addEventListener("install", () => {
  console.log("SW installed!");
});

self.addEventListener("notificationclick", (event) => {
  if (event.action === "close") {
    event.notification.close();
  } else {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        if (clients.length === 0) {
          // open a new client if not exist
          self.clients.openWindow("/try-scheduled-push");
        } else {
          // focus first client and send message to all clients
          clients.forEach((windowClient, ind) => {
            if (ind === 0) {
              windowClient.focus();
            }
            windowClient.postMessage({
              type: "clicked",
              messageId: event.notification.tag,
            });
          });
        }
      })
    );
  }
});
