import axios from 'axios';
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from 'react';
import { useLocalStorage } from '@/hooks/userLocalStorage';

export type LoginData = {
  username: string;
  password: string;
};

export type RegisterData = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  password: string;
  confirmPassword: string;
};

type UserData = {
  id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  profileId: number;
};

type AuthContextType = {
  currentUser?: UserData;
  login: (inputs: LoginData) => void;
  register: (inputs: RegisterData) => void;
};

export default function useAuth() {
  return useContext(AuthContext);
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [currentUser, setCurrentUser] = useLocalStorage<UserData>('user', null);

  async function login(inputs: LoginData) {
    console.log(inputs);
    const res = await axios.post(
      'http://localhost:3000/api/auth/login',
      inputs,
      {
        withCredentials: true,
      }
    );

    const data: UserData = res.data.user;

    setCurrentUser(data);
  }

  async function register(inputs: RegisterData) {
    const res = await axios.post(
      'http://localhost:3000/api/auth/register',
      inputs,
      {
        withCredentials: true,
      }
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};
