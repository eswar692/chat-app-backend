const contact = require('../controller/contactController')
const express = require('express')
const route = express.Router()
const verifyToken = require('../middleware/tokenVerify')

route.post('/search-contacts',verifyToken,contact.searchContact)

module.exports = route