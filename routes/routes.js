const userController = require('../controller/userController')
const express = require('express')
const route = express.Router()

route.post('/signup',userController.userRegister)

module.exports = route
