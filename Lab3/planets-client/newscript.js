document.addEventListener("DOMContentLoaded", function () {
  console.log("HTML DOM tree loaded, and ready for manipulation.");
  // === YOUR FUNCTION CALL TO INITIATE THE GENERATION OF YOUR WEB PAGE SHOULD GO HERE ===

  const webPageURL = new URL(document.URL);
  generateHomeFromServer();
});

const serverUrl = "http://127.0.0.1:3001";
async function requestAllData() {
  const response = await fetch(serverUrl + "/data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: null,
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to fetch data");
  }
}

async function requestSpecificData(entityName) {
  const response = await fetch(serverUrl + "/data/" + entityName, {
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

async function requestImage(entityName) {
  const response = await fetch(serverUrl + "/image/" + entityName, {
    method: "GET",
    headers: {
      "Content-Type": "image/png",
    },
  });

  if (response.ok) {
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  } else {
    throw new Error("Failed to fetch data");
  }
}

async function generateAllFromServer() {
  try {
    const jsonData = await requestAllData();
    document.body.innerHTML = "";
    document.body.appendChild(generateButton("Home", -1));
    const gridContainer = document.createElement("article");
    gridContainer.className = "button-grid-container";
    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = "1fr 1fr 1fr";

    gridContainer.style.gap = "100px";
    gridContainer.style.width = "100%";

    gridContainer.appendChild(generatePlanetText(jsonData.star));
    for (let i = 0; i < jsonData.planets.length; i++) {
      gridContainer.appendChild(generatePlanetText(jsonData.planets[i]));
    }

    document.body.appendChild(gridContainer);
  } catch (error) {
    console.error("error: " + error.message);
  }
}

function generateButton(planetName, ID) {
  const buttonDiv = document.createElement("div");
  buttonDiv.className = "button-grid-item";

  const button = document.createElement("button");
  button.id = ID.toString();

  button.onclick = function () {
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
async function generateHomeFromServer() {
  const response = await fetch(serverUrl + "/data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: null,
  });

  if (response.ok) {
    response.json().then((jsonBody) => {
      const gridContainer = document.createElement("article");
      gridContainer.className = "button-grid-container";
      gridContainer.style.display = "grid";
      gridContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";
      gridContainer.style.gridTemplateRow = "100% 100%";
      gridContainer.style.gap = "100px";

      const allButton = generateButton("All", 0);

      const sunButton = generateButton(jsonBody.star.name, 1);

      gridContainer.appendChild(allButton);
      gridContainer.appendChild(sunButton);
      iteratorID = 2;
      for (let i = 0; i < jsonBody.planets.length; i++) {
        const iteratorButton = generateButton(
          jsonBody.planets[i].name,
          iteratorID
        );

        gridContainer.appendChild(iteratorButton);
      }
      document.body.appendChild(gridContainer);
    });
  } else {
    throw new Error("Failed to fetch data");
  }
}

async function buttonOnClickToServer(ID) {
  if (ID == -1) {
    generateHomeFromServer();
    return;
  }

  try {
    const data = await requestAllData();
    console.log(data);
    document.body.appendChild(generateButton("Home", -1));
    if (ID == 0) {
      generateAllFromServer();
    } else {
      document.body.appendChild(generatePlanetText(data.planets[ID - 1]));
    }
  } catch (error) {
    console.error("error onclick: " + error.message);
  }
}

async function generatePlanetText(planet) {
  const divContainer = document.createElement("div");
  const h1 = createContentElement("h1",planet.name);
  if (planet.name !== "sun") {
    const pDesc = createContentElement("p", planet.description);
    
    const pTimeDay = createContentElement(
      "p",
      "Time Day: " +
        (planet.time_day < 1
          ? getTimeInHours(planet.time_day) + " hours"
          : planet.time_day + " days")
    ); 
    
    //gives time in hours if time is less than 1 day
    const pTimeYear = createContentElement(
      "p",
      "Time year: " + planet.time_year
    );
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
  } else {
    const pDesc = createContentElement("p", planet.description);
    const pTimeDay = createContentElement(
      "p",
      "Time Day: " +
        (planet.time_day < 1
          ? getTimeInHours(planet.time_day) + " hours"
          : planet.time_day + " days")
    ); //gives time in hours if time is less than 1 day
    const pTimeYear = createContentElement(
      "p",
      "Time year: " + planet.time_year
    );
    const pNeighbors = createContentElement(
      "p",
      "Neighbors: " + getNeighbors(planet)
    );
    divContainer.appendChild(h1);
    divContainer.appendChild(pDesc);
    divContainer.appendChild(pTimeDay);
    divContainer.appendChild(pTimeYear);
  }
  const anchor = document.createElement("a");
  anchor.href = planet.online_ref;
  try {
    const imgSrc = await requestImage(planet.name);
    console.log(imgSrc);
    const img = document.createElement("img");
    img.src = imgSrc;
    anchor.appendChild(img);
  } catch (error) {
    console.error("Error loading image:", error.message);
  }
  divContainer.appendChild(anchor);

  return divContainer;
}

function createContentElement(tag, content) {
  const element = document.createElement(tag);
  const text = document.createTextNode(content);
  element.appendChild(text);
  return element;
}

function getTimeInHours(days) {
  return days * 24;
}

function getNeighbors(planet) {
  returnString = "";
  for (let i = 0; i < planet.neighbors.length; i++) {
    returnString += getPlanetNamebyID(planet.neighbors[i]) + " ";
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
