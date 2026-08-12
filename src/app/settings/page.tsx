'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Phone, Mail, ArrowLeft, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { profile, firebaseUser } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mobile State
  const [mobile, setMobile] = useState('');
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');

  // Email State
  const [email, setEmail] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');

  useEffect(() => {
    if (profile) {
      setMobile(profile.phone || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  if (!profile || !firebaseUser) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle Mobile Update
  const handleSendMobileOtp = async () => {
    setError('');
    setSuccess('');
    if (mobile === profile.phone) return setError('New mobile number is same as current.');
    if (!mobile || mobile.replace(/\D/g, '').length < 10) return setError('Invalid mobile number.');

    setLoading(true);
    try {
      const digits = mobile.replace(/\D/g, '');
      const formattedPhone = '+91' + digits;

      // Ensure /api/auth/otp supports 'send' action if not already using sendPhoneOtp from context
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'phone', phone: digits }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      setMobileOtpSent(true);
      setSuccess('OTP sent to new mobile number.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    setError('');
    setSuccess('');
    if (!mobileOtp || mobileOtp.length < 6) return setError('Invalid OTP.');

    setLoading(true);
    try {
      const digits = mobile.replace(/\D/g, '');
      
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'phone', phone: digits, phoneOtp: mobileOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      // Update in Firebase Auth and Firestore via API
      const token = await firebaseUser.getIdToken();
      await fetch(`/api/admin/users/${profile.uid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ phone: '+91' + digits, phone_verified: true })
      });

      setSuccess('Mobile number updated successfully!');
      setMobileOtpSent(false);
      setMobileOtp('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Update
  const handleSendEmailOtp = async () => {
    setError('');
    setSuccess('');
    if (email === profile.email) return setError('New email is same as current.');
    if (!email || !email.includes('@')) return setError('Invalid email address.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');

      setEmailOtpSent(true);
      setSuccess('OTP sent to new email address.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    setError('');
    setSuccess('');
    if (!emailOtp || emailOtp.length < 6) return setError('Invalid OTP.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth/email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, otp: emailOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');

      // Update in Firebase Auth and Firestore via API
      const token = await firebaseUser.getIdToken();
      const patchRes = await fetch(`/api/admin/users/${profile.uid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ email: email, email_verified: true })
      });
      
      if (!patchRes.ok) {
        const errData = await patchRes.json();
        throw new Error(errData.error || 'Failed to update email in the database.');
      }

      setSuccess('Email address updated successfully!');
      setEmailOtpSent(false);
      setEmailOtp('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/profile" className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        
        <h1 className="text-3xl font-bold font-display text-text-primary mb-8">Account Settings</h1>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" /> {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Mobile Number Settings */}
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><Phone className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold">Change Mobile Number</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Mobile Number"
                id="settings-mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={mobileOtpSent}
              />
              {!mobileOtpSent ? (
                <Button variant="primary" onClick={handleSendMobileOtp} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Send OTP to Mobile
                </Button>
              ) : (
                <div className="space-y-4 animate-slide-down">
                  <Input
                    label="Enter 6-digit Mobile OTP"
                    id="settings-mobile-otp"
                    value={mobileOtp}
                    onChange={(e) => setMobileOtp(e.target.value)}
                    maxLength={6}
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleVerifyMobileOtp} disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Verify & Update Mobile
                    </Button>
                    <Button variant="outline" onClick={() => setMobileOtpSent(false)} disabled={loading}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Email ID Settings */}
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent/10 rounded-lg text-accent"><Mail className="w-5 h-5" /></div>
              <h2 className="text-xl font-bold">Change Email ID</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Email Address"
                id="settings-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={emailOtpSent}
              />
              {!emailOtpSent ? (
                <Button variant="primary" onClick={handleSendEmailOtp} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Send OTP to Email
                </Button>
              ) : (
                <div className="space-y-4 animate-slide-down">
                  <Input
                    label="Enter 6-digit Email OTP"
                    id="settings-email-otp"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    maxLength={6}
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleVerifyEmailOtp} disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Verify & Update Email
                    </Button>
                    <Button variant="outline" onClick={() => setEmailOtpSent(false)} disabled={loading}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
