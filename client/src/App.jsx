import React, { useEffect, useState } from "react";
import Loader from "./Loader.jsx";
import Header from "./Header.jsx";
import Timer from "./Timer.jsx";
import { normalizeWord } from "./stringUtils.js";
import "./App.css";

export default function App() {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Loader render condition
  const [timerRunning, setTimerRunning] = useState(false); // timer on-off

  const URL = "http://localhost:5000/";

  // Fetch word and definition data when page loads for the first time.
  // To do: refactor into SWR, or "use" hook since useEffect is called *after* the component has rendered,
  // thus calling the fetch twice at first load.
  useEffect(() => {
    getWord();
  }, []);

  async function getWord() {
    setIsLoading(true);
    try {
      const response = await fetch(URL + "get_word"); // Fetch data from backend (Flask app route)
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      if (data.definition !== null) {
        setDefinition(data.definition);
        setWord(data.word);
        setGuess("");
        setResult("");
        setTimerRunning(true);
      } else {
        getWord();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function checkGuess() {
    const normalizedGuess = normalizeWord(guess);
    const normalizedWord = normalizeWord(word);

    if (normalizedGuess === normalizedWord) {
      setResult("Correcto!"); // Display message if guess was right
      setScore((prevScore) => prevScore + 1);
    } else {
      setResult(`${timerRunning ? "Incorrecto" : "Tiempo"}. "${word}".`); // Display message if guess was wrong or time is over.
      setScore((prevScore) => prevScore - 1);
    }
    setTimerRunning(false);
    console.log(`score: ${score}`);
  }

  function handleTimerComplete() {
    setTimerRunning(false);
    checkGuess();
  }

  return (
    <div className="container">
      <Header />
      <p className={score < 0 ? "score-negative" : "score"}>
        {score < 0 ? `✘ ${score}` : `✔ ${score}`}
      </p>
      <h2>Definiciones RAE</h2>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="game-container">
          <p className="definition">{definition}</p>
          <input
            name="guess"
            id="guess"
            type="text"
            placeholder="Adivina la palabra"
            value={guess}
            disabled={!timerRunning}
            onChange={(e) => setGuess(e.target.value)}
          />
          {timerRunning && (
            <div className="timer-container">
              <div className="timer">
                <Timer onComplete={handleTimerComplete} />
              </div>
              <div className="button-container">
                <button
                  className="btn-primary"
                  onClick={checkGuess}
                  disabled={!timerRunning}
                >
                  Adivinar
                </button>
              </div>
            </div>
          )}
          <p className="result">{result}</p>
          {result && (
            <button className="btn-primary" onClick={getWord}>
              Próxima
            </button>
          )}
        </div>
      )}
    </div>
  );
}
