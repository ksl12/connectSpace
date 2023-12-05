import express  from "express";
import { authVerify } from "../middlewares/validation/auth.js";
import { notiCtrl } from "../controllers/notification.js";

const router = express.Router()

router.get("/:userID", authVerify, notiCtrl.getNumberNoti)
router.get("/loadAll/:userID", authVerify, notiCtrl.getAllNoti)
router.get("/readNoti/:notificationID", authVerify, notiCtrl.readNoti)
router.get("/readAllNoti/:userID", authVerify, notiCtrl.readAllNoti)

export default router