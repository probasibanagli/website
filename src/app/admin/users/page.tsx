'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import type { UserProfile, ModuleKey, PermissionLevel } from '@/types';
import { MODULE_LABELS } from '@/types';
import { AlertPopup, AlertType } from '@/components/ui/AlertPopup';
import { ConfirmPopup } from '@/components/ui/ConfirmPopup';
import {
  Shield, Crown, Search, ChevronRight, Check, X, Loader2,
  UserPlus, Users, Trash2, Ban, UserCheck, Activity, Eye, Settings, ShieldCheck, ArrowLeft
} from 'lucide-react';

const ADMIN_DEFAULT_PERMISSIONS = {
  stay: 'edit',
  food: 'edit',
  emergency: 'edit',
  community: 'edit',
  services: 'edit',
  blog: 'edit',
  users: 'none',
  matrimony: 'edit',
  travel: 'edit',
  blood_bank: 'edit',
  ambulance: 'edit'
};

const USER_DEFAULT_PERMISSIONS = {
  stay: 'none',
  food: 'none',
  emergency: 'none',
  community: 'none',
  services: 'none',
  blog: 'none',
  users: 'none',
  matrimony: 'none',
  travel: 'none',
  blood_bank: 'none',
  ambulance: 'none',
  events: 'none',
  government_services: 'none',
  legal: 'none'
};

const AVAILABLE_MODULES = [
  { key: 'stay', label: 'Stay & Accommodation' },
  { key: 'food', label: 'Bengali Food' },
  { key: 'emergency', label: 'Hospital Management (Hospitals, Doctors, Staff, Pharmacy)' },
  { key: 'community', label: 'Community Groups' },
  { key: 'services', label: 'Services' },
  { key: 'blog', label: 'Blog' },
  { key: 'users', label: 'User Management (Manage User)' },
  { key: 'matrimony', label: 'Matrimonial' },
  { key: 'travel', label: 'Travel & Transport' },
  { key: 'blood_bank', label: 'Blood Banks' },
  { key: 'ambulance', label: 'Ambulance Directory' },
  { key: 'events', label: 'Events & Festivals' },
  { key: 'government_services', label: 'Government Services' },
  { key: 'legal', label: 'Legal Services' }
];

