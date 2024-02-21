const MongoClient = require("mongodb").MongoClient;
const dbHostname = "127.0.0.1";
const dbPort = 27017;
const dbServerUrl = "mongodb://" + dbHostname + ":" + dbPort + "";
const dbClient = new MongoClient(dbServerUrl);

const dbName = "tnm115-lab";
const dbCollectionName = "artists";

async function createIndex() {
  await dbClient.connect(); // (1) establish an active connection to the specified MongoDB server
  const db = dbClient.db(dbName); // (2) select (create) a specified database on the server
  const dbCollection = db.collection(dbCollectionName); // (3) select (create) a specified (document) collection in the database

  const searchQuery = { name: "text", realname: "text", description: "text" };
  const index = await dbCollection.createIndex(searchQuery);
}

function closeDbConnection() {
  dbClient.close();
}

createIndex()
  .catch(console.error)
  .finally(() => {
    closeDbConnection();
  });
