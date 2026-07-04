'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserPlus, Eye, EyeOff, Loader2, Mail, CheckCircle2,
  Shield, ArrowRight, Lock, Phone, ArrowLeft, RefreshCw, Key, ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/AuthContext';
import type { ConfirmationResult } from 'firebase/auth';

type Step = 'details' | 'verification' | 'password';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, sendPhoneOtp } = useAuth();

  const [step, setStep] = useState<Step>('details');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Simulation / Store
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', '']);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Resend Timers
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Debug OTP display for testing convenience
  const [debugPhoneOtp, setDebugPhoneOtp] = useState('');
  const [debugEmailOtp, setDebugEmailOtp] = useState('');

  const phoneOtpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const emailOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startResendTimer = () => {
    setTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.full_name.trim()) return setError('Please enter your full name.');
    if (!form.email.trim()) return setError('Please enter your email address.');
    if (!form.phone.trim()) return setError('Please enter your phone number.');

    const digits = form.phone.replace(/\D/g, '');
    if (digits.length !== 10) return setError('Please enter a valid 10-digit phone number.');

    setLoading(true);
    try {
      const formattedPhone = '+91' + digits;

      // 1. Send Phone OTP
      const phoneResult = await sendPhoneOtp(formattedPhone, 'recaptcha-container', 'register');
      setPhoneConfirmationResult(phoneResult);

      // 2. Send Email OTP
      const emailRes = await fetch('/api/auth/email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: form.email.trim() }),
      });
      const emailData = await emailRes.json();
      if (!emailRes.ok) {
        throw new Error(emailData.error || 'Failed to send Email OTP');
      }

      // Store debug OTPs if returned
      if (emailData.debugOtp) {
        setDebugEmailOtp(emailData.debugOtp);
      }

      // Fetch simulated phone OTP from DB for testing ease
      try {
        const checkPhoneOtpDoc = await fetch('/api/auth/otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'verify', phone: formattedPhone, otp: 'CHECK_ONLY' })
        });
        // We just print mock alert or check console logs.
      } catch (err) {
        // Ignore check
      }

      setStep('verification');
      startResendTimer();
      setSuccess('Verification codes sent to both your registered Phone Number and Email ID!');
      setTimeout(() => phoneOtpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const phoneCode = phoneOtp.join('');
    const emailCode = emailOtp.join('');

    if (phoneCode.length !== 6) return setError('Please enter the complete 6-digit Phone OTP.');
    if (emailCode.length !== 6) return setError('Please enter the complete 6-digit Email OTP.');

    setLoading(true);
    try {
      // 1. Verify Email OTP
      const emailVerifyRes = await fetch('/api/auth/email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: form.email.trim(), otp: emailCode }),
      });
      const emailVerifyData = await emailVerifyRes.json();
      if (!emailVerifyRes.ok) {
        throw new Error(emailVerifyData.error || 'Invalid Email OTP.');
      }

      // 2. Verify Phone OTP (but don't trigger sign in until password is created, so we verify using API)
      const digits = form.phone.replace(/\D/g, '');
      const formattedPhone = '+91' + digits;
      const phoneVerifyRes = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone: formattedPhone, otp: phoneCode }),
      });
      const phoneVerifyData = await phoneVerifyRes.json();
      if (!phoneVerifyRes.ok) {
        throw new Error(phoneVerifyData.error || 'Invalid Phone OTP.');
      }

      setSuccess('Phone and Email successfully verified!');
      setTimeout(() => {
        setStep('password');
        setSuccess('');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm_password) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const digits = form.phone.replace(/\D/g, '');
      const formattedPhone = '+91' + digits;

      // Register the full account in Firebase Auth with Email & Password
      // Mark phone and email as verified
      await signUp(form.email.trim(), form.password, form.full_name, formattedPhone, true, true);

      // Create activity log
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'User Registered',
          performed_by: form.full_name,
          user_role: 'user',
          details: `Registered new account with Email: ${form.email.trim()}, Phone: ${formattedPhone}`
        })
      }).catch(() => {});

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create password.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (type: 'phone' | 'email', index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    if (type === 'phone') {
      const nextOtp = [...phoneOtp];
      nextOtp[index] = value;
      setPhoneOtp(nextOtp);
      if (value && index < 5) phoneOtpRefs.current[index + 1]?.focus();
    } else {
      const nextOtp = [...emailOtp];
      nextOtp[index] = value;
      setEmailOtp(nextOtp);
      if (value && index < 5) emailOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (type: 'phone' | 'email', index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (type === 'phone' && !phoneOtp[index] && index > 0) {
        phoneOtpRefs.current[index - 1]?.focus();
      } else if (type === 'email' && !emailOtp[index] && index > 0) {
        emailOtpRefs.current[index - 1]?.focus();
      }
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
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 animate-slide-down">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-start gap-2 animate-slide-down">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> {success}
            </div>
          )}



          {/* STEP 1: Enter Details */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <Input
                label="Full Name"
                id="reg-name"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                placeholder="Your full name"
                required
              />
              <Input
                label="Email Address"
                id="reg-email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
              />
              <Input
                label="Phone Number"
                id="reg-phone"
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="98765 43210"
                required
              />
              <Button variant="primary" size="lg" className="w-full" type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? 'Sending OTPs...' : 'Continue — Verify Contacts'}
              </Button>
            </form>
          )}

          {/* STEP 2: Double OTP Verification */}
          {step === 'verification' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* Phone OTP Inputs */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-primary" /> Phone Verification Code
                </label>
                <div className="flex justify-center gap-2">
                  {phoneOtp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { phoneOtpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange('phone', i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown('phone', i, e)}
                      className="w-10 h-12 text-center text-lg font-bold rounded-xl border border-border bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  ))}
                </div>
              </div>

              {/* Email OTP Inputs */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-accent" /> Email Verification Code
                </label>
                <div className="flex justify-center gap-2">
                  {emailOtp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { emailOtpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange('email', i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown('email', i, e)}
                      className="w-10 h-12 text-center text-lg font-bold rounded-xl border border-border bg-surface focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  ))}
                </div>
              </div>

              <Button variant="primary" size="lg" className="w-full" type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {loading ? 'Verifying...' : 'Verify OTPs'}
              </Button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to details
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Create Password */}
          {step === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-primary">Create Your Password</h3>
                <p className="text-xs text-text-muted">Set up a strong password to secure your account</p>
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-text-muted hover:text-primary cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm Password"
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirm_password}
                  onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[34px] text-text-muted hover:text-primary cursor-pointer transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button variant="primary" size="lg" className="w-full" type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {loading ? 'Creating Account...' : 'Complete & Register'}
              </Button>
            </form>
          )}

          {/* reCAPTCHA container */}
          <div id="recaptcha-container" />

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
