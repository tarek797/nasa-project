//using the prebuilt node http server for separation concerns
const http = require("http");
const mongoose = require("mongoose");

const app = require("./app.js");

const { loadPlanetsData } = require("./models/planets.model.js");

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://nasa-api:nasaapipassword@nasacluster.fb6g6gv.mongodb.net/nasa?retryWrites=true&w=majority";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}

startServer();
