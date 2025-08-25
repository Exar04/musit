// import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../context/authContext.tsx';
import { useNavigate } from "react-router";
import { authApi } from "../lib/api.ts";

import type { FormEvent } from 'react';
import type { AxiosError } from 'axios';

interface LoginResponse {
  username: string;
  token: string;
}

export function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await authApi.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      login(response.data.username, response.data.token);
      setError(null);
      navigate('/');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      setError(axiosErr.response?.data?.message || 'Login failed');
      console.error('Error logging in:', err);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <form onSubmit={handleSubmit} className="p-8 shadow-2xl rounded-lg h-fit w-2/5 bg-slate-100" >
        <div className="flex justify-center text-3xl font-bold font-mono px-3"> Login </div>
        <div className="my-8 text-center"> Please enter your credentials to login </div>
        <div>Email</div>
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mt-2 mb-4 border border-gray-300 bg-slate-200 rounded py-3"/>
        <div>Password</div>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mt-2 mb-4 border border-gray-300 bg-slate-200 rounded py-3"/>
        <button type="submit" className="bg-green-400 p-3 flex justify-center py-3 w-full rounded"> Submit </button>

        {error && <div className="text-red-500 text-center py-2">{error}</div>}

        <div className="text-center py-3">
          Don't have an account? <span className="text-blue-500">SignUp</span>
        </div>
      </form>
    </div>
  );
}