import React, { useState } from 'react';
import SinglePendulum from './components/SinglePendulum';
import DoublePendulum from './components/DoublePendulum';
import './App.css';

function App() {
  const [pendulumType, setPendulumType] = useState('single');

  return (
    <div className="App">
      <header className="app-header">
        <h1>Pendulum Simulator</h1>
        <div className="pendulum-selector">
          <button
            className={`selector-btn ${pendulumType === 'single' ? 'active' : ''}`}
            onClick={() => setPendulumType('single')}
          >
            Single Pendulum
          </button>
          <button
            className={`selector-btn ${pendulumType === 'double' ? 'active' : ''}`}
            onClick={() => setPendulumType('double')}
          >
            Double Pendulum
          </button>
        </div>
      </header>
      <main className="app-main">
        {pendulumType === 'single' ? <SinglePendulum /> : <DoublePendulum />}
      </main>
    </div>
  );
}

export default App;