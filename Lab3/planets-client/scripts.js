const serverUrl = "http://127.0.0.1:3001";

document.addEventListener("DOMContentLoaded", function () {
  console.log("HTML DOM tree loaded, and ready for manipulation.");
  // === YOUR FUNCTION CALL TO INITIATE THE GENERATION OF YOUR WEB PAGE SHOULD GO HERE ===

  const webPageURL = new URL(document.URL);
  generateHomePage();
  //function call to load first page
});

/* ----LIST OF PLANET AND OTHER BUTTON ID:S----
    homepage: "h"
    all page: "a"
    sun: "0"
    mercury: "1"
    venus: "2"
    earth: "3"
    mars: "4"
    jupiter:"5"
    saturn: "6"
    uranus: "7"
    neptune: "8"
 */

async function reqAllData() {
  const response = await fetch(serverUrl + "/data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to fetch data");
  }
}

async function reqSpecificData(entityName) {
  const response = await fetch(
    serverUrl + "/data/" + entityName.toLowerCase(),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to fetch data");
  }
}

async function createImgElement(entityName) {
  const response = await fetch(serverUrl + "/image/" + entityName, {
    method: "GET",
    headers: {
      "Content-Type": "image/png",
    },
  });
  if (response.ok) {
    const blob = await response.blob();
    const img = document.createElement("img");
    img.src = URL.createObjectURL(blob);
    img.style.width = "40%";
    return img;
  } else {
    throw new Error("Failed to fetch data");
  }
}

async function generateAllSolarSystemData() {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  } //clear the page
  document.body.appendChild(generateButton("Home", "h"));
  try {
    const jsonData = await reqAllData();

    const gridContainer = document.createElement("article");
    gridContainer.className = "button-grid-container";
    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = "1fr 1fr 1fr";

    gridContainer.style.gap = "100px";
    gridContainer.style.width = "100%";

    gridContainer.appendChild(await generateSun());
    for (let i = 0; i < jsonData.planets.length; i++) {
      gridContainer.appendChild(
        await generatePlanetText(jsonData.planets[i].name)
      );
    }

    document.body.appendChild(gridContainer);
  } catch (error) {
    console.error("Failed to fetch data: " + error.message);
  }
}

async function generatePlanetPage(entityName) {
  document.body.appendChild(generateButton("Home", "h"));
  try {
    if (entityName.toLowerCase() === "sun") {
      document.body.appendChild(await generateSun());
    } else {
      document.body.appendChild(await generatePlanetText(entityName));
    }
  } catch (error) {
    console.error("Error fetching specific planet data: " + error.message);
  }
}

async function generateSun() {
  const divContainer = document.createElement("div");
  const h1 = createContentElement("h1", "Sun");

  let sun;
  try {
    sun = await reqSpecificData("sun");
  } catch (error) {
    console.error("Error fetching specific planet data: " + error.message);
  }

  const pDesc = createContentElement("p", sun.description);
  const pNeighbors = createContentElement(
    "p",
    "Neighbors: " + getNeighbors(sun)
  );

  divContainer.appendChild(h1);
  divContainer.appendChild(pDesc);
  divContainer.appendChild(pNeighbors);

  const anchor = document.createElement("a");
  anchor.href = sun.online_ref;
  try {
    const img = await createImgElement(sun.name);
    anchor.appendChild(img);
  } catch (error) {
    console.error("Error loading image:", error.message);
  }
  divContainer.appendChild(anchor);

  return divContainer;
}

async function generatePlanetText(entityName) {
  const divContainer = document.createElement("div");
  const h1 = createContentElement("h1", entityName);
  let planet;
  try {
    planet = await reqSpecificData(entityName);
  } catch (error) {
    console.error("Error fetching specific planet data: " + error.message);
  }
  const pDesc = createContentElement("p", planet.description);
  const pTimeDay = createContentElement(
    "p",
    "Time Day: " +
      (planet.time_day < 1
        ? getTimeInHours(planet.time_day) + " hours"
        : planet.time_day + " days")
  );

  //gives time in hours if time is less than 1 day
  const pTimeYear = createContentElement("p", "Time year: " + planet.time_year);
  const pMoons = createContentElement(
    "p",
    "Moons: " + (planet.moons != null ? planet.moons : "0")
  );
  const pNeighbors = createContentElement(
    "p",
    "Neighbors: " + getNeighbors(planet)
  );

  divContainer.appendChild(h1);
  divContainer.appendChild(pDesc);
  divContainer.appendChild(pTimeDay);
  divContainer.appendChild(pTimeYear);
  divContainer.appendChild(pMoons);
  divContainer.appendChild(pNeighbors);

  const anchor = document.createElement("a");
  anchor.href = planet.online_ref;
  try {
    const img = await createImgElement(planet.name);
    anchor.appendChild(img);
  } catch (error) {
    console.error("Error loading image:", error.message);
  }
  divContainer.appendChild(anchor);

  return divContainer;
}

async function generateHomePage() {
  try {
    const solarSystemData = await reqAllData();
    const gridContainer = document.createElement("article");
    gridContainer.className = "button-grid-container";
    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";
    gridContainer.style.gridTemplateRow = "100% 100%";
    gridContainer.style.gap = "100px";

    const allButton = generateButton("All", "a");

    const sunButton = generateButton(solarSystemData.star.name, "0");

    gridContainer.appendChild(allButton);
    gridContainer.appendChild(sunButton);

    iteratorID = 1;
    for (let i = 0; i < solarSystemData.planets.length; i++) {
      const iteratorButton = generateButton(
        solarSystemData.planets[i].name,
        iteratorID.toString()
      );
      ++iteratorID;
      gridContainer.appendChild(iteratorButton);
    }

    document.body.appendChild(gridContainer);
  } catch (error) {
    console.error("Error fetching json: " + error.message);
  }
}

function generateButton(planetName, buttonID) {
  const buttonDiv = document.createElement("div");
  buttonDiv.className = "button-grid-item";

  const button = document.createElement("button");
  button.id = buttonID.toString();

  button.onclick = function () {
    buttonOnClick(buttonID);
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

function buttonOnClick(buttonID) {
  if (buttonID === "h") {
    document.body.innerHTML = "";
    generateHomePage();
  } else if (buttonID === "a") {
    generateAllSolarSystemData();
  } else {
    const buttonElement = document.getElementById(buttonID.toString());
    document.body.innerHTML = "";
    if (buttonElement) {
      entityName = buttonElement.textContent;
      //entityName === "sun" ? generateSun() : generatePlanetPage(entityName);

      generatePlanetPage(entityName);
    } else {
      console.error("Button element not found for ID: " + buttonID);
    }
  }
}

function getTimeInHours(days) {
  return days * 24;
}

function createContentElement(tag, content) {
  const element = document.createElement(tag);
  const text = document.createTextNode(content);
  element.appendChild(text);
  return element;
}

function getNeighbors(planet) {
  returnString = "";
  if (planet && planet.neighbors) {
    for (let i = 0; i < planet.neighbors.length; i++) {
      returnString += getPlanetNamebyID(planet.neighbors[i]) + " ";
    }
  }

  return returnString;
}

function getPlanetNamebyID(planetID) {
  switch (planetID) {
    case "s1":
      return "Sun";
    case "p1":
      return "Mercury";
    case "p2":
      return "Venus";
    case "p3":
      return "Earth";
    case "p4":
      return "Mars";
    case "p5":
      return "Jupiter";
    case "p6":
      return "Saturn";
    case "p7":
      return "Uranus";
    case "p8":
      return "Nepturne";
    default:
  }
}
