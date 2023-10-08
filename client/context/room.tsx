import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react';

type RoomInfo = {
  id?: string;
  code?: string;
  rounds?: number;
  gameType?: string;
};

interface RoomContextType {
  roomInfo: RoomInfo;
  setRoomInfo: Dispatch<SetStateAction<RoomInfo>>;
  roomUsers: Array<string>;
  setRoomUsers: Dispatch<SetStateAction<Array<string>>>;
}

const RoomContext = createContext<RoomContextType>({
  roomInfo: {},
  setRoomInfo: () => {},
  roomUsers: [],
  setRoomUsers: () => {},
});

type ContextProviderProps = {
  children?: ReactNode;
};

export const RoomProvider = ({ children }: ContextProviderProps) => {
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({});
  const [roomUsers, setRoomUsers] = useState<Array<string>>([]);

  return (
    <RoomContext.Provider
      value={{ roomInfo, setRoomInfo, roomUsers, setRoomUsers }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
