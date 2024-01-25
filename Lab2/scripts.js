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
const solarSystemData = {
    version: "2024-01-23",
    data_source: "https://science.nasa.gov/solar-system/",
    star : {
        id: "s1",
        name: "Sun",
        description: "A star is a hot, glowing ball of gas. When you look up in the night sky, you can see countless twinkling stars. Can you see any stars during the daytime? Of course! The light of daytime comes from our closest star: the Sun.",
        neighbors: [ "p1" ],
        image_src: "media/sun.png",
        online_ref: "https://science.nasa.gov/sun/"
    },
    planets : [
        { 
            id: "p1",
            name: "Mercury",
            description: "Mercury is the smallest planet in our solar system. It's just a little bigger than Earth's Moon. Mercury itself, though, doesn't have any moons. It is the closest planet to the Sun, but it's actually not the hottest. Venus is hotter.",
            time_day: 59,
            time_year: 88,
            moons: null,
            neighbors: [ "s1", "p2" ],
            image_src: "media/mercury.png",
            online_ref: "https://science.nasa.gov/mercury/"
        },
        { 
            id: "p2",
            name: "Venus",
            description: "Venus looks like a very active planet. It has mountains and volcanoes. Venus is similar in size to Earth. Earth is just a little bit bigger.",
            time_day: 243,
            time_year: 225,
            moons: null,
            neighbors: [ "p1", "p3" ],
            image_src: "media/venus.png",
            online_ref: "https://science.nasa.gov/venus/"
        },
        { 
            id: "p3",
            name: "Earth",
            description: "Our home planet Earth is a rocky, terrestrial planet. It has a solid and active surface with mountains, valleys, canyons, plains and so much more. Earth is special because it is an ocean planet. Water covers 70% of Earth's surface.",
            time_day: 1,
            time_year: 365.25,
            moons: [ "Moon" ],
            neighbors: [ "p2", "p4" ],
            image_src: "media/earth.png",
            online_ref: "https://science.nasa.gov/earth/"
        },
        { 
            id: "p4",
            name: "Mars",
            description: "Mars is a cold desert world. The average temperature on Mars is minus 85 degrees Fahrenheit - way below freezing. It is half the size of Earth. Mars is sometimes called the Red Planet. It's red because of rusty iron in the ground.",
            time_day: 1.025,
            time_year: 687,
            moons: [ "Phobos", "Deimos" ],
            neighbors: [ "p3", "p5" ],
            image_src: "media/mars.png",
            online_ref: "https://science.nasa.gov/mars/"
        },
        { 
            id: "p5",
            name: "Jupiter",
            description: "Jupiter is the biggest planet in our solar system. It's similar to a star, but it never got massive enough to start burning. It is covered in swirling cloud stripes. It has big storms like the Great Red Spot, which has been going for hundreds of years. Jupiter is a gas giant and doesn't have a solid surface.",
            time_day: 0.417,
            time_year: 11.8,
            moons: 95,
            neighbors: [ "p4", "p6" ],
            image_src: "media/jupiter.png",
            online_ref: "https://science.nasa.gov/jupiter/"
        },
        { 
            id: "p6",
            name: "Saturn",
            description: "Saturn isn't the only planet to have rings, but it definitely has the most beautiful ones. The rings we see are made of groups of tiny ringlets that surround Saturn. They're made of chunks of ice and rock. Like Jupiter, Saturn is mostly a ball of hydrogen and helium.",
            time_day: 0.446,
            time_year: 29,
            moons: 146,
            neighbors: [ "p5", "p7" ],
            image_src: "media/saturn.png",
            online_ref: "https://science.nasa.gov/saturn/"
        },
        { 
            id: "p7",
            name: "Uranus",
            description: "Uranus is made of water, methane, and ammonia fluids above a small rocky center. Its atmosphere is made of hydrogen and helium like Jupiter and Saturn, but it also has methane. The methane makes Uranus blue.",
            time_day: 0.71,
            time_year: 84,
            moons: 27,
            neighbors: [ "p6", "p8" ],
            image_src: "media/uranus.png",
            online_ref: "https://science.nasa.gov/uranus/"
        },
        { 
            id: "p8",
            name: "Neptune",
            description: "Neptune is dark, cold, and very windy. It's the last of the planets in our solar system. It's more than 30 times as far from the sun as Earth is. Neptune is very similar to Uranus. It's made of a thick fog of water, ammonia, and methane over an Earth-sized solid center.",
            time_day: 0.71,
            time_year: 165,
            moons: 14,
            neighbors: [ "p7" ],
            image_src: "media/neptune.png",
            online_ref: "https://science.nasa.gov/neptune/"
        }
    ]
};
// =============================

