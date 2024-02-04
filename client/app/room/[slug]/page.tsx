'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoomContext from '@/context/room';
import { SocketContext } from '@/context/socket';
import UserContext from '@/context/user';

import { SparklesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import RoleCard from '@/components/role-card';
import ChallengeSelection from '@/components/challenge-selection';
import Lever from '@/components/lever';
import ChallengeHowTo from '@/components/challenge-how-to';
import { Challenge } from '@/types/types';
import RoundVoting from '@/components/round-voting';

export default function RoomPage() {
  const socket = useContext(SocketContext);
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [leverPulled, setLeverPulled] = useState(false);
  const [showChallengeSelection, setShowChallengeSelection] = useState(false);
  const [showHowTo, setHowTo] = useState(false);
  const [showVotes, setShowVotes] = useState(false);
  const [roundResult, setRoundResult] = useState('nothing');
  const [randomChallenge, setRandomChallenge] = useState<Challenge>();

  const {
    roomInfo,
    setRoomInfo,
    roomUsers,
    setRoomUsers,
    roomChallenges,
    setRoomChallenges,
  } = useContext(RoomContext);
  const { userName, vip, role, setRole, setCastedVote } =
    useContext(UserContext);

  const handleStartGame = () => {
    socket.emit('startTimer', roomInfo.id);
  };

  const handleFlipCards = () => {
    if (isFlipped) return;
    socket.emit('getRoles', roomInfo.id);
  };

  const handleChallengeClick = () => {
    socket.emit(
      'getChallenges',
      roomInfo.id,
      roomInfo.gameType,
      roomInfo.rounds
    );
  };

  const leverClick = () => {
    socket.emit('leverPulled', roomInfo.id);
  };

  const handleContinue = () => {
    socket.emit('continueGame', roomInfo.id);
  };

  const handleQuiteTimeClick = () => {
    socket.emit('startVote', roomInfo.id);
  };

  const handleVoteClick = (option: string) => {
    setCastedVote(true);
    console.log('clicked');
    socket.emit('vote', roomInfo.id, option);
  };

  const voteTimerEnded = () => {
    setCastedVote(true);
    socket.emit('voteTimerEnded', roomInfo.id);
  };

  const handleEndGameClick = () => {
    socket.emit('endGame', roomInfo.id);
  };

  const handleNextRoundClick = () => {
    socket.emit('nextRound', roomInfo.id);
  };

  useEffect(() => {
    setGameStarted(false);
    socket.on('countdownUpdate', (data: number) => {
      setCountdown(data);
    });

    socket.on('countdownComplete', () => {
      setCountdown(0);
      setGameStarted(true);
    });

    socket.on('roles', (data: any) => {
      console.log(data, userName);
      setRole(data);
    });

    socket.on('randomChallenge', (data: any) => {
      setRandomChallenge(data);
      setRoomChallenges((prev) => {
        return prev.filter((challenge) => challenge !== data);
      });
    });

    socket.on('challenges', (data: any) => {
      setRoomChallenges(data);
      console.log(data);
      setShowChallengeSelection(true);
    });

    socket.on('flipCards', () => {
      setIsFlipped(true);
    });

    socket.on('leverPulled', () => {
      setLeverPulled(true);
    });

    socket.on('continueGame', () => {
      setHowTo(true);
    });

    socket.on('startVote', () => {
      setShowVotes(true);
    });

    socket.on('votePassed', (data: any) => {
      setRoundResult('passed');
      setRoomInfo(data);
      console.log('vote passed');
    });

    socket.on('voteFailed', (data: any) => {
      setRoundResult('failed');
      setRoomInfo(data);
      console.log('vote failed');
    });

    socket.on('voteTied', (data: any) => {
      setRoundResult('tied');
      setRoomInfo(data);
      console.log('vote tied');
    });

    socket.on('nextRound', () => {
      setRoundResult('nothing');
      setRoomInfo((prev) => {
        return { ...prev, votes: { totalVotes: 0, passed: 0, failed: 0 } };
      });
      setCastedVote(false);
      setLeverPulled(false);
      setIsFlipped(false);
      setShowVotes(false);
      setHowTo(false);
      setShowChallengeSelection(false);
    });

    socket.on('endGame', () => {
      router.push('/');
    });

    return () => {
      socket.off('countdownUpdate');
      socket.off('countdownComplete');
    };
  }, [socket]);

  useEffect(() => {
    socket.on('roomData', ({ users }: any) => {
      setRoomUsers(users);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomUsers]);

  return (
    <>
      {!gameStarted ? (
        <>
          {' '}
          <section className="flex flex-col text-center text-white">
            <h1>
              Join at <span className="font-semibold">hush-up.vercel.app</span>
            </h1>
            <h2>Enter room code</h2>
            <h2 className="text-4xl text-[#FFD700]">
              {roomInfo.code || 'Code'}
            </h2>
          </section>
          <div className="border rounded w-full lg:w-2/4 text-center text-white">
            <h1>Players</h1>
            <Separator />
            <div className="grid grid-cols-3 gap-4 py-4 px-4">
              {roomUsers.map((user) => (
                <div
                  className="bg-[#FFD700] p-4 rounded text-center text-black"
                  key={user.name}
                >
                  <h1>
                    {userName === user.name ? 'You' : user.name}{' '}
                    {vip && userName === user.name ? (
                      <span className="text-sm text-gray-500">(VIP)</span>
                    ) : (
                      ''
                    )}
                  </h1>
                </div>
              ))}
            </div>
          </div>
          {vip ? (
            <Button
              className=" bg-[#FFD700] text-black hover:text-white hover:bg-yellow-300"
              onClick={handleStartGame}
            >
              Start Game <SparklesIcon className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            ''
          )}
        </>
      ) : (
        ''
      )}
      {countdown !== 0 && countdown !== null ? (
        <CountdownOverlay countdown={countdown} />
      ) : gameStarted ? (
        (!showChallengeSelection && (
          <>
            <RoleCard role={role} isFlipped={isFlipped} />
            {vip && gameStarted && !isFlipped ? (
              <Button
                onClick={handleFlipCards}
                className="bg-[#FFD700] text-black hover:text-white hover:bg-yellow-300"
              >
                Flip Cards!
              </Button>
            ) : (
              vip &&
              gameStarted &&
              isFlipped && (
                <Button
                  onClick={handleChallengeClick}
                  className="bg-[#FFD700] text-black hover:text-white hover:bg-yellow-300"
                >
                  Challenge Time!
                </Button>
              )
            )}
          </>
        )) ||
        (showChallengeSelection && (
          <>
            {!showHowTo ? (
              <>
                <Lever leverClick={leverClick} leverPulled={leverPulled} />
                <ChallengeSelection
                  leverPulled={leverPulled}
                  randomChallenge={randomChallenge}
                />
                {vip && (
                  <Button
                    onClick={handleContinue}
                    className="mt-16 bg-[#FFD700] text-black hover:text-white hover:bg-yellow-300"
                    disabled={!leverPulled}
                  >
                    Continue
                  </Button>
                )}
              </>
            ) : (
              <>
                {!showVotes ? (
                  <ChallengeHowTo
                    randomChallenge={randomChallenge}
                    handleQuiteTimeClick={handleQuiteTimeClick}
                  />
                ) : (
                  <RoundVoting
                    handleVoteClick={handleVoteClick}
                    handleEndGameClick={handleEndGameClick}
                    handleNextRoundClick={handleNextRoundClick}
                    voteTimerEnded={voteTimerEnded}
                    roundResult={roundResult}
                  />
                )}
              </>
            )}
          </>
        ))
      ) : (
        ''
      )}
    </>
  );
}

const CountdownOverlay = ({ countdown }: any) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999, // Ensure the overlay is on top of other elements
      }}
    >
      <div style={{ fontSize: '2rem', color: '#fff' }}>
        Game Starts in: {countdown}
      </div>
    </div>
  );
};
