const Product = require("../models/product-model")
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config({path : "./config.env"});
const multer = require("multer");

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_USER_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

//handle errors
const handleError = (err) => {
    console.log(err.message);
    let errors = { owner : "", name : "", description : "", price : "", quantity : "", productImage : ""};
    
    //validate errors
    if(err.message.includes('Product validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
        
    }

    return errors;
}

//Upload a product
exports.createProduct = async (req, res) => {
    try {
        req.body.owner = req.user._id;
        const product = await Product.create(req.body);
        return res.status(200).send({
            status : true,
            meassage : "Successfully uploaded a product",
            data : {
                product
            }
        });
          
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    } 
}

//Get all Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            status : true,
            results : products.length,
            data : {
                products
            }
        })   
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}

//Get a product
exports.getOneProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json({
            status: "success",
            data: {
                product
            }
        });
    } catch (err) {
        const errors = handleError(err)
        res.status(400).json({ errors });
    }
};

//Upload a user image
const multerStorage = multer.diskStorage({});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  }
};


const uploadImage = multer({
    storage : multerStorage,
    fileFilter : multerFilter
});

exports.uploadProfileImage = uploadImage.single("profileImage");

exports.resizeImage = async (req, res, next) => {
    if (req.file) {
        let profileImage;

        const user = await User.findById(req.params.id);

        if (!user) {
          return res.status(400).json({
            status: "fail",
            message: `There is no user with the ID ${req.params.id}`,
          });
        }
    
        const result = await cloudinary.uploader.upload(req.file.path, {
                public_id : `${req.body.name}`,
                width : 2000,
                height : 1500
            }).catch((err) => console.log(err)); 

  
        profileImage = result.url;
        req.body.profileImage = profileImage;
      }
  
    next();
  };


//Update a Product
exports.updateProduct = async (req, res) => {
    try {
        const vendor = await Product.findById(req.params.id);
        if (!vendor) {
          return res.status(400).json({
            status: "fail",
            message: `There is no product from the vendor with the ID ${req.params.id}`,
          });
        }
        const category = req.body.category === undefined ? product.category : req.body.category;
        const name =
          req.body.name === undefined ? product.name : req.body.name;
        const quantity =
          req.body.quantity === undefined ? product.quantity : req.body.quantity;
        const price =
          req.body.price === undefined ? product.price : req.body.price;
        const update = { name, category, price, quantity };
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, update);
        res.status(200).json({
          status: "success",
          data: {
            product: updatedProduct,
          },
        });
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}

//Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        
        const delProduct = await Product.findByIdAndDelete(req.params.id);
    
        if(delProduct) {
            return res.status(201).send({
                status : true,
                message : "Product successfully deleted"
            });
        }else{
            return res.status(404).send({
                status : false,
                message : "Product cannot be fetched"
            })
        }
        
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({ errors });
    }
}