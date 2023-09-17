//using the prebuilt node http server for separation concerns
const http = require("http");
const app = require("./app.js");

const {loadPlanetsData} = require("./models/planets.model.js")

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await loadPlanetsData()
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}

startServer()