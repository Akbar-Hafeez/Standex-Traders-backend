import jwt from "jsonwebtoken"
const generateToken = (userId) =>{

    const token = jwt.sign({userId},process.env.TOKEN_SECRET,{expiresIn:process.env.TOKEN_EXPIRY})
    return token
}
const getUserIdFromToken = (token) =>{
const decodedToken = jwt.verify(token,process.env.TOKEN_SECRET)
return decodedToken.userId
}

export {generateToken,getUserIdFromToken}