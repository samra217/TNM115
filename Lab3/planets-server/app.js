const http = require("node:http");
const fs = require("fs");
const solarSystemData = require("./solar-system-data.json");

const hostname = "127.0.0.1";
const port = 3001;
const serverUrl = "http://" + hostname + ":" + port;

const server = http.createServer((req, res) => {
  const requestUrl = new URL(serverUrl + req.url);
  const pathComponents = requestUrl.pathname.split("/");
  if (req.method == "OPTIONS") {
    sendResponse(res, 204, null, null);
  }

  /*if (req.method == "GET") {
    switch (pathComponents[1]) {
      case "data":
        const bodyChunks = [];

        //handling error while reading
        req.on("error", (err) => {
          console.log(
            "An error ocurred when reading the HTTP POST message body: " +
              err.message
          );
          sendResponse(res, 500, null, null);
        });

        //read a chunk of data
        req.on("data", (chunk) => {
          bodyChunks.push(chunk);
        });

        // When last chunk of data is read
        req.on("end", () => {
          const messageBody = Buffer.concat(bodyChunks).toString();
          routingPlanet(res, messageBody);
        });
        break;
      default:
        sendResponse(
          res,
          400,
          "plain",
          "A HTTP GET method has been sent to the server, but no specific API endpoint could be determined."
        );
    }
  }*/

  if (req.method == "GET") {
    if (pathComponents[1] == "data") {
      if (pathComponents[2] != null) {
        switch (pathComponents[2]) {
          case "sun":
            sendResponse(
              res,
              200,
              "application/json",
              JSON.stringify(solarSystemData)
            );
            break;

          case "mercury":
            sendResponse(
              res,
              200,
              "application/json",
              JSON.stringify(solarSystemData.planets[0])
            );
            break;
          case "venus":
            sendResponse(
              res,
              200,
              "application/json",
              JSON.stringify(solarSystemData.planets[1])
            );
            break;
          case "earth":
            sendResponse(
              res,
              200,
              "application/json",
              JSON.stringify(solarSystemData.planets[2])
            );
            break;
          case "mars":
            sendResponse(
              res,
              200,
              "application/json",
              JSON.stringify(solarSystemData.planets[3])
            );
            break;
          case "jupiter":
            sendResponse(
              res,
              200,
              "application/json",
              JSON.stringify(solarSystemData.planets[4])
            );
            break;
          case "saturn":
            sendResponse(
              res,
              200,
              "application/json",
              JSON.stringify(solarSystemData.planets[5])
            );
            break;
          case "uranus":
            sendResponse(
              res,
              200,
              "application/json",
              JSON.stringify(solarSystemData.planets[6])
            );
            break;
          case "neptune":
            sendResponse(
              res,
              200,
              "application/json",
              JSON.stringify(solarSystemData.planets[7])
            );
            break;

          default:
            sendResponse(
              res,
              400,
              "plain",
              "A HTTP POST method has been sent to the server, but no specific API endpoint could be determined."
            );
        }
      } else {
        sendResponse(
          res,
          200,
          "application/json",
          JSON.stringify(solarSystemData)
        );
      }
    }

    if (pathComponents[1] == "image") {
      switch (pathComponents[2]) {
        case "sun":
          sendImageResponse(
            res,
            200,
            "image/png",
            solarSystemData.star.image_src
          );
          break;
        case "mercury":
          sendImageResponse(
            res,
            200,
            "image/png",
            solarSystemData.planets[0].image_src
          );
          break;
        case "venus":
          sendImageResponse(
            res,
            200,
            "image/png",
            solarSystemData.planets[1].image_src
          );
          break;
        case "earth":
          sendImageResponse(
            res,
            200,
            "image/png",
            solarSystemData.planets[2].image_src
          );
          break;
        case "mars":
          sendImageResponse(
            res,
            200,
            "image/png",
            solarSystemData.planets[3].image_src
          );
          break;
        case "jupiter":
          sendImageResponse(
            res,
            200,
            "image/png",
            solarSystemData.planets[4].image_src
          );
          break;
        case "saturn":
          sendImageResponse(
            res,
            200,
            "image/png",
            solarSystemData.planets[5].image_src
          );
          break;
        case "uranus":
          sendImageResponse(
            res,
            200,
            "image/png",
            solarSystemData.planets[6].image_src
          );
          break;
        case "neptune":
          sendImageResponse(
            res,
            200,
            "image/png",
            solarSystemData.planets[7].image_src
          );
          break;

        default:
          sendResponse(
            res,
            400,
            "plain",
            "A HTTP POST method has been sent to the server, but no specific API endpoint could be determined."
          );
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

function sendImageResponse(res, statusCode, contentType, imagePath) {
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      console.error(`Error reading image file: ${err}`);
      sendResponse(res, 500, "text/plain", "Internal Server Error");
    } else {
      sendResponse(res, statusCode, contentType, data);
    }
  });
}
function routingPlanet(res, planet) {
  sendResponse(res, 200, null, null);
}
