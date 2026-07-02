import React, { useState } from 'react';
import { X, Loader2, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OtpVerificationModal({ isOpen, onClose, onSuccess }: OtpVerificationModalProps) {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      
      setStep('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email, phoneOtp, emailOtp })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      
      // Store verification status in localStorage for UI state
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
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface/50">
          <h3 className="text-xl font-bold text-text-primary">Verification Required</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface text-text-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-2">
              <span className="shrink-0">⚠️</span> {error}
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <p className="text-sm text-text-muted mb-6">
                To view doctor details, please verify your identity using both your Phone Number and Email ID.
              </p>
              
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Phone Number
                </label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Email ID
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>

              <Button type="submit" disabled={loading} variant="primary" className="w-full mt-4 py-6 rounded-xl">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTPs'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700 flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                <p>OTPs have been sent to <b>{phone}</b> and <b>{email}</b>. They are valid for 10 minutes.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Phone OTP
                </label>
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  value={phoneOtp}
                  onChange={e => setPhoneOtp(e.target.value)}
                  placeholder="Enter 6-digit SMS OTP"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Email OTP
                </label>
                <input 
                  type="text" 
                  required
                  maxLength={6}
                  value={emailOtp}
                  onChange={e => setEmailOtp(e.target.value)}
                  placeholder="Enter 6-digit Email OTP"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>

              <Button type="submit" disabled={loading} variant="primary" className="w-full mt-4 py-6 rounded-xl">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Access'}
              </Button>

              <button 
                type="button" 
                onClick={() => setStep('request')}
                className="w-full py-2 text-sm text-text-muted hover:text-primary transition-colors mt-2"
              >
                Change Phone/Email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
