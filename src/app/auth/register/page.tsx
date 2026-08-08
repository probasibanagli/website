'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserPlus, Loader2, Mail, CheckCircle2,
  Shield, ArrowRight, Phone, ArrowLeft, Calendar, User, MapPin, ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/AuthContext';
import type { ConfirmationResult } from 'firebase/auth';

type Step = 'details' | 'verification';

export default function RegisterPage() {
  const router = useRouter();
  const { sendPhoneOtp } = useAuth();

  const [step, setStep] = useState<Step>('details');

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    dob: '',
    gender: 'male',
    address: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', '']);
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState<ConfirmationResult | null>(null);

  const phoneOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.full_name.trim()) return setError('Please enter your full name.');
    if (!form.phone.trim()) return setError('Please enter your mobile number.');
    if (!form.email.trim()) return setError('Please enter your email ID.');
    if (!form.dob) return setError('Please select your date of birth.');
    if (!form.address.trim()) return setError('Please enter your address.');

    const digits = form.phone.replace(/\D/g, '');
    if (digits.length !== 10) return setError('Please enter a valid 10-digit mobile number.');

    setLoading(true);
    try {
      const formattedPhone = '+91' + digits;

      // Send Mobile OTP with full registration profile details
      const phoneResult = await sendPhoneOtp(
        formattedPhone,
        'recaptcha-container',
        'register',
        {
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          dob: form.dob,
          gender: form.gender,
          address: form.address.trim(),
        }
      );

      setPhoneConfirmationResult(phoneResult);
      setStep('verification');
      setSuccess(`Verification code sent via SMS to ${formattedPhone}!`);
      setTimeout(() => phoneOtpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize mobile verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const phoneCode = phoneOtp.join('');
    if (phoneCode.length !== 6) return setError('Please enter the complete 6-digit OTP.');
    if (!phoneConfirmationResult) return setError('Session expired. Please start again.');

    setLoading(true);
    try {
      // Verify Mobile OTP & complete account creation
      await phoneConfirmationResult.confirm(phoneCode);

      // Track registration activity
      const formattedPhone = '+91' + form.phone.replace(/\D/g, '');
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'User Registered',
          performed_by: form.full_name.trim(),
          user_role: 'user',
          details: `Account registered & OTP verified for ${form.full_name.trim()} (${formattedPhone}, ${form.email.trim()})`
        })
      }).catch(() => {});

      setSuccess('Account created and verified successfully! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const nextOtp = [...phoneOtp];
    nextOtp[index] = value;
    setPhoneOtp(nextOtp);
    if (value && index < 5) phoneOtpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !phoneOtp[index] && index > 0) {
      phoneOtpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-light/30 via-white to-primary-light/20 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl bengali-text">প</div>
            <span className="text-xl font-bold">Probasi<span className="text-primary">Bangali</span></span>
          </Link>
          <h1 className="text-2xl font-bold font-display text-text-primary">New User Registration</h1>
          <p className="text-text-muted mt-1">Create your account with mobile OTP verification</p>
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

          {/* STEP 1: Enter User Details */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <Input
                label="Full Name *"
                id="reg-name"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Mobile Number (10 Digits) *"
                id="reg-phone"
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="98765 43210"
                required
              />

              <Input
                label="Email ID *"
                id="reg-email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={form.dob}
                    onChange={e => setForm({ ...form, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-primary" /> Gender *
                  </label>
                  <select
                    value={form.gender}
                    onChange={e => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Address *
                </label>
                <textarea
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Enter full street address, city, pincode"
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              <Button variant="primary" size="lg" className="w-full" type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? 'Sending Mobile OTP...' : 'Verify Mobile via OTP'}
              </Button>
            </form>
          )}

          {/* STEP 2: Mobile OTP Verification */}
          {step === 'verification' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-2">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-text-primary">Verify Mobile Number</h3>
                <p className="text-sm text-text-muted mt-0.5">
                  Enter 6-digit code sent to <strong className="text-text-primary">+91{form.phone.replace(/\D/g, '')}</strong>
                </p>
              </div>

              <div>
                <div className="flex justify-center gap-2">
                  {phoneOtp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { phoneOtpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-11 h-13 text-center text-xl font-bold rounded-xl border border-border bg-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  ))}
                </div>
              </div>

              <Button variant="primary" size="lg" className="w-full" type="submit" disabled={loading || phoneOtp.join('').length !== 6}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {loading ? 'Verifying & Creating Account...' : 'Verify OTP & Complete Registration'}
              </Button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="flex items-center gap-1 text-text-muted hover:text-primary transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to details
                </button>
              </div>
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
