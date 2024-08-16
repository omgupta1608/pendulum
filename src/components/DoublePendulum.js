import React, { useEffect, useRef, useState } from 'react';

const DoublePendulum = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isRunning, setIsRunning] = useState(true);
  const [length1] = useState(100);
  const [length2] = useState(100);
  const [mass1] = useState(10);
  const [mass2] = useState(10);
  const [gravity] = useState(1);
  const trailRef = useRef([]);
  const angle1Ref = useRef(Math.PI / 2);
  const angle2Ref = useRef(Math.PI / 2);
  const angleVelocity1Ref = useRef(0);
  const angleVelocity2Ref = useRef(0);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = 100;

      if (isRunning) {
        const a1 = angle1Ref.current;
        const a2 = angle2Ref.current;
        const a1_v = angleVelocity1Ref.current;
        const a2_v = angleVelocity2Ref.current;

        const num1 = -gravity * (2 * mass1 + mass2) * Math.sin(a1);
        const num2 = -mass2 * gravity * Math.sin(a1 - 2 * a2);
        const num3 = -2 * Math.sin(a1 - a2) * mass2;
        const num4 = a2_v * a2_v * length2 + a1_v * a1_v * length1 * Math.cos(a1 - a2);
        const den = length1 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * a1 - 2 * a2));
        const a1_a = (num1 + num2 + num3 * num4) / den;

        const num1_2 = 2 * Math.sin(a1 - a2);
        const num2_2 = a1_v * a1_v * length1 * (mass1 + mass2);
        const num3_2 = gravity * (mass1 + mass2) * Math.cos(a1);
        const num4_2 = a2_v * a2_v * length2 * mass2 * Math.cos(a1 - a2);
        const den_2 = length2 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * a1 - 2 * a2));
        const a2_a = (num1_2 * (num2_2 + num3_2 + num4_2)) / den_2;

        angleVelocity1Ref.current += a1_a;
        angleVelocity2Ref.current += a2_a;
        angle1Ref.current += angleVelocity1Ref.current;
        angle2Ref.current += angleVelocity2Ref.current;

        angleVelocity1Ref.current *= 0.999;
        angleVelocity2Ref.current *= 0.999;
      }

      const x1 = centerX + length1 * Math.sin(angle1Ref.current);
      const y1 = centerY + length1 * Math.cos(angle1Ref.current);
      const x2 = x1 + length2 * Math.sin(angle2Ref.current);
      const y2 = y1 + length2 * Math.cos(angle2Ref.current);

      if (isRunning) {
        trailRef.current.push({ x: x2, y: y2 });
        if (trailRef.current.length > 100) {
          trailRef.current.shift();
        }
      }

      ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < trailRef.current.length - 1; i++) {
        const alpha = i / trailRef.current.length;
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.5})`;
        ctx.moveTo(trailRef.current[i].x, trailRef.current[i].y);
        ctx.lineTo(trailRef.current[i + 1].x, trailRef.current[i + 1].y);
        ctx.stroke();
      }

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x1, y1);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(x1, y1, mass1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(x2, y2, mass2, 0, Math.PI * 2);
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
  }, [isRunning, length1, length2, mass1, mass2, gravity, resetTrigger]);

  const handleReset = () => {
    angle1Ref.current = Math.PI / 2;
    angle2Ref.current = Math.PI / 2;
    angleVelocity1Ref.current = 0;
    angleVelocity2Ref.current = 0;
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

export default DoublePendulum;