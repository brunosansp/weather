/**
 * Interação
 */
const citySearchInput = document.getElementById('city-search-input')
const citySearchButton = document.getElementById('city-search-button')

/**
 * Exibição
 */
const currentDate = document.getElementById('current-date')
const cityName = document.getElementById('city-name')
const weatherIcon = document.getElementById('weather-icon')
const weatherDescription = document.getElementById('weather-description')
const currentTemperature = document.getElementById('current-temperature')
const windSpeed = document.getElementById('wind-speed')
const feelsLikeTemperature = document.getElementById('feels-like-temperature')
const currentHumidity = document.getElementById('current-humidity')
const sunriseTime = document.getElementById('sunrise-time')
const sunsetTime = document.getElementById('sunset-time')

const API_KEY = "b4cff7d8cee5e09cf3d385c5d75cd649"

citySearchButton.addEventListener('click', () => {
  let cityName = citySearchInput.value
  getCityWeather(cityName)
})

navigator.geolocation.getCurrentPosition((position) => {
  let { latitude, longitude } = position.coords
  getCurrentLocationWeather(latitude, longitude)
}, (err) => {
  if (err.code === 1) {
    alert('Geolocalização negada pelo usuário, busque manualmente uma cidade na barra de pesquisa.')
  }
  throw new Error(err)
})

function getCurrentLocationWeather(latitude, longitude) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${API_KEY}`)
    .then((res) => res.json())
    .then((data) => displayWeather(data))
}

function getCityWeather(cityName) {
  weatherIcon.src = `./assets/loading-icon.svg`
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${API_KEY}`)
    .then((res) => res.json())
    .then((data) => displayWeather(data))
}

function displayWeather(data) {
  let {
    dt,
    name,
    weather: [{ icon, description }],
    main: { temp, feels_like, humidity },
    wind: { speed },
    sys: { sunrise, sunset }
  } = data

  currentDate.textContent = formatDate(dt)
  cityName.textContent = name
  weatherIcon.src = `./assets/${icon}.svg`
  weatherDescription.textContent = description
  currentTemperature.textContent = `${Number(temp).toFixed()}°C` // Pode ser feito com Math.round()
  windSpeed.textContent = `${Math.round(speed * 3.6)}km/h`
  feelsLikeTemperature.textContent = `${Number(feels_like).toFixed()}°C`
  currentHumidity.textContent = `${(humidity)}%`
  sunriseTime.textContent = formatTime(sunrise)
  sunsetTime.textContent = formatTime(sunset)
}

function formatDate(epochTime) {
  let date = new Date(epochTime * 1000)
  let formattedDate = date.toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' })
  return `Hoje, ${formattedDate}`
}

function formatTime(epochTime) {
  let date = new Date(epochTime * 1000)
  let hours = date.getHours()
  let minutes = date.getMinutes()
  return `${hours}:${minutes}`
}