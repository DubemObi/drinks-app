const request = require("supertest");
const app = require("../../app");
const dotenv = require("dotenv");
const jwt_decode = require("jwt-decode");
dotenv.config({ path: "./config.env" });
let token;
let id;
let cart;

describe("Order Endpoints", () => {
  beforeAll(async () => {
    const response = await request(app).post("/api/v1/auths/signin").send({
      email: "drinks@yahoo.com",
      password: "qwerty123$4",
    });
    token = "Bearer " + response.body.token;
    const decodedToken = jwt_decode(token);
    id = decodedToken.id;
    
    cart = await request(app)
      .patch("/api/v1/carts/cart/add/" + id)
      .set("Authorization", token)
      .send({
        productId: "633a4dd5a48fe46e44a15110",
        quantity: 1,
      });
  }, 20000);

  test("Create order", async () => {
    console.log(id, token);
    const response = await request(app)
      .post("/api/v1/orders/order/create/" + id)
      .set("Authorization", token)
      .send({
        cartId: id,
        address: "no 3, seamfix street",
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Order created Successfully!",
      })
    );
  }, 20000);

  test("Update Order", async () => {
    const response = await request(app)
      .patch("/api/v1/orders/order/update/" + id)
      .set("Authorization", token)
      .send({
        address: "no 3, seamfix street",
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Order has been updated successfully",
      })
    );
  });

  test("getAllOrders", async () => {
    const response = await request(app)
      .get("/api/v1/orders/allOrders")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "All Orders have been retrieved!",
      })
    );
  });

  test("get User Orders", async () => {
    const response = await request(app)
      .get("/api/v1/orders/allOrders")
      .set("Authorization", token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        data: expect.any(Object),
      })
    );
  });

  test("Delete Order", async () => {
    const response = await request(app)
      .delete("/api/v1/orders/order/" + id)
      .set("Authorization", token)
      .send({ orderId: id });
console.log(response.body)
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Order deleted successfully",
      })
    );
  });
});
