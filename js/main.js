"use strict";

let city = "London";
let intervalId;

const $blockMainInfo = document.querySelector(".main__info");
const $blockWindInfo = document.querySelector(".footer__info__field__wind");
const $blockPressureInfo = document.querySelector(
  ".footer__info__field__pressure"
);
const $blockHumidityInfo = document.querySelector(
  ".footer__info__field__humidity"
);

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
    `http://api.weatherapi.com/v1/current.json?key=5cf81997e51e495cb8184339230509&q=${city}&aqi=no`
  );

  const jsonRespone = await response.json();
  return jsonRespone;
}

function writeInfo(data) {
  writeMainInfo(data);
  writeAdditInfo(data);
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

function writeAdditInfo(data) {
  const wind = `${data.current.wind_kph} kph ${data.current.wind_dir}`;
  const pressure = `${data.current.pressure_mb} mb`;
  const humidity = data.current.humidity;

  $blockWindInfo.insertAdjacentHTML("beforeend", wind);
  $blockPressureInfo.insertAdjacentHTML("beforeend", pressure);
  $blockHumidityInfo.insertAdjacentHTML("beforeend", humidity);
}

function clearInfo() {
  $blockMainInfo.innerHTML = "";
  $blockWindInfo.innerHTML = "";
  $blockPressureInfo.innerHTML = "";
  $blockHumidityInfo.innerHTML = "";
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
  const id = e.target.textContent;
  const elem = document.querySelector(`#${id}`);

  elem.style.display = "none";

  console.log(e.target.textContent);
}

// ЗАПУСК

updateAndReloadData(city);
