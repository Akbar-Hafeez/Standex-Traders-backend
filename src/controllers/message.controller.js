
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const sendMessage = async (req, res) => {
  try {
   
    const{ name,companyName,phoneNumber,email,message,subject}=req.body
    console.log("name:",name)
    if (
        [name,companyName,phoneNumber,email,message].some((field)=> field?.trim( ) === "") 
    ) {
       throw new ApiError(400,"All fields are required") 
    }
    const existedMessage=await Message.findOne({
        $or:[{phoneNumber},{email}]
    })
    if (existedMessage) {
        throw new ApiError(409,"Message with this Phone Number or email already exist u can contact on our email or contact number for further assistannce")
    }
    
    const user =await Message.create({
      name,
      companyName,
      phoneNumber,
      email
      ,message,
      subject
    
    })
    
   
    const sendMessage = await Message.findById(user._id)
  
    if (!sendMessage) {
       throw new ApiError(500,"Something went wrong while sending the message") 
    }
    
    
    return res.status(201).json(
        new ApiResponse(200,sendMessage,"Message send successfully")
    )
  } catch (error) {
    
    console.error("Sending message error:", error.message);
    return res.status(error.statusCode || 500).send(new ApiResponse(error.statusCode || 500, null, error.message));
  }
};
export  {sendMessage}