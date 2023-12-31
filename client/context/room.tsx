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

type RoomUser = {
  name?: string;
};

interface RoomContextType {
  roomInfo: RoomInfo;
  setRoomInfo: Dispatch<SetStateAction<RoomInfo>>;
  roomUsers: Array<RoomUser>;
  setRoomUsers: Dispatch<SetStateAction<Array<RoomUser>>>;
  roomChallenges: Array<string>;
  setRoomChallenges: Dispatch<SetStateAction<Array<string>>>;
}

const RoomContext = createContext<RoomContextType>({
  roomInfo: {},
  setRoomInfo: () => {},
  roomUsers: [],
  setRoomUsers: () => {},
  roomChallenges: [],
  setRoomChallenges: () => {},
});

type ContextProviderProps = {
  children?: ReactNode;
};

export const RoomProvider = ({ children }: ContextProviderProps) => {
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({});
  const [roomUsers, setRoomUsers] = useState<Array<RoomUser>>([]);
  const [roomChallenges, setRoomChallenges] = useState<Array<string>>([]);

  return (
    <RoomContext.Provider
      value={{
        roomInfo,
        setRoomInfo,
        roomUsers,
        setRoomUsers,
        roomChallenges,
        setRoomChallenges,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomContext;
