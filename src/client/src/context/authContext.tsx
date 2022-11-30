import axios from 'axios';
import { createContext, useEffect, useState, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/userLocalStorage';

type AuthProviderProps = {
  children: ReactNode;
};

export type LoginData = {
  username: string;
  password: string;
};

type UserData = {
  id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  profileId: number;
};

type AuthContext = {
  login: (inputs: LoginData) => Promise<void>;
  currentUser: UserData;
};

export const AuthContext = createContext({} as AuthContext);

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useLocalStorage<UserData>('user', null);

  const login = async (inputs: LoginData) => {
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
  };

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
