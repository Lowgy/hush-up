'use client';
import { SocketContext, socket } from '@/context/socket';

type Props = {
  children: JSX.Element;
};

export function Providers({ children }: Props) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
