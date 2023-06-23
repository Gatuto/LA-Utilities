const priceInput = document.getElementById("price-el");
const priceOutput = document.getElementById("calculated-price");
const alarmBtn = document.getElementById("alarm-btn");
const alarmClear = document.getElementById("alarm-clear");
const playerNumber = document.querySelectorAll('input[type="radio"][name="people-raid"]');
const alarmsEl = document.getElementById("alarms-el");
let players = "four-people";
let alarmsList = [];
let alarmsDate = [];

chrome.storage.local.get(["alarms"]).then((result) => {
    const stringArray = result.alarms;
    if (typeof stringArray === "undefined") {
        alarmsList = [];
    } else {
        alarmsList = JSON.parse(stringArray);
        render(alarmsEl, alarmsList);
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

playerNumber.forEach(function (playerNumber) {
    playerNumber.addEventListener("change", function (howMany) {
        players = howMany.target.value;
        if (players === "four-people") {
            priceOutput.textContent = Math.floor(priceInput.value * 0.7125);
        } else if (players === "eight-people") {
            priceOutput.textContent = Math.floor(priceInput.value * 0.83125);
        }
    });
});

priceInput.addEventListener("input", function (price) {
    if (players === "four-people") {
        priceOutput.textContent = Math.floor(price.target.value * 0.7125);
    } else if (players === "eight-people") {
        priceOutput.textContent = Math.floor(price.target.value * 0.83125);
    }
});

alarmBtn.addEventListener("click", function () {
    const hours = parseInt(document.getElementById("hours").value || 0);
    const minutes = parseInt(document.getElementById("minutes").value);
    const delayInSeconds = hours * 3600 + minutes * 60;

    if (isNaN(hours) || isNaN(minutes)) {
        alert("Please enter valid hours and minutes.");
        return;
    }
    const setTime = new Date();
    setTime.setHours(setTime.getHours() + hours);
    setTime.setMinutes(setTime.getMinutes() + minutes);

    const formattedTime = setTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    const formattedDay = formatTimeAs24Hour(setTime);
    createAlarm(delayInSeconds);

    if (alarmsDate.length > 0) {
        orderAlarms(alarmsDate, formattedDay, alarmsList, formattedTime);
    } else {
        alarmsDate.push(formattedDay);
        alarmsList.push(`<li id="alarms-set">${formattedTime}</li>`);
        chrome.storage.local.set({ alarms: JSON.stringify(alarmsList) });
        chrome.storage.local.set({ dateAlarms: JSON.stringify(alarmsDate) });
        render(alarmsEl, alarmsList);
    }
});

function createAlarm(delay) {
    const alarmTime = Date.now() + delay * 1000;
    const alarmName = `myAlarm_${Date.now()}`;
    chrome.alarms.create(alarmName, {
        when: alarmTime,
    });
}

alarmClear.addEventListener("dblclick", function () {
    chrome.storage.local.clear();
    chrome.alarms.clearAll();
    alarmsList = [];
    alarmsDate = [];
    render(alarmsEl, alarmsList);
});

function render(ulEl, liEl) {
    let listItems = "";
    for (let i = 0; i < liEl.length; i++) {
        listItems += liEl[i];
    }
    ulEl.innerHTML = listItems;
}

function orderAlarms(array1, date, array2, formatted) {
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] > date) {
            array1.splice(i, 0, date);
            array2.splice(i, 0, `<li id="alarms-set">${formatted}</li>`);
            chrome.storage.local.set({ alarms: JSON.stringify(alarmsList) });
            chrome.storage.local.set({ dateAlarms: JSON.stringify(alarmsDate) });
            render(alarmsEl, alarmsList);
            return;
        } else if (array1[array1.length - 1] < date) {
            array1.push(date);
            array2.push(`<li id="alarms-set">${formatted}</li>`);
            chrome.storage.local.set({ alarms: JSON.stringify(alarmsList) });
            chrome.storage.local.set({ dateAlarms: JSON.stringify(alarmsDate) });
            render(alarmsEl, alarmsList);
            return;
        }
    }
}

function formatTimeAs24Hour(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedHours = (hours < 10 ? "0" : "") + hours;
    const formattedMinutes = (minutes < 10 ? "0" : "") + minutes;

    return `${day}/${month}/${year}, ${formattedHours}:${formattedMinutes}`;
}
