let alarmsList = [];
let alarmsDate = [];

chrome.storage.local.get(["alarms"]).then((result) => {
    const stringArray = result.alarms;
    if (typeof stringArray === "undefined") {
        alarmsList = [];
    } else {
        alarmsList = JSON.parse(stringArray);
    }
});

chrome.storage.local.get(["dateAlarms"]).then((result) => {
    const stringArray = result.dateAlarms;
    if (typeof stringArray === "undefined") {
        alarmsDate = [];
    } else {
        alarmsDate = JSON.parse(stringArray);
    }
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    showNotification();
    alarmsList.shift();
    alarmsDate.shift();
    chrome.storage.local.set({ alarms: JSON.stringify(alarmsList) });
    chrome.storage.local.set({ dateAlarms: JSON.stringify(alarmsDate) });
});

function showNotification() {
    const options = {
        type: "basic",
        iconUrl: "assets/icon.png",
        title: "Caution!",
        message: "Remember to bid!",
        silent: false,
    };
    chrome.notifications.create(options);
}
