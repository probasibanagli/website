'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserPlus, Eye, EyeOff, Loader2, Mail, CheckCircle2,
  Shield, ArrowRight, Clock, RefreshCw, Inbox, AlertCircle, Phone, ArrowLeft, Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/AuthContext';
import type { ConfirmationResult } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { EmailAuthProvider, linkWithCredential } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

const EMAIL_RESEND_COOLDOWN = 60; // seconds
const OTP_RESEND_COOLDOWN = 30; // seconds

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, sendVerificationEmail, sendPhoneOtp, verifyPhoneOtp } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', agree: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  
  // Phone OTP state
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer for Email
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Resend cooldown timer for OTP
  const [otpResendTimer, setOtpResendTimer] = useState(0);
  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  const startOtpResendTimer = useCallback(() => {
    setOtpResendTimer(OTP_RESEND_COOLDOWN);
    if (otpTimerRef.current) clearInterval(otpTimerRef.current);
    otpTimerRef.current = setInterval(() => {
      setOtpResendTimer((prev) => {
        if (prev <= 1) {
          if (otpTimerRef.current) clearInterval(otpTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);
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

  /* ── OTP Input Handling ── */
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < paste.length; i++) {
      newOtp[i] = paste[i];
    }
    setOtp(newOtp);
    if (paste.length > 0) {
      const focusIdx = Math.min(paste.length, 5);
      otpRefs.current[focusIdx]?.focus();
    }
  };

  const formatPhone = (val: string) => {
    let f = val.trim();
    if (f.length > 0 && !f.startsWith('+') && !f.startsWith('0')) {
      f = '+91' + f.replace(/\s/g, '');
    }
    return f;
  };

  const isPhoneValid = () => {
    const p = form.phone.replace(/\D/g, '');
    // If it's a 10 digit indian number or 12 digit with +91
    return p.length >= 10;
  };

  const handleSendOtp = async () => {
    setError('');
    setSuccess('');

    if (!form.full_name.trim()) {
      setError('Please enter your full name first.');
      return;
    }

    let formatted = formatPhone(form.phone);
    if (!isPhoneValid()) {
      setError('Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      const result = await sendPhoneOtp(formatted, 'recaptcha-container');
      setConfirmationResult(result);
      setPhoneStep('otp');
      startOtpResendTimer();
      setSuccess(`OTP sent via SMS to ${formatted}`);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      if (message.includes('too-many-requests')) {
        setError('Too many attempts. Please try again after some time.');
      } else if (message.includes('invalid-phone-number')) {
        setError('Invalid phone number. Please check and try again.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndRegister = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    if (!confirmationResult) {
      setError('Session expired. Please request a new OTP.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      // 1. Verify Phone OTP - This logs the user in and creates a default profile
      await verifyPhoneOtp(confirmationResult, code);

      const user = auth.currentUser;
      if (user) {
        // 2. Update the profile with the provided full name and email
        await updateDoc(doc(db, 'users', user.uid), {
          full_name: form.full_name,
          email: form.email || '',
        });

        // 3. Optional: Link Email & Password if provided
        if (form.email && form.password) {
          try {
            const credential = EmailAuthProvider.credential(form.email, form.password);
            await linkWithCredential(user, credential);
            await sendVerificationEmail();
            setRegistered(true); // Show verification screen
            startResendTimer();
            return;
          } catch (linkErr: any) {
            console.error('Failed to link email/password:', linkErr);
            // It might fail if email is already in use by another account
            if (linkErr.message?.includes('email-already-in-use')) {
              setError('Phone verified, but this email is already linked to another account.');
            }
          }
        }
      }

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'OTP verification failed';
      if (message.includes('invalid-verification-code')) {
        setError('Invalid OTP. Please check and try again.');
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      } else if (message.includes('code-expired')) {
        setError('OTP has expired. Please request a new one.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendTimer > 0) return;
    try {
      await sendVerificationEmail();
      startResendTimer();
    } catch (err) {
      console.error('Resend failed:', err);
    }
  };

  /* ── Post-Registration: Verify Email Screen ── */
  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-light/30 via-white to-primary-light/20 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card padding="lg">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-5">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 animate-pulse" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <Mail className="w-10 h-10 text-green-600" />
                </div>
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
                        <span>Return here and <strong>login</strong></span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {resendTimer > 0 && (
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Resend available in <strong className="text-primary">{resendTimer}s</strong></span>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleResendEmail}
                  disabled={resendTimer > 0}
                >
                  <RefreshCw className="w-4 h-4" />
                  Resend Verification Email
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  <ArrowRight className="w-4 h-4" />
                  Go to Home
                </Button>
              </div>
            </div>
          </Card>
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
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-start gap-2 animate-slide-down">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> {success}
            </div>
          )}

          {phoneStep === 'input' && (
            <div className="space-y-4">
              <Input
                label="Full Name"
                id="reg-name"
                value={form.full_name}
                onChange={(e) => update('full_name', e.target.value)}
                placeholder="Your full name"
              />
              <Input
                label="Email Address (Optional)"
                id="reg-email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@example.com"
              />
              {form.email && (
                <div>
                  <div className="relative">
                    <Input
                      label="Password (Required if email is provided)"
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[34px] text-text-muted hover:text-primary cursor-pointer transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                    </div>
                  )}
                </div>
              )}

              <Input
                label="Phone Number (Required)"
                id="reg-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />

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

              {isPhoneValid() ? (
                <Button variant="primary" size="lg" className="w-full" onClick={handleSendOtp} disabled={!form.agree || loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                  {loading ? 'Sending OTP...' : 'Send OTP to Register'}
                </Button>
              ) : (
                <div className="text-center text-xs text-text-muted mt-2">
                  Enter a valid 10-digit phone number to continue
                </div>
              )}
            </div>
          )}

          {phoneStep === 'otp' && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h3 className="text-lg font-bold text-text-primary mb-1">Verify Your Phone</h3>
                <p className="text-sm text-text-muted">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-sm font-semibold text-text-primary mt-0.5">
                  {form.phone}
                </p>
              </div>

              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-surface transition-all duration-200 focus:outline-none ${
                      digit
                        ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10'
                        : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  />
                ))}
              </div>

              {otpResendTimer > 0 && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
                  <Timer className="w-3.5 h-3.5" />
                  <span>Resend available in <strong className="text-primary">{otpResendTimer}s</strong></span>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleVerifyOtpAndRegister}
                disabled={loading || otp.join('').length !== 6}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {loading ? 'Verifying...' : 'Verify & Register'}
              </Button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => setPhoneStep('input')}
                  className="flex items-center gap-1 text-text-muted hover:text-primary cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Edit details
                </button>
                <button
                  onClick={handleSendOtp}
                  disabled={loading || otpResendTimer > 0}
                  className={`flex items-center gap-1 cursor-pointer transition-colors ${
                    otpResendTimer > 0
                      ? 'text-text-muted/50 cursor-not-allowed'
                      : 'text-primary hover:underline'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Resend OTP
                </button>
              </div>
            </div>
          )}

          {/* reCAPTCHA container */}
          <div id="recaptcha-container" />

          {phoneStep === 'input' && (
            <p className="text-center text-sm text-text-muted mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary font-medium hover:underline">Login</Link>
            </p>
          )}
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
