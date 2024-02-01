const http = require("node:http");
const hostname = "127.0.0.1";
const port = 3000;
const serverUrl = "http://" + hostname + ":" + port;

const server = http.createServer((req, res) => {
  const requestUrl = new URL(serverUrl + req.url);
  const pathComponents = requestUrl.pathname.split("/");

  if (req.method == "GET") {
    sendResponse(res, 200, "text/plain", "Welcome to the server");
  }

  if (req.method == "OPTIONS") {
    //CORS? to check if a server can handle a request
    sendResponse(res, 205, null, null);
  }

  if (req.method == "POST") {
    switch (pathComponents[1]) {
      case "score":
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
          routingScore(res, messageBody);
        });
        break;

      default: // if the submitted score (in this case) could not be read
        sendResponse(
          res,
          400,
          "plain",
          "A HTTP POST method has been sent to the server, but no specific API endpoint could be determined."
        );
    }
  }
});

server.listen(port, hostname, () => {
  console.log("the server is running and listening at:\n" + serverUrl);
});

function sendResponse(res, statusCode, contentType, data) {
  res.statusCode = statusCode;
  if (contentType != null) res.setHeader("Content-Type", contentType);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (data != null) res.end(data);
  else res.end();
}

function routingScore(res, jsonString) {
  const susJsonDataFromClient = JSON.parse(jsonString);

  const susScore = calculateScore(susJsonDataFromClient.results);

  if (susScore == null) sendResponse(res, 204, null, null);
  else {
    const jsonResult = {
      name: "SUS score from server",
      result: susScore,
    };
    const jsonResultString = JSON.stringify(jsonResult);
    sendResponse(res, 200, "applicatin/json", jsonResultString);
  }
}

function calculateScore(resultJsonArray) {
  // Scoring SUS:
  // SUS yields a single number representing a composite measure of the overall usability of the
  // system being studied. Note that scores for individual items are not meaningful on their own.
  // To calculate the SUS score, first sum the score contributions from each item. Each item's
  // score contribution will range from 0 to 4. For items 1,3,5,7,and 9 the score contribution is
  // the scale position minus 1. For items 2,4,6,8 and 10, the contribution is 5 minus the scale
  // position. Multiply the sum of the scores by 2.5 to obtain the overall value of SU.
  // SUS scores have a range of 0 to 100.
  //
  // Source: John Brooke. SUS: A ’Quick and Dirty’ Usability Scale. In Patrick W. Jordan,
  // B. Thomas, Ian Lyall McClelland, and Bernard Weerdmeester, editors, Usability Evaluation
  // In Industry, pages 189–194. CRC Press, 11 June 1996. doi: 10.1201/9781498710411.

  let sumOdd = 0;
  let sumEven = 0;

  for (let i = 0; i < resultJsonArray.length; i++) {
    if (resultJsonArray[i].value == null) return null;
    if (resultJsonArray[i].id % 2 == 0) {
      sumEven += resultJsonArray[i].value;
    } else {
      sumOdd += resultJsonArray[i].value;
    }
  }

  const x = sumOdd - 5;
  const y = 25 - sumEven;

  const susScore = (x + y) * 2.5;
  return susScore;
}
