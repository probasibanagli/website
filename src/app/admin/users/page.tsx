'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import type { UserProfile } from '@/types';
import { MODULE_LABELS } from '@/types';
import { Shield, Crown, Search, ChevronRight, Check, X, Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const isSuperAdmin = profile?.role === 'superadmin';

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    try {
      const snap = await getDocs(query(collection(db, 'users'), orderBy('created_at', 'desc')));
      setUsers(snap.docs.map((d) => d.data() as UserProfile));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function toggleActive(uid: string, active: boolean) {
    if (!isSuperAdmin) return;
    await updateDoc(doc(db, 'users', uid), { is_active: !active, updated_at: new Date().toISOString() });
    setUsers((p) => p.map((u) => u.uid === uid ? { ...u, is_active: !active } : u));
  }

  async function changeRole(uid: string, newRole: 'user' | 'admin') {
    if (!isSuperAdmin) return;
    const none = { stay:'none',food:'none',travel:'none',emergency:'none',community:'none',services:'none',blog:'none',users:'none' };
    const upd: Record<string,unknown> = { role: newRole, updated_at: new Date().toISOString() };
    if (newRole === 'user') upd.permissions = none;
    await updateDoc(doc(db, 'users', uid), upd);
    setUsers((p) => p.map((u) => u.uid === uid ? { ...u, role: newRole, ...(newRole === 'user' ? { permissions: none as UserProfile['permissions'] } : {}) } : u));
  }

  const filtered = users.filter((u) => {
    const s = u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return s && (filterRole === 'all' || u.role === filterRole);
  });

  if (!isSuperAdmin) return (
    <div className="text-center py-20">
      <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-text-primary mb-2">Super Admin Only</h2>
      <p className="text-text-muted">Only Super Admins can manage users.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-text-primary">User Management</h1><p className="text-text-muted text-sm mt-1">{users.length} total users</p></div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-2.5 bg-white border border-border rounded-xl text-sm text-text-primary focus:outline-none cursor-pointer">
          <option value="all">All Roles</option><option value="superadmin">Super Admin</option><option value="admin">Admin</option><option value="user">User</option>
        </select>
      </div>
      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead><tr className="bg-surface/50 border-b border-border">
              <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">User</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider hidden md:table-cell">Modules</th>
              <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider hidden sm:table-cell">Status</th>
              <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map((u) => {
                const mods = u.role==='admin' ? Object.values(u.permissions||{}).filter(l=>l!=='none').length : u.role==='superadmin' ? 8 : 0;
                return (
                  <tr key={u.uid} className="hover:bg-surface transition-colors">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">{u.full_name?.charAt(0).toUpperCase()}</div><div><p className="text-sm font-semibold text-text-primary">{u.full_name}</p><p className="text-xs text-text-muted">{u.email}</p></div></div></td>
                    <td className="px-5 py-4">
                      {u.role==='superadmin' ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold"><Crown className="w-3 h-3" /> Super Admin</span>
                       : u.role==='admin' ? <div className="flex items-center gap-2"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold"><Shield className="w-3 h-3" /> Admin</span><button onClick={()=>changeRole(u.uid,'user')} className="text-[10px] text-text-muted hover:text-red-500 cursor-pointer">Remove</button></div>
                       : <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted text-xs font-bold">User</span><button onClick={()=>changeRole(u.uid,'admin')} className="text-[10px] text-text-muted hover:text-primary cursor-pointer">Make Admin</button></div>}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell"><span className="text-xs text-text-muted font-medium">{mods}/8 Modules</span></td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <button onClick={()=>toggleActive(u.uid,u.is_active)} disabled={u.role==='superadmin'} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold cursor-pointer transition-colors ${u.is_active?'bg-accent/10 text-accent':'bg-red-50 text-red-500'}`}>
                        {u.is_active?<Check className="w-3 h-3"/>:<X className="w-3 h-3"/>}{u.is_active?'Active':'Disabled'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">{u.role!=='superadmin' && <Link href={`/admin/users/${u.uid}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-surface text-xs text-text-muted hover:text-primary transition-all">Edit Permissions<ChevronRight className="w-3.5 h-3.5"/></Link>}</td>
                  </tr>
                );
              })}
              {filtered.length===0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm italic">No users found</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
