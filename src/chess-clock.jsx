import React, { useState, useEffect } from 'react';

const ChessClock = () => {
  const [timePlayer1, setTimePlayer1] = useState(600);
  const [timePlayer2, setTimePlayer2] = useState(600);
  const [activePlayer, setActivePlayer] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [player1Input, setPlayer1Input] = useState('10');
  const [player2Input, setPlayer2Input] = useState('10');
  const [isRunning, setIsRunning] = useState(false);
  const [additionalSeconds, setAdditionalSeconds] = useState(0);
  const [isRestarted, setIsRestarted] = useState(false);
  const [isTimeButtonDisabled, setIsTimeButtonDisabled] = useState(false); 

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleTimeSubmit = () => {
    setTimePlayer1(parseInt(player1Input) * 60);
    setTimePlayer2(parseInt(player2Input) * 60);
    setShowMenu(false);
  };

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        if (activePlayer === 1) {
          setTimePlayer1(prevTime => prevTime - 1);
          if (timePlayer1 === 180) {
            alert("Player 1, you have little time left!");
          }
        } else {
          setTimePlayer2(prevTime => prevTime - 1);
          if (timePlayer2 === 180) {
            alert("Player 2, you have little time left!");
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, activePlayer, timePlayer1, timePlayer2]);

  const handleStart = () => {
    setIsRunning(true);
    setShowMenu(false);
    setIsRestarted(false);
    setIsTimeButtonDisabled(true); 
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleRestart = () => {
    if (!isRestarted) {
      setIsRunning(false);
      setPlayer1Input('10');
      setPlayer2Input('10');
      setTimePlayer1(600);
      setTimePlayer2(600);
      setIsRestarted(true);
      setIsTimeButtonDisabled(true); 
    }
  };

  const handleZoneClick = (player) => {
    if (isRunning && activePlayer === player) {
      setActivePlayer(prevPlayer => (prevPlayer === 1 ? 2 : 1));
      if (activePlayer === 1) {
        setTimePlayer1((prevTime) => prevTime + additionalSeconds);
      } else if (activePlayer === 2) {
        setTimePlayer2((prevTime) => prevTime + additionalSeconds);
      }
    }
  };

  useEffect(() => {
    
    if (isRestarted) {
      setIsTimeButtonDisabled(false);
    }
  }, [isRestarted]);

  return (
    <div className="chess-clock">
      <div className={`player player-${activePlayer}`} onClick={() => handleZoneClick(activePlayer)}>
        Player {activePlayer}
        <div className="timer">{formatTime(activePlayer === 1 ? timePlayer1 : timePlayer2)}</div>
      </div>
      <div className={`player player-${activePlayer === 1 ? 2 : 1}`} onClick={() => handleZoneClick(activePlayer === 1 ? 2 : 1)}>
        Player {activePlayer === 1 ? 2 : 1}
        <div className="timer">{formatTime(activePlayer === 1 ? timePlayer2 : timePlayer1)}</div>
      </div>
      <div className="buttons">
        {!isRunning ? (
          <>
            <button className="start" onClick={handleStart}>Start</button>
            <button className="time-button" onClick={handleMenuToggle} disabled={isTimeButtonDisabled}>
              Time
            </button>
          </>
        ) : (
          <button className="stop" onClick={handleStop}>Stop</button>
        )}
        <button className="restart" onClick={handleRestart}>Restart</button>
      </div>
      {showMenu && (
        <div className="menu">
          <div className="menu-item">
            <label htmlFor="player1-input">Player 1 Time (minutes):</label>
            <input
              id="player1-input"
              type="number"
              min="1"
              max="60"
              value={player1Input}
              onChange={(e) => setPlayer1Input(e.target.value)}
            />
          </div>
          <div className="menu-item">
            <label htmlFor="player2-input">Player 2 Time (minutes):</label>
            <input
              id="player2-input"
              type="number"
              min="1"
              max="60"
              value={player2Input}
              onChange={(e) => setPlayer2Input(e.target.value)}
            />
          </div>
          <button onClick={handleTimeSubmit}>Submit</button>
          <div className="menu-item">
            <label htmlFor="additional-seconds">Additional Seconds:</label>
            <input
              id="additional-seconds"
              type="number"
              min="0"
              max="60"
              value={additionalSeconds}
              onChange={(e) => setAdditionalSeconds(parseInt(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default ChessClock;