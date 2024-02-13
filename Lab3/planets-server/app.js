const http = require("node:http");
const fs = require("fs");
const { send } = require("node:process");

const hostname = "127.0.0.1";
const port = 3001;
const serverUrl = "http://" + hostname + ":" + port;
const hej = "Hej";
const server = http.createServer((req, res) => {
  const requestUrl = new URL(serverUrl + req.url);
  
  const pathComponents = requestUrl.pathname.split("/");
  if (req.method == "OPTIONS") {
    sendResponse(res, 204, null, null);
  }

  
  if (req.method == "GET") {
    if (requestUrl.pathname == "/data") {
      const jsonData = require("./solar-system-data.json");
      sendResponse(res, 200, "application/json", JSON.stringify(jsonData));
      

    } else if (requestUrl.pathname.startsWith("/data/")) {
      const jsonData = require("./solar-system-data.json");
      const entityName = pathComponents[2]; //the name of the planet we're looking for

      
      console.log(entityName);
      let entity;
      if (entityName.toLowerCase() === "sun") {
        //EDGE CASE (SUN IS NOT IN jsonData.planets)
        entity = jsonData.star;
      } else {

        entity = jsonData.planets.find((planet) => {
          return planet.name.toLowerCase() === entityName.toLowerCase();
        });

      }

      if (entity) {
        sendResponse(res, 200, "application/json", JSON.stringify(entity));
      } else {
        sendResponse(
          res,
          404,
          "application/json",
          JSON.stringify({ error: "entity not found" })
        );
      }
    } 
    else if (requestUrl.pathname.startsWith("/image/")) {
      const entityName = pathComponents[2];
      const imagePath = "./media/" + entityName + ".png";

      
      if (fs.existsSync(imagePath)) {
        fs.readFile(imagePath, (err, data) => {
          if (err) {
            sendResponse(
              res,
              404,
              "text/plain",
              "An error occured reading the image"
            );
          } else {
            sendResponse(res, 200, "image/png", data);
          }
        });
      }
    } else {
      sendResponse(res, 404, "application/json", JSON.stringify({error: "api endpoint doesn't exist"}))
    }
  }
});

server.listen(port, hostname, () => {
  console.log("server is running at url: " + serverUrl);
});

function sendResponse(res, statusCode, contentType, data) {
  res.statusCode = statusCode;
  if (contentType != null) res.setHeader("Content-Type", contentType);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (data != null) res.end(data);
  else res.end();
}
