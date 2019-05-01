const router = require('express').Router()
const controller = require('../controllers/location')
const auth = require('./auth')

router.post('/:name', auth.validateBodyType, controller.uploadJson)

router.get('/names', auth.validateApiToken, controller.getLocationNames)

module.exports = router