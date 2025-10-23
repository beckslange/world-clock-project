function updateTime() {
  let cityElements = document.querySelectorAll(".city");

  cityElements.forEach((cityElement) => {
    let timezone =
      cityElement.getAttribute("data-timezone") ||
      (cityElement.id === "los-angeles"
        ? "America/Los_Angeles"
        : cityElement.id === "sydney"
        ? "Australia/Sydney"
        : null);

    if (!timezone) return;

    let cityTime = moment().tz(timezone);
    let dateElement = cityElement.querySelector(".date");
    let timeElement = cityElement.querySelector(".time");

    dateElement.innerHTML = cityTime.format("dddd, MMM Do, YYYY");
    timeElement.innerHTML = cityTime.format("h:mm:ss [<small>]A[</small>]");
  });
}

function updateCity(event) {
  let cityTimezone = event.target.value;
  if (!cityTimezone) return;

  let cityName = cityTimezone.replace("_", " ").split("/")[1];
  let existingCity = document.querySelector(
    `[data-timezone='${cityTimezone}']`
  );
  if (existingCity) return;

  let citiesElement = document.querySelector("#cities");

  let cityHTML = `
    <div class="city" data-timezone="${cityTimezone}">
      <div>
        <h2>${cityName}</h2>
        <div class="date"></div>
      </div>
      <div class="time"></div>
      <button class="remove-btn">×</button>
    </div>
  `;

  citiesElement.insertAdjacentHTML("beforeend", cityHTML);
  updateTime();
}

function removeCity(event) {
  if (event.target.classList.contains("remove-btn")) {
    event.target.parentElement.remove();
  }
}

updateTime();
setInterval(updateTime, 1000);

let citiesSelectElement = document.querySelector("#city");
citiesSelectElement.addEventListener("change", updateCity);

let citiesContainer = document.querySelector("#cities");
citiesContainer.addEventListener("click", removeCity);
