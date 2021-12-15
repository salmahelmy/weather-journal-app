/* Global Variables */
const weatherApiLink = "api.openweathermap.org/data/2.5/weather?zip=";
const weatherApiKey = "eb2812ce4d51a2e5c642238cae9b02f7";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "." + d.getDate() + "." + d.getFullYear();

//add click event listener on the generate button
document.getElementById("generate").addEventListener("click", generateData);
/**
 * the function executed on click on the generate button
 * @param {*} e
 */
function generateData(e) {
  let zipCode = document.getElementById("zip").value;
  //check the value of the zip code that's not empty & it's an integer
  if (Number.isInteger(parseInt(zipCode))) {
    document.getElementById("zip").style.backgroundColor = "#22b2da";
    document.getElementById("zip_notify").style.display = "none";

    //get request to the weather API
    getWeatherApiData(weatherApiLink, zipCode, weatherApiKey)
      .then(function (weatherTemp) {
        //prepare for the post request to save the data
        const userFeeling = document.getElementById("feelings").value;
        postFullData("/postFullData", {
          temp: weatherTemp,
          feeling: userFeeling,
          date: newDate,
        });
      })
      .then(function () {
        //update the UI
        updateUIData();
      });
  } else {
    //if zip code is empty or not integer, display the notification span & color the text field red
    document.getElementById("zip_notify").style.display = "block";
    document.getElementById("zip").style.backgroundColor = "red";
  }
}
/**
 * async function that gets the temperature from the weather API
 * @param {*} apiLink
 * @param {*} zipCode
 * @param {*} apiKey
 * @returns weatherDataJson.main.temp (if no error happenend)
 */
const getWeatherApiData = async (apiLink, zipCode, apiKey) => {
  const apiUrl = `https://${apiLink}${zipCode}&appid=${apiKey}&units=metric`;
  const weatherData = await fetch(apiUrl);
  try {
    const weatherDataJson = await weatherData.json();
    //if zip code is not valid for the weather API, the JSON returned does not have the key 'main' or 'temp', so an error occurs
    //I made a check if it's not found return null for the temperature value
    return weatherDataJson.hasOwnProperty("main")
      ? weatherDataJson.main.temp
      : null;
  } catch (error) {
    console.log("error", error);
  }
};
/**
 * async function that posts the whole data to the server side
 * @param {*} url
 * @param {*} data
 * @returns
 */
const postFullData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  try {
    const responseJSON = await response.json();
    return responseJSON;
  } catch (error) {
    console.log("error", error);
  }
};
/**
 * function that gets the saved data from the server-side & update the UI with it
 */
const updateUIData = async () => {
  const request = await fetch("/getLastData");
  try {
    const requestJSON = await request.json();
    //A check is made if the temp value is null, meaning the entered zip code was not found, a message will be shown that the city was not found
    if (requestJSON.temp) {
      document.getElementById("entryHolder").style.display = "block";
      document.getElementById("zipcode_error").style.display = "none";
      document.getElementById("date").innerHTML =
        "Today's Date: " + requestJSON.date;
      document.getElementById("temp").innerHTML =
        "Current Temperature: " + requestJSON.temp + " Celsius";
      document.getElementById("content").innerHTML =
        "You Feel like: " + requestJSON.feeling;
    } else {
      document.getElementById("entryHolder").style.display = "none";
      document.getElementById("zipcode_error").style.display = "block";
    }
  } catch (error) {
    console.log("error", error);
  }
};
