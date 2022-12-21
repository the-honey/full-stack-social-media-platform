import axios, { Axios, AxiosError } from 'axios';
import {
  createContext,
  useMemo,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from 'react';
import { useLocalStorage } from '@/hooks/userLocalStorage';
import { useNavigate, useLocation } from 'react-router-dom';
import { makeRequest } from '../axios';

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
  passwordConfirm: string;
};

type UserData = {
  id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  profile: { firstName: string; lastName: string; profilePicUrl: string };
};

type AuthContextType = {
  currentUser?: UserData | null;
  error?: any;
  loading: boolean;
  login: (inputs: LoginData) => void;
  register: (inputs: RegisterData) => void;
  logout: () => void;
  refreshProfile: () => void;
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
  const [currentUser, setCurrentUser] = useLocalStorage<UserData | null>(
    'user',
    null
  );
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  // If we change page, reset the error state.
  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  async function refreshProfile() {
    makeRequest
      .get('/user/id/' + currentUser?.username)
      .then((res) => {
        const { user } = res.data;
        setCurrentUser(
          (prev) => ({ ...prev, profile: user.profile } as UserData)
        );
      })
      .catch((err) => {
        if (err instanceof AxiosError) setError(err.response?.data);
      });
  }

  async function login(inputs: LoginData) {
    setLoading(true);

    makeRequest
      .post('/auth/login', inputs)
      .then((res) => {
        const { user } = res.data;
        setCurrentUser(user);
        navigate('/');
      })
      .catch((err) => {
        if (err instanceof AxiosError) setError(err.response?.data);
      })
      .finally(() => setLoading(false));
  }

  async function register(inputs: RegisterData) {
    setLoading(true);

    makeRequest
      .post('/auth/register', inputs)
      .then((res) => {
        const { user } = res.data;
        setCurrentUser(user);
        navigate('/');
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          setError(err.response?.data);
        }
      })
      .finally(() => setLoading(false));
  }

  async function logout() {
    setLoading(true);

    makeRequest
      .post('/auth/logout')
      .then((res) => {
        setCurrentUser(null);
        navigate('/login');
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          setError(err.response?.data);
        }
      })
      .finally(() => setLoading(false));
  }

  const memoedValue = useMemo(
    () => ({
      currentUser,
      loading,
      error,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [currentUser, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};
