const request = require("supertest");
const app = require("../../app");
const dotenv = require("dotenv");
const jwt_decode = require("jwt-decode");
dotenv.config({ path: "./config.env" });
let token;
let id;
describe("User route", () => {
  test("Create user", async () => {
    const response = await request(app).post("/api/v1/auths/signup").send(
      {
        name: "",
        email: "",
        password: "qwerty123$4",
        confirmPassword: "qwerty123$4",
        phoneNumber: "08023098161",
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        token: expect.any(String),
        data: expect.any(Object),
      })
    );
  },30000);

  test("User Login", async () => {
    const response = await request(app).post("/api/v1/auths/signin").send({
      email: "drinks@yahoo.com",
      password: "qwerty123$4",
    });
    token = "Bearer " + response.body.token;
    const decodedToken = jwt_decode(token);
    id = decodedToken.id;
    console.log(token, id);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: "success",
        token: expect.any(String),
        data: expect.any(Object),
      })
    );
  }, 20000);

  test("update user", async () => {
    const response = await request(app).put("/api/v1/users/user/"+id).set("Authorization", token).send({fullname: "ifeanyi", email:"drinks@yahoo.com"});
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: true,
        message: "Account has been updated successfully",
      })
    );
  });

  test("get a user", async () => {
    const response = await request(app).get("/api/v1/users/user/"+id).set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: true,
        message: expect.any(String),
      })
    );
  });

  test("get all users", async () => {
    const response = await request(app).get("/api/v1/users/user").set("Authorization", token);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        status: true,
        message: expect.any(String),
      })
    );
  });

  test("Delete User", async () => {
    const response = await request(app)
      .delete("/api/v1/auths/delete")
      .set("Authorization", token)
      .send({});
    expect(response.status).toBe(200);
  }, 20000);
});
