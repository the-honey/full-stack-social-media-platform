import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '@/context/authContext';

const Login = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: any) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login, error, loading } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    login(inputs);
  };

  return (
    <div className="h-full sm:h-screen bg-green-300 flex md:items-center justify-center">
      <div className="md:rounded-xl max-w-[950px] flex flex-wrap bg-white min-h-[600px] shadow-xl">
        <div className="flex-1 md:rounded-l-xl bg-gradient-to-br from-green-500 to-green-900 p-12 flex flex-col gap-8 text-white">
          <h1 className="text-8xl font-bold">Very Social</h1>
          <p className="text-justify">
            Welcome to our social media platform! Share your thoughts, connect
            with others, and enjoy your time on our platform. If you have any
            questions or feedback, let us know. Thanks for joining!
          </p>
          <span className="text-sm">Don't you have an account?</span>
          <Link to="/register">
            <button className="w-1/2 p-2 border-none bg-white text-green-900 font-bold cursor-pointer rounded-lg">
              Register
            </button>
          </Link>
        </div>
        <div className="flex-1 p-12 flex flex-col gap-12 justify-center">
          <h1 className="text-4xl text-gray-600 font-bold">Login</h1>
          <form className="">
            <div className="flex flex-col gap-8 mb-6">
              <input
                className=" border-solid border-b-2 border-b-gray-300 px-5 py-3"
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
              />
              <input
                className="border-solid border-b-2 border-b-gray-300 px-5 py-3"
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
            </div>
            {error?.message && <p className="text-red-600">{error.message}</p>}
            {error?.errors &&
              error.errors.map((e: string) => (
                <p className="text-red-600">{e}</p>
              ))}
            <button
              className="mt-6 w-1/2 p-3 border-none bg-slate-500 text-white cursor-pointer font-bold rounded-lg"
              onClick={handleLogin}
              disabled={loading}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
