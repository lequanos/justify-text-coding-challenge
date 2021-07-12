module.exports = {

  /**
   * Controller prenant un bloc de texte
   * et renvoie le texte justifié avec une longueur de ligne de 80 caractères
   * @param {express.Request} req 
   * @param {espress.Response} res 
   */
  justifyText(req, res) {
    const text = req.body;
    const { user } = req;

    // On vérifie le nombre de mots envoyé aujourd'hui par l'utilisateur
    const nbrOfWords = text.split('\n').join(' ').split(' ').filter((word) => word.length > 0).length;
    let todayNbrOfWords = user.nbrOfWords.find((day) => day.date === new Date().toISOString().split('T')[0])
    
    if (!todayNbrOfWords) {
      user.nbrOfWords.push({
        date: new Date().toISOString().split('T')[0],
        nbrOfWords,
      })
      todayNbrOfWords = user.nbrOfWords.find((day) => day.date === new Date().toISOString().split('T')[0])
    };

    todayNbrOfWords.nbrOfWords = todayNbrOfWords.nbrOfWords + nbrOfWords;

    if (todayNbrOfWords.nbrOfWords > 80000) {
      todayNbrOfWords.nbrOfWords = todayNbrOfWords.nbrOfWords - nbrOfWords;
      return res.status(402).json({result: 'Nombre maximal de mot quotidien dépassé, veuillez vous abonner ou revenir demain!'})
    }

    // S'il n'a pas dépassé la limite quotidienne de mot, on traite le texte
    const linesArray = [];
    const wordsArray = text.split(' ');

    // On traite le texte en créant les lignes les unes après les autres et en les renvoyant dans un tableau
    wordsArray.reduce((acc, word, index) => {

      // On vérifie en premier lieu si le mot comporte des retours à la ligne
      if (word.startsWith('\n')) {
        linesArray.push(acc.join(' '));
        word = word.replace('\n', '');
        acc = [];
        acc.push(word);
      }
      else if (word.endsWith('\n')) {
        word = word.replace('\n', '')
        acc.push(word);
      }
      else if (word.includes('\n')) {
        const separatedWords = word.split('\n')
        separatedWords.forEach((word) => {
          if (word.length === 0) {
            separatedWords[0] = separatedWords[0] + '\n';
          }
        })
        acc.push(separatedWords[0]);

        const lineLength = acc.join(' ').length;
        if (lineLength > 80) {
          acc.pop()
          const nbrOfSpaceToAdd = 80 - acc.join(' ').length;
          const singleWhiteSpaceNeeded = acc.length - 1 - nbrOfSpaceToAdd;

          acc.forEach((wordInArray, index) => {
            if (singleWhiteSpaceNeeded < 0 && index < singleWhiteSpaceNeeded * -1) {
              wordInArray = wordInArray + '   ';
            }
            else if (singleWhiteSpaceNeeded > 0 && index < singleWhiteSpaceNeeded) {
              wordInArray = wordInArray + ' ';
            }
            else if (index === acc.length - 1) {
              return false;
            }
            else {
              wordInArray = wordInArray + '  ';
            }
            acc[index] = wordInArray;
          })

          const joinedText = acc.join('');
          linesArray.push(joinedText);
          acc = [];
          acc.push(separatedWords[0]);
        }

        linesArray.push(acc.join(' '));
        acc = [];

        separatedWords.forEach((word, index) => {
          if (index > 0 && word.length > 0) {
            acc.push(word);
          }
        })

      }
      else {
        // Sinon on le mets dans l'array pour traiter la longueur de la ligne
        acc.push(word);
      }

      // On vérifie que la ligne n'a pas dépassé la longueur maximale de caractères
      const lineLength = acc.join(' ').length;
      if (lineLength === 80) {
        linesArray.push(acc.join(' '));
        acc = [];
        // Sinon on modifie la ligne
      } else if (lineLength > 80) {
        acc.pop()
        const neededSpace = 80 - acc.join(' ').length;
        const singleWhiteSpaceNeeded = acc.length - 1 - neededSpace;

        acc.forEach((wordInArray, index) => {
          if (singleWhiteSpaceNeeded < 0 && index < singleWhiteSpaceNeeded * -1) {
            wordInArray = wordInArray + '   ';
          }
          else if (singleWhiteSpaceNeeded > 0 && index < singleWhiteSpaceNeeded) {
            wordInArray = wordInArray + ' ';
          }
          else if (index === acc.length - 1) {
            return false;
          }
          else {
            wordInArray = wordInArray + '  ';
          }
          acc[index] = wordInArray;
        })

        const joinedText = acc.join('');
        linesArray.push(joinedText);
        acc = [];
        acc.push(word)
      }

      // On vérifie si c'est le dernier mot, si c'est le cas, on envoie la ligne dans le tableau
      if (wordsArray.length === index + 1) {
        linesArray.push(acc.join(' '));
        acc = [];
      }

      return acc;

    }, [])

    // On renvoie le tableau joint avec des retours à la ligne après chaque ligne
    res.status(200).json(linesArray.join('\n'));
  },

}