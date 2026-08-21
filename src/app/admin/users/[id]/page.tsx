'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { useAuth } from '@/lib/auth/AuthContext';
import type { UserProfile, ModuleKey, PermissionLevel, Hospital } from '@/types';
import { MODULE_LABELS } from '@/types';
import { ALL_MODULES, ALL_PERMISSION_LEVELS } from '@/lib/permissions';
import { ArrowLeft, Save, Loader2, Shield, Crown, Building2, CheckSquare, Square } from 'lucide-react';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { profile: myProfile, firebaseUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [permissions, setPermissions] = useState<Record<ModuleKey, PermissionLevel>>({} as Record<ModuleKey, PermissionLevel>);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const userId = params.id as string;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/users/${userId}`);

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setFullName(data.user.full_name || '');
            setEmail(data.user.email || '');
            let rawPhone = data.user.phone || '';
            if (rawPhone.startsWith('+91')) {
              rawPhone = rawPhone.slice(3);
            }
            setPhone(rawPhone);
            setEmailVerified(!!data.user.email_verified);
            setPhoneVerified(!!data.user.phone_verified);
            setPermissions(data.user.permissions || {} as Record<ModuleKey, PermissionLevel>);
          }
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (userId) load();
  }, [userId]);


  async function handleSave() {
    if (!user || !firebaseUser) return;
    if (!fullName.trim()) return alert('Please enter a name.');
    if (!email.trim()) return alert('Please enter an email.');

    const digits = phone.replace(/\D/g, '');
    if (phone && digits.length !== 10) {
      return alert('Please enter a valid 10-digit phone number.');
    }
    const formattedPhone = phone ? '+91' + digits : '';

    setSaving(true);
    try {
      const token = typeof firebaseUser.getIdToken === 'function'
        ? await firebaseUser.getIdToken()
        : 'temp_token';
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          permissions,
          full_name: fullName.trim(),
          email: email.trim(),
          phone: formattedPhone,
          email_verified: emailVerified,
          phone_verified: phoneVerified,
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update user profile');
      }

      // Log activity
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Permissions Updated',
          performed_by: myProfile?.full_name || 'Super Admin',
          user_role: 'superadmin',
          details: `Updated permissions for ${fullName}`
        })
      }).catch(() => { });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  }

  if (myProfile?.role !== 'superadmin') {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-text-primary mb-2">Access Denied</h2>
        <p className="text-text-muted">Only the Super Admin can configure administrator permissions.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-text-muted">
        User account not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </button>

      {/* User info */}
      <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold uppercase shrink-0">
            {fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">Edit Account & Access Scope</h2>
            <span className={`inline-flex items-center gap-1 mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-700'}`}>
              {user.role === 'admin' ? <><Shield className="w-2.5 h-2.5" /> System Admin</> : <><Crown className="w-2.5 h-2.5" /> Super Admin</>}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Full Name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Phone Number (10 digit)</label>
            <div className="flex rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
              <span className="bg-surface/50 text-text-muted px-3 py-2 text-sm border-r border-border font-medium">+91</span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border-0 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 md:col-span-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface/30">
              <div>
                <p className="text-xs font-bold text-text-primary">Email Verification</p>
                <p className="text-[11px] text-text-muted">Mark email address as verified</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailVerified(!emailVerified)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${emailVerified ? 'bg-green-50 text-green-700 border-green-300' : 'bg-amber-50 text-amber-700 border-amber-300'
                  }`}
              >
                {emailVerified ? 'Verified' : 'Pending'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-surface/30">
              <div>
                <p className="text-xs font-bold text-text-primary">Phone Verification</p>
                <p className="text-[11px] text-text-muted">Mark phone number as verified</p>
              </div>
              <button
                type="button"
                onClick={() => setPhoneVerified(!phoneVerified)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${phoneVerified ? 'bg-green-50 text-green-700 border-green-300' : 'bg-amber-50 text-amber-700 border-amber-300'
                  }`}
              >
                {phoneVerified ? 'Verified' : 'Pending'}
              </button>
            </div>
          </div>
        </div>
      </div>



      {/* Permission Matrix */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-surface/30">
          <h2 className="text-lg font-bold text-text-primary">System Module Permissions</h2>
          <p className="text-sm text-text-muted mt-0.5">Set general access levels for system modules</p>
        </div>

        <div className="p-5 space-y-3">
          {ALL_MODULES.map((mod) => (
            <div key={mod} className="flex flex-col md:flex-row md:items-center justify-between py-3.5 px-4 rounded-xl bg-surface/10 border border-border gap-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">{MODULE_LABELS[mod]}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {permissions[mod] === 'none' && 'No access'}
                  {permissions[mod] === 'view' && 'Can view data only'}
                  {permissions[mod] === 'edit' && 'Can view, add & edit data'}
                  {permissions[mod] === 'manage' && 'Full access including delete'}
                </p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {ALL_PERMISSION_LEVELS.map((level) => {
                  const isSelected = permissions[mod] === level;
                  let activeClass = '';
                  if (isSelected) {
                    if (level === 'none') activeClass = 'bg-gray-100 text-gray-700 border-gray-300';
                    else if (level === 'view') activeClass = 'bg-blue-50 text-blue-700 border-blue-300';
                    else if (level === 'edit') activeClass = 'bg-amber-50 text-amber-700 border-amber-300';
                    else if (level === 'manage') activeClass = 'bg-green-50 text-green-700 border-green-300';
                  } else {
                    activeClass = 'bg-white text-text-muted border-border hover:bg-surface hover:text-text-primary';
                  }

                  return (
                    <button
                      key={level}
                      onClick={() => setPermissions({ ...permissions, [mod]: level })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer border ${activeClass}`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-border flex items-center justify-end gap-3 bg-surface/30">
          {saved && <span className="text-sm text-green-600 font-medium">✓ Saved successfully</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-md active:scale-95"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
}
