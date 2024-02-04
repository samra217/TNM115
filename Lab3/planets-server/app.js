const http = require("node:http");
const fs = require("fs");

const hostname = "127.0.0.1";
const port = 3001;
const serverUrl = "http://" + hostname + ":" + port;

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
      const entityName = pathComponents[2];
      let entity;
      if (entityName.toLowerCase() === "sun") {
        //EDGE CASE (SUN IS NOT IN jsonData.planets)
        entity = "sun";
      } else {
        entity = jsonData.planets.find((planet) => {
          planet.name.toLowerCase() === entityName.toLowerCase();
        });
      }

      if (entity) {
        sendResponse(res, 200, "application/json", JSON.stringify(entity));
      } else {
        sendResponse(
          res,
          404,
          "application/json",
          JSON.stringify({ error: "enttiy not found" })
        );
      }
    } else if (requestUrl.pathname.startsWith("/image/")) {
      const entityName = pathComponents[2];
      console.log(entityName);
      const imagePath = "./media/" + entityName + ".png";
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.readFile(imagePath, (err, data) => {
          if (err) {
            sendResponse(
              res,
              404,
              "text/plain",
              "An error occured reading the file"
            );
          } else {
            sendResponse(res, 200, "image/png", data);
          }
        });
      }
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
