import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [err, setErr] = useState(null);

  const handleChange = (e: any) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8800/api/auth/register', inputs);
    } catch (err: any) {
      //setErr(err.response.data);
      console.log(err.response);
    }
  };

  console.log(err);

  return (
    <div className="h-screen bg-green-300 flex items-center justify-center">
      <div className="w-1/2 flex flex-row-reverse bg-white rounded-lg min-h-[600px] overflow-hidden shadow-xl">
        <div className="flex-1 bg-gradient-to-bl from-green-500 to-green-900 p-12 flex flex-col gap-8 text-white">
          <h1 className="text-7xl font-bold">Very Social Platform.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
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
          <form className="grid grid-cols-2 gap-6">
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
              name="birthdate"
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
              name="confirmpassword"
              required
              onChange={handleChange}
            />
            {err && err}
            <button
              className="w-1/2 p-3 border-none bg-slate-500 text-white cursor-pointer font-bold rounded-lg"
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
