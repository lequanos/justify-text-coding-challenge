const users = require('../data/users');

/**
 * Middleware vérifiant si la requête envoyée par le client comporte l'authorizatin nécessaire
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.Next} next 
 */
module.exports = (req, res, next) => {
  try {
    const authorization = req.headers['authorization'];

    if (!authorization) {
      throw new Error('Vous devez être authentifié pour accéder à ce contenu');
    };

    const token = authorization;

    const userFound = users.find((user) => user.token === token);

    if (!userFound) {
      throw new Error('Vous devez être authentifié pour accéder à ce contenu');
    }

    req.user = userFound;
    next();
  }
  catch (err) {
    return res.status(401).json({
      error: {
        message: "Fatal error",
        messageDetail: err.message,
        infos: err.name
      }
    });
  }
};