'use client';

import { useContext, useEffect } from 'react';
import RoomContext from '@/context/room';
import { SocketContext } from '@/context/socket';
import { Separator } from '@/components/ui/separator';
import UserContext from '@/context/user';

import { SparklesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testUsers = [
  {
    name: 'Lowgy',
  },
  {
    name: 'Robeet',
  },
  {
    name: 'Pagan',
  },
  {
    name: 'Miche',
  },
  {
    name: 'Signy',
  },
];

export default function RoomPage() {
  const socket = useContext(SocketContext);
  const { roomInfo, roomUsers, setRoomUsers } = useContext(RoomContext);
  const { userName, vip } = useContext(UserContext);

  useEffect(() => {
    socket.on('roomData', ({ users }: any) => {
      console.log(users);
      setRoomUsers(users);
    });
  }, [roomUsers]);

  return (
    <>
      <section className="flex flex-col text-center text-white">
        <h1>
          Join at <span className="font-semibold">hush-up.vercel.app</span>
        </h1>
        <h2>Enter room code</h2>
        <h2 className="text-4xl text-[#FFD700]">{roomInfo.code || 'Code'}</h2>
      </section>
      <div className="border rounded w-full lg:w-2/4 text-center text-white">
        <h1>Players</h1>
        <Separator />
        <div className="grid grid-cols-3 gap-4 py-4 px-4">
          {/* {testUsers.map((user) => (
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
          ))} */}
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
        <Button className=" bg-[#FFD700] text-black hover:text-white hover:bg-yellow-300">
          Start Game <SparklesIcon className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        ''
      )}
    </>
  );
}
