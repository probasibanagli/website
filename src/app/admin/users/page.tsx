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
  UserPlus, Users, Trash2, Ban, UserCheck, Activity, Eye, Settings, ShieldCheck, ArrowLeft,
  LogIn, LogOut, PlusCircle, Edit3, Filter, Calendar, Download, RefreshCw, Clock, ChevronDown
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
  ambulance: 'edit',
  events: 'edit',
  government_services: 'edit',
  legal: 'edit',
  chamber_of_commerce: 'edit',
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
  legal: 'none',
  chamber_of_commerce: 'none',
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
  { key: 'legal', label: 'Legal Services' },
  { key: 'chamber_of_commerce', label: 'Chamber of Commerce' }
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

  // Activity Audit Log Filter States
  const [activityActionFilter, setActivityActionFilter] = useState<string>('all');
  const [activityAdminFilter, setActivityAdminFilter] = useState<string>('all');
  const [activityDateFilter, setActivityDateFilter] = useState<string>('all');
  const [activitySearchQuery, setActivitySearchQuery] = useState<string>('');
  const [refreshingActivities, setRefreshingActivities] = useState<boolean>(false);
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
    setRefreshingActivities(true);
    try {
      const token = await getIdToken();
      const res = await fetch('/api/admin/activities?limit=500', {
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
    } finally {
      setRefreshingActivities(false);
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
      const targetUser = users.find(u => u.uid === uid);
      const targetName = targetUser?.full_name || targetUser?.email || uid;
      fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: currentActive ? 'User Blocked' : 'User Unblocked',
          action_type: 'edit',
          performed_by: profile?.full_name || profile?.email || 'Admin',
          admin_email: profile?.email || '',
          user_role: profile?.role || 'admin',
          module: 'users',
          target_id: uid,
          details: `${currentActive ? 'Blocked' : 'Unblocked'} account for "${targetName}" (${uid})`,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});

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
      const targetUser = users.find(u => u.uid === uid);
      const targetName = targetUser?.full_name || targetUser?.email || uid;
      const token = await getIdToken();
      const res = await fetch(`/api/admin/users/${uid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete user');

      setUsers((prev) => prev.filter((u) => u.uid !== uid));
      fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'User Account Deleted',
          action_type: 'delete',
          performed_by: profile?.full_name || profile?.email || 'Admin',
          admin_email: profile?.email || '',
          user_role: profile?.role || 'admin',
          module: 'users',
          target_id: uid,
          details: `Permanently deleted account for "${targetName}" (${uid})`,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});

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
      const targetVisitor = visitors.find(v => v.id === id);
      const visitorContact = targetVisitor?.phone || targetVisitor?.email || id;
      await deleteDoc(doc(db, 'otps', id));
      setVisitors(prev => prev.filter(v => v.id !== id));
      fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Visitor Log Deleted',
          action_type: 'delete',
          performed_by: profile?.full_name || profile?.email || 'Admin',
          admin_email: profile?.email || '',
          user_role: profile?.role || 'admin',
          module: 'users',
          target_id: id,
          details: `Deleted OTP visitor verification log for ${visitorContact}`,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});

      if (isSuperAdmin) loadActivities();
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
          action_type: 'create',
          performed_by: profile?.full_name || 'Super Admin',
          admin_email: profile?.email || '',
          user_role: 'superadmin',
          module: 'users',
          details: `Created Admin account for ${createForm.full_name} (${createForm.email})`,
          timestamp: new Date().toISOString(),
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

  // Unique admins list for filtering
  const uniqueAdmins = Array.from(
    new Set(
      activities
        .map((a) => a.performed_by?.trim() || a.admin_email?.trim())
        .filter(Boolean)
    )
  ).sort();

  // Filtered Activities
  const filteredActivities = activities.filter((act) => {
    // 1. Action Type Filter
    if (activityActionFilter === 'login_logout') {
      if (act.action_type !== 'login' && act.action_type !== 'logout') return false;
    } else if (activityActionFilter === 'login') {
      if (act.action_type !== 'login') return false;
    } else if (activityActionFilter === 'logout') {
      if (act.action_type !== 'logout') return false;
    } else if (activityActionFilter === 'create') {
      if (act.action_type !== 'create') return false;
    } else if (activityActionFilter === 'edit') {
      if (act.action_type !== 'edit') return false;
    } else if (activityActionFilter === 'delete') {
      if (act.action_type !== 'delete') return false;
    }

    // 2. Admin User Filter
    if (activityAdminFilter !== 'all') {
      const perf = (act.performed_by || '').toLowerCase();
      const mail = (act.admin_email || '').toLowerCase();
      const target = activityAdminFilter.toLowerCase();
      if (!perf.includes(target) && !mail.includes(target)) {
        return false;
      }
    }

    // 3. Date / Time Filter
    if (activityDateFilter !== 'all') {
      const actTime = new Date(act.timestamp).getTime();
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      if (activityDateFilter === 'today') {
        if (actTime < todayStart) return false;
      } else if (activityDateFilter === 'yesterday') {
        const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
        if (actTime < yesterdayStart || actTime >= todayStart) return false;
      } else if (activityDateFilter === '7days') {
        const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000;
        if (actTime < sevenDaysAgo) return false;
      } else if (activityDateFilter === '30days') {
        const thirtyDaysAgo = todayStart - 30 * 24 * 60 * 60 * 1000;
        if (actTime < thirtyDaysAgo) return false;
      }
    }

    // 4. Search Filter
    const q = (activitySearchQuery || localSearch).trim().toLowerCase();
    if (q) {
      const actionStr = (act.action || '').toLowerCase();
      const perfStr = (act.performed_by || '').toLowerCase();
      const emailStr = (act.admin_email || '').toLowerCase();
      const roleStr = (act.user_role || '').toLowerCase();
      const detailsStr = (act.details || '').toLowerCase();
      const dateStr = new Date(act.timestamp).toLocaleString('en-IN').toLowerCase();
      return (
        actionStr.includes(q) ||
        perfStr.includes(q) ||
        emailStr.includes(q) ||
        roleStr.includes(q) ||
        detailsStr.includes(q) ||
        dateStr.includes(q)
      );
    }

    return true;
  });

  // Activity Metrics
  const nowTs = new Date();
  const todayStartTs = new Date(nowTs.getFullYear(), nowTs.getMonth(), nowTs.getDate()).getTime();

  const totalLogins = activities.filter((a) => a.action_type === 'login').length;
  const totalLogouts = activities.filter((a) => a.action_type === 'logout').length;
  const todayLogins = activities.filter((a) => a.action_type === 'login' && new Date(a.timestamp).getTime() >= todayStartTs).length;
  const todayLogouts = activities.filter((a) => a.action_type === 'logout' && new Date(a.timestamp).getTime() >= todayStartTs).length;
  const totalCreates = activities.filter((a) => a.action_type === 'create').length;
  const totalEdits = activities.filter((a) => a.action_type === 'edit').length;
  const totalDeletes = activities.filter((a) => a.action_type === 'delete').length;

  const exportActivitiesToCsv = () => {
    if (filteredActivities.length === 0) return alert('No activity records to export.');
    const headers = ['Timestamp', 'Action Type', 'Action Name', 'Admin Name', 'Admin Email', 'Admin Role', 'Details'];
    const rows = filteredActivities.map(a => [
      `"${new Date(a.timestamp).toLocaleString('en-IN')}"`,
      `"${a.action_type || 'other'}"`,
      `"${(a.action || '').replace(/"/g, '""')}"`,
      `"${(a.performed_by || '').replace(/"/g, '""')}"`,
      `"${(a.admin_email || '').replace(/"/g, '""')}"`,
      `"${(a.user_role || '').replace(/"/g, '""')}"`,
      `"${(a.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `admin_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


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

      {/* Tab Switcher Pills */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3 overflow-x-auto scrollbar-none">
        <Link
          href="/admin/users?tab=users"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-primary border border-border/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-text-muted'}`}>
            {regularUsersList.length}
          </span>
        </Link>

        <Link
          href="/admin/users?tab=admins"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'admins'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-primary border border-border/50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Administrators</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${activeTab === 'admins' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-text-muted'}`}>
            {adminsList.length}
          </span>
        </Link>

        <Link
          href="/admin/users?tab=visitors"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'visitors'
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-primary border border-border/50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Directory Visitors</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${activeTab === 'visitors' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-text-muted'}`}>
            {visitors.length}
          </span>
        </Link>

        {isSuperAdmin && (
          <Link
            href="/admin/users?tab=activities"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'activities'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-primary border border-border/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Admin Activity Tracking & Audit Logs</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${activeTab === 'activities' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-text-muted'}`}>
              {activities.length}
            </span>
          </Link>
        )}
      </div>



      {/* Filters */}
      {activeTab !== 'activities' && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 
              'visitors' ? 'visitors by phone/email' : activeTab}...`}
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

          {/* TAB 4: ACTIVITY LOGS & AUDIT TRAIL */}
          {activeTab === 'activities' && isSuperAdmin && (
            <div className="space-y-6">
              {/* Activity KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-muted">Logins</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <LogIn className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-text-primary">{totalLogins}</span>
                    <span className="text-xs text-emerald-600 font-medium">({todayLogins} today)</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">Admin Sessions</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-muted">Logouts</span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-text-primary">{totalLogouts}</span>
                    <span className="text-xs text-rose-600 font-medium">({todayLogouts} today)</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">Logged out</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-muted">Created</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <PlusCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-text-primary">{totalCreates}</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">New records added</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-muted">Edited</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Edit3 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-text-primary">{totalEdits}</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">Modifications</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-border shadow-xs col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-muted">Deleted</span>
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-red-600">{totalDeletes}</span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">Removed records</p>
                </div>
              </div>

              {/* Advanced Filter Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-border shadow-sm space-y-3">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Left: Quick Action Filter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setActivityActionFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        activityActionFilter === 'all'
                          ? 'bg-neutral-800 text-white shadow-xs'
                          : 'bg-surface text-text-muted hover:text-text-primary border border-border/60'
                      }`}
                    >
                      All Actions ({activities.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivityActionFilter('login_logout')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        activityActionFilter === 'login_logout'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <LogIn className="w-3 h-3" />
                      Login & Logout ({totalLogins + totalLogouts})
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivityActionFilter('login')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        activityActionFilter === 'login'
                          ? 'bg-green-700 text-white shadow-xs'
                          : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                      }`}
                    >
                      Logins ({totalLogins})
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivityActionFilter('logout')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        activityActionFilter === 'logout'
                          ? 'bg-rose-700 text-white shadow-xs'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      }`}
                    >
                      Logouts ({totalLogouts})
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivityActionFilter('create')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        activityActionFilter === 'create'
                          ? 'bg-blue-700 text-white shadow-xs'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                      }`}
                    >
                      <PlusCircle className="w-3 h-3" />
                      Created ({totalCreates})
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivityActionFilter('edit')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        activityActionFilter === 'edit'
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      Edited ({totalEdits})
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivityActionFilter('delete')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        activityActionFilter === 'delete'
                          ? 'bg-red-700 text-white shadow-xs'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                      Deleted ({totalDeletes})
                    </button>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={exportActivitiesToCsv}
                      title="Download Activity Audit Trail as CSV"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface/80 border border-border text-xs font-bold text-text-primary transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-primary" />
                      Export CSV
                    </button>

                    <button
                      type="button"
                      onClick={loadActivities}
                      disabled={refreshingActivities}
                      title="Refresh activity logs"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface/80 border border-border text-xs font-bold text-text-primary transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-primary ${refreshingActivities ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Second Row: Dropdowns & Search */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/50">
                  {/* Admin User Selector */}
                  <div className="relative">
                    <Users className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <select
                      value={activityAdminFilter}
                      onChange={(e) => setActivityAdminFilter(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface/50 border border-border text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                    >
                      <option value="all">All Administrators ({uniqueAdmins.length})</option>
                      {uniqueAdmins.map((admin) => (
                        <option key={admin} value={admin}>
                          {admin}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>

                  {/* Date Range Selector */}
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <select
                      value={activityDateFilter}
                      onChange={(e) => setActivityDateFilter(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface/50 border border-border text-xs font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>

                  {/* Real-time Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search action, admin, details..."
                      value={activitySearchQuery}
                      onChange={(e) => setActivitySearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface/50 border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    {activitySearchQuery && (
                      <button
                        type="button"
                        onClick={() => setActivitySearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Activity Log Table */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 bg-surface/50 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      Audit Log Entries
                    </span>
                  </div>
                  <span className="text-xs text-text-muted font-medium">
                    Showing <strong className="text-text-primary">{filteredActivities.length}</strong> of {activities.length} entries
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-surface/30 border-b border-border/80">
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Time & Date</th>
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Action Type</th>
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Performed By</th>
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                        <th className="text-left px-5 py-3.5 text-xs font-bold text-text-muted uppercase tracking-wider">Event Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredActivities.map((act) => {
                        const dateObj = new Date(act.timestamp);
                        const formattedDate = dateObj.toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        });
                        const formattedTime = dateObj.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true
                        });

                        // Calculate relative time
                        const diffSec = Math.floor((Date.now() - dateObj.getTime()) / 1000);
                        let relativeTime = 'Just now';
                        if (diffSec >= 60 && diffSec < 3600) relativeTime = `${Math.floor(diffSec / 60)}m ago`;
                        else if (diffSec >= 3600 && diffSec < 86400) relativeTime = `${Math.floor(diffSec / 3600)}h ago`;
                        else if (diffSec >= 86400) relativeTime = `${Math.floor(diffSec / 86400)}d ago`;

                        const type = act.action_type || 'other';

                        return (
                          <tr key={act.id} className="hover:bg-surface/40 transition-colors text-sm">
                            {/* Timestamp */}
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="text-xs font-semibold text-text-primary">{formattedDate}</div>
                              <div className="text-[11px] font-mono text-text-muted flex items-center gap-1.5 mt-0.5">
                                <span>{formattedTime}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 font-sans">
                                  {relativeTime}
                                </span>
                              </div>
                            </td>

                            {/* Action Type Badge */}
                            <td className="px-5 py-4 whitespace-nowrap">
                              {type === 'login' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                                  <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                                  Admin Login
                                </span>
                              ) : type === 'logout' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
                                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                                  Admin Logout
                                </span>
                              ) : type === 'create' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                                  <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                                  Created
                                </span>
                              ) : type === 'edit' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs">
                                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                                  Updated
                                </span>
                              ) : type === 'delete' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 shadow-2xs">
                                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                  Deleted
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 border border-neutral-200 shadow-2xs">
                                  <Activity className="w-3.5 h-3.5 text-neutral-600" />
                                  Activity
                                </span>
                              )}
                            </td>

                            {/* Performed By */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                  {act.performed_by?.charAt(0) || 'A'}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-text-primary leading-tight truncate">
                                    {act.performed_by || 'Admin'}
                                  </p>
                                  {act.admin_email && (
                                    <p className="text-[11px] text-text-muted truncate mt-0.5">
                                      {act.admin_email}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Role */}
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                act.user_role === 'superadmin' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                act.user_role === 'admin' ? 'bg-primary/10 text-primary border border-primary/20' :
                                'bg-surface text-text-muted border border-border'
                              }`}>
                                {act.user_role === 'superadmin' ? (
                                  <>
                                    <Crown className="w-3 h-3 text-amber-600" />
                                    Super Admin
                                  </>
                                ) : (
                                  act.user_role || 'Admin'
                                )}
                              </span>
                            </td>

                            {/* Details & Event */}
                            <td className="px-5 py-4">
                              <div className="space-y-1">
                                <div className="font-semibold text-text-primary text-xs">
                                  {act.action}
                                </div>
                                <div className="text-xs text-text-muted leading-relaxed max-w-md">
                                  {act.details}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredActivities.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-5 py-16 text-center">
                            <div className="max-w-xs mx-auto space-y-3">
                              <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mx-auto text-text-muted">
                                <Search className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-semibold text-text-primary">No activity logs found</p>
                              <p className="text-xs text-text-muted">No records match the current filter selection.</p>
                              {(activityActionFilter !== 'all' || activityAdminFilter !== 'all' || activityDateFilter !== 'all' || activitySearchQuery) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActivityActionFilter('all');
                                    setActivityAdminFilter('all');
                                    setActivityDateFilter('all');
                                    setActivitySearchQuery('');
                                  }}
                                  className="text-xs font-bold text-primary hover:underline cursor-pointer"
                                >
                                  Clear All Filters
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
