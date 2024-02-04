'use client';

import { useState, useEffect, useContext } from 'react';
import UserContext from '@/context/user';
import RoomContext from '@/context/room';
import { Button } from './ui/button';

type RoundVotingProps = {
  handleVoteClick: (decision: string) => void;
  handleNextRoundClick: () => void;
  handleEndGameClick: () => void;
  voteTimerEnded: () => void;
  roundResult: string;
};

export default function RoundVoting({
  handleVoteClick,
  handleNextRoundClick,
  handleEndGameClick,
  voteTimerEnded,
  roundResult,
}: RoundVotingProps) {
  const { role, vip, castedVote } = useContext(UserContext);
  const { roomInfo } = useContext(RoomContext);

  //Create coutdown timer
  const [timer, setTimer] = useState(30);
  useEffect(() => {
    //If the timer reaches 0, clear the interval
    if (timer === 0) {
      if (vip) {
        voteTimerEnded();
      }
      return;
    }
    //Create the interval
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    //Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="flex flex-col items-center text-center pt-16">
      {role !== 'not safe' && !castedVote && roundResult === 'nothing' && (
        <>
          <h1 className="text-white text-4xl">Did they pass?</h1>
          <p className="text-white text-sm pt-2">Time left to vote: {timer}</p>
          <div className="flex flex-row pt-8 gap-x-4">
            <Button
              onClick={() => handleVoteClick('passed')}
              className="p-16 rounded-lg bg-green-500 text-4xl"
            >
              👍
            </Button>
            <Button
              onClick={() => handleVoteClick('failed')}
              className="p-16 rounded-lg bg-red-500 text-4xl"
            >
              👎
            </Button>
          </div>
        </>
      )}
      {((role === 'not safe' && roundResult === 'nothing') ||
        (castedVote && roundResult === 'nothing')) && (
        <>
          <h1 className="text-white text-4xl pt-8">
            Waiting for others to vote...
          </h1>
          <p className="text-white text-sm pt-2">Time left to vote: {timer}</p>
        </>
      )}
      {roundResult !== 'nothing' && (
        <>
          <h1 className="text-white text-4xl pt-8">
            {roundResult === 'passed'
              ? 'Congrats you passed!'
              : roundResult === 'failed'
              ? 'Uh Oh... looks like you failed!'
              : 'Vote were even! So I guess you pass?'}
          </h1>
          {vip &&
            (roomInfo.rounds === 0 ? (
              <Button
                onClick={handleEndGameClick}
                className="w-full disabled:bg-gray-400 disabled:text-white bg-[#FFD700] text-black hover:text-white hover:bg-yellow-300 mt-4"
              >
                End Game
              </Button>
            ) : (
              <Button
                onClick={handleNextRoundClick}
                className="w-full disabled:bg-gray-400 disabled:text-white bg-[#FFD700] text-black hover:text-white hover:bg-yellow-300 mt-4"
              >
                Next Round
              </Button>
            ))}
        </>
      )}
    </div>
  );
}
