const contact = require('../controller/contactController')
const express = require('express')
const route = express.Router()

route.post('/search-contacts',contact.searchContact)

module.exports = route