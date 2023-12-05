import express  from "express";
import { authVerify } from "../middlewares/validation/auth.js";
import { postSavedCtrl } from "../controllers/postSaved.js";

const router = express.Router()

router.get("/:userID", authVerify, postSavedCtrl.getPS)
router.post("/", authVerify, postSavedCtrl.addNewPS)
router.delete("/", authVerify, postSavedCtrl.deleteOLDPS)


export default router