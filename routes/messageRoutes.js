const express = require('express')
const { deleteAllMessage, getAllMessages, fileMessage} = require('../controller/messageController')
const route = express.Router()
const varifyToken = require('../middleware/tokenVerify')
const multer = require('multer')
const path = require('path')

// const storage = multer.memoryStorage()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store files in 'uploads/' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage });


route.delete('/delete-all-messages',deleteAllMessage)
route.post('/all-messages', varifyToken, getAllMessages)
route.post('/file-image', varifyToken, upload.single('file'), fileMessage)

module.exports = route