"use client";

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '../../../services/firebase';
import { RootState } from '../../../store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

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
      setError(error.message);
    }
  };

  return (
    <div className="container flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Admin Sign Up' : 'Admin Login'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {validationError && <p className="text-red-500">{validationError}</p>}
            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => { setValidationError(null); setError(null); setSuccessMessage(null); }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => { setValidationError(null); setError(null); setSuccessMessage(null); }}
              />
            </div>
            <Button type="submit" className="w-full">
              {isSignUp ? 'Sign Up' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-1 p-0"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminAuthPage;
