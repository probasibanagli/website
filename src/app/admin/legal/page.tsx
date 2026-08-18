'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { LegalServiceItem, LegalAidCentre, LegalHelpline, LegalCategory, LegalPortal } from '@/types';
import { Plus, Pencil, Trash2, X, Loader2, Shield, Scale, MapPin, PhoneCall, Globe, BookOpen, ArrowLeft, Save } from 'lucide-react';

function LegalPageContent() {
  const { profile } = useAuth();
  
  const [items, setItems] = useState<LegalServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'centre' | 'helpline' | 'category' | 'portal'>('centre');
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const moduleKey = 'legal';
  const canView = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'view');
  const canEdit = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'edit');

  useEffect(() => {
    if (canView) {
      loadData();
    }
  }, [canView]);

  async function loadData() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.legal || 'legal_services'));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as LegalServiceItem)));
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditId(null);
    setFormData({ type: activeTab });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openEdit(item: LegalServiceItem) {
    setEditId(item.id);
    setFormData({ ...item });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload = {
        ...formData,
        id: editId || `legal-${Date.now()}`,
        updated_at: now,
        created_at: formData.created_at || now,
      };

      if (editId) {
        setItems(prev => prev.map(item => item.id === editId ? payload : item));
      } else {
        setItems(prev => [payload, ...prev]);
      }

      setShowForm(false);
      setSaving(false);

      if (editId) {
        await updateDoc(doc(db, COLLECTIONS.legal || 'legal_services', editId), { ...payload });
      } else {
        await setDoc(doc(db, COLLECTIONS.legal || 'legal_services', payload.id), { ...payload });
      }
    } catch (e) {
      console.error(e);
      alert('Error saving legal record.');
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      setItems(prev => prev.filter(i => i.id !== id));
      await deleteDoc(doc(db, COLLECTIONS.legal || 'legal_services', id));
    } catch (e) {
      console.error(e);
      alert('Error deleting record.');
    }
  }

  if (!canView) return (
    <div className="text-center py-20"><Shield className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-text-primary mb-2">No Access</h2><p className="text-text-muted">You don't have permission to access this module.</p></div>
  );

  const filteredItems = items.filter(i => i.type === activeTab);

  if (showForm) {
    return (
      <div className="space-y-6 animate-fade-in">
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
              {editId ? 'Edit Record' : 'Add New Record'}
            </h1>
            <p className="text-text-muted text-sm mt-0.5">Editing {activeTab} details</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <form className="p-6 md:p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {activeTab === 'centre' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Name *</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">City *</label>
                  <input type="text" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">District</label>
                  <input type="text" value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone</label>
                  <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Timings</label>
                  <input type="text" value={formData.timings || ''} onChange={e => setFormData({...formData, timings: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Centre Type</label>
                  <input type="text" value={formData.centre_type || ''} onChange={e => setFormData({...formData, centre_type: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Address</label>
                  <input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                {Boolean(formData.address && formData.address.trim()) && (
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Pincode</label>
                    <input type="text" maxLength={6} value={formData.pincode || ''} onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 600001" />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'helpline' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Label *</label>
                  <input type="text" value={formData.label || ''} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Number *</label>
                  <input type="text" value={formData.number || ''} onChange={e => setFormData({...formData, number: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Color Classes (Tailwind)</label>
                  <input type="text" value={formData.color || ''} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
              </div>
            )}

            {activeTab === 'portal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Label *</label>
                  <input type="text" value={formData.label || ''} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Icon Name (Lucide)</label>
                  <input type="text" value={formData.icon_name || ''} onChange={e => setFormData({...formData, icon_name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">URL *</label>
                  <input type="text" value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Description</label>
                  <input type="text" value={formData.desc || ''} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
              </div>
            )}

            {activeTab === 'category' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Label *</label>
                  <input type="text" value={formData.label || ''} onChange={e => setFormData({...formData, label: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Color mapping</label>
                  <select value={formData.color || 'blue'} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm">
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="amber">Amber</option>
                    <option value="red">Red</option>
                    <option value="slate">Slate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Icon Name (Lucide)</label>
                  <input type="text" value={formData.icon_name || ''} onChange={e => setFormData({...formData, icon_name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Description</label>
                  <textarea maxLength={250} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" rows={2} placeholder="(Max 250 characters)" />
                  <p className="text-right text-[10px] text-text-muted mt-1">{(formData.description || '').length}/250</p>
                </div>
                <div className="md:col-span-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-xs text-yellow-800">Advanced fields like Steps, Portals and nested Helplines editing are partially supported here in the simple editor. In a full version, dynamic arrays would be built here. For now, they are preserved when editing.</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-surface border border-border transition-colors cursor-pointer">Cancel</button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" /> Legal Services Management
          </h1>
          <p className="text-text-muted text-sm mt-1">Manage legal aid centres, helplines, categories, and portals.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {canEdit && (
            <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors shadow-md active:scale-95 cursor-pointer">
              <Plus className="w-4 h-4" /> Add New Record
            </button>
          )}
        </div>
      </div>

      <div className="flex border-b border-border overflow-x-auto">
        {[
          { id: 'centre', label: 'Legal Aid Centres', icon: MapPin },
          { id: 'category', label: 'Legal Rights', icon: BookOpen },
          { id: 'helpline', label: 'Emergency Helplines', icon: PhoneCall },
          { id: 'portal', label: 'Important Portals', icon: Globe },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/50 text-text-muted text-xs font-bold uppercase tracking-wider">
                  {activeTab === 'centre' && (
                    <>
                      <th className="p-4">Name</th>
                      <th className="p-4">City/District</th>
                      <th className="p-4">Contact & Timings</th>
                    </>
                  )}
                  {activeTab === 'category' && (
                    <>
                      <th className="p-4">Label</th>
                      <th className="p-4">Icon & Color</th>
                      <th className="p-4">Description</th>
                    </>
                  )}
                  {activeTab === 'helpline' && (
                    <>
                      <th className="p-4">Label</th>
                      <th className="p-4">Number</th>
                    </>
                  )}
                  {activeTab === 'portal' && (
                    <>
                      <th className="p-4">Label</th>
                      <th className="p-4">URL</th>
                    </>
                  )}
                  {canEdit && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text-primary">
                {filteredItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                    {activeTab === 'centre' && (
                      <>
                        <td className="p-4 font-bold">{item.name} <span className="block text-xs font-normal text-text-muted mt-1">{item.centre_type}</span></td>
                        <td className="p-4">{item.city} {item.district && `(${item.district})`}</td>
                        <td className="p-4 text-xs">
                          {item.phone && <div className="font-semibold">{item.phone}</div>}
                          {item.timings && <div className="text-text-muted mt-0.5">{item.timings}</div>}
                        </td>
                      </>
                    )}
                    {activeTab === 'category' && (
                      <>
                        <td className="p-4 font-bold">{item.label}</td>
                        <td className="p-4 text-xs font-mono">{item.icon_name} ({item.color})</td>
                        <td className="p-4 text-xs max-w-xs truncate">{item.description}</td>
                      </>
                    )}
                    {activeTab === 'helpline' && (
                      <>
                        <td className="p-4 font-bold">{item.label}</td>
                        <td className="p-4 font-mono font-bold text-primary">{item.number}</td>
                      </>
                    )}
                    {activeTab === 'portal' && (
                      <>
                        <td className="p-4 font-bold">{item.label}</td>
                        <td className="p-4 text-xs text-blue-600 hover:underline max-w-[200px] truncate">
                          <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
                        </td>
                      </>
                    )}
                    {canEdit && (
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openEdit(item)} className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer" title="Edit"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 5 : 4} className="p-8 text-center text-text-muted">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminLegalServicesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-border">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-text-muted text-sm font-medium">Loading legal services panel...</p>
      </div>
    }>
      <LegalPageContent />
    </Suspense>
  );
}
