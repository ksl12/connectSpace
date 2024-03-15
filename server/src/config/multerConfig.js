import multer from "multer";

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

export const multerConfig = {
    upload
}