import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function TestComponent() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(60); // 60 seconds

  const socket = io('http://localhost:5000');

  useEffect(() => {
    document.title = 'Escalón Cuatro';
    socket.on('connect', () => {
      console.log('Connected to server');
      getWord();
    });
  }, []);

  useEffect(() => {
    // Start the timer when the word definition is displayed
    if (definition !== '') {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);

        // When the timer hits 0, call checkGuess()
        if (remainingTime === 0) {
          clearInterval(timer);
          checkGuess();
        }
      }, 1000); // Update every second

      return () => {
        clearInterval(timer); // Clean up timer on component unmount
      };
    }
  }, [definition, remainingTime]);

  function getWord() {
    socket.emit('start_game');
    socket.on('word_data', (response) => {
      if (response.data.definicion !== null) {
        setDefinition(response.data.definicion);
        setWord(response.data.palabra);
        setGuess('');
        setResult('');
        setRemainingTime(60); // Reset the timer
      } else {
        setDefinition('');
        setGuess('');
        setResult(`Definición de "${word}" no disponible :(`);
      }
    });
  }

  function checkGuess() {
    if (guess.toLowerCase() === word.toLowerCase()) {
      setResult('Correcto!');
      setScore(score + 1);
    } else {
      setResult(`Incorrecto. "${word}".`);
      setScore(score - 1);
    }
    console.log(`score: ${score}`);
  }

  return (
    <div>
      <p className="score">Puntos: {score}</p>
      <h2>Definiciones RAE</h2>
      <p className="definition">{definition}</p>
      <div className="timer-bar" style={{ width: `${(remainingTime / 60) * 100}%` }}></div>
      <input
        type="text"
        placeholder="Adivina la palabra"
        value={guess}
        disabled={definition === ''}
        onChange={(e) => setGuess(e.target.value)}
      />
      <button className="btn-primary" onClick={checkGuess} disabled={definition === ''}>
        Adivinar
      </button>
      <p className="result">{result}</p>
      {result && (
        <button className="btn-primary" onClick={getWord}>
          Próxima Palabra
        </button>
      )}
    </div>
  );
}
