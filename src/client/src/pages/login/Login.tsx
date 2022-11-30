import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '@/context/authContext';
import { AuthContext } from '@/context/authContext';

const Login = () => {
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useAuth();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate('/');
    } catch (err: any) {
      setErr(err);
      //console.log(err);
    }
  };

  return (
    <div className="h-screen bg-green-300 flex items-center justify-center">
      <div className="w-1/2 flex bg-white rounded-xl min-h-[600px] overflow-hidden">
        <div className="flex-1 bg-gradient-to-br from-green-500 to-green-900 p-12 flex flex-col gap-8 text-white">
          <h1 className="text-8xl font-bold">Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
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
          <form className="flex flex-col gap-8">
            <input
              className="border-solid border-b-2 border-b-gray-300 px-5 py-3"
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
            {err && err}
            <button
              className="w-1/2 p-3 border-none bg-slate-500 text-white cursor-pointer font-bold rounded-lg"
              onClick={handleLogin}
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
