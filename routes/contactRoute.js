const contact = require('../controller/contactController')
const express = require('express')
const route = express.Router()
const verifyToken = require('../middleware/tokenVerify')

route.post('/search-contacts',verifyToken,contact.searchContact)
route.get('/get-dm-contacts', verifyToken, contact.getContactDM)


module.exports = route