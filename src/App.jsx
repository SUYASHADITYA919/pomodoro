import { useEffect, useRef, useState } from 'react';
import './App.css';

const modes = [
  { label: 'Focus', minutes: 30 },
  { label: 'Short Break', minutes: 5 },
  { label: 'Long Break', minutes: 15 }
];

function App() {
  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(modes[0].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('dark');
  const intervalRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    setTimeLeft(modes[activeModeIndex].minutes * 60);
    setIsRunning(false);
    window.clearInterval(intervalRef.current);
  }, [activeModeIndex]);

  useEffect(() => {
    if (!isRunning) {
      window.clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalRef.current);
          setIsRunning(false);
          setTimeout(() => {
            alert('Session complete! Time for a break.');
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  const handleModeChange = (index) => {
    setActiveModeIndex(index);
  };

  const handleStartPause = () => {
    setIsRunning((current) => !current);
  };

  const handleReset = () => {
    window.clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(modes[activeModeIndex].minutes * 60);
  };

  return (
    <div className="app-root">
      <div className="theme-toggle-container">
        <label className="switch">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(event) => setTheme(event.target.checked ? 'dark' : 'light')}
          />
          <span className="slider round" />
        </label>
      </div>

      <main className="glass-container">
        Pomodoro Timer ⏰
        <div className="mode-switcher">
          {modes.map((mode, index) => (
            <button
              key={mode.label}
              type="button"
              className={`mode-btn ${index === activeModeIndex ? 'active' : ''}`}
              onClick={() => handleModeChange(index)}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="timer-display">
          <h1>{`${minutes}:${seconds}`}</h1>
        </div>

        <div className="controls">
          <button className="main-btn" type="button" onClick={handleStartPause}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button className="secondary-btn" type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
