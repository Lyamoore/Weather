"use strict";

const $blockMainInfo = document.querySelector(".main__info");
const $blockWindInfo = document.querySelector(".footer__info__wind");
const $blockPressureInfo = document.querySelector(".footer__info__pressure");
const $blockHumidityInfo = document.querySelector(".footer__info__humidity");

// const $blockChange = document.querySelector(".header__change");
// const $blockChangeTitle = document.querySelector(".header__change__title");
const $blockChangeSearch = document.querySelector(".header__change__search");
const $blockChangeInput = document.querySelector(
  ".header__change__search__input"
);
const $blockChangeBtn = document.querySelector(".header__change__search__send");

let city = "London";

// async function getWeather(city) {
//   let response = await fetch(
//     `http://api.weatherapi.com/v1/current.json?key=5cf81997e51e495cb8184339230509&q=${city}&aqi=no`
//   );

//   let jsonRespone = await response.json();

//   writeInfo(jsonRespone);
// }

async function getWeather(city) {
  let data = await getData(city);

  writeInfo(data);
}

async function getData(city) {
  let response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=5cf81997e51e495cb8184339230509&q=${city}&aqi=no`
  );

  let jsonRespone = await response.json();
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

setInterval(getWeather(city), 10 * 60 * 1000);

// СМЕНА ГОРОДА

$blockChangeBtn.addEventListener("click", searchCityClick);
$blockChangeInput.addEventListener("keyup", searchCityBtn);

function searchCityClick() {
  let newCity = $blockChangeInput.value;

  clearInfo();
  getWeather(newCity);
  $blockChangeInput.value = "";
}

function searchCityBtn(e) {
  if (e.key == "Enter") {
    let newCity = e.target.value;

    clearInfo();
    getWeather(newCity);
    e.target.value = "";
  }
}

function clearInfo() {
  $blockMainInfo.innerHTML = "";
  $blockWindInfo.innerHTML = "";
  $blockPressureInfo.innerHTML = "";
  $blockHumidityInfo.innerHTML = "";
}

// ИСЧЕЗНОВЕНИЕ ЧЕНДЖ СИТИ

// function changeOn() {
//   $blockChangeTitle.style.display = "none";
//   $blockChangeSearch.style.display = "block";
// }

// function changeOver() {
//   $blockChangeTitle.style.display = "block";
//   $blockChangeSearch.style.display = "none";
// }

// $blockChangeTitle.addEventListener("mouseover", changeOn);
// $blockChangeTitle.addEventListener("mouseout", changeOver);
