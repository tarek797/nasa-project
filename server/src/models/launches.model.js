const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");

const launches = new Map();

let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;  
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDB.findOne({}).sort("-flightNumber")

  if(!latestLaunch) return DEFAULT_FLIGHT_NUMBER

  return latestLaunch.flightNumber
}

async function getAllLaunches() {
  return await launchesDB.find(
    {},
    {
      "_id": 0,
      "__v": 0,
    }
  );
}

async function saveLaunch(launch) {
  const planet = planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  await launchesDB.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch){
  const newFlightNumber = await getLatestFlightNumber() + 1

  const newLaunch = Object.assign(launch, 
    {success:true, upcoming: true,
    customer: ["ZTM", "NASA"],
    flightNumber:newFlightNumber 
    })

    await saveLaunch(newLaunch)
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  abortLaunchById,
  scheduleNewLaunch
};
