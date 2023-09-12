"use strict";

let city = "London";
let intervalId;

const $blockMainInfo = document.querySelector(".main__info");
const $blockAdditMainInfo = document.querySelector("#Main");
const $blockAdditAstroInfo = document.querySelector("#Astro");

// СТРОКА ПОИСКА

const $blockChangeSearch = document.querySelector(".header__change__search");
const $blockChangeInput = document.querySelector(
  ".header__change__search__input"
);
const $blockChangeBtn = document.querySelector(".header__change__search__send");
const $blockChangeWarn = document.querySelector(
  ".header__change__search__warn"
);

// МЕНЮ

const $blockMenu = document.querySelector(".footer__menu");
const $blocksMenuInfo = document.querySelectorAll(".footer__info");

// ОБНОВЛЕНИЕ ДАННЫХ И ПЕРЕРИСОВКА

function updateAndReloadData(city) {
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(getWeather(city), 10 * 60 * 1000);
}

async function getWeather(city) {
  clearInfo();
  const data = await getData(city);

  writeInfo(data);
}

async function getData(city) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=5cf81997e51e495cb8184339230509&q=${city}&days=1&aqi=no&alerts=no`
  );

  const jsonRespone = await response.json();
  return jsonRespone;
}

function writeInfo(data) {
  writeMainInfo(data);
  writeAdditMainInfo(data);
  writeAdditAstroInfo(data);
}

function writeMainInfo(data) {
  const temperature =
    data.current.temp_c > 0
      ? `${data.location.name} +${data.current.temp_c}`
      : `${data.location.name} ${data.current.temp_c}`;

  const condition = data.current.condition.text;

  const mainHtml = `<div>${temperature}</div>
    <div>${condition}</div>`;

  $blockMainInfo.insertAdjacentHTML("beforeend", mainHtml);
}

function writeAdditMainInfo(data) {
  const wind = `${data.current.wind_kph} kph ${data.current.wind_dir}`;
  const pressure = `${data.current.pressure_mb} mb`;
  const humidity = data.current.humidity;

  const html = `<div class="footer__info__field">
  <div class="footer__info__field__img">
    <img
      src="img/icon-wind.png"
      class="footer__info__field__img_mod"
      alt="wind"
    />
  </div>
  <div class="footer__info__field__wind">${wind}</div>
</div>
<div class="footer__info__field">
  <div class="footer__info__field__img">
    <img
      src="img/icon-pressure.png"
      class="footer__info__field__img_mod"
      alt="pressure"
    />
  </div>
  <div class="footer__info__field__pressure">${pressure}</div>
</div>
<div class="footer__info__field">
  <div class="footer__info__field__img">
    <img
      src="img/icon-humidity.png"
      class="footer__info__field__img_mod"
      alt="humidity"
    />
  </div>
  <div class="footer__info__field__humidity">${humidity}</div>
</div>`;

  $blockAdditMainInfo.insertAdjacentHTML("beforeend", html);
}

function writeAdditAstroInfo(data) {
  const astro = data.forecast.forecastday[0].astro;

  const sun = `${astro.sunrise} — ${astro.sunset}`;
  const moon = `${astro.moonrise} — ${astro.moonset}`;
  const phase = astro.moon_phase;

  const html = `<div class="footer__info__field">
  <div class="footer__info__field__img">Sun</div>
  <div class="footer__info__field__des">${sun}</div>
</div>
<div class="footer__info__field">
  <div class="footer__info__field__img">Moon</div>
  <div class="footer__info__field__des">${moon}</div>
</div>
<div class="footer__info__field">
  <div class="footer__info__field__img">Phase</div>
  <div class="footer__info__field__des">${phase}</div>
</div>`;

  $blockAdditAstroInfo.insertAdjacentHTML("beforeend", html);
}

function clearInfo() {
  $blockMainInfo.innerHTML = "";
  $blockAdditMainInfo.innerHTML = "";
  $blockAdditAstroInfo.innerHTML = "";
}

// СМЕНА ГОРОДА

$blockChangeBtn.addEventListener("click", searchCityClick);
$blockChangeInput.addEventListener("keyup", searchCityBtn);

async function searchCityClick() {
  const newCity = $blockChangeInput.value;

  if (await checkCity(newCity)) {
    updateAndReloadData(newCity);

    $blockChangeInput.value = "";
  } else {
    warningCity();

    $blockChangeInput.value = "";
  }
}

async function searchCityBtn(e) {
  if (e.key == "Enter") {
    const newCity = e.target.value;

    if (await checkCity(newCity)) {
      updateAndReloadData(newCity);

      e.target.value = "";
    } else {
      warningCity();

      e.target.value = "";
    }
  }
}

async function checkCity(city) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=5cf81997e51e495cb8184339230509&q=${city}&aqi=no`
  );

  return response.ok ? 1 : 0;
}

function warningCity() {
  $blockChangeWarn.style.opacity = 1;
  setTimeout(() => ($blockChangeWarn.style.opacity = 0), 3 * 1000);
}

// ТОЛЬКО АНГЛИЙСКИЙ В СТРОКЕ ПОИСКА

$blockChangeInput.addEventListener("input", washField);

function washField(e) {
  const value = e.target.value;
  const regex = /^[A-Za-z\s]+$/;

  if (!regex.test(value)) {
    e.target.value = value.replace(/[^A-Za-z\s]/g, "");
  }
}

// ВЗАИМОДЕЙСТВИЕ С МЕНЮ

$blockMenu.addEventListener("click", switchMenu);

function switchMenu(e) {
  const id = e.target.dataset.id;

  $blocksMenuInfo.forEach((item) => {
    if (item.id === id) {
      item.classList.add("active-block");
    } else {
      item.classList.remove("active-block");
    }
  });

  for (let item of this.children) {
    if (item === e.target) {
      item.classList.add("active-text");
    } else {
      item.classList.remove("active-text");
    }
  }
}

document.querySelector('[data-id="Main"]').classList.add("active-text");
document.querySelector("#Main").classList.add("active-block");

// ЗАПУСК

updateAndReloadData(city);
