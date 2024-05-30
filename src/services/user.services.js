import {User} from "../models/user.model.js"
import bcrypt from "bcrypt";
import {generateToken,getUserIdFromToken} from "../utils/jwtProvider.js"
import { ApiError } from "../utils/apiError.js";
const createdUser = async (userData) => {
  try {
      const { name, email, password } = userData;

      const isUserExist = await User.findOne({ email });
      if (isUserExist) {
          throw new ApiError(400, "User already exists with email: " + email);
      }

      const bcryptPassword = await bcrypt.hash(password, 8);
      const user = await User.create({ name, email, password: bcryptPassword });
      console.log("created user", user);
      return user;
  } catch (error) {
   const emailError= ("Error creating user:", error.message);
    throw new ApiError(500, emailError);
  }
};

const findUserByEmail =async (email) => {
try {
    const user = await User.findOne({email})
    if (!user) {
        throw new ApiError(401,"user not found with email :",email)
    }
    return user;
} catch (error) {
  console.error("Error finding user by email:", error.message);
  throw new ApiError(401, "user not found with email :" + email);
}
}
const findUserById =async (userId) => {
try {
    const user = await User.findById(userId)
    // .populate("address") 
    // we dont have address right that why it s not working
    if (!user) {
        throw new ApiError(401,"user not found with id :",userId)
    }
    return user;
} catch (error) {
  console.error("Error while finding user by id:", error.message);
  throw new ApiError(500, "Something went wrong while finding user by id");
}
}
const getUserProfileByToken =async (token) => {
try {
    const userId = getUserIdFromToken(token)
    const user = await findUserById(userId)
    if (!user) {
      throw new ApiError(401,"user not found with id :",userId)
    }
  console.log("user",user)
  return user;
} catch (error) {
  console.error("Error while getting user profile by token:", error.message);
  throw new ApiError(500, "Something went wrong while getting user profile by token");
}
}
const getAllUsers =async () => {
  try {
    const users = await User.find(); 
    return users;
  } catch (error) {
    console.error("Error while getting all users:", error.message);
    throw new ApiError(500, "Something went wrong while getting all users"); 
  }
}
export { createdUser,findUserById,findUserByEmail,getUserProfileByToken,getAllUsers };