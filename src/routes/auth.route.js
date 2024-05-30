import express from "express"
import { Router } from "express"
import {register,login, logout} from "../controllers/auth.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
const router = Router()

router.route("/signup").post(register)
router.route("/signin").post(login)
router.route("/signout").post(verifyJwt,logout)

export default router