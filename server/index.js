import fs from "fs"
import  express  from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import {createServer} from "http"
import {fileTypeFromFile} from 'file-type';
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

// multer
const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../client/public/upload")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
})


const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!whitelist.includes(file.mimetype)) {
            cb(null, false)
            return cb(new Error("file not allowed"))
        }
        cb(null, true)
    }
})

app.post("/api/upload", upload.single("file"), async (req, res) => {
    const meta = await fileTypeFromFile(req.file.path)
    if (!whitelist.includes(meta.mime)) {
        return res.status(400).json({messages: "File không hợp lệ"})
    }
    const file = req.file
    res.status(200).json(file.filename)
})

app.delete("/api/delete/:filename", (req, res) => {
    const filePath = "../client/public/upload/" + req.params.filename;

    fs.unlink(filePath, err => {
        if (err) {
            return res.status(500).send('An error occurred while trying to delete the file.');
        }
        res.send('File deleted successfully.');
    });    
});

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

