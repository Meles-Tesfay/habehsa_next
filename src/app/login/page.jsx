'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('admin@habesha.com');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const router = useRouter();

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.replace(user.role === 'admin' ? '/dashboard' : '/account');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login(email, password);
    if (res.success) {
      router.replace(res.role === 'admin' ? '/dashboard' : '/account');
    } else {
      setError(res.error);
    }
    setIsLoading(false);
  };

  const setCustomerDemo = () => {
    setEmail('customer@example.com');
    setPassword('password');
  };

  const setAdminDemo = () => {
    setEmail('admin@habesha.com');
    setPassword('admin');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link href="/" className="login-logo">Habesha <em>Heritage</em></Link>
          <h2>Welcome Back</h2>
          <p>Sign in to access your account or dashboard.</p>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>Email Address</label>
            <div className="login-input-wrap">
              <Mail size={18} />
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="name@example.com"
              />
            </div>
          </div>
          
          <div className="login-field">
            <label>Password</label>
            <div className="login-input-wrap">
              <Lock size={18} />
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary btn-gold login-btn" disabled={isLoading}>
            {isLoading ? <div className="pf-spinner-sm" /> : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="login-demo-accounts">
          <p className="demo-label">Demo Accounts:</p>
          <div className="demo-btns">
            <button type="button" onClick={setCustomerDemo}>Customer</button>
            <button type="button" onClick={setAdminDemo}>Seller (Admin)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
