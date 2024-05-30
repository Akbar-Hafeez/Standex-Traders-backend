import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from  'jsonwebtoken';
export const verifyJwt = asyncHandler(async(req,res,next)=>{ 
    try {
        const token = req.cookies?.Token || req.header("Authorization")?.
        replace("bearer ", "")
       
        if (!token) {
            throw new ApiError(
                401,"Unauthorized request login to send message"
               
            )
        }
        const decodedToken = jwt.verify(token,process.env.TOKEN_SECRET)
        const user = await User.findOne(decodedToken?.email)
    
        if (!user) {
           throw new ApiError (401,"Invalid Access Token") 
        }
        req.user = user;
        next()
    } catch (error) {
        
        console.error("Verifying jwt error:", error.message);
        return res
          .status(error.statusCode || 500)
          .send(new ApiResponse(error.statusCode || 500, null, error.message));
    }
})