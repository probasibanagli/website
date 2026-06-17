'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight,
  CheckCircle2, MessageCircle, Shield, ArrowLeft, RefreshCw,
  Smartphone, Timer, Fingerprint
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/AuthContext';
import type { ConfirmationResult } from 'firebase/auth';

type LoginMode = 'email' | 'phone';
type PhoneStep = 'input' | 'otp';

const OTP_RESEND_COOLDOWN = 30; // seconds

export default function LoginPage() {
  const router = useRouter();
  const { signIn, sendPhoneOtp, verifyPhoneOtp } = useAuth();

  const [mode, setMode] = useState<LoginMode>('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Phone OTP state
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('input');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpMethod, setOtpMethod] = useState<'sms' | 'whatsapp'>('sms');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start countdown
  const startResendTimer = useCallback(() => {
    setResendTimer(OTP_RESEND_COOLDOWN);
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

  /* ── Email Login ── */
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/';
      router.push(redirect);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      if (message.includes('user-not-found') || message.includes('wrong-password') || message.includes('invalid-credential')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Phone OTP: Send ── */
  const handleSendOtp = async () => {
    setError('');
    setSuccess('');

    let formatted = phone.trim();
    if (!formatted) {
      setError('Please enter your phone number.');
      return;
    }

    // Auto-format: add +91 if not present
    if (!formatted.startsWith('+')) {
      formatted = formatted.replace(/^0+/, '');
      formatted = '+91' + formatted.replace(/\s/g, '');
    }

    if (formatted.length < 12) {
      setError('Please enter a valid phone number with country code (e.g., +91 98765 43210).');
      return;
    }

    setLoading(true);
    try {
      const result = await sendPhoneOtp(formatted, 'recaptcha-container');
      setConfirmationResult(result);
      setPhoneStep('otp');
      startResendTimer();
      setSuccess(`OTP sent via SMS to ${formatted}`);
      // Auto-focus first OTP input
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

  /* ── Phone OTP: Verify ── */
  const handleVerifyOtp = async () => {
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
      await verifyPhoneOtp(confirmationResult, code);
      setSuccess('Phone verified successfully! Redirecting...');
      setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/';
        router.push(redirect);
      }, 1000);
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

    // Auto-submit when all 6 digits are entered
    if (value && index === 5) {
      const code = newOtp.join('');
      if (code.length === 6 && confirmationResult) {
        setTimeout(() => handleVerifyOtp(), 200);
      }
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

  const resetPhone = () => {
    setPhoneStep('input');
    setOtp(['', '', '', '', '', '']);
    setConfirmationResult(null);
    setError('');
    setSuccess('');
    setResendTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    await handleSendOtp();
  };

  // Format phone display
  const formatPhoneDisplay = (num: string) => {
    let f = num.trim();
    if (!f.startsWith('+')) {
      f = f.replace(/^0+/, '');
      f = '+91' + f.replace(/\s/g, '');
    }
    if (f.length >= 13) {
      return f.slice(0, 3) + ' ' + f.slice(3, 8) + ' ' + f.slice(8);
    }
    return f;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light/30 via-white to-accent-light/20 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl bengali-text">প</div>
            <span className="text-xl font-bold">Probasi<span className="text-primary">Bangali</span></span>
          </Link>
          <h1 className="text-2xl font-bold font-display text-text-primary">Welcome Back</h1>
          <p className="text-text-muted mt-1">Login to access all features</p>
        </div>

        <Card padding="lg">
          {/* Mode Tabs */}
          <div className="flex rounded-xl border border-border p-1 mb-6 bg-surface/50">
            <button
              onClick={() => { setMode('phone'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                mode === 'phone'
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Phone className="w-4 h-4" /> Phone OTP
            </button>
            <button
              onClick={() => { setMode('email'); resetPhone(); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                mode === 'email'
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
          </div>

          {/* Error / Success Messages */}
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

          {/* ═══ EMAIL LOGIN ═══ */}
          {mode === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Input
                label="Email Address"
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              <div className="relative">
                <Input
                  label="Password"
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-text-muted hover:text-primary cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end">
                <button type="button" className="text-xs text-primary hover:underline cursor-pointer">Forgot password?</button>
              </div>
              <Button variant="primary" size="lg" className="w-full" type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {loading ? 'Logging in...' : 'Login with Email'}
              </Button>
            </form>
          )}

          {/* ═══ PHONE OTP LOGIN ═══ */}
          {mode === 'phone' && (
            <div className="space-y-4">
              {phoneStep === 'input' && (
                <>
                  <Input
                    label="Phone Number"
                    id="login-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />

                  {/* Security info */}
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                    <Fingerprint className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      We&apos;ll send a <strong>6-digit verification code</strong> to your phone via SMS.
                      Standard messaging rates may apply.
                    </p>
                  </div>

                  <Button variant="primary" size="lg" className="w-full" onClick={handleSendOtp} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </>
              )}

              {phoneStep === 'otp' && (
                <>
                  {/* OTP verification header */}
                  <div className="text-center mb-2">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                      <Shield className="w-8 h-8 text-primary" />
                      {/* Animated ring */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">Verify Your Phone</h3>
                    <p className="text-sm text-text-muted">
                      Enter the 6-digit code sent to
                    </p>
                    <p className="text-sm font-semibold text-text-primary mt-0.5">
                      {formatPhoneDisplay(phone)}
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
                        aria-label={`OTP digit ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Timer */}
                  {resendTimer > 0 && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
                      <Timer className="w-3.5 h-3.5" />
                      <span>Resend available in <strong className="text-primary">{resendTimer}s</strong></span>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.join('').length !== 6}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </Button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={resetPhone}
                      className="flex items-center gap-1 text-text-muted hover:text-primary cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Change number
                    </button>
                    <button
                      onClick={handleResendOtp}
                      disabled={loading || resendTimer > 0}
                      className={`flex items-center gap-1 cursor-pointer transition-colors ${
                        resendTimer > 0
                          ? 'text-text-muted/50 cursor-not-allowed'
                          : 'text-primary hover:underline'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Resend OTP
                    </button>
                  </div>

                  {/* Delivery info */}
                  <div className="text-center">
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Didn&apos;t receive the code? Check your SMS inbox
                      or try again.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* reCAPTCHA container (invisible) */}
          <div id="recaptcha-container" />

          <p className="text-center text-sm text-text-muted mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary font-medium hover:underline">Register</Link>
          </p>
        </Card>

        {/* Security badges */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Shield className="w-3.5 h-3.5 text-green-500" />
            <span>Firebase Secured</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <Lock className="w-3.5 h-3.5 text-blue-500" />
            <span>256-bit Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
