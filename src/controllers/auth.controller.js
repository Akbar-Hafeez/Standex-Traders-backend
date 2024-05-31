import { User } from "../models/user.model.js";
import {
  createdUser,
  findUserByEmail,
  getUserProfileByToken,
} from "../services/user.services.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken, getUserIdFromToken } from "../utils/jwtProvider.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await createdUser(req.body);
    const jwt = generateToken(user._id);
    const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "lax",
      domain: 'standex-traders.onrender.com', 
      path: '/'
    };
    return res
      .status(200)
      .cookie("Token", jwt, option)
      .json(new ApiResponse(200, jwt, "Register success"));
  } catch (error) {
    console.error("Registration error:", error.message);
    return res
      .status(error.statusCode || 500)
      .send(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      throw new ApiError(400, "User not found with email :", email);
    }
    const isPassswordValid = await bcrypt.compare(password, user.password);
    if (!isPassswordValid) {
        throw new ApiError(401, "Invalid Password");
    }
    const jwt = generateToken(user._id);

    const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "lax",
      domain: 'standex-traders.onrender.com', 
      path: '/'
    };
    return res
      .status(200)
      .cookie("Token", jwt, option)
      .json(
        new ApiResponse(
          200,
          {
            user: email,
            jwt,
          },
          "User logged In successfully"
        )
      );
  } catch (error) {
    console.error("signin error:", error.message);
    return res
      .status(error.statusCode || 500)
      .send(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};
const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          Token: undefined, //it will undefined the value of refresh token in db
        },
      },
      {
        new: true, //it will updated value of refreh token in return response
      }
    );
    const option = {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "lax",
      domain: 'standex-traders.onrender.com', 
      path: '/'
    };
    return res
      .status(200)
      .clearCookie("Token", option)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    console.error("logging out error:", error.message);
    return res
      .status(error.statusCode || 500)
      .send(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};

export { register, login, logout };
