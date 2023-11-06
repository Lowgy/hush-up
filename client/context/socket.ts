import { createContext } from 'react';
import { io } from 'socket.io-client';

const url =
  process.env.NODE_ENV === 'production'
    ? 'https://hush-up-app-server.onrender.com'
    : 'http://localhost:3001';

export const socket = io(`${url}`);
export const SocketContext = createContext<any>(null);
