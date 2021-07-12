const { v4: uuidv4 } = require('uuid');
const users = require('../data/users');

module.exports = {

  /**
   * Controller prenant une adresse mail evnoyé par la client, génère un token lié avec la date de création, et le renvoie.
   * @param {express.Request} req 
   * @param {espress.Response} res 
   */
  getToken(req, res) {
    const { email } = req.body;

    const userFound = users.find((user) => user.email === email);

    if (userFound) {
      return res.status(202).json({result: 'Token déjà existant', data: userFound});
    }

    const token = uuidv4();

    users.push({
      email,
      token,
      nbrOfWords: [
        {
          date: new Date().toISOString().split('T')[0],
          nbrOfWords: 0,
        }
      ],
    })

    res.cookie('token', token);

    res.status(200).json({result: 'ok'});
  },

}