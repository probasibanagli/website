'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, MessageCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/AuthContext';
import type { ConfirmationResult } from 'firebase/auth';

type LoginMode = 'email' | 'phone';
type PhoneStep = 'input' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, sendPhoneOtp, verifyPhoneOtp } = useAuth();

  const [mode, setMode] = useState<LoginMode>('email');
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
      setSuccess(
        otpMethod === 'sms'
          ? `OTP sent via SMS to ${formatted}`
          : `OTP sent via WhatsApp to ${formatted}`
      );
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
        setError('Invalid OTP. Please try again.');
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
          <div className="flex rounded-xl border border-border p-1 mb-6">
            <button onClick={() => { setMode('email'); resetPhone(); setError(''); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${mode === 'email' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-primary'}`}>
              <Mail className="w-4 h-4" /> Email
            </button>
            <button onClick={() => { setMode('phone'); setError(''); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${mode === 'phone' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-primary'}`}>
              <Phone className="w-4 h-4" /> Phone OTP
            </button>
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
              <Shield className="w-4 h-4 mt-0.5 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> {success}
            </div>
          )}

          {/* ═══ EMAIL LOGIN ═══ */}
          {mode === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <Input label="Email Address" id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              <div className="relative">
                <Input label="Password" id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[34px] text-text-muted hover:text-primary cursor-pointer">
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
                  {/* OTP method selection */}
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-2">Receive OTP via</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOtpMethod('sms')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border-2 ${
                          otpMethod === 'sms'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border text-text-muted hover:border-primary/40'
                        }`}
                      >
                        <Phone className="w-4 h-4" /> SMS
                      </button>
                      <button
                        onClick={() => setOtpMethod('whatsapp')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border-2 ${
                          otpMethod === 'whatsapp'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-border text-text-muted hover:border-green-300'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </button>
                    </div>
                  </div>

                  <Input
                    label="Phone Number"
                    id="login-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />

                  <p className="text-xs text-text-muted">
                    We&apos;ll send a 6-digit verification code to your phone
                    {otpMethod === 'whatsapp' ? ' via WhatsApp' : ' via SMS'}.
                  </p>

                  <Button variant="primary" size="lg" className="w-full" onClick={handleSendOtp} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </>
              )}

              {phoneStep === 'otp' && (
                <>
                  <div className="text-center mb-2">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm text-text-muted">
                      Enter the 6-digit code sent to <span className="font-semibold text-text-primary">{phone}</span>
                    </p>
                  </div>

                  {/* OTP Input Boxes */}
                  <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
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
                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-border bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                      />
                    ))}
                  </div>

                  <Button variant="primary" size="lg" className="w-full" onClick={handleVerifyOtp} disabled={loading || otp.join('').length !== 6}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </Button>

                  <div className="flex items-center justify-between text-xs">
                    <button onClick={resetPhone} className="text-text-muted hover:text-primary cursor-pointer">
                      ← Change number
                    </button>
                    <button onClick={handleSendOtp} disabled={loading} className="text-primary hover:underline cursor-pointer">
                      Resend OTP
                    </button>
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

        {/* Info note */}
        <p className="text-center text-xs text-text-muted mt-4">
          🔒 Secured by Firebase Authentication
        </p>
      </div>
    </div>
  );
}
