const priceInput = document.getElementById("price-el");
const priceOutput = document.getElementById("calculated-price");
const alarmBtn = document.getElementById("alarm-btn");
const playerNumber = document.querySelectorAll('input[type="radio"][name="people-raid"]');
let players = "four-people";

playerNumber.forEach(function(playerNumber) {
    playerNumber.addEventListener('change', function(howMany) {
        players = howMany.target.value;
        if (players === "four-people") {
            priceOutput.textContent = Math.floor(priceInput.value * 0.7125);
        } else if (players === "eight-people") {
            priceOutput.textContent = Math.floor(priceInput.value * 0.83125);
        }
    });
});

priceInput.addEventListener('input', function(price) {
    if (players === "four-people") {
        priceOutput.textContent = Math.floor(price.target.value * 0.7125);
    } else if (players === "eight-people") {
        priceOutput.textContent = Math.floor(price.target.value * 0.83125);
    }
});

alarmBtn.addEventListener('click', function() {
    const hours = parseInt(document.getElementById("hours").value ?? 0);
    const minutes = parseInt(document.getElementById("minutes").value);
    const delayInSeconds = (hours * 3600 + minutes * 60);

    if (isNaN(hours) || isNaN(minutes)) {
        alert('Please enter valid hours and minutes.');
        return;
    }
    chrome.runtime.sendMessage({ delayInSeconds });
    const alarmLi = document.createElement("li");
});