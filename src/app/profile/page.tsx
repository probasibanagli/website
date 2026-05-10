'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Settings, LogOut, Shield, Loader2, Crown, CheckCircle2,
  AlertCircle, Phone, Mail, Smartphone, Fingerprint, ArrowRight,
  RefreshCw, Timer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/AuthContext';
import type { ConfirmationResult } from 'firebase/auth';

const OTP_RESEND_COOLDOWN = 30;

export default function ProfilePage() {
  const router = useRouter();
  const {
    firebaseUser, profile, loading, logOut,
    sendVerificationEmail, linkPhoneToAccount, confirmLinkPhone
  } = useAuth();

  const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);
  const [emailMsg, setEmailMsg] = useState({ type: '', text: '' });

  // Phone verification state
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneSuccess, setPhoneSuccess] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startResendTimer = () => {
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
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  const handleVerifyEmail = async () => {
    setVerifyEmailLoading(true);
    setEmailMsg({ type: '', text: '' });
    try {
      await sendVerificationEmail();
      setEmailMsg({ type: 'success', text: 'Verification email sent! Check your inbox.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send verification email';
      setEmailMsg({ type: 'error', text: msg });
    } finally {
      setVerifyEmailLoading(false);
    }
  };

  /* ── Phone OTP: Send ── */
  const handleSendOtp = async () => {
    setPhoneError('');
    setPhoneSuccess('');

    let formatted = phoneInput.trim();
    if (!formatted) {
      setPhoneError('Please enter your phone number.');
      return;
    }

    if (!formatted.startsWith('+')) {
      formatted = formatted.replace(/^0+/, '');
      formatted = '+91' + formatted.replace(/\s/g, '');
    }

    if (formatted.length < 12) {
      setPhoneError('Please enter a valid phone number with country code (e.g., +91 98765 43210).');
      return;
    }

    setPhoneLoading(true);
    try {
      const result = await linkPhoneToAccount(formatted, 'recaptcha-container-profile');
      setConfirmationResult(result);
      setPhoneStep('otp');
      startResendTimer();
      setPhoneSuccess(`OTP sent to ${formatted}`);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP';
      if (message.includes('credential-already-in-use')) {
        setPhoneError('This phone number is already linked to another account.');
      } else if (message.includes('too-many-requests')) {
        setPhoneError('Too many attempts. Please try again later.');
      } else if (message.includes('invalid-phone-number')) {
        setPhoneError('Invalid phone number. Please check and try again.');
      } else {
        setPhoneError(message);
      }
    } finally {
      setPhoneLoading(false);
    }
  };

  /* ── Phone OTP: Verify ── */
  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setPhoneError('Please enter the complete 6-digit OTP.');
      return;
    }
    if (!confirmationResult) {
      setPhoneError('Session expired. Please request a new OTP.');
      return;
    }

    setPhoneError('');
    setPhoneLoading(true);
    try {
      await confirmLinkPhone(confirmationResult, code);
      setPhoneSuccess('Phone number verified and linked successfully!');
      setTimeout(() => {
        setShowPhoneVerify(false);
        setPhoneStep('input');
        setOtp(['', '', '', '', '', '']);
        setPhoneSuccess('');
        // Reloading window to refresh AuthContext state fully
        window.location.reload();
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'OTP verification failed';
      if (message.includes('invalid-verification-code')) {
        setPhoneError('Invalid OTP. Please check and try again.');
      } else if (message.includes('code-expired')) {
        setPhoneError('OTP has expired. Please request a new one.');
      } else {
        setPhoneError(message);
      }
    } finally {
      setPhoneLoading(false);
    }
  };

  /* ── OTP Input Handling ── */
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!firebaseUser || !profile) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold font-display text-text-primary mb-8">My Profile</h1>
          <Card padding="lg" className="mb-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl text-white">
                <User className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Guest User</h2>
                <p className="text-sm text-text-muted">Please login to view your profile</p>
                <Link href="/auth/login" className="mt-3 inline-block">
                  <Button variant="primary" size="sm">Login to Continue</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const roleBadgeVariant = profile.role === 'superadmin' ? 'bengali' : profile.role === 'admin' ? 'teal' : 'default';
  const roleLabel = profile.role === 'superadmin' ? 'Super Admin' : profile.role === 'admin' ? 'Admin' : 'User';

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-display text-text-primary mb-8">My Profile</h1>

        <Card padding="lg" className="mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl text-white">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-2xl font-bold">{profile.full_name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold">{profile.full_name}</h2>
                <Badge variant={roleBadgeVariant}>
                  {profile.role === 'superadmin' && <Crown className="w-3 h-3" />}
                  {roleLabel}
                </Badge>
              </div>
              <p className="text-sm text-text-muted">{profile.email}</p>
              {profile.phone && <p className="text-sm text-text-muted">{profile.phone}</p>}
              <p className="text-xs text-text-muted mt-1">
                Member since {new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </Card>

        {/* Verification Status Section */}
        <div className="mb-6 space-y-4">
          <h2 className="text-lg font-bold text-text-primary">Verification Status</h2>

          {/* Email Verification */}
          <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${profile.email_verified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-text-primary">Email Address</h3>
                  {profile.email_verified ? (
                    <Badge variant="green" size="sm" className="gap-1"><CheckCircle2 className="w-3 h-3"/> Verified</Badge>
                  ) : (
                    <Badge variant="amber" size="sm" className="gap-1"><AlertCircle className="w-3 h-3"/> Pending</Badge>
                  )}
                </div>
                <p className="text-sm text-text-muted">{profile.email}</p>
              </div>
            </div>
            {!profile.email_verified && (
              <div className="w-full sm:w-auto flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={handleVerifyEmail} disabled={verifyEmailLoading}>
                  {verifyEmailLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Verification'}
                </Button>
                {emailMsg.text && (
                  <p className={`text-xs ${emailMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {emailMsg.text}
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Phone Verification */}
          <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${profile.phone_verified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-text-primary">Phone Number</h3>
                  {profile.phone_verified ? (
                    <Badge variant="green" size="sm" className="gap-1"><CheckCircle2 className="w-3 h-3"/> Verified</Badge>
                  ) : (
                    <Badge variant="amber" size="sm" className="gap-1"><AlertCircle className="w-3 h-3"/> Not Linked</Badge>
                  )}
                </div>
                <p className="text-sm text-text-muted">{profile.phone || 'No phone number linked'}</p>
              </div>
            </div>
            {!profile.phone_verified && !showPhoneVerify && (
              <Button variant="outline" size="sm" onClick={() => setShowPhoneVerify(true)} className="w-full sm:w-auto">
                Link & Verify Phone
              </Button>
            )}
          </Card>

          {/* Phone Linking Flow */}
          {showPhoneVerify && !profile.phone_verified && (
            <Card className="animate-slide-down border-primary/20 bg-primary/5">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-text-primary">Link Your Phone</h3>
                <p className="text-sm text-text-muted">Secure your account by linking a phone number.</p>
              </div>

              {phoneError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 shrink-0" /> {phoneError}
                </div>
              )}
              {phoneSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> {phoneSuccess}
                </div>
              )}

              {phoneStep === 'input' && (
                <div className="space-y-4">
                  <Input
                    label="Phone Number"
                    id="link-phone"
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                    <Fingerprint className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-700">We&apos;ll send a 6-digit verification code to your phone via SMS.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={handleSendOtp} disabled={phoneLoading} className="flex-1">
                      {phoneLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      {phoneLoading ? 'Sending...' : 'Send OTP'}
                    </Button>
                    <Button variant="ghost" onClick={() => setShowPhoneVerify(false)} disabled={phoneLoading}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {phoneStep === 'otp' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-text-muted mb-3">
                      Enter the 6-digit code sent to <span className="font-semibold text-text-primary">{phoneInput}</span>
                    </p>
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
                          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-surface focus:outline-none transition-all ${
                            digit ? 'border-primary bg-primary/5 text-primary' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {resendTimer > 0 && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted mt-2">
                      <Timer className="w-3.5 h-3.5" />
                      <span>Resend available in <strong className="text-primary">{resendTimer}s</strong></span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button variant="primary" onClick={handleVerifyOtp} disabled={phoneLoading || otp.join('').length !== 6} className="flex-1">
                      {phoneLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      {phoneLoading ? 'Verifying...' : 'Verify Phone'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-2">
                    <button
                      onClick={() => { setPhoneStep('input'); setPhoneSuccess(''); setPhoneError(''); setOtp(['','','','','','']); }}
                      className="text-text-muted hover:text-primary cursor-pointer"
                    >
                      ← Change number
                    </button>
                    <button
                      onClick={handleSendOtp}
                      disabled={phoneLoading || resendTimer > 0}
                      className={`flex items-center gap-1 cursor-pointer transition-colors ${
                        resendTimer > 0 ? 'text-text-muted/50 cursor-not-allowed' : 'text-primary hover:underline'
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${phoneLoading ? 'animate-spin' : ''}`} /> Resend OTP
                    </button>
                  </div>
                </div>
              )}

              {/* Invisible reCAPTCHA container for linking phone */}
              <div id="recaptcha-container-profile" />
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(profile.role === 'admin' || profile.role === 'superadmin') && (
            <Link href="/admin">
              <Card className="flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer border-2 border-transparent">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-bold">Admin Panel</h3>
                  <p className="text-sm text-text-muted">Manage website content</p>
                </div>
              </Card>
            </Link>
          )}

          <Card className="flex items-center gap-4 opacity-60">
            <Settings className="w-6 h-6 text-text-muted" />
            <div>
              <h3 className="font-bold">Account Settings</h3>
              <p className="text-sm text-text-muted">Update your profile information</p>
            </div>
          </Card>

          <button onClick={handleLogout} className="w-full text-left cursor-pointer">
            <Card className="flex items-center gap-4 hover:border-red-300 transition-all border-2 border-transparent">
              <LogOut className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-bold text-red-600">Logout</h3>
                <p className="text-sm text-text-muted">Sign out of your account</p>
              </div>
            </Card>
          </button>
        </div>
      </div>
    </div>
  );
}
