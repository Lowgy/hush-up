'use client';
import { SocketContext, socket } from '@/context/socket';

export function Providers(children: any) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
