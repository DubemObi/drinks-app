const express = require("express");
const productController = require("../controllers/product-controller");
const { auth, checkUser } = require("../middleware/authMiddleware");

const router = express.Router();

const { createProduct, getOneProduct, uploadProfileImage, resizeImage, updateProduct, deleteProduct, getAllProducts } =   productController;

router
    .route("/:id")
    .get(getOneProduct)
    .put(auth, checkUser("vendor"), uploadProfileImage, resizeImage, updateProduct)
    .delete(auth, checkUser("vendor", "admin"), deleteProduct)

router.route("/").get(getAllProducts).post(auth, checkUser("vendor"), createProduct);

module.exports = router;
