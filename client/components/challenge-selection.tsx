import React, { useState, useContext, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion, useAnimation } from 'framer-motion';
import UserContext from '@/context/user';
import RoomContext from '@/context/room';
import '../app/styles.css';

export default function ChallengeSelection({}) {
  const randomChallengeRef = useRef<HTMLDivElement>(null);
  const [randomChallengeY, setRandomChallengeY] = useState(0);
  const [randomChallenge, setRandomChallenge] = useState('');
  const [isShown, setIsShown] = useState(false);
  const { vip, role } = useContext(UserContext);
  const { roomChallenges, setRoomChallenges } = useContext(RoomContext);
  const controls = useAnimation();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * roomChallenges.length);
    setRandomChallenge(roomChallenges[randomIndex]);
    setRoomChallenges((prev) => {
      return prev.filter((challenge) => challenge !== randomChallenge);
    });
    if (randomChallengeRef.current) {
      const y = randomChallengeRef.current.getBoundingClientRect().top;
      setRandomChallengeY(y);
    }
  }, []);

  const leverClick = () => {
    controls.start({ y: 50 });
    gsap.fromTo(
      '.lever',
      { rotate: 30 },
      { rotate: -80, duration: '1', repeat: 0, ease: 'Sine.out' }
    );
    setIsShown(true);
  };

  return (
    <div className="relative w-full">
      {/* <div className="flex text-white flex-col border-t-2 border-r-2 border-l-2 rounded">
        {roomChallenges.map((item, index) => (
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
      {vip && <Button onClick={handleSpin}>Spin</Button>} */}
      <div className="relative -mt-2 mb-20">
        <button
          id="leverControl"
          className={`${role === 'not safe' ? 'pointer' : ''} lever-control`}
          onClick={leverClick}
          disabled={role === 'not safe' ? false : true}
        >
          <div className="lever">
            <div className="knob"></div>
            <div className="stick"></div>
          </div>
          <div className="lever-base">
            <div className="pivot"></div>
          </div>
        </button>
      </div>
      <div className="relative w-1/2 h-full mx-auto z-10">
        <motion.div
          className="bg-gray-200 absolute w-full h-full p-4 rounded-md flex justify-center items-center text-gray-200 z-20"
          animate={controls}
          initial={{ y: randomChallengeY }}
        >
          {randomChallenge}
        </motion.div>
        <div
          className={`mt-32 w-full h-full bg-white p-4 rounded-md flex justify-center items-center z-50`}
        >
          <h1 className="text-2xl text-black">{randomChallenge}</h1>
        </div>
      </div>
      <div className="absolute top-1/2 bg-yellow-400 w-full h-3/4 mt-4 rounded-md z-0"></div>
    </div>
  );
}