export default function AdminUsersPage() {
  const { profile, firebaseUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);

  const getIdToken = async (): Promise<string> => {
    if (!firebaseUser) return 'temp_token';
    return typeof firebaseUser.getIdToken === 'function'
      ? await firebaseUser.getIdToken()
      : 'temp_token';
  };
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'admins' | 'users' | 'activities' | 'visitors'>('users');
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  useEffect(() => {
    if (tabParam === 'admins' || tabParam === 'users' || tabParam === 'activities' || tabParam === 'visitors') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const searchTerm = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    setLocalSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const [filterRole, setFilterRole] = useState<string>('all');

  // Popup States
  const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, message: string, type: AlertType}>({ isOpen: false, message: '', type: 'info' });
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, message: string, title?: string, confirmText?: string, onConfirm: () => void}>({ isOpen: false, message: '', onConfirm: () => {} });

  const showAlert = (message: string, type: AlertType = 'info') => {
    setAlertConfig({ isOpen: true, message, type });
  };

  // Create Admin Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ full_name: '', email: '', password: '', phone: '' });
  const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({});
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Permissions configuration
  const isSuperAdmin = profile?.role === 'superadmin';
  const isAdmin = profile?.role === 'admin';
  const userPermissionLevel = profile?.permissions?.users || 'none';
  const canView = isSuperAdmin || userPermissionLevel !== 'none';
  const canEdit = isSuperAdmin || userPermissionLevel === 'edit' || userPermissionLevel === 'manage';
  const canManage = isSuperAdmin || userPermissionLevel === 'manage';

  useEffect(() => {
    if (canView && firebaseUser) {
      loadData();
    }
  }, [canView, isSuperAdmin, firebaseUser]);

  async function loadData() {
    setLoading(true);
    try {
      await Promise.all([
        loadUsers(),
        loadVisitors(),
        isSuperAdmin ? loadActivities() : Promise.resolve()
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    if (!firebaseUser) return;
    try {
      let list: UserProfile[] = [];
      try {
        const token = await getIdToken();
        const res = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json() as { users: UserProfile[] };
          if (Array.isArray(data.users)) {
            list = data.users;
          }
        }
      } catch (apiErr) {
        console.warn('Admin API fetch failed, falling back to Firestore client:', apiErr);
      }

      if (list.length === 0) {
        const uSnap = await getDocs(collection(db, 'users'));
        list = uSnap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
      }
      
      list.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      setUsers(list);
    } catch (e: any) {
      console.error('Error loading users:', e);
    }
  }

  async function loadVisitors() {
    try {
      const snap = await getDocs(collection(db, 'otps'));
      const list: any[] = [];
      snap.forEach(doc => {
        const data = doc.data();
        if (data.verified) {
          list.push({ id: doc.id, ...data });
        }
      });
      list.sort((a, b) => (b.verifiedAt || 0) - (a.verifiedAt || 0));
      setVisitors(list);
    } catch (e) {
      console.error('Error loading visitors:', e);
    }
  }

  async function loadActivities() {
    if (!firebaseUser) return;
    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/activities', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.logs) {
        setActivities(data.logs);
      }
    } catch (e) {
      console.error('Failed to load activities', e);
    }
  }

  // Block or Unblock user account
  async function handleToggleBlock(uid: string, currentActive: boolean) {
    if (!canEdit || !firebaseUser) return;
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/users/${uid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !currentActive })
      });
      if (!res.ok) throw new Error('Failed to update status');

      setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, is_active: !currentActive } : u));
      if (isSuperAdmin) loadActivities();
      showAlert(`User ${currentActive ? 'blocked' : 'unblocked'} successfully!`, 'success');
    } catch (e: any) {
      showAlert(e.message || 'Error updating status', 'error');
    }
  }

  // Delete User Account
  function handleDeleteUser(uid: string) {
    if (!canManage || !firebaseUser) return;
    setConfirmConfig({
      isOpen: true,
      title: 'Delete User',
      message: 'Are you sure you want to permanently delete this user? This action cannot be undone.',
      confirmText: 'Delete Permanently',
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        executeDeleteUser(uid);
      }
    });
  }

  async function executeDeleteUser(uid: string) {
    try {
      const token = await getIdToken();
      const res = await fetch(`/api/admin/users/${uid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete user');

      setUsers((prev) => prev.filter((u) => u.uid !== uid));
      if (isSuperAdmin) loadActivities();
      showAlert('User account deleted permanently!', 'success');
    } catch (e: any) {
      showAlert(e.message || 'Error deleting user', 'error');
    }
  }

  // Delete Visitor log
  function handleDeleteVisitor(id: string) {
    if (!canManage) return;
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Visitor Log',
      message: 'Are you sure you want to delete this visitor log?',
      confirmText: 'Delete',
      onConfirm: () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        executeDeleteVisitor(id);
      }
    });
  }

  async function executeDeleteVisitor(id: string) {
    try {
      await deleteDoc(doc(db, 'otps', id));
      setVisitors(prev => prev.filter(v => v.id !== id));
      setVisitors(prev => prev.filter(v => v.id !== id));
      showAlert('Visitor verification log deleted successfully.', 'success');
    } catch (err: any) {
      showAlert('Failed to delete visitor log: ' + err.message, 'error');
    }
  }

  function openCreateModal() {
    setCreateForm({ full_name: '', email: '', password: '', phone: '' });
    setSelectedModules(AVAILABLE_MODULES.reduce((acc, m) => ({ ...acc, [m.key]: true }), {}));
    setCreateError('');
    setShowCreateModal(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!isSuperAdmin || !firebaseUser) return;
    setCreateError('');

    const phoneDigits = createForm.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setCreateError('Please enter a valid 10-digit phone number.');
      return;
    }

    setCreating(true);
    try {
      const perms: Record<string, string> = {};
      AVAILABLE_MODULES.forEach(m => {
        perms[m.key] = selectedModules[m.key] ? 'edit' : 'none';
      });

      const token = await getIdToken();
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: createForm.email.trim(),
          password: createForm.password,
          full_name: createForm.full_name.trim(),
          phone: `+91${phoneDigits}`,
          role: 'admin',
          permissions: perms
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create admin');
      }

      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Admin Account Created',
          performed_by: profile?.full_name || 'Super Admin',
          user_role: 'superadmin',
          details: `Created Admin account for ${createForm.full_name} (${createForm.email})`
        })
      }).catch(() => {});

      setShowCreateModal(false);
      loadUsers();
      loadActivities();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  }

  const adminsList = users.filter((u) => u.role === 'admin' || u.role === 'superadmin');
  const regularUsersList = users.filter((u) => u.role === 'user');

  const filteredAdmins = adminsList.filter((u) => {
    const name = u.full_name || '';
    const email = u.email || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredUsers = regularUsersList.filter((u) => {
    const name = u.full_name || '';
    const email = u.email || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Filter visitors
  const registeredPhones = new Set(users.map(u => u.phone?.trim()).filter(Boolean));
  const registeredEmails = new Set(users.map(u => u.email?.trim().toLowerCase()).filter(Boolean));

  const filteredVisitors = visitors.filter((v) => {
    const phone = v.phone || '';
    const email = v.email || '';
    return phone.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!canView) {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-text-primary mb-2">Access Denied</h2>
        <p className="text-text-muted">You do not have the required &apos;Manage User&apos; permission to access this module.</p>
      </div>
    );
  }

  if (showCreateModal && isSuperAdmin) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowCreateModal(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface/80 border border-border text-text-muted hover:text-text-primary transition-colors text-sm font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to User List
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Create New Admin Account</h1>
            <p className="text-text-muted text-sm mt-0.5">Assign admin privileges, module access, and hospital scopes.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <form id="create-admin-form" onSubmit={handleCreateAdmin} className="p-6 md:p-8 space-y-6">
            {createError && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">{createError}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Full Name *</label>
                <input required type="text" value={createForm.full_name} onChange={(e) => setCreateForm({...createForm, full_name: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Email Address *</label>
                <input required type="email" value={createForm.email} onChange={(e) => setCreateForm({...createForm, email: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" placeholder="admin@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone Number *</label>
                <input required type="tel" value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" placeholder="98765 43210" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Password *</label>
                <input required type="password" minLength={6} value={createForm.password} onChange={(e) => setCreateForm({...createForm, password: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all" placeholder="Min 6 characters" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Module Access Permissions</label>
              <div className="space-y-6 border border-border p-5 rounded-2xl bg-surface/30 mt-3">
                {[
                  { title: 'Explore', modules: ['stay', 'food', 'travel'] },
                  { title: 'Community', modules: ['community', 'matrimony', 'events'] },
                  { title: 'Emergency', modules: ['emergency', 'blood_bank', 'ambulance'] },
                  { title: 'Services', modules: ['services', 'government_services', 'legal'] },
                  { title: 'System Management', modules: ['users', 'blog'] }
                ].map(group => (
                  <div key={group.title}>
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">{group.title}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {group.modules.map(moduleKey => {
                        const m = AVAILABLE_MODULES.find(mod => mod.key === moduleKey);
                        if (!m) return null;
                        return (
                          <label key={m.key} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-surface cursor-pointer bg-white transition-colors shadow-sm">
                            <input type="checkbox" checked={selectedModules[m.key] || false} onChange={(e) => setSelectedModules({...selectedModules, [m.key]: e.target.checked})} className="w-4 h-4 accent-primary rounded cursor-pointer" />
                            <span className="text-sm font-medium text-text-primary leading-tight">{m.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button type="button" onClick={() => setShowCreateModal(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:bg-surface border border-border transition-colors cursor-pointer">Cancel</button>
              <button form="create-admin-form" type="submit" disabled={creating} className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-colors cursor-pointer">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                {creating ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AlertPopup 
        isOpen={alertConfig.isOpen} 
        message={alertConfig.message} 
        type={alertConfig.type} 
        onClose={() => setAlertConfig(prev => ({...prev, isOpen: false}))} 
      />
      <ConfirmPopup
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({...prev, isOpen: false}))}
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {activeTab === 'admins' ? 'Admin Management' :
             activeTab === 'activities' ? 'Activity Tracking' :
             activeTab === 'visitors' ? 'Directory Visitors' : 'User Management'}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {activeTab === 'admins' ? `${adminsList.length} total administrators` :
             activeTab === 'activities' ? `${activities.length} total activities logged` :
             activeTab === 'visitors' ? `${visitors.length} directory visitors (OTP verified)` :
             `${regularUsersList.length} total users registered`}
          </p>
        </div>
        {isSuperAdmin && activeTab === 'admins' && (
          <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors shadow-md active:scale-95 cursor-pointer">
            <UserPlus className="w-4 h-4" /> Create Admin
          </button>
        )}
      </div>



      {/* Filters */}
      {activeTab !== 'activities' && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'visitors' ? 'visitors by phone/email' : activeTab}...`}
            value={localSearch}
            onChange={(e) => {
              const value = e.target.value;
              setLocalSearch(value);
              const params = new URLSearchParams(searchParams.toString());
              if (value) {
                params.set('search', value);
              } else {
                params.delete('search');
              }
              router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <>
          {/* TAB 1: USERS */}
          {activeTab === 'users' && (
            <div className="bg-white/50 rounded-2xl border border-border overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface/50 border-b border-border">
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">User details</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Contact</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Verification</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Block Option</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((u) => (
                    <tr key={u.uid} className="hover:bg-surface transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase">
                            {u.full_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">{u.full_name}</p>
                            <p className="text-xs text-text-muted">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-primary">{u.phone || '—'}</td>
                      <td className="px-5 py-4 space-y-1">
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${u.email_verified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          Email: {u.email_verified ? 'Verified' : 'Pending'}
                        </span>
                        <br />
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${u.phone_verified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          Phone: {u.phone_verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${u.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
                          {u.is_active ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleBlock(u.uid, u.is_active)}
                            disabled={!canEdit}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors border ${
                              u.is_active ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {u.is_active ? <Ban className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            {u.is_active ? 'Block Account' : 'Unblock Account'}
                          </button>
                          {canManage && (
                            <button
                              onClick={() => handleDeleteUser(u.uid)}
                              className="p-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm italic">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: ADMINS */}
          {activeTab === 'admins' && (
            <div className="bg-white/50 rounded-2xl border border-border overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface/50 border-b border-border">
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Admin details</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Permissions Assigned</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Verification</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAdmins.map((u) => {
                    const activePermissions = Object.entries(u.permissions || {})
                      .filter(([_, level]) => level !== 'none')
                      .map(([key]) => key);
                    const isFullyVerified = u.role === 'superadmin' || (u.email_verified && u.phone_verified);
                    
                    return (
                      <tr key={u.uid} className="hover:bg-surface transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold uppercase">
                              {u.full_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-text-primary">{u.full_name}</p>
                              <p className="text-xs text-text-muted">{u.email}</p>
                              <p className="text-[10px] text-text-muted font-mono">{u.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {u.role === 'superadmin' ? (
                            <span className="text-xs font-semibold text-amber-700">All permissions granted</span>
                          ) : activePermissions.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {activePermissions.map(p => (
                                <span key={p} className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-semibold text-text-muted capitalize">
                                  {MODULE_LABELS[p as ModuleKey] || p}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-text-muted">No permissions</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {u.role === 'superadmin' ? (
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700">Verified</span>
                          ) : (
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isFullyVerified ? 'bg-green-50 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {isFullyVerified ? 'Verified' : 'Pending'}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {isSuperAdmin && u.email !== profile?.email ? (
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/admin/users/${u.uid}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface hover:bg-surface/80 border border-border text-xs text-text-muted hover:text-primary rounded-xl transition-all"
                              >
                                <Settings className="w-3.5 h-3.5" /> Edit Permissions
                              </Link>
                              <button
                                onClick={() => handleDeleteUser(u.uid)}
                                className="p-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-text-muted">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: VISITORS */}
          {activeTab === 'visitors' && (
            <div className="bg-white/50 rounded-2xl border border-border overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface/50 border-b border-border">
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Visitor Phone</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Email Address</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">User Classification</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Verified Time</th>
                    {(canManage) && <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredVisitors.map((v) => {
                    const isRegPhone = v.phone && registeredPhones.has(v.phone.trim());
                    const isRegEmail = v.email && registeredEmails.has(v.email.trim().toLowerCase());
                    const isRegistered = isRegPhone || isRegEmail;
                    
                    return (
                      <tr key={v.id} className="hover:bg-surface transition-colors">
                        <td className="px-5 py-4 text-sm font-semibold text-text-primary">{v.phone || '—'}</td>
                        <td className="px-5 py-4 text-sm text-text-muted">{v.email || '—'}</td>
                        <td className="px-5 py-4">
                          {isRegistered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                              <ShieldCheck className="w-3.5 h-3.5 text-green-600 mr-1" /> Registered Member
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              New Visitor
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-text-muted">
                          {v.verifiedAt ? new Date(v.verifiedAt).toLocaleString('en-IN') : '—'}
                        </td>
                        {canManage && (
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleDeleteVisitor(v.id)}
                              className="p-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                  {filteredVisitors.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm italic">No visitors found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: ACTIVITY LOGS */}
          {activeTab === 'activities' && isSuperAdmin && (
            <div className="bg-white/50 rounded-2xl border border-border overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface/50 border-b border-border">
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Timestamp</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">User/Admin</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Action</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-surface transition-colors text-sm">
                      <td className="px-5 py-4 text-xs text-text-muted font-mono whitespace-nowrap">
                        {new Date(act.timestamp).toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 font-semibold text-text-primary">{act.performed_by}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          act.user_role === 'superadmin' ? 'bg-amber-100 text-amber-700' :
                          act.user_role === 'admin' ? 'bg-primary/10 text-primary' :
                          'bg-surface text-text-muted border border-border'
                        }`}>
                          {act.user_role}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-text-primary">{act.action}</td>
                      <td className="px-5 py-4 text-xs text-text-muted max-w-sm truncate">{act.details}</td>
                    </tr>
                  ))}
                  {activities.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm italic">No activities logged yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

    </div>
  );
}
