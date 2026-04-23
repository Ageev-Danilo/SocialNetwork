import {
    createContext,
    useContext,
    useState,
    type PropsWithChildren,
} from 'react';
import type { User } from '../model';

interface UserContextContract {
    token: string | null;
    user: User | null;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextContract | null>(null);

export  function useUserContext() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUserContext must be inside UserContextProvider');
    return ctx;
}

export function UserContextProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    return (
        <UserContext.Provider value={{ user, token, setUser, setToken }}>
            {children}
        </UserContext.Provider>
    );
}