import { useEffect, useContext } from 'react';
import UserContext from '@/context/user';
import RoomContext from '@/context/room';
import { Button } from './ui/button';

type RoundVotingProps = {
  handleVoteClick: (decision: string) => void;
  roundResult: string;
};

export default function RoundVoting({
  handleVoteClick,
  roundResult,
}: RoundVotingProps) {
  const { role, vip, castedVote } = useContext(UserContext);
  const { roomInfo } = useContext(RoomContext);

  console.log(role, roomInfo);

  return (
    <div className="flex flex-col items-center text-center pt-16">
      {role !== 'not safe' && !castedVote && (
        <>
          <h1 className="text-white text-4xl">Did they pass?</h1>
          <p className="text-white text-sm pt-2">Time left to vote: timer</p>
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
          <p className="text-white text-sm pt-2">Time left to vote: timer</p>
        </>
      )}
      {roundResult !== 'nothing' && (
        <>
          <h1 className="text-white text-4xl pt-8">
            {roundResult === 'passed' ? 'They passed!' : 'They failed!'}
          </h1>
          {vip &&
            (roomInfo.rounds === 0 ? (
              <Button onClick={() => console.log('End Game')} className="w-full disabled:bg-gray-400 disabled:text-white bg-[#FFD700] text-black hover:text-white hover:bg-yellow-300 mt-4">
                End Game
              </Button>
            ) : (
              <Button onClick={() => console.log('Next Round')} className="w-full disabled:bg-gray-400 disabled:text-white bg-[#FFD700] text-black hover:text-white hover:bg-yellow-300 mt-4">
                Next Round
              </Button>
            ))}
        </>
      )}
    </div>
  );
}
