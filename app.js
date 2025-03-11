/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React;

function App() {
  const initialWords = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'];
  const [wordList, setWordList] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [skipsLeft, setSkipsLeft] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showSmiley, setShowSmiley] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem('scrambleGame'));
    if (savedState) {
      setWordList(savedState.wordList);
      setCurrentWord(savedState.currentWord);
      setScrambledWord(savedState.scrambledWord);
      setScore(savedState.score || 0);
      setMistakes(savedState.mistakes || 0);
      setSkipsLeft(savedState.skipsLeft || 3);
      setIsGameOver(savedState.isGameOver || false);
      setShowSmiley(savedState.showSmiley || false);
      setFeedbackMessage(savedState.feedbackMessage || '');
    } else {
      setWordList(initialWords);
      setCurrentWord(initialWords[0]);
      setScrambledWord(shuffle(initialWords[0]));
      setScore(0);
      setMistakes(0);
      setSkipsLeft(3);
      setIsGameOver(false);
      setShowSmiley(false);
      setFeedbackMessage('');
    }
  }, []);

  useEffect(() => {
    const gameState = {
      wordList,
      currentWord,
      scrambledWord,
      score,
      mistakes,
      skipsLeft,
      isGameOver,
      showSmiley,
      feedbackMessage
    };
    localStorage.setItem('scrambleGame', JSON.stringify(gameState));
  }, [wordList, currentWord, scrambledWord, score, mistakes, skipsLeft, isGameOver, showSmiley, feedbackMessage]);

  const handleGuess = (e) => {
    e.preventDefault();
    if (userGuess.toLowerCase() === currentWord.toLowerCase()) {
      const newScore = score + 1;
      setScore(newScore);
      setFeedbackMessage('Correct!');
      if (newScore === 3) {
        setShowSmiley(true);
        setIsGameOver(true);
      } else {
        nextWord();
      }
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setFeedbackMessage('Incorrect!');
      if (newMistakes === 3) {
        setIsGameOver(true);
      }
    }
    setUserGuess('');
  };

  const nextWord = () => {
    const remainingWords = wordList.filter(word => word !== currentWord);
    if (remainingWords.length === 0) {
      alert('Game Over! You have completed all words.');
      resetGame();
    } else {
      const newWord = remainingWords[0];
      setWordList(remainingWords);
      setCurrentWord(newWord);
      setScrambledWord(shuffle(newWord));
    }
  };

  const handleSkip = () => {
    if (skipsLeft > 0) {
      const newSkipsLeft = skipsLeft - 1;
      setSkipsLeft(newSkipsLeft);
      nextWord();
    }
  };

 const resetGame = () => {
  setWordList(initialWords);
  setCurrentWord(initialWords[0]);
  setScrambledWord(shuffle(initialWords[0]));
  setUserGuess('');
  setScore(0);
  setMistakes(0);
  setSkipsLeft(3);
  setIsGameOver(false);
  setShowSmiley(false);
  setFeedbackMessage('');
  localStorage.removeItem('scrambleGame');
};

  return (
    <div className="container">
      <h1>Scramble Game</h1>
      <div className="scoreboard">
        <div>
          <p>Score</p>
          <p>{score}</p>
        </div>
        <div>
          <p>Mistakes</p>
          <p>{mistakes}</p>
        </div>
        <div>
          <p>Skips Left</p>
          <p>{skipsLeft}</p>
        </div>
      </div>
      <p className="scrambled-word">{scrambledWord}</p>
      <form onSubmit={handleGuess}>
        <input
          type="text"
          value={userGuess}
          onChange={(e) => setUserGuess(e.target.value)}
          disabled={isGameOver}
        />
        <button type="submit" disabled={isGameOver}>Guess</button>
      </form>
      <button onClick={handleSkip} disabled={isGameOver || skipsLeft === 0}>Skip</button>
      <p className={`feedback ${feedbackMessage === 'Correct!' ? 'correct' : 'incorrect'}`}>{feedbackMessage}</p>
      {isGameOver && (
        <div className="game-over">
          {showSmiley ? <p>You win! Please play again 😊</p> : <p>Game Over! Try Again.</p>}
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));