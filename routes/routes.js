const userController = require('../controller/userController')
const express = require('express')
const route = express.Router()

route.post('/signup',userController.userRegister)
route.post('/login',userController.userLogin)
route.get('/get-data-token',userController.getUserData)

module.exports = route
