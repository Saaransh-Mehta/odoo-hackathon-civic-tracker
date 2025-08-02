import {Router} from "express"
import { createPost, getPost, login, register } from "../controller/User.controller.js"
import { jwtVerify } from "../middleware/auth.middleware.js"

let router = Router()


router.route("/register").post(register)
router.route("/login").get(login)
router.route("/post").post(jwtVerify,createPost)
router.route("/getpost").post(jwtVerify,getPost)

export default router