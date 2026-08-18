'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { collection, getDocs, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { BloodBank } from '@/types';
import { Plus, Pencil, Trash2, X, Loader2, Shield, Droplets, Upload, Phone, Globe, MapPin, ArrowLeft, Save, Search } from 'lucide-react';
import { CITIES } from '@/lib/constants';
import * as XLSX from 'xlsx';
import { AlertPopup } from '@/components/ui/AlertPopup';
import { createPortal } from 'react-dom';

function BloodBankPageContent() {
  const { profile, firebaseUser } = useAuth();
  
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [cityFilter, setCityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const moduleKey = 'blood_bank';
  const canView = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'view');
  const canEdit = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'edit');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!canView) return;

    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, COLLECTIONS.blood_banks || 'blood_banks'),
      (snap) => {
        setBloodBanks(snap.docs.map(d => ({ id: d.id, ...d.data() } as BloodBank)));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [canView]);

  // Removed loadData in favor of onSnapshot listener

  function parseCsvText(text: string): string[][] {
    const lines: string[][] = [];
    let row: string[] = [];
    let inQuotes = false;
    let currentValue = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(currentValue.trim());
        currentValue = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++;
        row.push(currentValue.trim());
        if (row.some(val => val !== '')) {
          lines.push(row);
        }
        row = [];
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    if (currentValue || row.length > 0) {
      row.push(currentValue.trim());
      lines.push(row);
    }
    return lines;
  }

  async function processImportRows(lines: any[][]) {
    try {
      setLoading(true);
      if (lines.length < 2) {
        showAlert('Invalid file or empty data.', 'error');
        return;
      }

      const headers = lines[0].map(h => String(h || '').toLowerCase().replace(/[^a-z0-9]/g, ''));
      let nameIdx = headers.findIndex(h => h.includes('name') || h.includes('title') || h.includes('hospital') || h.includes('bloodbank'));
      let cityIdx = headers.findIndex(h => h.includes('district') || h.includes('city') || h.includes('area') || h.includes('location'));
      let addressIdx = headers.findIndex(h => h.includes('address') || h.includes('details'));
      let phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('contact') || h.includes('number'));
      let mapIdx = headers.findIndex(h => h.includes('map') || h.includes('google') || h.includes('link') || h.includes('url'));
      let websiteIdx = headers.findIndex(h => h.includes('website') || h.includes('site') || h.includes('web'));

      if (nameIdx === -1) {
        nameIdx = 0;
        cityIdx = 1;
        phoneIdx = 2;
        addressIdx = 3;
      }

      const newItems: BloodBank[] = [];
      const now = new Date().toISOString();

      for (let i = 1; i < lines.length; i++) {
        const r = lines[i];
        const name = nameIdx !== -1 && r[nameIdx] ? String(r[nameIdx]) : '';
        if (!name) continue;

        const rawCity = cityIdx !== -1 && r[cityIdx] ? String(r[cityIdx]) : '';
        let matchedCity = CITIES.find(c => rawCity.toLowerCase().includes(c.toLowerCase())) || 'Chennai';

        const itemData: BloodBank = {
          id: `bb-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          name,
          city: matchedCity,
          phone: phoneIdx !== -1 && r[phoneIdx] ? String(r[phoneIdx]) : '',
          address: addressIdx !== -1 && r[addressIdx] ? String(r[addressIdx]) : '',
          available_groups: [],
          google_maps_url: mapIdx !== -1 && r[mapIdx] ? String(r[mapIdx]) : '',
          website: websiteIdx !== -1 && r[websiteIdx] ? String(r[websiteIdx]) : '',
          created_at: now,
          updated_at: now,
        };

        newItems.push(itemData);
      }

      if (newItems.length === 0) {
        showAlert('No valid rows found in file.', 'warning');
        return;
      }

      setBloodBanks(prev => [...newItems, ...prev]);

      for (const item of newItems) {
        await setDoc(doc(db, COLLECTIONS.blood_banks || 'blood_banks', item.id), item);
      }

      showAlert(`Successfully imported ${newItems.length} blood bank records!`, 'success');
    } catch (err) {
      console.error(err);
      showAlert('Error parsing file. Please make sure format is valid.', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isXlsx = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    const reader = new FileReader();

    if (isXlsx) {
      reader.onload = async (evt) => {
        try {
          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          await processImportRows(rows);
        } catch (err) {
          console.error(err);
          showAlert('Failed to read Excel file.', 'error');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = async (evt) => {
        const text = evt.target?.result as string;
        if (!text) return;
        const rows = parseCsvText(text);
        await processImportRows(rows);
      };
      reader.readAsText(file);
    }
  }

  function openAdd() {
    setEditId(null);
    setFormData({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openEdit(bank: BloodBank) {
    setEditId(bank.id);
    setFormData({ ...bank });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave() {
    if (!formData.name || !formData.city) {
      showAlert('Name and City are required fields.', 'warning');
      return;
    }
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload = {
        ...formData,
        id: editId || `bb-${Date.now()}`,
        updated_at: now,
        created_at: formData.created_at || now,
      };

      if (editId) {
        setBloodBanks(prev => prev.map(item => item.id === editId ? payload : item));
      } else {
        setBloodBanks(prev => [payload, ...prev]);
      }

      setShowForm(false);
      setSaving(false);

      if (editId) {
        await updateDoc(doc(db, COLLECTIONS.blood_banks || 'blood_banks', editId), { ...payload });
      } else {
        await setDoc(doc(db, COLLECTIONS.blood_banks || 'blood_banks', payload.id), { ...payload });
      }
    } catch (e) {
      console.error(e);
      showAlert('Error saving blood bank.', 'error');
      setSaving(false);
    }
  }

  function handleDelete(id: string) {
    setDeleteId(id);
  }

  function executeDelete() {
    if (!deleteId) return;
    setBloodBanks(prev => prev.filter(i => i.id !== deleteId));
    deleteDoc(doc(db, COLLECTIONS.blood_banks || 'blood_banks', deleteId))
      .then(() => {
        showAlert('Blood bank deleted successfully.', 'success');
      })
      .catch(e => {
        console.error(e);
        showAlert('Error deleting blood bank.', 'error');
      });
    setDeleteId(null);
  }

  const filtered = bloodBanks.filter(b => {
    if (cityFilter && b.city !== cityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.name?.toLowerCase().includes(q) || b.address?.toLowerCase().includes(q);
    }
    return true;
  });

  if (!canView) return (
    <div className="text-center py-20"><Shield className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-text-primary mb-2">No Access</h2><p className="text-text-muted">You don't have permission to access this module.</p></div>
  );

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
              {editId ? 'Edit Blood Bank' : 'Add New Blood Bank'}
            </h1>
            <p className="text-text-muted text-sm mt-0.5">Fill in the fields below to update directories.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <form className="p-6 md:p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Blood Bank Name *</label>
                <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">City *</label>
                <select value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                  <option value="">Select City...</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone</label>
                <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Website</label>
                <input type="text" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Full Address</label>
                <input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
              </div>
              {Boolean(formData.address && formData.address.trim()) && (
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-1.5">Pincode</label>
                  <input type="text" maxLength={6} value={formData.pincode || ''} onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 600001" />
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Google Maps Link</label>
                <input type="text" value={formData.google_maps_url || ''} onChange={e => setFormData({...formData, google_maps_url: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
              </div>
            </div>
            
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
            <Droplets className="w-6 h-6 text-primary" /> Blood Bank Management
          </h1>
          <p className="text-text-muted text-sm mt-1">Manage Blood Bank directories and contact details</p>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border hover:bg-border/50 text-text-primary rounded-xl text-sm font-medium transition-colors shadow-sm active:scale-95 cursor-pointer">
              <Upload className="w-4 h-4 text-primary" /> Import File
              <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileImport} className="hidden" />
            </label>
          )}
          {canEdit && (
            <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors shadow-md active:scale-95 cursor-pointer">
              <Plus className="w-4 h-4" /> Add New Blood Bank
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1 min-w-[200px] w-full md:w-auto">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search blood banks by name or area..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <select 
          value={cityFilter} 
          onChange={e => setCityFilter(e.target.value)} 
          className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-border text-sm bg-surface cursor-pointer hover:border-primary/50 transition-colors outline-none focus:border-primary min-w-[140px]"
        >
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
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
                  <th className="p-4">Blood Bank Name</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Address</th>
                  {canEdit && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text-primary">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                    <td className="p-4 font-bold">{item.name}</td>
                    <td className="p-4">{item.city}</td>
                    <td className="p-4 font-semibold text-text-primary">{item.phone || '-'}</td>
                    <td className="p-4 max-w-xs truncate" title={item.address}>{item.address || '-'}</td>
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
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 5 : 4} className="p-8 text-center text-text-muted">No blood banks found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AlertPopup 
        isOpen={alertOpen} 
        message={alertMessage} 
        type={alertType} 
        onClose={() => setAlertOpen(false)} 
      />

      {deleteId && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-sm overflow-hidden rounded-[32px] bg-white border border-black/5 shadow-2xl z-10 p-8 pt-10 text-center animate-slide-up">
            <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-neutral-900">Confirm Delete</h3>
            <p className="mb-6 text-neutral-500 text-sm">Are you sure you want to delete this blood bank listing?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteId(null)} 
                className="flex-1 py-3 px-4 rounded-xl border border-border text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete} 
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all active:scale-95 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function AdminBloodBankPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-border">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-text-muted text-sm font-medium">Loading blood bank panel...</p>
      </div>
    }>
      <BloodBankPageContent />
    </Suspense>
  );
}
