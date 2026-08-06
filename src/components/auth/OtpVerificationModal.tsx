import React, { useState, useEffect } from 'react';
import { X, Loader2, Phone, Mail, CheckCircle2, ShieldAlert, Lock, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  doctorId?: string;
}

export function OtpVerificationModal({ isOpen, onClose, onSuccess, doctorId }: OtpVerificationModalProps) {
  const [step, setStep] = useState<'phone' | 'phoneOtp' | 'email' | 'emailOtp'>('phone');
  const [phone, setPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setStep('phone');
      setPhone('');
      setPhoneOtp('');
      setEmail('');
      setEmailOtp('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
        localStorage.setItem('directory_verified', 'true');
        onSuccess();
        return;
      }
      setStep('phoneOtp');
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
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
        body: JSON.stringify({ type: 'email', phone, email, emailOtp, doctorId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      localStorage.setItem('directory_verified', 'true');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-blue-500 to-emerald-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-text-primary">Identity Verification</h3>
              <p className="text-xs text-text-muted">Access details securely</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface text-text-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center py-4 bg-surface/60 border-b border-border">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs transition-colors ${step === 'phone' || step === 'phoneOtp' ? 'bg-primary text-white' : 'bg-emerald-500 text-white'}`}>
            {step === 'email' || step === 'emailOtp' ? <CheckCircle2 className="w-4 h-4" /> : '1'}
          </div>
          <div className={`h-0.5 w-12 mx-2 rounded-full transition-colors ${step === 'email' || step === 'emailOtp' ? 'bg-emerald-500' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs transition-colors ${step === 'email' || step === 'emailOtp' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
            2
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center font-medium">
              {error}
            </div>
          )}

          {/* Step 1: Phone Form */}
          {step === 'phone' && (
            <form onSubmit={handleSendPhoneOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5 flex items-center gap-1.5"><Phone className="w-4 h-4 text-primary" /> Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send SMS OTP'}
              </Button>
            </form>
          )}

          {/* Step 1b: Phone OTP Form */}
          {step === 'phoneOtp' && (
            <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-xs text-text-muted">Enter the 6-digit OTP sent to</p>
                <p className="text-sm font-bold text-text-primary">+91 {phone}</p>
              </div>
              <div>
                <input
                  type="text"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-center text-lg font-bold tracking-[0.4em] focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Phone'}
              </Button>
              <button type="button" onClick={() => setStep('phone')} className="w-full text-xs text-text-muted hover:text-primary transition-colors text-center mt-2">
                Change Phone Number
              </button>
            </form>
          )}

          {/* Step 2: Email Form */}
          {step === 'email' && (
            <form onSubmit={handleSendEmailOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5 flex items-center gap-1.5"><Mail className="w-4 h-4 text-primary" /> Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Email OTP'}
              </Button>
            </form>
          )}

          {/* Step 2b: Email OTP Form */}
          {step === 'emailOtp' && (
            <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
              <div className="text-center mb-2">
                <p className="text-xs text-text-muted">Enter the 6-digit OTP sent to</p>
                <p className="text-sm font-bold text-text-primary">{email}</p>
              </div>
              <div>
                <input
                  type="text"
                  value={emailOtp}
                  onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-center text-lg font-bold tracking-[0.4em] focus:ring-2 focus:ring-primary/20 outline-none"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Complete'}
              </Button>
              <button type="button" onClick={() => setStep('email')} className="w-full text-xs text-text-muted hover:text-primary transition-colors text-center mt-2">
                Change Email Address
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
