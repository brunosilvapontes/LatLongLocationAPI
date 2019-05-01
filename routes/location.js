const router = require('express').Router()
const controller = require('../controllers/location')
const auth = require('./auth')

// Get some github repositories' (not forks) data from a given username
router.post('/:name', auth.validateBodyType, controller.uploadJson)

module.exports = router