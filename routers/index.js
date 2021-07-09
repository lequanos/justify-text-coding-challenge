const router = require('express').Router();
const textController = require('../controllers/textController');

router.post('/api/justify', textController.justifyText);

module.exports = router;