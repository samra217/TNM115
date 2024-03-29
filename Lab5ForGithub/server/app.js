const http = require("node:http");

const fs = require("fs");

const hostname = "127.0.0.1";
const port = 3000;
const serverUrl = "http://" + hostname + ":" + port;

const dbName = "tnm115-lab";
const dbCollectionName = "artists";

const MongoClient = require("mongodb").MongoClient;
const dbHostname = "127.0.0.1";
const dbPort = 27017;
const dbServerUrl = "mongodb://" + dbHostname + ":" + dbPort + "";

const dbClient = new MongoClient(dbServerUrl);

const server = http.createServer((req, res) => {
  const requestUrl = new URL(serverUrl + req.url);
  const pathComponents = requestUrl.pathname.split("/");

  if (req.method === "OPTIONS") {
    sendResponse(res, 204, null, null);
  }
  if (req.method == "POST") {
    if (pathComponents[1] === "insertartist") {
      readJsonFromClient(req, res);
    }
  }

  if (req.method === "GET") {
    if (requestUrl.pathname === "/artists") {
      routingAllArtists(res)
        .catch(console.error)
        .finally(() => {
          closeDbConnection();
        });
    } else if (requestUrl.pathname.startsWith("/artists/")) {
      const artistID = pathComponents[2];
      routingSpecificArtist(artistID, res)
        .catch(console.error)
        .finally(() => {
          closeDbConnection();
        });
    } else if (requestUrl.pathname.startsWith("/search/")) {
      const searchString = pathComponents[2];
      routingSearch(res, searchString);
    } else if (requestUrl.pathname.startsWith("/image/")) {
      const artistID = pathComponents[2];
      let imagePath = "./media/" + artistID + ".png";

      if (!fs.existsSync(imagePath)) {
        imagePath = "./media/PLACEHOLDER.png";
      }
      readFile(imagePath, res);
    } else {
      sendResponse(
        res,
        404,
        "application/json",
        JSON.stringify({ error: "api endpoint doesn't exist" })
      );
    }
  }
});
server.listen(port, hostname, () => {
  console.log("the server is running and listening at:\n" + serverUrl);
});

function readFile(imagePath, res) {
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

async function routingAllArtists(res) {
  await dbClient.connect();
  const dbCollection = dbClient.db(dbName).collection(dbCollectionName); //Selects the database, and then select the collection (might have to change)

  const sortQuery = { name: 1 };

  const artistsArray = await dbCollection
    .find({})
    .project({ name: 1, _id: 1 })
    .sort(sortQuery)
    .toArray();

  const artistJson = { artistsArr: artistsArray };
  sendResponse(res, 200, "application/json", JSON.stringify(artistJson));
}

async function routingSpecificArtist(artistID, res) {
  await dbClient.connect();
  const dbCollection = dbClient.db(dbName).collection(dbCollectionName); //Selects the database, and then select the collection (might have to change)

  const filterQuery = { _id: parseInt(artistID) };

  const document = await dbCollection.find({}).filter(filterQuery).toArray();

  const documentJson = { artist: document };
  sendResponse(res, 200, "application/json", JSON.stringify(documentJson));
}

async function routingSearch(res, searchString) {
  const searchQuery = { $text: { $search: searchString } };
  console.log(searchString);
  await dbClient.connect();
  const dbCollection = dbClient.db(dbName).collection(dbCollectionName); //Selects the database, and then select the collection (might have to change)

  const document = await dbCollection
    .find({})
    .filter(searchQuery)
    .project({ name: 1, _id: 1 })
    .toArray();

  const documentJson = { artistArr: document };
  console.log(documentJson);
  console.log(document.length);
  sendResponse(res, 200, "application/json", JSON.stringify(documentJson));
}

function readJsonFromClient(req, res) {
  const bodyChunks = [];

  //handling error while reading
  req.on("error", (err) => {
    console.log(
      "An error ocurred when reading the HTTP POST message body: " + err.message
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
    insertToDB(res, messageBody)
      .catch(console.error)
      .finally(() => {
        closeDbConnection();
      });
  });
}

async function insertToDB(res, messageBody) {
  try {
    await dbClient.connect();
    const dbCollection = dbClient.db(dbName).collection(dbCollectionName); //Selects the database, and then select the collection
    await dbCollection.insertOne(JSON.parse(messageBody));
    sendResponse(res, 200, null, null);
  } catch (error) {
    sendResponse(res, 500, "application/json", error.message);
  }
}

function sendResponse(res, statusCode, contentType, data) {
  res.statusCode = statusCode;
  if (contentType != null) res.setHeader("Content-Type", contentType);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (data != null) res.end(data);
  else res.end();
}

function closeDbConnection() {
  dbClient.close();
  console.log("=== FINISHED FETCHING DATA ===");
}
