chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const delayInSeconds = request.delayInSeconds;
  const alarmTime = Date.now() + delayInSeconds * 1000;

  chrome.alarms.create("myAlarm", {
    when: alarmTime,
  });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "myAlarm") {
    showNotification();
  }
});

function showNotification() {
    const options = {
        type: 'basic',
        iconUrl: 'assets/icon.png',
        title: 'Caution!',
        message: 'Remember to bid!',
        silent: false
    };
    console.log("alarm should've gone off by now");
    chrome.notifications.create(options);
}