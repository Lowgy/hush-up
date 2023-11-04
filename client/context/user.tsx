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
  role: string;
  setRole: Dispatch<SetStateAction<string>>;
}

const UserContext = createContext<UserContextType>({
  userName: '',
  setUsername: () => {},
  vip: false,
  setVip: () => {},
  role: '',
  setRole: () => {},
});

type ContextProviderProps = {
  children?: ReactNode;
};

export const UserProvider = ({ children }: ContextProviderProps) => {
  const [userName, setUsername] = useState('');
  const [vip, setVip] = useState(false);
  const [role, setRole] = useState('');

  return (
    <UserContext.Provider
      value={{ userName, setUsername, vip, setVip, role, setRole }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
