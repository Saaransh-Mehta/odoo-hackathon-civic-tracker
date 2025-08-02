import {Router} from "express"
import { login, register } from "../controller/User.controller.js"

let router = Router()


router.route("/register").post(register)
router.route("/login").post(login)

export default router