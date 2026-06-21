'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserPlus, Eye, EyeOff, Loader2, Mail, CheckCircle2,
  Shield, ArrowRight, Clock, RefreshCw, Inbox, AlertCircle,
  Phone, ArrowLeft, Timer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/AuthContext';
import type { ConfirmationResult } from 'firebase/auth';

const EMAIL_RESEND_COOLDOWN = 60;
const OTP_RESEND_COOLDOWN = 30;

type Step = 'form' | 'phone-otp' | 'email-sent';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, sendPhoneOtp, sendVerificationEmail } = useAuth();

  const [step, setStep] = useState<Step>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', agree: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Phone OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timers
  const [otpTimer, setOtpTimer] = useState(0);
  const [emailTimer, setEmailTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);
  const emailTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => () => {
    if (otpTimerRef.current) clearInterval(otpTimerRef.current);
    if (emailTimerRef.current) clearInterval(emailTimerRef.current);
  }, []);

  const startTimer = useCallback((
    setter: React.Dispatch<React.SetStateAction<number>>,
    timerRef: React.MutableRefObject<NodeJS.Timeout | null>,
    duration: number,
  ) => {
    setter(duration);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setter(prev => {
        if (prev <= 1) { if (timerRef.current) clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
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

  // Format phone to E.164
  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    return '+91' + digits;
  };

  /* ── Step 1: Validate Form & Send Phone OTP ── */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.full_name.trim()) { setError('Please enter your full name.'); return; }
    if (!form.email.trim()) { setError('Please enter your email address.'); return; }
    if (!form.phone.trim()) { setError('Phone number is required.'); return; }
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length !== 10) { setError('Please enter a valid 10-digit phone number.'); return; }
    const formatted = '+91' + digits;
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!form.agree) { setError('Please accept the Terms of Service to continue.'); return; }

    setLoading(true);
    try {
      const result = await sendPhoneOtp(formatted, 'recaptcha-container', 'register');
      setConfirmationResult(result);
      setStep('phone-otp');
      startTimer(setOtpTimer, otpTimerRef, OTP_RESEND_COOLDOWN);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP';
      if (msg.includes('too-many-requests')) setError('Too many attempts. Please try again later.');
      else if (msg.includes('invalid-phone-number')) setError('Invalid phone number. Please check and try again.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: Verify Phone OTP → Create Account ── */
  const handleVerifyOtp = async (codeOverride?: string) => {
    const code = codeOverride || otp.join('');
    if (code.length !== 6) { setError('Please enter the complete 6-digit OTP.'); return; }
    if (!confirmationResult) { setError('Session expired. Please go back and try again.'); return; }

    setError('');
    setLoading(true);
    try {
      // Verify OTP first — this signs the user in with just phone
      await confirmationResult.confirm(code);

      // Now create the full account (email + password) which re-authenticates and sets up Firestore profile
      const formatted = formatPhone(form.phone);
      await signUp(form.email, form.password, form.full_name, formatted, true);

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      if (msg.includes('invalid-verification-code')) {
        setError('Invalid OTP. Please check and try again.');
        setOtp(['', '', '', '', '', '']);
        otpRefs.current[0]?.focus();
      } else if (msg.includes('code-expired')) {
        setError('OTP has expired. Please request a new one.');
      } else if (msg.includes('email-already-in-use')) {
        setError('This email is already registered. Please login instead.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    setError('');
    setLoading(true);
    try {
      const formatted = formatPhone(form.phone);
      const result = await sendPhoneOtp(formatted, 'recaptcha-container', 'register');
      setConfirmationResult(result);
      setOtp(['', '', '', '', '', '']);
      startTimer(setOtpTimer, otpTimerRef, OTP_RESEND_COOLDOWN);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (value && index === 5) {
      const code = newOtp.join('');
      if (code.length === 6 && confirmationResult) setTimeout(() => handleVerifyOtp(code), 200);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < paste.length; i++) newOtp[i] = paste[i];
    setOtp(newOtp);
    if (paste.length > 0) otpRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  const handleResendEmail = async () => {
    if (emailTimer > 0) return;
    setResendLoading(true);
    setResendSuccess(false);
    try {
      await sendVerificationEmail();
      setResendSuccess(true);
      setResendCount(prev => prev + 1);
      startTimer(setEmailTimer, emailTimerRef, EMAIL_RESEND_COOLDOWN);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      console.error('Resend failed:', err);
    } finally {
      setResendLoading(false);
    }
  };

  const formatPhoneDisplay = (raw: string) => {
    const f = formatPhone(raw);
    if (f.length >= 13) return f.slice(0, 3) + ' ' + f.slice(3, 8) + ' ' + f.slice(8);
    return f;
  };

  /* ── Step 3: Email Sent Screen ── */
  if (step === 'email-sent') {
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

              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Phone Verified</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">Email Pending</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold font-display text-text-primary mb-2">Verify Your Email</h2>
              <p className="text-text-muted text-sm leading-relaxed">We&apos;ve sent a verification link to</p>
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

              {resendSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2 justify-center animate-slide-down">
                  <CheckCircle2 className="w-4 h-4" /> Verification email resent!
                </div>
              )}

              {emailTimer > 0 && (
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Resend available in <strong className="text-primary">{emailTimer}s</strong></span>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <Button
                  variant="outline" size="lg" className="w-full"
                  onClick={handleResendEmail}
                  disabled={resendLoading || emailTimer > 0}
                >
                  {resendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                </Button>
                <Button variant="primary" size="lg" className="w-full" onClick={() => router.push('/auth/login')}>
                  <ArrowRight className="w-4 h-4" /> Go to Login
                </Button>
              </div>
            </div>
          </Card>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <Shield className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs text-text-muted">Your data is protected with Firebase Authentication</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 2: Phone OTP Verification ── */
  if (step === 'phone-otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-light/30 via-white to-primary-light/20 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl bengali-text">প</div>
              <span className="text-xl font-bold">Probasi<span className="text-primary">Bangali</span></span>
            </Link>
            <h1 className="text-2xl font-bold font-display text-text-primary">Verify Your Phone</h1>
            <p className="text-text-muted mt-1 text-sm">Phone verification</p>
          </div>

          <Card padding="lg">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2 animate-slide-down">
                <Shield className="w-4 h-4 mt-0.5 shrink-0" /> {error}
              </div>
            )}

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                <Phone className="w-8 h-8 text-primary" />
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 animate-pulse" />
              </div>
              <p className="text-sm text-text-muted">Enter the 6-digit code sent to</p>
              <p className="text-sm font-semibold text-text-primary mt-0.5">{formatPhoneDisplay(form.phone)}</p>
            </div>

            {/* OTP Boxes */}
            <div className="flex justify-center gap-2.5 mb-5" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-surface transition-all duration-200 focus:outline-none ${
                    digit
                      ? 'border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10'
                      : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                  }`}
                  aria-label={`OTP digit ${i + 1}`}
                />
              ))}
            </div>

            {otpTimer > 0 && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted mb-4">
                <Timer className="w-3.5 h-3.5" />
                <span>Resend available in <strong className="text-primary">{otpTimer}s</strong></span>
              </div>
            )}

            <Button
              variant="primary" size="lg" className="w-full mb-3"
              onClick={handleVerifyOtp}
              disabled={loading || otp.join('').length !== 6}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {loading ? 'Verifying & Creating Account...' : 'Verify & Create Account'}
            </Button>

            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => { setStep('form'); setOtp(['', '', '', '', '', '']); setError(''); }}
                className="flex items-center gap-1 text-text-muted hover:text-primary cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to form
              </button>
              <button
                onClick={handleResendOtp}
                disabled={loading || otpTimer > 0}
                className={`flex items-center gap-1 cursor-pointer transition-colors ${
                  otpTimer > 0 ? 'text-text-muted/50 cursor-not-allowed' : 'text-primary hover:underline'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Resend OTP
              </button>
            </div>
          </Card>

          {/* reCAPTCHA container */}
          <div id="recaptcha-container" />
        </div>
      </div>
    );
  }

  /* ── Step 1: Registration Form ── */
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

          {/* Verification flow info */}
          <div className="mb-5 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 text-xs text-blue-700 flex items-start gap-2.5">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="font-semibold text-sm text-blue-800">Phone verification required</p>
              <p className="mt-0.5 leading-relaxed">
                We will send a 6-digit OTP code to verify your phone number.
              </p>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <Input
              label="Full Name"
              id="reg-name"
              value={form.full_name}
              onChange={e => update('full_name', e.target.value)}
              placeholder="Your full name"
            />
            <Input
              label="Email Address"
              id="reg-email"
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="you@example.com"
            />
            <div>
              <Input
                label="Phone Number"
                id="reg-phone"
                type="tel"
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                placeholder="98765 43210"
              />
              <p className="text-[11px] text-text-muted mt-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Required — will be verified via OTP
              </p>
            </div>
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
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
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= pwStrength.level ? pwStrength.color : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-text-muted">Password strength</span>
                    <span className={`text-[10px] font-semibold ${
                      pwStrength.level <= 1 ? 'text-red-500' :
                      pwStrength.level === 2 ? 'text-amber-500' :
                      pwStrength.level === 3 ? 'text-blue-500' : 'text-green-500'
                    }`}>{pwStrength.label}</span>
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={e => update('agree', e.target.checked)}
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
              {loading ? 'Sending OTP...' : 'Continue — Verify Phone'}
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </Card>

        {/* reCAPTCHA container for the form step */}
        <div id="recaptcha-container" />

        <div className="flex items-center justify-center gap-1.5 mt-4">
          <Shield className="w-3.5 h-3.5 text-green-500" />
          <span className="text-xs text-text-muted">Your data is protected with Firebase Authentication</span>
        </div>
      </div>
    </div>
  );
}
