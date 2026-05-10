'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserPlus, Eye, EyeOff, Loader2, Mail, CheckCircle2,
  Shield, ArrowRight, Clock, RefreshCw, Inbox, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/AuthContext';

const EMAIL_RESEND_COOLDOWN = 60; // seconds

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, sendVerificationEmail } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', agree: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  // Resend cooldown timer
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startResendTimer = useCallback(() => {
    setResendTimer(EMAIL_RESEND_COOLDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Password strength
  const getPasswordStrength = (pw: string) => {
    if (pw.length === 0) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-400' };
    if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-amber-400' };
    if (score <= 3) return { level: 3, label: 'Good', color: 'bg-blue-400' };
    return { level: 4, label: 'Strong', color: 'bg-green-500' };
  };

  const pwStrength = getPasswordStrength(form.password);

  const update = (field: string, value: string | boolean) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.full_name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!form.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signUp(form.email, form.password, form.full_name, form.phone || undefined);
      setRegistered(true);
      startResendTimer();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      if (message.includes('email-already-in-use')) {
        setError('This email is already registered. Please login instead.');
      } else if (message.includes('weak-password')) {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (message.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendTimer > 0) return;
    setResendLoading(true);
    setResendSuccess(false);
    try {
      await sendVerificationEmail();
      setResendSuccess(true);
      setResendCount((prev) => prev + 1);
      startResendTimer();
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      console.error('Resend failed:', err);
    } finally {
      setResendLoading(false);
    }
  };

  /* ── Post-Registration: Verify Email Screen ── */
  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-light/30 via-white to-primary-light/20 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card padding="lg">
            <div className="text-center">
              {/* Animated icon */}
              <div className="relative w-20 h-20 mx-auto mb-5">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 animate-pulse" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-green-600" />
                </div>
                {/* Success checkmark */}
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold font-display text-text-primary mb-2">
                Verify Your Email
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                We&apos;ve sent a verification link to
              </p>
              <p className="font-semibold text-text-primary text-base mt-1">{form.email}</p>

              {/* Steps card */}
              <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50">
                <div className="flex items-start gap-3 text-left">
                  <Inbox className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-2">Complete these steps:</p>
                    <ol className="space-y-2 text-xs">
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 font-bold shrink-0 text-[10px]">1</span>
                        <span>Open your email inbox (check spam/junk too)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 font-bold shrink-0 text-[10px]">2</span>
                        <span>Click the <strong>&ldquo;Verify Email&rdquo;</strong> button in the email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 font-bold shrink-0 text-[10px]">3</span>
                        <span>Return here and <strong>login</strong> with your credentials</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Resend success */}
              {resendSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2 justify-center animate-slide-down">
                  <CheckCircle2 className="w-4 h-4" /> Verification email resent!
                </div>
              )}

              {/* Timer + Resend info */}
              {resendTimer > 0 && (
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Resend available in <strong className="text-primary">{resendTimer}s</strong></span>
                </div>
              )}

              {resendCount >= 3 && (
                <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>Still not receiving? Check your spam/junk folder or try a different email.</span>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleResendEmail}
                  disabled={resendLoading || resendTimer > 0}
                >
                  {resendLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => router.push('/auth/login')}
                >
                  <ArrowRight className="w-4 h-4" />
                  Go to Login
                </Button>
              </div>

              {form.phone && (
                <div className="mt-6 pt-5 border-t border-border">
                  <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Phone: {form.phone}</span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">verify later</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <Shield className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs text-text-muted">Your data is protected with Firebase Authentication</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Registration Form ── */
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
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 animate-slide-down">
              <Shield className="w-4 h-4 mt-0.5 shrink-0" /> {error}
            </div>
          )}

          {/* Verification info banner */}
          <div className="mb-5 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 text-xs text-blue-700 flex items-start gap-2.5">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="font-semibold text-sm text-blue-800">Verification required</p>
              <p className="mt-0.5 leading-relaxed">A verification email will be sent after registration. You can verify your phone number later via OTP in your profile.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              id="reg-name"
              value={form.full_name}
              onChange={(e) => update('full_name', e.target.value)}
              placeholder="Your full name"
            />
            <Input
              label="Email Address"
              id="reg-email"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="you@example.com"
            />
            <Input
              label="Phone Number (optional)"
              id="reg-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="+91 98765 43210"
            />
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  placeholder="Create a strong password (min 6 chars)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-text-muted hover:text-primary cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength indicator */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= pwStrength.level ? pwStrength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11px] mt-1 ${
                    pwStrength.level <= 1 ? 'text-red-500' :
                    pwStrength.level <= 2 ? 'text-amber-500' :
                    pwStrength.level <= 3 ? 'text-blue-500' : 'text-green-600'
                  }`}>
                    {pwStrength.label} password
                  </p>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => update('agree', e.target.checked)}
                className="mt-1 accent-primary"
              />
              <span className="text-xs text-text-muted">
                I agree to the{' '}
                <Link href="#" className="text-primary underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="#" className="text-primary underline">Privacy Policy</Link>
              </span>
            </label>

            <Button variant="primary" size="lg" className="w-full" type="submit" disabled={!form.agree || loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </Card>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <Shield className="w-3.5 h-3.5 text-green-500" />
          <span className="text-xs text-text-muted">Secured by Firebase Authentication</span>
        </div>
      </div>
    </div>
  );
}
