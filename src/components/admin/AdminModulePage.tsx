'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import type { ModuleKey, PermissionLevel } from '@/types';
import { MODULE_LABELS } from '@/types';
import { Plus, Pencil, Trash2, X, Loader2, Shield, Eye } from 'lucide-react';

interface AdminModulePageProps {
  moduleKey: ModuleKey;
  collectionName: string;
  columns: { key: string; label: string }[];
  formFields: { key: string; label: string; type?: string; required?: boolean; options?: string[] }[];
}

export default function AdminModulePage({ moduleKey, collectionName, columns, formFields }: AdminModulePageProps) {
  const { profile } = useAuth();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const canView = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'view');
  const canEdit = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'edit');
  const canManage = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'manage');

  useEffect(() => { loadItems(); }, []);

  async function loadItems() {
    try {
      const snap = await getDocs(collection(db, collectionName));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function openAdd() {
    setEditId(null);
    setFormData({});
    setShowForm(true);
  }

  function openEdit(item: Record<string, unknown>) {
    setEditId(item.id as string);
    const data: Record<string, string> = {};
    formFields.forEach(f => { data[f.key] = String(item[f.key] || ''); });
    setFormData(data);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const now = new Date().toISOString();
      if (editId) {
        await updateDoc(doc(db, collectionName, editId), { ...formData, updated_at: now });
        setItems(prev => prev.map(i => i.id === editId ? { ...i, ...formData } : i));
        alert('Item updated successfully!');
      } else {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        await setDoc(doc(db, collectionName, id), { ...formData, id, created_at: now });
        setItems(prev => [{ id, ...formData, created_at: now }, ...prev]);
        alert('Item added successfully!');
      }
      setShowForm(false);
    } catch (e) {
      console.error(e);
      alert('Error saving item. Please check your connection and permissions.');
    }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      setItems(prev => prev.filter(i => i.id !== id));
      alert('Item deleted successfully!');
    } catch (e) {
      console.error(e);
      alert('Error deleting item.');
    }
  }

  if (!canView) return (
    <div className="text-center py-20"><Shield className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-text-primary mb-2">No Access</h2><p className="text-text-muted">You don't have permission to access this module.</p></div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-text-primary">{MODULE_LABELS[moduleKey]}</h1><p className="text-text-muted text-sm mt-1">{items.length} items</p></div>
        {canEdit && <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-md active:scale-95"><Plus className="w-4 h-4" /> Add New</button>}
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead><tr className="bg-surface/50 border-b border-border">
              {columns.map(c => <th key={c.key} className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">{c.label}</th>)}
              {(canEdit || canManage) && <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {items.map(item => (
                <tr key={item.id as string} className="hover:bg-surface transition-colors">
                  {columns.map(c => <td key={c.key} className="px-5 py-4 text-sm text-text-primary max-w-[200px] truncate">{String(item[c.key] || '—')}</td>)}
                  {(canEdit || canManage) && (
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>}
                        {canManage && <button onClick={() => handleDelete(item.id as string)} className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={columns.length + 1} className="px-5 py-12 text-center text-text-muted text-sm italic">No data yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl border border-border w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-text-primary">{editId ? 'Edit' : 'Add'} {MODULE_LABELS[moduleKey]}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-surface text-text-muted transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 p-6 space-y-5 overflow-y-auto overflow-x-hidden">
              {formFields.map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">{f.label}{f.required && <span className="text-primary"> *</span>}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={formData[f.key] || ''} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} rows={4} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" placeholder={`Enter ${f.label.toLowerCase()}...`} />
                  ) : f.type === 'select' && f.options ? (
                    <select value={formData[f.key] || ''} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer">
                      <option value="">Select {f.label}...</option>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type || 'text'} value={formData[f.key] || ''} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={`Enter ${f.label.toLowerCase()}...`} />
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-surface/30">
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}{saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
