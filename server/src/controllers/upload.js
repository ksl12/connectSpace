import express  from "express";
import { authVerify } from "../middlewares/validation/auth.js";
import { multerConfig } from "../config/multerConfig.js";
import fs from "fs"
import {fileTypeFromFile} from 'file-type';

const router = express.Router()

// //whitelist of accept file name of image
const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]

router.post("/upload", authVerify , multerConfig.upload.single("file"), async (req, res) => {
    const meta = await fileTypeFromFile(req.file.path)
    if (!whitelist.includes(meta.mime)) {
        return res.status(400).json({messages: "File không hợp lệ"})
    }
    const file = req.file
    res.status(200).json(file.filename)
})

router.delete("/delete/:filename", authVerify , async (req, res) => {
    const filePath = "../client/public/upload/" + req.params.filename;

    fs.unlink(filePath, err => {
        if (err) {
            return res.status(500).send('Lỗi xảy ra khi gửi file');
        }
        res.send('Xóa file thành công');
    });    
});



export default router