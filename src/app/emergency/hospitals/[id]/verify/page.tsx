'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldAlert, Phone, Mail, ArrowRight, CheckCircle2, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || (id === 'general' ? '/emergency/hospitals' : `/emergency/hospitals/${id}`);

  const [step, setStep] = useState<'phone' | 'phoneOtp' | 'email' | 'emailOtp'>('phone');
  
  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already verified
  useEffect(() => {
    if (localStorage.getItem('directory_verified') === 'true') {
      router.replace(redirectUrl);
    }
  }, [router, redirectUrl]);

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'phone', phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      if (data.alreadyVerified) {
        // They were verified previously with some email
        localStorage.setItem('directory_verified', 'true');
        router.replace(redirectUrl);
        return;
      }
      setStep('phoneOtp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOtp || phoneOtp.length < 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'phone', phone, phoneOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      setStep('email');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'email', phone, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      setStep('emailOtp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOtp || emailOtp.length < 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'email', phone, email, emailOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      localStorage.setItem('directory_verified', 'true');
      router.replace(redirectUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href={id === 'general' ? '/emergency/hospitals' : `/emergency/hospitals/${id}`} className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to {id === 'general' ? 'Hospitals' : 'Hospital'}
        </Link>
        
        <Card className="p-6 sm:p-8 rounded-3xl border-border shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Secure Verification</h1>
            <p className="text-sm text-text-muted">
              For privacy and security, please verify your identity to access detailed medical professional profiles.
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${step === 'phone' || step === 'phoneOtp' ? 'bg-primary text-white' : 'bg-emerald-500 text-white'}`}>
              {step === 'email' || step === 'emailOtp' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
            </div>
            <div className={`h-1 w-16 mx-2 rounded-full transition-colors ${step === 'email' || step === 'emailOtp' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${step === 'email' || step === 'emailOtp' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
              2
            </div>
          </div>

          {error && (
            <div className="p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center font-medium">
              {error}
            </div>
          )}

          {/* Step 1: Phone */}
          {step === 'phone' && (
            <form onSubmit={handleSendPhoneOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full py-3 text-base" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send SMS OTP'}
              </Button>
            </form>
          )}

          {/* Step 1b: Phone OTP */}
          {step === 'phoneOtp' && (
            <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-text-muted">Enter the 6-digit OTP sent to</p>
                <p className="font-bold text-text-primary">+91 {phone}</p>
              </div>
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    placeholder="000000"
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-center text-lg font-bold tracking-[0.5em]"
                    required
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full py-3 text-base" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Phone'}
              </Button>
              <button type="button" onClick={() => setStep('phone')} className="w-full text-sm font-medium text-text-muted hover:text-primary transition-colors text-center mt-4">
                Change Phone Number
              </button>
            </form>
          )}

          {/* Step 2: Email */}
          {step === 'email' && (
            <form onSubmit={handleSendEmailOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                    required
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full py-3 text-base" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Email OTP'}
              </Button>
            </form>
          )}

          {/* Step 2b: Email OTP */}
          {step === 'emailOtp' && (
            <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-text-muted">Enter the 6-digit OTP sent to</p>
                <p className="font-bold text-text-primary">{email}</p>
              </div>
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    placeholder="000000"
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-center text-lg font-bold tracking-[0.5em]"
                    required
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full py-3 text-base" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
              </Button>
              <button type="button" onClick={() => setStep('email')} className="w-full text-sm font-medium text-text-muted hover:text-primary transition-colors text-center mt-4">
                Change Email Address
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
