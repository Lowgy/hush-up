import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import RoomContext from '@/context/room';
import '../app/styles.css';

//create props type
type ChallengeSelectionProps = {
  leverPulled: boolean;
  randomChallenge: string;
};

export default function ChallengeSelection({
  leverPulled,
  randomChallenge,
}: ChallengeSelectionProps) {
  const randomChallengeRef = useRef<HTMLDivElement>(null);
  const [randomChallengeY, setRandomChallengeY] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (randomChallengeRef.current) {
      const y = randomChallengeRef.current.getBoundingClientRect().top;
      setRandomChallengeY(y);
    }
  }, []);

  //Run animations if lever is pulled
  useEffect(() => {
    if (leverPulled) {
      controls.start({ y: 50 });
    }
  }, [leverPulled]);

  return (
    <div className="relative w-full">
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
