'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Phone, Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function BlockedPage() {
  const { profile, logOut } = useAuth();
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'support_requests'), {
        uid: profile?.uid || 'guest',
        email: profile?.email || 'unknown',
        full_name: profile?.full_name || 'Guest User',
        phone: profile?.phone || '',
        message: message.trim(),
        status: 'pending',
        type: 'unblock_request',
        created_at: new Date().toISOString(),
      });
      // Record this activity
      await addDoc(collection(db, 'activities'), {
        action: 'Unblock request submitted',
        performed_by: profile?.full_name || 'Guest User',
        user_role: 'user',
        timestamp: new Date().toISOString(),
        details: `User requested unblocking: ${message.trim()}`
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      alert('Failed to send request. Please contact support via phone or email directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-red-600 shadow-lg shadow-red-200">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary font-display">Account Restricted</h1>
          <p className="text-text-muted mt-2">Your account has been temporarily blocked by the system administrator.</p>
        </div>

        <Card padding="lg" className="border-red-100 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-surface border border-border flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-text-primary text-sm">Call Us</h3>
                <p className="text-xs text-text-muted mt-0.5">Mon-Sat, 9AM-6PM</p>
                <a href="tel:+919876543210" className="text-sm font-bold text-primary hover:underline block mt-1">+91 98765 43210</a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-border flex items-start gap-3">
              <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-text-primary text-sm">Email Support</h3>
                <p className="text-xs text-text-muted mt-0.5">24/7 Response time</p>
                <a href="mailto:support@probasibangali.in" className="text-sm font-bold text-accent hover:underline block mt-1">support@probasibangali.in</a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            {submitted ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-primary">Request Submitted</h3>
                <p className="text-sm text-text-muted mt-1">Our administration team will review your request shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-text-primary flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-primary" /> Request Unblocking
                </h3>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain why your account should be unblocked..."
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
                />
                <Button variant="primary" className="w-full" type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Review Request'} <Send className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs">
            <span className="text-text-muted">User ID: {profile?.uid || 'Not signed in'}</span>
            <button onClick={logOut} className="text-red-500 font-bold hover:underline">Log Out</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
