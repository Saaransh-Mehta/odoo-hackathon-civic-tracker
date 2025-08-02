import {Router} from "express"
import { createPost, login, register } from "../controller/User.controller.js"
import { jwtVerify } from "../middleware/auth.middleware.js"

let router = Router()


router.route("/register").post(register)
router.route("/login").post(login)
router.route("/post").post(jwtVerify,createPost)

export default router