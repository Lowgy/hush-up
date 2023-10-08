'use client';
import { RoomProvider } from '@/context/room';
import { SocketContext, socket } from '@/context/socket';
import { UserProvider } from '@/context/user';

type Props = {
  children: JSX.Element;
};

export function Providers({ children }: Props) {
  return (
    <SocketContext.Provider value={socket}>
      <UserProvider>
        <RoomProvider>{children}</RoomProvider>
      </UserProvider>
    </SocketContext.Provider>
  );
}
