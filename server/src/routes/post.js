import express  from "express";
import { authVerify } from "../middlewares/validation/auth.js";
import { postCtrl } from "../controllers/post.js";

const router = express.Router()

router.get("/getPost/:userID", authVerify, postCtrl.getPost)
router.get("/getPostUser/:userID", authVerify, postCtrl.getPostOnlyUser)
router.get("/getOnlyPost/:postID", authVerify, postCtrl.getOnlyOnePost)
router.post("/addPost", authVerify, postCtrl.addPost)
router.delete("/deletePost/:postID", authVerify, postCtrl.deletePost)

export default router