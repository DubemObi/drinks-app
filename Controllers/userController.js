const User = require("../Models/userModel");
const ErrorHandler = require("../utils/error");

exports.updateUser = async (request, response) => {
  try {
    // const id = request.params.id;
    const user = request.user;
    const findUser = await User.findById(user.id);
    findUser.fullname = request.body.fullname;
    findUser.email = request.body.email;
    findUser.phoneNumber = request.body.phoneNumber;
    await findUser.save();
    return response.status(200).send({
      status: true,
      message: "Account has been updated successfully",
      updatedUser: findUser,
    });
  } catch (err) {
    const error = ErrorHandler.handleErrors(err);
    response.status(404).json({ error });
  }
};

exports.getUser = async (request, response) => {
  try {
    // const id = request.params.id;
    const user = request.user;
    const findOneUser = await User.findById(user.id);
    if (!findOneUser) {
      return response.status(404).send({
        status: false,
        message: "User not found",
      });
    } else {
      return response.status(200).send({
        status: true,
        message: "User found",
        User: findOneUser,
      });
    }
  } catch (err) {
    if (err.path === "_id") {
      return response.status(401).send({
        status: false,
        message: "Invalid ID",
      });
    } else {
      return response.status(500).send({
        status: false,
        message: "Server Error",
      });
    }
  }
};

exports.getAllUsers = async (request, response) => {
  try {
    const findAllUsers = await User.find();
    return response.status(200).send({
      status: true,
      message: "Users found",
      AllUsers: findAllUsers,
    });
  } catch (err) {
    console.log(err);
    return response.status(404).send({
      status: false,
      message: "No users found",
    });
  }
};

exports.deleteUser = async (request, response) => {
  const user = request.user;
  const findUser = await User.findByIdAndDelete(user.id);
  if (findUser) {
    return response.status(200).send({
      status: true,
      message: "User deleted successfully",
      deletedUser: findUser,
    });
  } else {
    return response.status(404).send({
      status: false,
      message: "User not found",
    });
  }
};
