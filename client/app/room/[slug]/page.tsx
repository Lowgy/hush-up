'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoomContext from '@/context/room';
import { SocketContext } from '@/context/socket';
import { Separator } from '@/components/ui/separator';
import UserContext from '@/context/user';

import { SparklesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoleCard from '@/components/role-card';
import ChallengeSelection from '@/components/challenge-selection';

export default function RoomPage() {
  const socket = useContext(SocketContext);
  const router = useRouter();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showChallengeSelection, setShowChallengeSelection] = useState(false);
  const {
    roomInfo,
    roomUsers,
    setRoomUsers,
    roomChallenges,
    setRoomChallenges,
  } = useContext(RoomContext);
  const { userName, vip, role, setRole } = useContext(UserContext);

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
      setRole(data);
    });

    socket.on('challenges', (data: any) => {
      setRoomChallenges(data);
      setShowChallengeSelection(true);
    });

    socket.on('flipCards', () => {
      setIsFlipped(true);
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
              <Button onClick={handleFlipCards}>Flip Cards!</Button>
            ) : (
              vip &&
              gameStarted &&
              isFlipped && (
                <Button onClick={handleChallengeClick}>Challenge Time!</Button>
              )
            )}
          </>
        )) ||
        (showChallengeSelection && (
          <ChallengeSelection challenges={roomChallenges} />
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
