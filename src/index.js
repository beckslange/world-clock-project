function updateTime() {
  const cityElements = document.querySelectorAll(".city");

  cityElements.forEach((cityElement) => {
    const timezone = cityElement.getAttribute("data-timezone");
    if (!timezone) return;

    const cityTime = moment().tz(timezone);
    const dateElement = cityElement.querySelector(".date");
    const timeElement = cityElement.querySelector(".time");

    dateElement.innerHTML = cityTime.format("dddd, MMM Do, YYYY");
    timeElement.innerHTML = cityTime.format("h:mm:ss [<small>]A[</small>]");
  });
}

function updateCity(event) {
  let cityTimezone = event.target.value;
  if (cityTimezone === "current") cityTimezone = moment.tz.guess();
  if (!cityTimezone) return;

  const cityName = cityTimezone.replace("_", " ").split("/")[1];
  const existingCity = document.querySelector(
    `[data-timezone='${cityTimezone}']`
  );
  const citiesElement = document.querySelector("#cities");

  const cityHTML = `
    <div class="city" data-timezone="${cityTimezone}" draggable="true">
      <span class="drag-handle">☰</span>
      <div>
        <h2>${cityName}</h2>
        <div class="date"></div>
      </div>
      <div class="time"></div>
      <button class="remove-btn">×</button>
    </div>
  `;

  if (existingCity) {
    if (event.target.value === "current") {
      existingCity.remove();
      citiesElement.insertAdjacentHTML("afterbegin", cityHTML);
    }
  } else {
    if (event.target.value === "current") {
      citiesElement.insertAdjacentHTML("afterbegin", cityHTML);
    } else {
      citiesElement.insertAdjacentHTML("beforeend", cityHTML);
    }
  }

  // Show Home link when a city is selected
  homeLink.style.display = "inline";

  updateTime();
  enableDragAndDrop();
}

function removeCity(event) {
  if (event.target.classList.contains("remove-btn")) {
    event.target.parentElement.remove();
    checkHomeLink();
  }
}

// Drag-and-drop functionality
function enableDragAndDrop() {
  const container = document.querySelector("#cities");
  let draggedItem = null;

  container.querySelectorAll(".city").forEach((city) => {
    city.onmousedown = null;

    city.addEventListener("dragstart", (e) => {
      draggedItem = city;
      city.classList.add("dragging");
    });

    city.addEventListener("dragend", () => {
      draggedItem.classList.remove("dragging");
      draggedItem = null;
    });
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    if (afterElement == null) {
      container.appendChild(draggedItem);
    } else {
      container.insertBefore(draggedItem, afterElement);
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".city:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Home link functionality
const homeLink = document.createElement("a");
homeLink.href = "#";
homeLink.id = "home-link";
homeLink.innerHTML = "🏠 Back to Homepage";
homeLink.style.display = "none";
homeLink.style.marginLeft = "10px";
document
  .querySelector(".container")
  .insertBefore(homeLink, document.querySelector("#cities"));

homeLink.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#city").value = "";
  homeLink.style.display = "none";
  // Optionally hide all dynamically added cities except default ones
  document.querySelectorAll("#cities .city").forEach((city) => {
    if (!city.id) city.remove();
  });
});

// Helper to check if Home link should be hidden
function checkHomeLink() {
  const dynamicCities = document.querySelectorAll("#cities .city:not([id])");
  if (dynamicCities.length === 0) homeLink.style.display = "none";
}

// Initial setup
updateTime();
setInterval(updateTime, 1000);

const citiesSelectElement = document.querySelector("#city");
citiesSelectElement.addEventListener("change", updateCity);

const citiesContainer = document.querySelector("#cities");
citiesContainer.addEventListener("click", removeCity);

enableDragAndDrop();
