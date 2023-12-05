import express  from "express";
import { authVerify } from "../middlewares/validation/auth.js";
import { commentCtrl } from "../controllers/comment.js";

const router = express.Router()

router.get("/:postID", authVerify, commentCtrl.getNumComment)
router.get("/", authVerify, commentCtrl.loadComment)
router.post("/", authVerify, commentCtrl.addNewComment)
router.delete("/:commentID", authVerify, commentCtrl.deleteComment)


export default router