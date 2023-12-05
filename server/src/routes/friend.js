import express  from "express";
import { authVerify } from "../middlewares/validation/auth.js";
import { friendCtrl } from "../controllers/friend.js";

const router = express.Router()

router.get("/", authVerify, friendCtrl.getNumberFriend)
router.get("/loadFriend", authVerify, friendCtrl.loadFriend)
router.get("/checkFriend", authVerify, friendCtrl.checkFriend)
router.get("/checkSend", authVerify, friendCtrl.checkSendRequest)
router.get("/checkReceive", authVerify, friendCtrl.checkReceiveRequest)
router.post("/send", authVerify, friendCtrl.sendRequestFriend)
router.post("/accept", authVerify, friendCtrl.acceptFriend)
router.delete("/reject", authVerify, friendCtrl.rejectFriend)
router.delete("/deleteFriend", authVerify, friendCtrl.deleteFriend)


export default router