const request = require("supertest");
const app = require("../../app");
const dotenv = require("dotenv");
const jwt_decode = require("jwt-decode");
dotenv.config({ path: "./config.env" });
let token;
let id;

describe("Product route", () => {
  beforeAll(async () => {
    const response = await request(app).post("/api/v1/auths/signin").send({
      email: "drinks@storeOwner.com",
      password: "qwerty123$4",
    });
    token = "Bearer " + response.body.token;
    const decodedToken = jwt_decode(token);
    id = decodedToken.id;
  }, 20000);

  test("Create product", async () => {
    const response = await request(app)
      .post("/api/v1/products/product")
      .set("Authorization", token)
      .send({
        productName: "CocaCola",
        category: "Non-alcoholic",
        vendor: id,
        price: 200,
        description: "This drink is for parties",
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: true,
        message: expect.any(String),
      })
    );
  }, 4000);

  test("get a Product", async () => {
    const response = await request(app)
      .get("/api/v1/products/product/633ac5e66c1c4268abe83677")
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: true,
        message: expect.any(String),
      })
    );
  });

  test("get all Product", async () => {
    const response = await request(app)
      .get("/api/v1/products/product")
      .set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: true,
        message: expect.any(String),
      })
    );
  });
});
