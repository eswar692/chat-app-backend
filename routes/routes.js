const userController = require('../controller/userController')
const express = require('express')
const route = express.Router()
const tokenVerify = require('../middleware/tokenVerify')

const verifyToken = require('../middleware/tokenVerify')

route.post('/signup',userController.userRegister)
route.post('/login',userController.userLogin)
route.get('/get-data-token',userController.getUserData)
route.put('/profile-update',tokenVerify, userController.profileDataUpdate)
route.post('/upload-image',tokenVerify,userController.upload.single('image'),userController.profileImage)
route.delete('/delete-profile-image',tokenVerify, userController.deleteProfileImage)
route.post('/logout', verifyToken,userController.logout)

module.exports = route
