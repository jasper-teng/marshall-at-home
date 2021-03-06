const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;
const app = require("../app");

describe("Testing GET SUCCESSFUL /questions endpoint", () => {
  it("get questions", async () => {
    const response = await request.get("/questions");

    expect(response.status).to.eql(200);
    expect(response.body, "You fucked up your api call\nOr you might have deleted all you questions").to.not.be.null;
  });
});
