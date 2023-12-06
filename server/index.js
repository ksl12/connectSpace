import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {createServer} from "http"
import "dotenv/config"


// import {authVerify} from "./src/middlewares/auth.js"
import authRoutes from "./src/routes/auth.js" 
import userRoutes from "./src/routes/user.js"
import postRoutes from "./src/routes/post.js"
import likeRoutes from "./src/routes/like.js"
import commentRoutes from "./src/routes/comment.js"
import friendRoutes from "./src/routes/friend.js"
import notificationRoutes from "./src/routes/notification.js"
import postSavedRoutes from "./src/routes/postSaved.js"
import adminRoutes from "./src/routes/admin.js"
import socketServer from "./socketServer.js"

const app = express()

app.use(cors({
    origin: "http://localhost:3001"
}))
app.use(express.json())
app.use(cookieParser())


//endPoint
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/like", likeRoutes)
app.use("/api/comment", commentRoutes)
app.use("/api/friend", friendRoutes)
app.use("/api/notification", notificationRoutes)
app.use("/api/postSaved", postSavedRoutes)
app.use("/api/admin", adminRoutes)

//Setup socketio server
const httpServer = createServer(app)
const io = socketServer(httpServer)
//export io to socketserver js

const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
    console.log("working")
})

