/*
 *  Filename: scripts.js
 *  Description: Provided JS source code as material for Lab 2: HTML + JavaScript.
 *  Course Code: TNM115-2024VT
 *  Institution: Linköping University
 *
 *  Author: Nico Reski
 *  Version: 2024-01-23
 */

// ===== SOLAR SYSTEM DATA =====
// JSON object containing the information (data) about the solar system
// JSON object composed by: Nico Reski
// based on data available at: https://science.nasa.gov/solar-system/

const serverUrl = "http://127.0.0.1:3001";

// == Documentation for individual star/planet JSON objects ==
// id           -> unique identifier for a JSON object across the dataset
// name         -> textual name
// description  -> textual description
// time_day     -> length of 1 day on the respective planet, measured in (unit) earth days (1 complete self-rotation with respect to the sun)
// time_year    -> length of 1 year, measured in (unit) earth days (1 complete orbit around the sun)
// moons        -> moons of the respective planet; observe: value type varies!
// neighbors    -> array containing the ids of its neighbors
// image_src    -> filepath to image
// online_ref   -> link (url) for further reading

// =============================

// manually added listener for the "DOMContentLoaded" event, which is automatically invoked
// once the initial loading of the web page has been completed (.html file is completely parsed)
document.addEventListener("DOMContentLoaded", function () {
  console.log("HTML DOM tree loaded, and ready for manipulation.");
  // === YOUR FUNCTION CALL TO INITIATE THE GENERATION OF YOUR WEB PAGE SHOULD GO HERE ===

  const webPageURL = new URL(document.URL);

  generateAllFromServer();
});

// ===== PROVIDED JS SOURCE CODE    -- ABOVE   =====
// ===== JS LAB 2 IMPLEMENTATION -- BENEATH =====

