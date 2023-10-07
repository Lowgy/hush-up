'use client';
import { SocketContext, socket } from '@/context/socket';
import { UserProvider } from '@/context/user';

type Props = {
  children: JSX.Element;
};

export function Providers({ children }: Props) {
  return (
    <UserProvider>
      <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    </UserProvider>
  );
}
