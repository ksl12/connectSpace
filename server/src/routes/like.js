import express  from "express";
import { authVerify } from "../middlewares/validation/auth.js";
import { likeCtrl } from "../controllers/like.js";

const router = express.Router()

router.get("/:postID", authVerify, likeCtrl.getLike)
router.post("/", authVerify, likeCtrl.addNewLike)
router.delete("/", authVerify, likeCtrl.unLikePost)


export default router