/*async function getPlanetDataFromServer() {
  //client sends message to server
  const response = await fetch(serverUrl + "/data", {
    method: "GET",
    headers: {
      "Content-Type": "apllication/json",
    },
    body: null,
  });
  //client recieves servers response
  if (response.ok) {
    response.json().then((jsonBody) => {
      JSON.parse(jsonBody);
    });
  } else {
    console.log("Client request to server was unsuccesul");
    console.log(response.status + " | " + response.statusText);
  }
}*/
async function generateAllFromServer() {
  //client sends message to server
  const response = await fetch(serverUrl + "/data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  //client recieves servers response
  if (response.ok) {
    response.json().then((jsonBody) => {
      console.log(jsonBody);
      const container = document.createElement("div");

      // Append new content to the container
      container.appendChild(generateButton("Home"));
      const gridContainer = document.createElement("article");
      gridContainer.className = "button-grid-container";
      gridContainer.style.display = "grid";
      gridContainer.style.gridTemplateColumns = "1fr 1fr 1fr";
      gridContainer.style.gap = "100px";
      gridContainer.style.width = "100%";
      gridContainer.appendChild(generateSun(jsonBody));
      for (let i = 0; i < jsonBody.planets.length; i++) {
        gridContainer.appendChild(generatePlanetText(jsonBody.planets[i]));
      }
      container.appendChild(gridContainer);

      // Clear the body and append the container
      document.body.innerHTML = "";
      document.body.appendChild(container);
    });
  } else {
    console.log("Client request to server was unsuccesul");
    console.log(response.status + " | " + response.statusText);
  }
}

async function generatePlanetFromServer(entityName) {
  const response = await fetch(serverUrl + "/data" + "/" + entityName, {
    method: "GET",
    headers: {
      "Content-Type": "apllication/json",
    },
    body: null,
  });
  //client recieves servers response
  if (response.ok) {
    return response.json();
  } else {
    console.log("Client request to server was unsuccesul");
    console.log(response.status + " | " + response.statusText);
  }
}

async function getSpecificPlanetImage(entityName) {
  const response = await fetch(serverUrl + "/image" + "/" + entityName, {
    method: "GET",
    headers: {
      "Content-Type": "image/png",
    },
    body: null,
  });
  //client recieves servers response
  if (response.ok) {
    response.blob().then((blobBody) => {
      const filePath = URL.createObjectURL(blobBody);
    });
  } else {
    console.log("Client request to server was unsuccesul");
    console.log(response.status + " | " + response.statusText);
  }
}

function home() {
  //const solarSystemData = getPlanetDataFromServer();
  const gridContainer = document.createElement("article");
  gridContainer.className = "button-grid-container";
  gridContainer.style.display = "grid";
  gridContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";
  gridContainer.style.gridTemplateRow = "100% 100%";
  gridContainer.style.gap = "100px";

  const allButton = generateButton("All");
  const sunButton = generateButton(solarSystemData.star.name);

  gridContainer.appendChild(allButton);
  gridContainer.appendChild(sunButton);
  for (let i = 0; i < solarSystemData.planets.length; i++) {
    gridContainer.appendChild(generateButton(solarSystemData.planets[i].name));
  }
  return gridContainer;
}

function generateButton(planetName) {
  const buttonDiv = document.createElement("div");
  buttonDiv.className = "button-grid-item";

  const button = document.createElement("button");

  button.onclick = function (planetName) {
    buttonOnClickToServer(planetName);
  };

  const buttonText = document.createTextNode(planetName);
  button.appendChild(buttonText);
  button.style.fontSize = "xx-large";
  button.style.fontFamily = " Arial, Helvetica, sans-serif";
  button.style.borderRadius = "10%";
  button.style.width = "100%";
  button.style.height = "200%";
  button.style.border = "outset";
  button.style.cursor = "pointer";

  buttonDiv.appendChild(button);
  return buttonDiv;
}

function getPlanetIDbyName(planetName, solarSystemData) {
  if (planetName.toLowerCase() === "sun") {
    return "s1"; //id for sun
  } else if (planetName.toLowerCase() === "all") {
    return "all";
  }
  for (i = 0; i < solarSystemData.planets.length; i++) {
    if (
      solarSystemData.planets[i].name.toLowerCase() === planetName.toLowerCase()
    ) {
      return solarSystemData.planets[i].id;
    }
  }
  return "0"; //ID for homebutton
}

function getPlanetNamebyID(planetID, solarSystemData) {
  if (planetID.toLowerCase() === "s1") {
    return "Sun";
  }

  for (i = 0; i < solarSystemData.planets.length; i++) {
    if (
      solarSystemData.planets[i].id.toLowerCase() === planetID.toLowerCase()
    ) {
      return solarSystemData.planets[i].name;
    }
  }
}

function getNeighbors(planet, solarSystemData) {
  returnString = "";
  for (let i = 0; i < planet.neighbors.length; i++) {
    returnString +=
      getPlanetNamebyID(planet.neighbors[i], solarSystemData) + " ";
  }
  return returnString;
}

/*function buttonOnClickToServer(planetName) {
  document.body.innerHTML = "";

  const planetID = getPlanetIDbyName(planetName);

  if (planetID === "0") {
    document.body.appendChild(home());
    return;
  }

  document.body.appendChild(generateButton("Home"));
  if (planetName.toLowerCase() === "all") {
    document.body.appendChild(generateAll());
  } else if (planetID.startsWith("p")) {
    for (let i = 0; i < solarSystemData.planets.length; i++) {
      if (planetID.endsWith(i + 1)) {
        document.body.appendChild(
          generatePlanetText(solarSystemData.planets[i])
        );
      }
    }
  } else {
    document.body.appendChild(generateSun()); //function call for the sun
  }
}*/

function getTimeInHours(days) {
  return days * 24;
}

async function generateAll() {
  solarSystemData = await getAllPlanetData();
  console.log(solarSystemData);
  document.body.innerHTML = "";
  document.body.appendChild(generateButton("Home"));
  const gridContainer = document.createElement("article");
  gridContainer.className = "button-grid-container";
  gridContainer.style.display = "grid";
  gridContainer.style.gridTemplateColumns = "1fr 1fr 1fr";

  gridContainer.style.gap = "100px";
  gridContainer.style.width = "100%";

  gridContainer.appendChild(generateSun(solarSystemData));
  for (let i = 0; i < solarSystemData.planets.length; i++) {
    gridContainer.appendChild(generatePlanetText(solarSystemData.planets[i]));
  }
  return gridContainer;
}

function createContentElement(tag, content) {
  const element = document.createElement(tag);
  const text = document.createTextNode(content);
  element.appendChild(text);
  return element;
}

function generateAnchor(planet) {
  const anchor = document.createElement("a");
  anchor.href = planet.online_ref;
  return anchor;
}

function generatePlanetText(planet) {
  const divContainer = document.createElement("div");
  const h1 = document.createElement("h1");
  const h1Text = document.createTextNode(planet.name);
  h1.appendChild(h1Text);

  const pDesc = createContentElement("p", planet.description);
  const pTimeDay = createContentElement(
    "p",
    "Time Day: " +
      (planet.time_day < 1
        ? getTimeInHours(planet.time_day) + " hours"
        : planet.time_day + " days")
  ); //gives time in hours if time is less than 1 day
  const pTimeYear = createContentElement("p", "Time year: " + planet.time_year);
  const pMoons = createContentElement(
    "p",
    "Moons: " + (planet.moons != null ? planet.moons : "0")
  );
  const anchor = generateAnchor(planet);
  const pNeighbors = createContentElement(
    "p",
    "Neighbors: " + getNeighbors(planet)
  );

  const img = document.createElement("img");
  img.src = planet.image_src;
  img.style.width = "40%";
  anchor.appendChild(img);

  divContainer.appendChild(h1);
  divContainer.appendChild(pDesc);
  divContainer.appendChild(pTimeDay);
  divContainer.appendChild(pTimeYear);
  divContainer.appendChild(pMoons);
  divContainer.appendChild(pNeighbors);
  divContainer.appendChild(anchor);

  return divContainer;
}

function generateSun(solarSystemData) {
  const divContainer = document.createElement("div");
  const h1 = document.createElement("h1");
  const h1Text = document.createTextNode("Sun");
  h1.appendChild(h1Text);

  const pDesc = createContentElement("p", solarSystemData.star.description);
  const anchor = generateAnchor(solarSystemData.star);
  const pNeighbors = createContentElement(
    "p",
    "Neighbors: " + getNeighbors(solarSystemData.star, solarSystemData)
  );

  const img = document.createElement("img");
  img.src = solarSystemData.star.image_src;
  img.style.width = "40%";
  anchor.appendChild(img);

  divContainer.appendChild(h1);
  divContainer.appendChild(pDesc);
  divContainer.appendChild(pNeighbors);
  divContainer.appendChild(anchor);

  return divContainer;
}

async function buttonOnClickToServer(planetName) {
  const response = await fetch(serverUrl + "/" + planetName, {
    method: "GET",
    headers: {
      "Content-Type": "text/plain",
    },
    body: null,
  });
  if (response.ok) {
    console.log("The client request to the server was successful.");
  } else {
    console.log("The client request to the server was unsuccessful.");
    console.log(response.status + " | " + response.statusText);
  }
}