// manually added listener for the "DOMContentLoaded" event, which is automatically invoked
// once the initial loading of the web page has been completed (.html file is completely parsed) 
document.addEventListener("DOMContentLoaded", function(){
   console.log("HTML DOM tree loaded, and ready for manipulation.");
   // === YOUR FUNCTION CALL TO INITIATE THE GENERATION OF YOUR WEB PAGE SHOULD GO HERE ===


    const webPageURL = new URL(document.URL);

    document.body.appendChild(generateButton("Home"));
    switch(webPageURL.searchParams.get("page")){
        case "all":
            document.body.innerHTML ="";
            document.body.appendChild(generateAll());
            break;
        case "sun":
            document.body.appendChild(generateSun());
            break;
        case "mercury":
            document.body.appendChild(generatePlanetText(solarSystemData.planets[0]));
            break;
        case "venus":
            document.body.appendChild(generatePlanetText(solarSystemData.planets[1]));
            break;
        case "earth":
            document.body.appendChild(generatePlanetText(solarSystemData.planets[2]));
            break;
        case "mars":
            document.body.appendChild(generatePlanetText(solarSystemData.planets[3]));
            break;
        case "jupiter":
            document.body.appendChild(generatePlanetText(solarSystemData.planets[4]));
            break;
        case "saturn":
            document.body.appendChild(generatePlanetText(solarSystemData.planets[5]));
            break;
        case "uranus":
            document.body.appendChild(generatePlanetText(solarSystemData.planets[6]));
            break;
        case "neptune":
            document.body.appendChild(generatePlanetText(solarSystemData.planets[7]));
            break;
        default:
            document.body.innerHTML ="";
            document.body.appendChild(home());
            break;

    }
    

});

// ===== PROVIDED JS SOURCE CODE    -- ABOVE   =====
// ===== JS LAB 2 IMPLEMENTATION -- BENEATH =====


function generateButton(planetName) {
    const buttonDiv = document.createElement("div");
    buttonDiv.className = "button-grid-item";

    const button = document.createElement("button");
    
    
    button.onclick = function() {
        buttonOnClick(planetName); 
    }
    
        
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

function getPlanetIDbyName(planetName) {
    if(planetName.toLowerCase() === "sun"){
        return "s1"; //id for sun
    } 
    else if(planetName.toLowerCase() === "all") {
        return "all";
    }
    for(i = 0; i < solarSystemData.planets.length; i++){
        if(solarSystemData.planets[i].name.toLowerCase() === planetName.toLowerCase()){
            return solarSystemData.planets[i].id;
        }
    }
    return "0"; //ID for homebutton
}

function getPlanetNamebyID(planetID){
    if(planetID.toLowerCase() === "s1"){
        return "Sun"; 
    } 

    for(i = 0; i < solarSystemData.planets.length; i++){
        if(solarSystemData.planets[i].id.toLowerCase() === planetID.toLowerCase()){
            return solarSystemData.planets[i].name;
        }
    }

}

function getNeighbors(planet){
    returnString = "";
    for (let i = 0; i<planet.neighbors.length;i++){
        returnString += getPlanetNamebyID(planet.neighbors[i])+ " ";
    }
    return returnString;
}





function buttonOnClick(planetName){
    document.body.innerHTML ="";

    const planetID = getPlanetIDbyName(planetName);

    if ( planetID === "0"){
        document.body.appendChild(home());
        return;
    }

    document.body.appendChild(generateButton("Home"));
    if(planetName.toLowerCase() === "all") {
        document.body.appendChild(generateAll());
    }

    else if(planetID.startsWith("p")){
        
        for(let i = 0; i < solarSystemData.planets.length; i++){
            if(planetID.endsWith(i+1)) {
                
                document.body.appendChild(generatePlanetText(solarSystemData.planets[i]));
            }
        }
    }
    else {
       
        document.body.appendChild(generateSun()); //function call for the sun
    }
    
}


function getTimeInHours(days){
    return days*24;
}


function generateAll(){
    document.body.innerHTML = "";
    document.body.appendChild(generateButton("Home"));
    const gridContainer = document.createElement("article");
    gridContainer.className = "button-grid-container";
    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = "1fr 1fr 1fr";

    gridContainer.style.gap = "100px";
    gridContainer.style.width = "100%";

    
    gridContainer.appendChild(generateSun());
    for(let i = 0; i < solarSystemData.planets.length; i++){
        gridContainer.appendChild(generatePlanetText(solarSystemData.planets[i]));
    }

    return gridContainer;
}

function home() {
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
    for(i = 0; i < solarSystemData.planets.length ; i++) {
        gridContainer.appendChild(
            generateButton(solarSystemData.planets[i].name)
        )
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
    const pTimeDay = createContentElement("p","Time Day: " + (planet.time_day < 1 ? getTimeInHours(planet.time_day) + " hours": planet.time_day +" days" )); //gives time in hours if time is less than 1 day
    const pTimeYear = createContentElement("p", "Time year: " + planet.time_year);
    const pMoons = createContentElement("p","Moons: " + (planet.moons != null?planet.moons: "0"));
    const anchor = generateAnchor(planet);
    const pNeighbors = createContentElement("p", "Neighbors: " + getNeighbors(planet));

    


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


function generateSun(){
    const divContainer = document.createElement("div");
    const h1 = document.createElement("h1");
    const h1Text = document.createTextNode("Sun");
    h1.appendChild(h1Text);

    const pDesc = createContentElement("p", solarSystemData.star.description);
    const anchor = generateAnchor(solarSystemData.star);
    const pNeighbors = createContentElement("p", "Neighbors: " + getNeighbors(solarSystemData.star));

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

