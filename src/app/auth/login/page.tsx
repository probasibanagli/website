'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Supabase auth integration will go here
    alert('Login functionality requires Supabase configuration. Please add your Supabase credentials to .env.local');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/30 via-white to-accent-light/20 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl bengali-text">প</div>
            <span className="text-xl font-bold">Probasi<span className="text-primary">Bangali</span></span>
          </Link>
          <h1 className="text-2xl font-bold font-display text-text-primary">Welcome Back</h1>
          <p className="text-text-muted mt-1">Login to access all features</p>
        </div>

        <Card padding="lg">
          <div className="flex rounded-xl border border-border p-1 mb-6">
            <button onClick={() => setMode('email')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${mode === 'email' ? 'bg-primary text-white' : 'text-text-muted'}`}>
              <Mail className="w-4 h-4" /> Email
            </button>
            <button onClick={() => setMode('phone')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${mode === 'phone' ? 'bg-primary text-white' : 'text-text-muted'}`}>
              <Phone className="w-4 h-4" /> Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'email' ? (
              <Input label="Email Address" id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            ) : (
              <Input label="Phone Number" id="login-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
            )}

            <div className="relative">
              <Input label="Password" id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-text-muted hover:text-primary cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</button>
            </div>

            <Button variant="primary" size="lg" className="w-full" type="submit">
              <Lock className="w-4 h-4" /> Login
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary font-medium hover:underline">Register</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
