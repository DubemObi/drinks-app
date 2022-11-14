const request = require("supertest");
const app = require("../../app");
const dotenv = require("dotenv");
const jwt_decode = require("jwt-decode");
dotenv.config({ path: "./config.env" });
let token;
let id;
describe("Cart Endpoints", () => {
  

  beforeAll(async () => {
    const response = await request(app).post("/api/v1/auths/signin").send({
      email: "drinks@yahoo.com",
      password: "qwerty123$4",
    });
    token = "Bearer " + response.body.token;
      const decodedToken = jwt_decode(token);
      id = decodedToken.id
    
  }, 20000);

  test("Add to cart", async () => {
   
    const response = await request(app)
      .patch("/api/v1/carts/cart/add/"+id)
      .set("Authorization", token)
      .send({
        productId: "633a4dd5a48fe46e44a15110",
        quantity: 1,
      });
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        cart: expect.any(Object),
      })
    );
  }, 20000);

  test("Get cart", async () => {
    const response = await request(app)
      .get("/api/v1/carts/cart/"+id)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "Cart retrieved",
      })
    );
  });

  test("remove from cart", async () => {
    const response = await request(app)
      .patch("/api/v1/carts/cart/remove/"+id)
      .set("Authorization", token)
      .send({
        productId: "633a4dd5a48fe46e44a15110",
        quantity: expect.any(Number),
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "drink deleted from cart successfully",
      })
    );
  });

  test("Delete cart", async () => {
    const response = await request(app)
      .get("/api/v1/carts/cart/"+id)
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body.success).toEqual(true);
  });
});
