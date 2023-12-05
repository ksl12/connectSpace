import express  from "express";
import { adminCtrl } from "../controllers/admin.js";
import { authVerify } from "../middlewares/validation/auth.js";

const router = express.Router()

router.get("/user", authVerify, adminCtrl.getNumberUser)
router.get("/post", authVerify, adminCtrl.getNumberPost)
router.get("/comment", authVerify, adminCtrl.getNumberComment)
router.get("/gender", authVerify, adminCtrl.getNumberGender)

// manage
router.get("/userManage", authVerify, adminCtrl.listUser)
router.get("/postManage", authVerify, adminCtrl.listPost)

// check block 
router.get("/userBlock/:userID", authVerify, adminCtrl.checkUserBlocked)
router.patch("/openBlock/", authVerify, adminCtrl.openBlocked)
router.patch("/Block/", authVerify, adminCtrl.Block)

export default router