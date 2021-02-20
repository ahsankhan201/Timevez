const express = require('express');
const router = express.Router();
const appController = require('../controllers/app.controller');

/**
 * @Get Listen root url.
 * Listen root url and send 'Hello world!' message to client side.
 */
router.get('', appController.listenRoot);

module.exports = router;