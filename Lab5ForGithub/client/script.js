const serverUrl = "http://127.0.0.1:3000";

document.addEventListener("DOMContentLoaded", function () {
  console.log("HTML DOM tree loaded, and ready for manipulation.");
  // === YOUR FUNCTION CALL TO INITIATE THE GENERATION OF YOUR WEB PAGE SHOULD GO HERE ===

  const webPageURL = new URL(document.URL);

  //function call to load first page
  addSearchEventListener();
  generateHomePage();
});

async function generateHomePage() {
  document.getElementById("header").innerText = "44 Artists"; // Set the header of the doc
  const response = await fetch(serverUrl + "/artists", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    response.json().then((jsonBody) => {
      generateHomeInfo(jsonBody);
    });
  } else {
    console.log("error occured getting server data");
  }
}

function generateHomeInfo(artistsJson) {
  const articleDiv = document.querySelector(".artist-grid-container");

  for (let i = 0; i < artistsJson.artistsArr.length; i++) {
    const artistElement = createArtistGridItem(artistsJson.artistsArr[i]);
    articleDiv.appendChild(artistElement);
  }
}

function createArtistGridItem(artistObject) {
  const buttonDiv = document.createElement("div");
  buttonDiv.className = "artist-grid-item";
  const artistButton = createContentElement("button", artistObject.name);
  artistButton.id = artistObject._id;
  artistButton.onclick = function () {
    generateArtistPage(artistButton.id);
  };

  buttonDiv.appendChild(artistButton);
  return buttonDiv;
}

async function createImgElement(artistID) {
  const response = await fetch(serverUrl + "/image/" + artistID, {
    method: "GET",
    headers: {
      "Content-Type": "image/png",
    },
  });
  if (response.ok) {
    const blob = await response.blob();
    const img = document.createElement("img");
    img.src = URL.createObjectURL(blob);
    return img;
  } else {
    throw new Error("Failed to fetch data");
  }
}

async function generateArtistPage(artistID) {
  const response = await fetch(serverUrl + "/artists/" + artistID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const img = await createImgElement(artistID);
  if (response.ok) {
    response.json().then((jsonBody) => {
      generateArtistText(jsonBody.artist[0], img); //jsonBody is an JSOn but artist is an array and its first element is also an JSON, So we send the json
    });
  } else {
    console.log("error occured getting server data");
  }
}

function generateArtistText(artistJsonObject, imgElement) {
  //clear home page
  document.querySelector(".artist-grid-container").innerText = null;

  document.getElementById("header").innerText = artistJsonObject.name;

  document.getElementById("artist-page").appendChild(imgElement);
  realName(artistJsonObject);
  document.getElementById("desc").innerText = artistJsonObject.description;
  document.getElementById("discogs").href = artistJsonObject.discogsUrl;
  document
    .getElementById("discogs")
    .appendChild(createContentElement("p", "Discogs URL"));
  nameVariations(artistJsonObject);
  aliases(artistJsonObject);

  memberInGroups(artistJsonObject);
  references(artistJsonObject);
}

function nameVariations(json) {
  if (json.nameVariations != null) {
    const names = document.getElementById("name-var");
    names.appendChild(createContentElement("h3", "Name Variations: "));
    for (let i = 0; i < json.nameVariations.length; i++) {
      names.appendChild(createContentElement("li", json.nameVariations[i]));
    }
  }
}
function realName(json) {
  if (json.realname != null) {
    document.getElementById("real-name").innerText =
      "Real name:  " + json.realname;
  }
}

function aliases(json) {
  if (json.aliases != null) {
    const aliases = document.getElementById("aliases");
    aliases.appendChild(createContentElement("h3", "Aliases: "));
    for (let i = 0; i < json.aliases.length; i++) {
      aliases.appendChild(createContentElement("li", json.aliases[i].name));
    }
  }
}
function memberInGroups(json) {
  if (json.memberInGroups != null) {
    const groups = document.getElementById("groups");
    groups.appendChild(createContentElement("h3", "Bands: "));
    for (let i = 0; i < json.memberInGroups.length; i++) {
      const memberIn = json.memberInGroups[i];

      //if artist in active in band this returns the string "active in: {band name}, else "Not active in: {band name}"
      const formatString =
        memberIn.activeInGroup === true
          ? "Active in: " + memberIn.name
          : "Not active in: " + memberIn.name;

      groups.appendChild(createContentElement("li", formatString));
    }
  }
}

function references(json) {
  const references = document.getElementById("ref");
  references.appendChild(createContentElement("h3", "References: "));
  for (let i = 0; i < json.referenceUrls.length; i++) {
    const anchor = createContentElement("a", "");
    anchor.href = json.referenceUrls[i];
    const listItem = createContentElement("li", json.referenceUrls[i]);
    anchor.appendChild(listItem);
    references.appendChild(anchor);
  }
}

function addSearchEventListener() {
  const searchBar = document.getElementById("search-field");
  searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchArtists(generateSearchPage);
    }
  });
}

async function searchArtists(callback) {
  const searchString = getSearchBarInput();
  const response = await fetch(serverUrl + "/search/" + searchString, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    response.json().then((jsonBody) => {
      callback(jsonBody);
    });
  } else {
    console.error("an error occured: " + error.message);
  }
}

function getSearchBarInput() {
  const searchField = document.getElementById("search-field");
  return searchField.value;
}

function generateSearchPage(json) {
  const articleDiv = document.querySelector(".artist-grid-container");
  articleDiv.innerHTML = "";

  if (json.artistArr.length === 1) {
    console.log(json);
    generateArtistPage(json.artistArr[0]._id);
    return;
  }

  for (let i = 0; i < json.artistArr.length; i++) {
    const artistElement = createArtistGridItem(json.artistArr[i]);
    articleDiv.appendChild(artistElement);
  }
}

function createContentElement(tag, content) {
  const element = document.createElement(tag);
  const text = document.createTextNode(content);
  element.appendChild(text);
  return element;
}
