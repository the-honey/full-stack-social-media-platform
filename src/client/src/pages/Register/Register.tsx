import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth, { RegisterData } from '@/context/authContext';

const Register = () => {
  const [inputs, setInputs] = useState({} as RegisterData);

  const { login, error, loading, register } = useAuth();

  const handleChange = (e: any) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e: any) => {
    e.preventDefault();
    register(inputs);
  };

  return (
    <div className="h-full sm:h-screen bg-green-300 flex md:items-center justify-center">
      <div className="md:rounded-xl max-w-[950px] flex flex-wrap flex-row-reverse bg-white min-h-[600px] shadow-xl">
        <div className="flex-1 md:rounded-r-xl bg-gradient-to-br from-green-500 to-green-900 p-12 flex flex-col gap-8 text-white">
          <h1 className="text-7xl font-bold">Welcome</h1>
          <p className="text-justify">
            Welcome to our social media platform! Share your thoughts, connect
            with others, and enjoy your time on our platform. If you have any
            questions or feedback, let us know. Thanks for joining!
          </p>
          <span className="text-sm">Do you have an account?</span>
          <Link to="/login">
            <button className="w-1/2 p-2 border-none bg-white text-green-900 font-bold cursor-pointer rounded-lg">
              Login
            </button>
          </Link>
        </div>
        <div className="flex-1 p-12 flex flex-col gap-12 justify-center">
          <h1 className="text-4xl text-gray-600 font-bold">Register</h1>
          <form>
            <div className="mb-6 grid grid-cols-2 gap-3">
              <input
                className="col-span-2 border-solid border-b-2 border-b-gray-300 px-5 py-3"
                type="email"
                placeholder="Email"
                name="email"
                required
                onChange={handleChange}
              />
              <input
                className="border-solid border-b-2 border-b-gray-300 px-5 py-3"
                type="text"
                placeholder="Username"
                name="username"
                required
                onChange={handleChange}
              />
              <input
                className="border-solid border-b-2 border-b-gray-300 px-5 py-3"
                type="date"
                name="birthDate"
                required
                onChange={handleChange}
              />
              <input
                className="border-solid border-b-2 border-b-gray-300 px-5 py-3"
                type="text"
                placeholder="First Name"
                name="firstName"
                required
                onChange={handleChange}
              />
              <input
                className="border-solid border-b-2 border-b-gray-300 px-5 py-3"
                type="text"
                placeholder="Last Name"
                name="lastName"
                required
                onChange={handleChange}
              />
              <input
                className="col-span-2 border-solid border-b-2 border-b-gray-300 px-5 py-3"
                type="password"
                placeholder="Password"
                name="password"
                required
                onChange={handleChange}
              />
              <input
                className="col-span-2 border-solid border-b-2 border-b-gray-300 px-5 py-3"
                type="password"
                placeholder="Confirm Password"
                name="passwordConfirm"
                required
                onChange={handleChange}
              />
            </div>
            {error?.message && (
              <p className="text-red-600 col-span-2">{error.message}</p>
            )}
            {error?.errors &&
              error.errors.map((e: string) => (
                <p className="text-red-600 col-span-2">{e}</p>
              ))}
            <button
              className="mt-6 w-1/2 p-3 border-none bg-slate-500 text-white cursor-pointer font-bold rounded-lg"
              onClick={handleClick}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
