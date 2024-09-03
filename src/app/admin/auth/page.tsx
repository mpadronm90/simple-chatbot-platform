"use client";

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '../../../services/firebase';
import { RootState } from '../../../store';

const AdminAuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const type = searchParams.get('type');
    setIsSignUp(type === 'signup');
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationError(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setValidationError('Email and password are required.');
      return;
    }
    if (isSignUp && password.length < 6) {
      setValidationError('Password should be at least 6 characters.');
      return;
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMessage('Sign up successful! Please log in.');
        setIsSignUp(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/admin');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Error during authentication. Please try again.');
      }
    }
  };

  return (
    <div className="container flex justify-center items-center min-h-screen">
      <div className="admin-auth w-full max-w-md p-6 bg-black text-white rounded-lg">
        <h2 className="text-2xl mb-6">{isSignUp ? 'Admin Sign Up' : 'Admin Login'}</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          {validationError && <p className="text-red-500">{validationError}</p>}
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => { setValidationError(null); setError(null); setSuccessMessage(null); }}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => { setValidationError(null); setError(null); setSuccessMessage(null); }}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 bg-white text-black rounded">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 ml-2"
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminAuthPage;
