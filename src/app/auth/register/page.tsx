'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', agree: false });

  const update = (field: string, value: string | boolean) => setForm({ ...form, [field]: value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Registration requires Supabase configuration. Please add your Supabase credentials to .env.local');
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
            <Button variant="primary" size="lg" className="w-full" type="submit" disabled={!form.agree}>
              <UserPlus className="w-4 h-4" /> Create Account
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
