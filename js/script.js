let weather = {
  apiKey: "6da975f8f5d2c6349df9a4880abc9f83",
  fetchWeather: function (city) {
    fetch(
      "http://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => response.json())
      .then((data) => {
        this.displayWeather(data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  },

  fetchWeeklyWeather: function (city) {
    fetch(
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&units=metric&appid=" +
        this.apiKey
    )
      .then((response) => response.json())
      .then((data) => {
        this.displayWeeklyWeather(data);
        this.displayHourlyForecast(data);
      });
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    console.log(name, icon, description, temp, humidity, speed);

    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temperature").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind Speed: " + speed + " km/h";

    document.querySelector(".weather").classList.remove("loading");

    // Fetch and display weekly weather forecast
    this.fetchWeeklyWeather(name);
  },

  displayHourlyForecast: function (data) {
    console.log(data);
    const forecastContainer = document.querySelector(".hourly-container");
    forecastContainer.innerHTML = ""; // Clear any previous forecasts

    // Get today's date
    const today = new Date().toISOString().slice(0, 10);

    // Extract time and temperature data for the chart
    const times = [];
    const temps = [];

    // Filter and limit the forecast data to 8 values (every 3 hours up to 21 hours)
    const filteredForecasts = data.list
      .filter((forecast) => forecast)
      .slice(0, 8);
    console.log(filteredForecasts);
    filteredForecasts.forEach((forecast) => {
      const { dt_txt } = forecast;
      const { temp } = forecast.main;

      const time = new Date(dt_txt).toLocaleTimeString([], {
        hour: "2-digit",
      });

      times.push(time);
      temps.push(temp);
    });

    document.querySelector(".hourly-weather").classList.remove("loading");
    console.log(times);
    console.log(temps);
    // Create or update the chart with the new data
    window.createOrUpdateChart(times, temps);
  },

  // Example data to test the function

  displayWeeklyWeather: function (data) {
    const forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = ""; // Clear any previous forecasts

    // Iterate through all forecast items
    data.list.forEach((forecast) => {
      const { dt_txt } = forecast;
      const hour = new Date(dt_txt).getHours();

      // Filter data to include only forecasts around a certain time of the day (e.g., noon)
      if (hour === 12) {
        const { icon, description } = forecast.weather[0];
        const { temp } = forecast.main;
        const { temp_max } = forecast.main;
        const { temp_min } = forecast.main;

        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");
        forecastItem.innerHTML = `
                <h3>${new Date(dt_txt).toLocaleDateString()}</h3>
                <img src="https://openweathermap.org/img/wn/${icon}.png" class="icon" />
                <div class="forecast-weekly-temp"> 
                <p class="forecast-max-temp">${temp_max.toFixed(0)}°</p>
                <p class="forecast-min-temp">${temp_min.toFixed(0)}°</p>
                </div>
                <p class="forecast-description">${description}</p>
            `;
        forecastContainer.appendChild(forecastItem);
      }
    });

    document.querySelector(".weekly-weather").classList.remove("loading");
  },

  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  document.querySelector(".weather").classList.add("loading");
  document.querySelector(".weekly-weather").classList.add("loading");
  document.querySelector(".hourly-weather").classList.add("loading");
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      document.querySelector(".weather").classList.add("loading");
      document.querySelector(".weekly-weather").classList.add("loading");
      document.querySelector(".hourly-weather").classList.add("loading");
      weather.search();
    }
  });

weather.fetchWeather("Ankara");
