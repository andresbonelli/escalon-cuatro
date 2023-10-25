import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Loader from './Loader.jsx';
import Header from './Header.jsx';

export default function App() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(60); // 60 seconds timer
  const [timerRunning, setTimerRunning] =useState(false);
  
  const socket = io('http://localhost:5000');

  useEffect(() => {
    socket.connect();
    socket.on('connect', () => {
      console.log('Connected to server');
      getWord();
    });
    return () => {
      socket.off('connect');
    }
  }, []);

  useEffect(() => {
    // Start the timer when the word definition is displayed
    if (definition !== '' && timerRunning) {
      
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);

        // When time runs up check answer automatically
        if (remainingTime === 0) {
          clearInterval(timer);
          if (guess.toLowerCase() === word.toLowerCase()) {
            setResult('Correcto!');
            setScore((prevScore) => prevScore + 1);
          } else {
            setResult(`Tiempo. "${word}".`);
            setScore((prevScore) => prevScore - 1);
          }
          setTimerRunning(false);
          console.log(`score: ${score}`);
          
        }
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [definition, remainingTime, timerRunning]);

  async function getWord() {
    
    setIsLoading(true);
    socket.emit('get_word');

    socket.on('word_data', (response) => {
      console.log('Game Status:', response);

      if (response.data.definition !== null) {
        setDefinition(response.data.definition);
        setWord(response.data.word);
        setGuess('');
        setResult('');
        setRemainingTime(60); 
        setTimerRunning(true); 
      } else {
        setDefinition('');
        setGuess('');
        setResult("Trulé. Buscá de nuevo, porfis.");
        socket.off('connect');
        socket.off('word_data');
      }
      setIsLoading(false);
    });
  }

  function checkGuess() {
    if (guess.toLowerCase() === word.toLowerCase()) {
      setResult('Correcto!');
      setScore((prevScore) => prevScore + 1);
    } else {
      setResult(`Incorrecto. "${word}".`);
      setScore((prevScore) => prevScore - 1);
    }
    setRemainingTime(60);
    setTimerRunning(false);
  }

  return (
    <div className='container'>
      <Header/>
      <p className={score < 0 ? 'score-negative' : 'score'}>
        {score < 0 ? `✘ ${score}` : `✔ ${score}`}
      </p>
      <h2>Definiciones RAE</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <p className="definition">{definition}</p>
          <input
            name='guess'
            id='guess'
            type="text"
            placeholder="Adivina la palabra"
            value={guess}
            disabled={!timerRunning}
            onChange={(e) => setGuess(e.target.value)}
          />
          {timerRunning && 
            <>
              <div className="timer-bar" style={{ width: `${(remainingTime / 60) * 20}rem`}}></div>
              <button className="btn-primary" onClick={checkGuess} disabled={!timerRunning}>
                Adivinar
              </button>
            </>
          }
          <p className="result">{result}</p>
          {result && (
            <button className="btn-primary" onClick={getWord}>
              Próxima
            </button>
          )}
        </>
      )}
    </div>
  );
}
