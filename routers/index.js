const router = require('express').Router();
const textController = require('../controllers/textController');
const tokenController = require('../controllers/tokenController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * Route recevant une requête POST avec un Content-Type text/plain
 * permettant de justifier le texte envoyé
 * @param {string} path
 * @param {callback} middleware
 */
router.post('/api/justify', authMiddleware, textController.justifyText);

/**
 * Route recevant une requête POST avec un body JSON sous la forme {"email": "foo@bar.com"}
 * permettant de recevoir un token d'authentification
 * @param {string} path
 * @param {callback} middleware
 */
router.post('/api/token', tokenController.getToken);

module.exports = router;