import express  from "express";
import { userCtrl } from "../controllers/user.js";
import { authVerify } from "../middlewares/validation/auth.js";
import { updateUserValidation } from "../middlewares/validation/update.js"

const router = express.Router()

router.get("/find/:userID", authVerify, userCtrl.getUser)
router.get("/getUserUpdate/:userID", authVerify, userCtrl.getInfoUpdate)
router.post("/search", authVerify, userCtrl.searchUser)
router.patch("/update/:userID", authVerify, updateUserValidation ,userCtrl.updateUser)

router.get("/suggestionUser/:userID", authVerify, userCtrl.suggestionNewFriend)


export default router