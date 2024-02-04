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

document.addEventListener("DOMContentLoaded", function () {
  console.log("HTML DOM tree loaded, and ready for manipulation.");
  // === YOUR FUNCTION CALL TO INITIATE THE GENERATION OF YOUR WEB PAGE SHOULD GO HERE ===

  const webPageURL = new URL(document.URL);

  generateAllFromServer();
});

function home(jsonBody) {
  const gridContainer = document.createElement("article");
  gridContainer.className = "button-grid-container";
  gridContainer.style.display = "grid";
  gridContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";
  gridContainer.style.gridTemplateRow = "100% 100%";
  gridContainer.style.gap = "100px";

  const allButton = generateButton("All");
  allButton.id = 0;
  const sunButton = generateButton(jsonBody.star.name);
  sunButton.id = 1;

  gridContainer.appendChild(allButton);
  gridContainer.appendChild(sunButton);
  iteratorID = 2;
  for (let i = 0; i < jsonBody.planets.length; i++) {
    const iteratorButton = generateButton(jsonBody.planets[i].name);
    iteratorButton.id = iteratorID;
    ++iteratorID;
    gridContainer.appendChild(iteratorButton);
  }
  return gridContainer;
}

function generateButton(planetName, ID) {
  const buttonDiv = document.createElement("div");
  buttonDiv.className = "button-grid-item";

  const button = document.createElement("button");
  button.id = ID;

  button.onclick = function (planetName) {
    buttonOnClickToServer(ID);
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

function getNeighbors(planet, solarSystemData) {
  returnString = "";
  for (let i = 0; i < planet.neighbors.length; i++) {
    returnString +=
      getPlanetNamebyID(planet.neighbors[i], solarSystemData) + " ";
  }
  return returnString;
}

function buttonOnClickToServer(ID) {
  document.body.innerHTML = "";

  const planetID = getPlanetIDbyName(planetName);

  if (ID === -1) {
    home();
    return;
  }

  document.body.appendChild(generateButton("Home", -1));
  if (ID === 0) {
    generateAllFromServer();
  } else if (planetID.startsWith("p")) {
    for (let i = 0; i < jsonBody.planets.length; i++) {
      if (planetID.endsWith(i + 1)) {
        document.body.appendChild(generatePlanetText(jsonBody.planets[i]));
      }
    }
  } else {
    document.body.appendChild(generateSun()); //function call for the sun
  }
}

function getTimeInHours(days) {
  return days * 24;
}

function generateAll() {
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

  const img = getSpecificPlanetImage(planet.name);
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
