'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import type { UserProfile, ModuleKey, PermissionLevel } from '@/types';
import { MODULE_LABELS } from '@/types';
import { ALL_MODULES, ALL_PERMISSION_LEVELS } from '@/lib/permissions';
import { ArrowLeft, Save, Loader2, Shield, Crown } from 'lucide-react';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { profile: myProfile } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<Record<ModuleKey, PermissionLevel>>({} as Record<ModuleKey, PermissionLevel>);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const userId = params.id as string;

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setUser(data);
        setPermissions(data.permissions || {} as Record<ModuleKey, PermissionLevel>);
      }
      setLoading(false);
    }
    if (userId) load();
  }, [userId]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', userId), {
        permissions,
        updated_at: new Date().toISOString(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  }

  if (myProfile?.role !== 'superadmin') {
    return <div className="text-center py-20"><Shield className="w-12 h-12 text-red-400 mx-auto mb-4" /><h2 className="text-xl font-bold text-white">Access Denied</h2></div>;
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;
  if (!user) return <div className="text-center py-20 text-gray-400">User not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </button>

      {/* User info */}
      <div className="bg-[#1a1d27] rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
            {user.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{user.full_name}</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
            <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-gray-500/10 text-gray-400'}`}>
              {user.role === 'admin' ? <><Shield className="w-3 h-3" /> Admin</> : 'User'}
            </span>
          </div>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-[#1a1d27] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-lg font-bold text-white">Module Permissions</h2>
          <p className="text-sm text-gray-500 mt-1">Set what this admin can do in each module</p>
        </div>

        <div className="p-5 space-y-3">
          {ALL_MODULES.map((mod) => (
            <div key={mod} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div>
                <p className="text-sm font-medium text-white">{MODULE_LABELS[mod]}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {permissions[mod] === 'none' && 'No access'}
                  {permissions[mod] === 'view' && 'Can view data only'}
                  {permissions[mod] === 'edit' && 'Can view, add & edit data'}
                  {permissions[mod] === 'manage' && 'Full access including delete'}
                </p>
              </div>
              <div className="flex gap-1">
                {ALL_PERMISSION_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => setPermissions({ ...permissions, [mod]: level })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                      permissions[mod] === level
                        ? level === 'none' ? 'bg-gray-600 text-white'
                        : level === 'view' ? 'bg-blue-600 text-white'
                        : level === 'edit' ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                        : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-white/5 flex items-center justify-end gap-3">
          {saved && <span className="text-sm text-emerald-400">✓ Saved successfully</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>
    </div>
  );
}
