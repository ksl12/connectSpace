import express  from "express";
import { authCtrl } from "../controllers/auth.js";
import { loginValidation, registerValidation } from "../middlewares/validation/auth.js";


const router = express.Router()

router.post("/register", registerValidation, authCtrl.register)
router.post("/login", loginValidation, authCtrl.login)

router.post("/logout", authCtrl.logout)

router.post("/refresh_token", authCtrl.refreshAccessToken)

export default router