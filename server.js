// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
const port = 8000;
const server = app.listen(port, listening);

function listening() {
  console.log(`Server running`);
  console.log(`Running on localhost:${port}`);
}

app.post("/postFullData", postFullData);

function postFullData(request, response) {
    //update the endpoint object with new values
  projectData = {
    temp: request.body.temp,
    feeling: request.body.feeling,
    date: request.body.date,
  };
  response.send(projectData);
}

app.get("/getLastData", getLastData);

function getLastData(request, response) {
    //send the end point object
  response.send(projectData);
}
