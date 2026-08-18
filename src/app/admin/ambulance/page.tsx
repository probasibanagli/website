'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Ambulance } from '@/types';
import { Plus, Pencil, Trash2, X, Loader2, Shield, Truck, Upload, Phone, Globe, MapPin, ArrowLeft, Save } from 'lucide-react';
import { CITIES } from '@/lib/constants';

function AmbulancePageContent() {
  const { profile, firebaseUser } = useAuth();
  
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [cityFilter, setCityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const moduleKey = 'ambulance';
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
      const snap = await getDocs(collection(db, COLLECTIONS.ambulances || 'ambulances'));
      setAmbulances(snap.docs.map(d => ({ id: d.id, ...d.data() } as Ambulance)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this ambulance listing?')) return;
    setAmbulances(prev => prev.filter(item => item.id !== id));
    deleteDoc(doc(db, COLLECTIONS.ambulances || 'ambulances', id)).catch(e => console.error(e));
  }

  function handleCsvImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      try {
        setLoading(true);
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

        if (lines.length < 2) {
          alert('Invalid CSV file or empty data.');
          return;
        }

        const headers = lines[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
        
        let nameIdx = headers.findIndex(h => h.includes('name') || h.includes('title') || h.includes('provider') || h.includes('service'));
        let cityIdx = headers.findIndex(h => h.includes('district') || h.includes('city') || h.includes('route') || h.includes('area'));
        let addressIdx = headers.findIndex(h => h.includes('address') || h.includes('location') || h.includes('details'));
        let phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('contact') || h.includes('number'));
        let subCategoryIdx = headers.findIndex(h => h.includes('subcategory') || h.includes('sub-category') || h.includes('sub'));
        let typeModeIdx = headers.findIndex(h => h.includes('typemode') || h.includes('type/mode') || h.includes('mode'));
        let notesIdx = headers.findIndex(h => h.includes('notes') || h.includes('source') || h.includes('sourcenotes') || h.includes('source/notes'));

        if (nameIdx === -1) {
          console.warn("Could not match columns by header name, falling back to standard column positions.");
          subCategoryIdx = 0;
          nameIdx = 1;
          cityIdx = 2;
          phoneIdx = 3;
          typeModeIdx = 4;
          addressIdx = 5;
          notesIdx = 6;
        }

        const newItems: Ambulance[] = [];
        const now = new Date().toISOString();

        for (let i = 1; i < lines.length; i++) {
          const r = lines[i];
          const name = nameIdx !== -1 && r[nameIdx] ? r[nameIdx] : '';
          if (!name) continue;

          const rawCity = cityIdx !== -1 && r[cityIdx] ? r[cityIdx] : '';
          let matchedCity = CITIES.find(c => rawCity.toLowerCase().includes(c.toLowerCase())) || 'Chennai';

          const itemData: Ambulance = {
            id: `amb-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
            name,
            sub_category: subCategoryIdx !== -1 && r[subCategoryIdx] ? r[subCategoryIdx] : '',
            type_mode: typeModeIdx !== -1 && r[typeModeIdx] ? r[typeModeIdx] : '',
            city: matchedCity,
            phone: phoneIdx !== -1 && r[phoneIdx] ? r[phoneIdx] : '',
            address: addressIdx !== -1 && r[addressIdx] ? r[addressIdx] : '',
            source_notes: notesIdx !== -1 && r[notesIdx] ? r[notesIdx] : '',
            created_at: now,
            updated_at: now,
          };

          newItems.push(itemData);
        }

        if (newItems.length === 0) {
          alert('No valid rows found in CSV file.');
          return;
        }

        setAmbulances(prev => [...newItems, ...prev]);

        for (const item of newItems) {
          await setDoc(doc(db, COLLECTIONS.ambulances || 'ambulances', item.id), item);
        }

        alert(`Successfully imported ${newItems.length} ambulance records!`);
      } catch (err) {
        console.error(err);
        alert('Error parsing CSV file. Please make sure format is valid.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  }

  function openAdd() {
    setEditId(null);
    setFormData({});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openEdit(item: Ambulance) {
    setEditId(item.id);
    setFormData({ ...item });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave() {
    if (!formData.name || !formData.city) {
      alert('Name and City are required fields.');
      return;
    }
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload = {
        ...formData,
        id: editId || `amb-${Date.now()}`,
        updated_at: now,
        created_at: formData.created_at || now,
      };

      if (editId) {
        setAmbulances(prev => prev.map(item => item.id === editId ? payload : item));
      } else {
        setAmbulances(prev => [payload, ...prev]);
      }

      setShowForm(false);
      setSaving(false);

      if (editId) {
        await updateDoc(doc(db, COLLECTIONS.ambulances || 'ambulances', editId), { ...payload });
      } else {
        await setDoc(doc(db, COLLECTIONS.ambulances || 'ambulances', payload.id), { ...payload });
      }
    } catch (e) {
      console.error(e);
      alert('Error saving ambulance details.');
      setSaving(false);
    }
  }

  const filtered = ambulances
    .filter(item => {
      const matchCity = !cityFilter || item.city === cityFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery = !searchQuery || 
        (item.name || '').toLowerCase().includes(q) ||
        (item.address || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q) ||
        (item.sub_category || '').toLowerCase().includes(q);
      return matchCity && matchQuery;
    })
    .sort((a, b) => {
      return (a.name || '').localeCompare(b.name || '');
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
              {editId ? 'Edit Ambulance Details' : 'Add New Ambulance Service'}
            </h1>
            <p className="text-text-muted text-sm mt-0.5">Fill in the fields below to update directories.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <form className="p-6 md:p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Ambulance Name *</label>
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
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone *</label>
                <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Sub-Category</label>
                <input type="text" value={formData.sub_category || ''} onChange={e => setFormData({...formData, sub_category: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Private Ambulance" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Type/Mode</label>
                <input type="text" value={formData.type_mode || ''} onChange={e => setFormData({...formData, type_mode: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Road ALS/BLS" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Source/Notes</label>
                <input type="text" value={formData.source_notes || ''} onChange={e => setFormData({...formData, source_notes: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. GVK EMRI operated" />
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
            <Truck className="w-6 h-6 text-primary" /> Ambulance Management
          </h1>
          <p className="text-text-muted text-sm mt-1">Manage Ambulance directories and emergency contacts</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {canEdit && (
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border hover:bg-border/50 text-text-primary rounded-xl text-sm font-medium transition-colors shadow-sm active:scale-95 cursor-pointer">
              <Upload className="w-4 h-4 text-primary" /> Import CSV
              <input type="file" accept=".csv" onChange={handleCsvImport} className="hidden" />
            </label>
          )}
          {canEdit && (
            <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors shadow-md active:scale-95 cursor-pointer">
              <Plus className="w-4 h-4" /> Add New Ambulance
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-border shadow-sm">
        <div className="w-full sm:max-w-xs">
          <input 
            type="text" 
            placeholder="Search name or address..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:max-w-xs">
          <label className="text-sm font-bold text-text-primary whitespace-nowrap">Filter City:</label>
          <select 
            value={cityFilter} 
            onChange={e => setCityFilter(e.target.value)} 
            className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm cursor-pointer"
          >
            <option value="">All Cities</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
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
                  <th className="p-4">Ambulance Service Name</th>
                  <th className="p-4">Sub-Category</th>
                  <th className="p-4">Type/Mode</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Address</th>
                  {canEdit && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text-primary">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                    <td className="p-4 font-bold">
                      <div>{item.name}</div>
                      {item.source_notes && (
                        <div className="text-[10px] font-normal text-text-muted mt-0.5" title="Source/Notes">
                          Note: {item.source_notes}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {item.sub_category || <span className="text-text-muted text-xs">-</span>}
                    </td>
                    <td className="p-4 text-xs font-semibold">{item.type_mode || '-'}</td>
                    <td className="p-4">{item.city}</td>
                    <td className="p-4 font-semibold text-text-primary">{item.phone || '-'}</td>
                     <td className="p-4 max-w-[240px] whitespace-normal break-words" title={item.address}>
                      <div className="line-clamp-2">
                        {item.address || '-'}
                      </div>
                    </td>
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
                    <td colSpan={canEdit ? 7 : 6} className="p-8 text-center text-text-muted">No ambulances found.</td>
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

export default function AdminAmbulancePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-border">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-text-muted text-sm font-medium">Loading ambulance panel...</p>
      </div>
    }>
      <AmbulancePageContent />
    </Suspense>
  );
}
