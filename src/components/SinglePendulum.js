import React, { useEffect, useRef, useState } from 'react';

const SinglePendulum = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isRunning, setIsRunning] = useState(true);
  const [length] = useState(200);
  const [mass] = useState(20);
  const [gravity] = useState(0.5);
  const [damping] = useState(0.995);
  const trailRef = useRef([]);
  const angleRef = useRef(Math.PI / 4);
  const angleVelocityRef = useRef(0);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = 100;

      if (isRunning) {
        const angleAcceleration = (-gravity / length) * Math.sin(angleRef.current);
        angleVelocityRef.current += angleAcceleration;
        angleVelocityRef.current *= damping;
        angleRef.current += angleVelocityRef.current;
      }

      const bobX = centerX + length * Math.sin(angleRef.current);
      const bobY = centerY + length * Math.cos(angleRef.current);

      if (isRunning) {
        trailRef.current.push({ x: bobX, y: bobY });
        if (trailRef.current.length > 50) {
          trailRef.current.shift();
        }
      }

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < trailRef.current.length - 1; i++) {
        const alpha = i / trailRef.current.length;
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 0.5})`;
        ctx.moveTo(trailRef.current[i].x, trailRef.current[i].y);
        ctx.lineTo(trailRef.current[i + 1].x, trailRef.current[i + 1].y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(bobX, bobY, mass, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, length, mass, gravity, damping, resetTrigger]);

  const handleReset = () => {
    angleRef.current = Math.PI / 4;
    angleVelocityRef.current = 0;
    trailRef.current = [];
    setResetTrigger(prev => prev + 1);
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="pendulum-container">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="pendulum-canvas"
      />
      <div className="controls">
        <button onClick={handlePlayPause} className="control-btn">
          {isRunning ? 'Pause' : 'Play'}
        </button>
        <button onClick={handleReset} className="control-btn">
          Reset
        </button>
      </div>
    </div>
  );
};

export default SinglePendulum;