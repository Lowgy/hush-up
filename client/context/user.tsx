import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from 'react';

interface UserContextType {
  userName: string;
  setUsername: Dispatch<SetStateAction<string>>;
  vip: boolean;
  setVip: Dispatch<SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType>({
  userName: '',
  setUsername: () => {},
  vip: false,
  setVip: () => {},
});

type ContextProviderProps = {
  children?: ReactNode;
};

export const UserProvider = ({ children }: ContextProviderProps) => {
  const [userName, setUsername] = useState('');
  const [vip, setVip] = useState(false);

  return (
    <UserContext.Provider value={{ userName, setUsername, vip, setVip }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
