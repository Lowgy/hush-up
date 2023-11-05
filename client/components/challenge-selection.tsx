import React, { useState } from 'react';
import { Button } from './ui/button';

export default function ChallengeSelection({
  challenges,
}: {
  challenges: Array<string>;
}) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isSpinning, setIsSpinning] = useState(false);

  const sound = new Audio('/sounds/click.mp3');

  const handleSpin = () => {
    setIsSpinning(true);
    setCurrentIndex(Math.floor(Math.random() * challenges.length));
    const duration = (Math.floor(Math.random() * 5) + 1) * 1000;

    let timeoutId: NodeJS.Timeout;
    const spin = () => {
      setCurrentIndex((prevIndex) => {
        sound.pause();
        sound.currentTime = 0;
        sound.play();
        return (prevIndex + 1) % challenges.length;
      });

      timeoutId = setTimeout(spin, 300);
    };

    spin();

    setTimeout(() => {
      clearTimeout(timeoutId);
      setIsSpinning(false);
    }, duration);
  };

  return (
    <>
      <div className="flex text-white flex-col border-t-2 border-r-2 border-l-2 rounded">
        {challenges.map((item, index) => (
          <div
            key={index}
            className={`${
              index === currentIndex && isSpinning
                ? 'bg-yellow-400'
                : !isSpinning && index === currentIndex
                ? 'bg-green-400'
                : ''
            } border-b-2 p-2 text-center`}
          >
            {item}
          </div>
        ))}
      </div>
      <Button onClick={handleSpin}>Spin</Button>
    </>
  );
}
