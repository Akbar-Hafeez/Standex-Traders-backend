import  express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { ApiError } from "./utils/apiError.js"
import { ApiResponse } from "./utils/ApiResponse.js"
const app =express()
app.use(cors({
    origin:['http://localhost:3000','http://localhost:5000'],
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err instanceof ApiError) {
        res.status(err.statusCode).send(new ApiResponse(err.statusCode, null, err.message));
    } else {
        res.status(500).send(new ApiResponse(500, null, "Internal Server Error"));
    }
});


//routes decleration
import authRoutes from "./routes/auth.route.js"
import messageRoute from "./routes/message.route.js"
import { verifyJwt } from "./middlewares/auth.middleware.js"

app.use("/api/v1/auth",authRoutes)
app.get('/api/v1/verify-token', verifyJwt, (req, res) => {
    return res.status(200).json(new ApiResponse(200, { userId: req.user._id }, 'Token is valid'));
});
app.use("/api/v1/message",messageRoute)

export {app}