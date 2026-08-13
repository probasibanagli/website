'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('If the email is registered, a password reset link has been sent to it. Please check your inbox.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send recovery email';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-light/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl bengali-text">প</div>
            <span className="text-xl font-bold">Probasi<span className="text-primary">Bangali</span></span>
          </Link>
          <h1 className="text-2xl font-bold font-display text-text-primary">Reset Password</h1>
          <p className="text-text-muted mt-1">Recover access to your account</p>
        </div>

        <Card padding="lg">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 animate-slide-down">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-start gap-2 animate-slide-down">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> {success}
            </div>
          )}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Button variant="primary" size="lg" className="w-full" type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {loading ? 'Sending...' : 'Send Recovery Link'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <Link href="/auth/login" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          )}

          {!success && (
            <div className="mt-6 flex justify-center">
              <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
