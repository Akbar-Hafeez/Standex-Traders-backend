import express from "express"
import { Router } from "express"
import { sendMessage} from "../controllers/message.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
const router = Router()


router.route("/sendmessage").post(verifyJwt,sendMessage)


export default router