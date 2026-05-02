'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', agree: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string | boolean) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.full_name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signUp(form.email, form.password, form.full_name, form.phone || undefined);
      router.push('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      if (message.includes('email-already-in-use')) {
        setError('This email is already registered. Please login instead.');
      } else if (message.includes('weak-password')) {
        setError('Password is too weak. Use at least 6 characters.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-light/30 via-white to-primary-light/20 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl bengali-text">প</div>
            <span className="text-xl font-bold">Probasi<span className="text-primary">Bangali</span></span>
          </Link>
          <h1 className="text-2xl font-bold font-display text-text-primary">Create Account</h1>
          <p className="text-text-muted mt-1">Join the Bengali community in Tamil Nadu</p>
        </div>

        <Card padding="lg">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" id="reg-name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} placeholder="Your full name" />
            <Input label="Email Address" id="reg-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
            <Input label="Phone Number" id="reg-phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" />
            <div className="relative">
              <Input label="Password" id="reg-password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Create a strong password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-text-muted hover:text-primary cursor-pointer">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.agree} onChange={(e) => update('agree', e.target.checked)} className="mt-1 accent-primary" />
              <span className="text-xs text-text-muted">I agree to the <Link href="#" className="text-primary underline">Terms of Service</Link> and <Link href="#" className="text-primary underline">Privacy Policy</Link></span>
            </label>
            <Button variant="primary" size="lg" className="w-full" type="submit" disabled={!form.agree || loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account? <Link href="/auth/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
