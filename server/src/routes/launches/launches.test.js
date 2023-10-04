const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("content-Type", /json/)
      .expect(200);
  });
});

describe("Test POST /launches", () => {
  test("It should respond with 200 success", async () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler 102",
      launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler 102",
    };

    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("content-Type", /json/)
      .expect(201);

    expect(response.body).toMatchObject(launchDataWithoutDate);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(responseDate).toBe(requestDate);
  });

  test("It should catch missing required properties", () => {});
});
