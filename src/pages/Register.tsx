import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const register = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      setMessage("All fields must be filled");
      return;
    }

    const formData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      await axios.post(`http://localhost:7000/api/auth/register`, formData);
      navigate("/");
    } catch (error: any) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center h-[100vh]">
      <div className="md:mb-5">
        <h1 className="text-center text-4xl text-blue-500 font-bold md:text-5xl lg:text-[3.5rem]">
          Social Media
        </h1>

        <p className="my-3 text-center text-gray-700 text-[1rem] md:text-[1.2rem]">
          Connect with friends and the world <br /> around you on Social Media.
        </p>
      </div>

      <form
        onSubmit={register}
        className="flex flex-col space-y-3 p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:space-y-5 md:py-10"
      >
        <input
          type="text"
          placeholder="Enter your first name"
          className="p-2 border-2 rounded-md focus:outline-blue-600 md:w-[25rem]"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        />

        <input
          type="text"
          placeholder="Enter your last name"
          className="p-2 border-2 rounded-md focus:outline-blue-600 md:w-[25rem]"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        />
        <input
          type="text"
          placeholder="Enter your email"
          className="p-2 border-2 rounded-md focus:outline-blue-600 md:w-[25rem]"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="password"
          className="p-2 border-2 rounded-md focus:outline-blue-600 md:w-[25rem]"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button
          type="submit"
          className="p-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Register
        </button>

        {message && <span className="text-center text-red-500">{message}</span>}

        <Link
          to="/login"
          className="mx-auto text-[0.9rem] text-blue-600 hover:underline"
        >
          Already have an account?
        </Link>
      </form>
    </section>
  );
};

export default Register;
