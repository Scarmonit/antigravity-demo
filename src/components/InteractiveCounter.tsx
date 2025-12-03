import React from 'react';

interface InteractiveCounterProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  resetCounter: () => void;
}

const InteractiveCounter: React.FC<InteractiveCounterProps> = ({ count, setCount, resetCounter }) => {
  return (
    <div className="card">
      <h2>Interactive Counter</h2>
      <div className="counter-display">
        <span className="counter-value">{count}</span>
      </div>
      <div className="button-group">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="counter-button primary"
        >
          Increment
        </button>
        <button
          onClick={resetCounter}
          className="counter-button secondary"
        >
          Reset
        </button>
      </div>
      <p className="hint">
        Click buttons to test browser automation
      </p>
    </div>
  );
};

export default InteractiveCounter;
