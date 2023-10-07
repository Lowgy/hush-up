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
}

const UserContext = createContext<UserContextType>({
  userName: '',
  setUsername: () => {},
});

type ContextProviderProps = {
  children?: ReactNode;
};

export const UserProvider = ({ children }: ContextProviderProps) => {
  const [userName, setUsername] = useState('');

  return (
    <UserContext.Provider value={{ userName, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
