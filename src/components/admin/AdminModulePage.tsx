'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import type { ModuleKey } from '@/types';
import { MODULE_LABELS } from '@/types';
import { Plus, Pencil, Trash2, X, Loader2, Shield, ArrowLeft, Save } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface AdminModulePageProps {
  moduleKey: ModuleKey;
  collectionName: string;
  columns: { key: string; label: string }[];
  formFields: { key: string; label: string; type?: string; required?: boolean; options?: string[] }[];
}

export default function AdminModulePage({ moduleKey, collectionName, columns, formFields }: AdminModulePageProps) {
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const searchVal = searchParams.get('search') || '';
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImages(prev => ({ ...prev, [key]: true }));
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const storage = getStorage();
      const fileExt = compressedFile.name.split('.').pop() || 'jpg';
      const storageRef = ref(storage, `admin_uploads/${moduleKey}/${Date.now()}.${fileExt}`);
      await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, [key]: url }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
    } finally {
      setUploadingImages(prev => ({ ...prev, [key]: false }));
    }
  };

  const canView = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'view');
  const canEdit = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'edit');
  const canManage = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'manage');

  useEffect(() => {
    async function loadItems() {
      try {
        const snap = await getDocs(collection(db, collectionName));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e: unknown) { console.error(e); }
      finally { setLoading(false); }
    }
    const handle = requestAnimationFrame(() => { loadItems(); });
    return () => cancelAnimationFrame(handle);
  }, [collectionName]);

  function openAdd() {
    setEditId(null);
    setFormData({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openEdit(item: Record<string, unknown>) {
    setEditId(item.id as string);
    const data: Record<string, unknown> = {};
    formFields.forEach(f => {
      data[f.key] = f.type === 'checkbox' ? !!item[f.key] : item[f.key] ?? '';
    });
    setFormData(data);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    } finally { setSaving(false); }
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
    <div className="text-center py-20"><Shield className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-text-primary mb-2">No Access</h2><p className="text-text-muted">You don&apos;t have permission to access this module.</p></div>
  );

  /* ─────────────── FORM PAGE ─────────────── */
  if (showForm) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface/80 border border-border text-text-muted hover:text-text-primary transition-colors text-sm font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {editId ? 'Edit' : 'Add New'} — {MODULE_LABELS[moduleKey]}
            </h1>
            <p className="text-text-muted text-sm mt-0.5">
              {editId ? 'Update the details below and save.' : 'Fill in the details below to add a new record.'}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            className="p-6 md:p-8 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map(f => (
                <div key={f.key} className={f.type === 'textarea' || f.type === 'staff_contacts' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">
                    {f.label}{f.required && <span className="text-primary"> *</span>}
                  </label>

                  {f.type === 'textarea' ? (
                    <>
                      <textarea
                        maxLength={250}
                        value={String(formData[f.key] || '')}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, [f.key]: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                        placeholder={`Enter ${f.label.toLowerCase()}... (Max 250 chars)`}
                      />
                      <p className="text-right text-[10px] text-text-muted mt-1">{String(formData[f.key] || '').length}/250</p>
                    </>
                  ) : f.type === 'select' && f.options ? (
                    <select
                      value={String(formData[f.key] || '')}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    >
                      <option value="">Select {f.label}...</option>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === 'image' ? (
                    <div className="space-y-2">
                      {Boolean(formData[f.key]) && typeof formData[f.key] === 'string' && (
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border">
                          <img src={formData[f.key] as string} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setFormData({ ...formData, [f.key]: '' })} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, f.key)}
                          disabled={uploadingImages[f.key]}
                          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                        />
                        {uploadingImages[f.key] && (
                          <div className="absolute inset-y-0 right-4 flex items-center">
                            <Loader2 className="w-5 h-5 text-primary animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : f.type === 'checkbox' ? (
                    <div className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        id={f.key}
                        checked={!!formData[f.key]}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [f.key]: e.target.checked })}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                      />
                      <span className="text-sm text-text-muted">Enable {f.label.toLowerCase()}</span>
                    </div>
                  ) : f.type === 'staff_contacts' ? (
                    <div className="space-y-3">
                      {((formData[f.key] as any[]) || []).map((contact, index) => (
                        <div key={index} className="p-4 border border-border rounded-xl bg-surface relative shadow-sm">
                          <button type="button" onClick={() => {
                            const newContacts = [...((formData[f.key] as any[]) || [])];
                            newContacts.splice(index, 1);
                            setFormData({ ...formData, [f.key]: newContacts });
                          }} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                            <input type="text" placeholder="Name" value={contact.name || ''} onChange={e => {
                              const newContacts = [...((formData[f.key] as any[]) || [])];
                              newContacts[index] = { ...contact, name: e.target.value };
                              setFormData({ ...formData, [f.key]: newContacts });
                            }} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                            <input type="text" placeholder="Role (e.g. Professor)" value={contact.role || ''} onChange={e => {
                              const newContacts = [...((formData[f.key] as any[]) || [])];
                              newContacts[index] = { ...contact, role: e.target.value };
                              setFormData({ ...formData, [f.key]: newContacts });
                            }} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                            <input type="text" placeholder="Department" value={contact.department || ''} onChange={e => {
                              const newContacts = [...((formData[f.key] as any[]) || [])];
                              newContacts[index] = { ...contact, department: e.target.value };
                              setFormData({ ...formData, [f.key]: newContacts });
                            }} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                            <input type="text" placeholder="Phone" value={contact.phone || ''} onChange={e => {
                              const newContacts = [...((formData[f.key] as any[]) || [])];
                              newContacts[index] = { ...contact, phone: e.target.value };
                              setFormData({ ...formData, [f.key]: newContacts });
                            }} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none" />
                            <input type="email" placeholder="Email" value={contact.email || ''} onChange={e => {
                              const newContacts = [...((formData[f.key] as any[]) || [])];
                              newContacts[index] = { ...contact, email: e.target.value };
                              setFormData({ ...formData, [f.key]: newContacts });
                            }} className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none sm:col-span-2" />
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => {
                        const newContacts = [...((formData[f.key] as any[]) || []), { name: '', role: '', department: '', phone: '', email: '' }];
                        setFormData({ ...formData, [f.key]: newContacts });
                      }} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors cursor-pointer w-full justify-center">
                        <Plus className="w-4 h-4" /> Add Staff / Professor
                      </button>
                    </div>
                  ) : (
                    <input
                      type={f.type || 'text'}
                      value={String(formData[f.key] || '')}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [f.key]: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder={`Enter ${f.label.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-surface border border-border transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ─────────────── LIST PAGE ─────────────── */
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-text-primary">{MODULE_LABELS[moduleKey]}</h1><p className="text-text-muted text-sm mt-1">{items.length} items</p></div>
        {canEdit && <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-md active:scale-95"><Plus className="w-4 h-4" /> Add New</button>}
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : (
        <div className="bg-white/50 rounded-2xl border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead><tr className="bg-surface/50 border-b border-border">
              {columns.map(c => <th key={c.key} className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">{c.label}</th>)}
              {(canEdit || canManage) && <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>}
            </tr></thead>
            <tbody className="divide-y divide-border">
              {items.filter(item => {
                if (!searchVal) return true;
                const q = searchVal.toLowerCase();
                return Object.keys(item).some(key => {
                  const val = item[key];
                  if (typeof val === 'string') return val.toLowerCase().includes(q);
                  return false;
                });
              }).map(item => (
                <tr key={item.id as string} className="hover:bg-surface transition-colors">
                  {columns.map(c => <td key={c.key} className="px-5 py-4 text-sm text-text-primary max-w-[200px] truncate">{String(item[c.key] || '-')}</td>)}
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
    </div>
  );
}
