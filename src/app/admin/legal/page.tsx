'use client';

import React, { useEffect, useState, Suspense, useMemo } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { LegalServiceListing } from '@/types';
import { INITIAL_LEGAL_SERVICES, LEGAL_CATEGORIES } from '@/data/legal-services-data';
import {
  Plus, Pencil, Trash2, X, Loader2, Shield, Scale, MapPin, PhoneCall,
  Globe, BookOpen, ArrowLeft, Save, Upload, Download, Search, CheckCircle2,
  Mail, Clock, Building, Landmark, Gavel, Users
} from 'lucide-react';
import { CITIES } from '@/lib/constants';

function LegalAdminContent() {
  const { profile } = useAuth();
  
  const [items, setItems] = useState<LegalServiceListing[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<LegalServiceListing>>({});
  const [saving, setSaving] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

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
      if (!snap.empty) {
        const fetched = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as any))
          .filter(i => i.name && i.category && !i.type);
        
        if (fetched.length > 0) {
          setItems(fetched);
          return;
        }
      }
      // If Firestore is empty, initialize with default seed data
      setItems(INITIAL_LEGAL_SERVICES);
    } catch (e: any) {
      console.error('Error loading legal services:', e);
      setItems(INITIAL_LEGAL_SERVICES);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditId(null);
    setFormData({
      category: 'Legal Services Authority',
      city: 'Chennai',
      verified: true
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openEdit(item: LegalServiceListing) {
    setEditId(item.id);
    setFormData({ ...item });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave() {
    if (!formData.name?.trim()) {
      alert('Office Name is required.');
      return;
    }
    if (!formData.category?.trim()) {
      alert('Category is required.');
      return;
    }
    if (!formData.address?.trim()) {
      alert('Address is required.');
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload: LegalServiceListing = {
        id: editId || `legal-${Date.now()}`,
        name: formData.name.trim(),
        category: formData.category.trim(),
        address: formData.address.trim(),
        city: formData.city?.trim() || '',
        district: formData.district?.trim() || formData.city?.trim() || '',
        phone: formData.phone?.trim() || '',
        email: formData.email?.trim() || '',
        website: formData.website?.trim() || '',
        google_maps_url: formData.google_maps_url?.trim() || '',
        timings: formData.timings?.trim() || '',
        description: formData.description?.trim() || '',
        verified: formData.verified !== false,
        created_at: formData.created_at || now,
        updated_at: now,
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
    if (!confirm('Are you sure you want to delete this legal office record?')) return;
    try {
      setItems(prev => prev.filter(i => i.id !== id));
      await deleteDoc(doc(db, COLLECTIONS.legal || 'legal_services', id));
    } catch (e) {
      console.error(e);
      alert('Error deleting record.');
    }
  }

  /* ─── CSV Import Handler ─── */
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
        
        let catIdx = headers.findIndex(h => h.includes('category') || h.includes('type'));
        let nameIdx = headers.findIndex(h => h.includes('name') || h.includes('office') || h.includes('court'));
        let addrIdx = headers.findIndex(h => h.includes('address') || h.includes('location'));
        let phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('contact') || h.includes('mobile') || h.includes('helpline'));
        let emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));
        let webIdx = headers.findIndex(h => h.includes('web') || h.includes('url') || h.includes('portal') || h.includes('link'));

        if (nameIdx === -1) {
          catIdx = 0;
          nameIdx = 1;
          addrIdx = 2;
          phoneIdx = 3;
          emailIdx = 4;
          webIdx = 5;
        }

        const newItems: LegalServiceListing[] = [];
        const now = new Date().toISOString();

        for (let i = 1; i < lines.length; i++) {
          const r = lines[i];
          const name = nameIdx !== -1 && r[nameIdx] ? r[nameIdx] : '';
          if (!name) continue;

          const address = addrIdx !== -1 && r[addrIdx] ? r[addrIdx] : '';
          const category = catIdx !== -1 && r[catIdx] ? r[catIdx] : 'Legal Services Authority';
          
          // Auto-detect city & district from address/name
          let city = 'Chennai';
          for (const c of CITIES) {
            if (address.toLowerCase().includes(c.toLowerCase()) || name.toLowerCase().includes(c.toLowerCase())) {
              city = c;
              break;
            }
          }
          if (name.includes('Ariyalur') || address.includes('Ariyalur')) city = 'Ariyalur';
          if (name.includes('Jayankondam') || address.includes('Jayankondam')) city = 'Jayankondam';
          if (name.includes('Sendurai') || address.includes('Sendurai')) city = 'Sendurai';
          if (name.includes('Cuddalore') || address.includes('Cuddalore')) city = 'Cuddalore';
          if (name.includes('Dharmapuri') || address.includes('Dharmapuri')) city = 'Dharmapuri';
          if (name.includes('Erode') || address.includes('Erode')) city = 'Erode';
          if (name.includes('Kanniyakumari') || name.includes('Nagercoil') || address.includes('Nagercoil')) city = 'Nagercoil';
          if (name.includes('Karur') || address.includes('Karur')) city = 'Karur';
          if (name.includes('Mayiladuthurai') || address.includes('Mayiladuthurai')) city = 'Mayiladuthurai';
          if (name.includes('Nagapattinam') || address.includes('Nagapattinam')) city = 'Nagapattinam';
          if (name.includes('Pudukkottai') || address.includes('Pudukkottai')) city = 'Pudukkottai';
          if (name.includes('Salem') || address.includes('Salem')) city = 'Salem';
          if (name.includes('Sivagangai') || address.includes('Sivagangai')) city = 'Sivagangai';

          const itemData: LegalServiceListing = {
            id: `legal-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
            name,
            category,
            address,
            city,
            district: city,
            phone: phoneIdx !== -1 && r[phoneIdx] ? r[phoneIdx] : '',
            email: emailIdx !== -1 && r[emailIdx] ? r[emailIdx] : '',
            website: webIdx !== -1 && r[webIdx] ? r[webIdx] : '',
            timings: '10:00 AM - 5:00 PM (Mon - Fri)',
            verified: true,
            created_at: now,
            updated_at: now,
          };

          newItems.push(itemData);
        }

        if (newItems.length === 0) {
          alert('No valid rows found in CSV.');
          return;
        }

        setItems(prev => [...newItems, ...prev]);

        for (const item of newItems) {
          await setDoc(doc(db, COLLECTIONS.legal || 'legal_services', item.id), item);
        }

        alert(`Successfully imported ${newItems.length} legal records!`);
      } catch (err) {
        console.error('CSV import error:', err);
        alert('Error parsing CSV file. Please verify formatting.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  }

  /* ─── CSV Export Handler ─── */
  function handleCsvExport() {
    const headers = ['Category', 'Office Name', 'Address', 'City', 'District', 'Phone', 'Email', 'Website', 'Timings', 'Verified'];
    const rows = items.map(item => [
      `"${(item.category || '').replace(/"/g, '""')}"`,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.address || '').replace(/"/g, '""')}"`,
      `"${(item.city || '').replace(/"/g, '""')}"`,
      `"${(item.district || '').replace(/"/g, '""')}"`,
      `"${(item.phone || '').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${(item.website || '').replace(/"/g, '""')}"`,
      `"${(item.timings || '').replace(/"/g, '""')}"`,
      item.verified !== false ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `legal_services_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filtered List
  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchCat = !categoryFilter || item.category === categoryFilter;
      const matchCity = !cityFilter || item.city === cityFilter || item.district === cityFilter;
      
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        (item.city || '').toLowerCase().includes(q) ||
        (item.district || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q) ||
        (item.email || '').toLowerCase().includes(q);

      return matchCat && matchCity && matchQuery;
    });
  }, [items, categoryFilter, cityFilter, searchQuery]);

  // Unique list of cities/districts for filter
  const allLocations = useMemo(() => {
    const locs = new Set<string>();
    items.forEach(i => {
      if (i.city) locs.add(i.city);
      if (i.district) locs.add(i.district);
    });
    return Array.from(locs).sort();
  }, [items]);

  if (!canView) {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-text-primary mb-2">No Access</h2>
        <p className="text-text-muted">You don't have permission to access the Legal Services module.</p>
      </div>
    );
  }

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
              {editId ? 'Edit Legal Service Office' : 'Add New Legal Office / Authority'}
            </h1>
            <p className="text-text-muted text-sm mt-0.5">
              Fill in the fields below with office details, contacts, and jurisdiction.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <form className="p-6 md:p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Office / Court Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Office / Court / Authority Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Madras High Court (Principal Bench) or District Legal Services Authority - Chennai"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Category *
                </label>
                <select
                  required
                  value={formData.category || ''}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="">Select Category...</option>
                  <option value="Judiciary - High Court">Judiciary - High Court</option>
                  <option value="Legal Services Authority">Legal Services Authority</option>
                  <option value="Bar Council">Bar Council</option>
                  <option value="Government - Law Department">Government - Law Department</option>
                  <option value="Legal Education">Legal Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  City / Taluk
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chennai, Madurai, Coimbatore, Ariyalur"
                  value={formData.city || ''}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  District
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chennai, Madurai, Coimbatore"
                  value={formData.district || ''}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Phone / Helplines */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Phone / Helpline Numbers
                </label>
                <input
                  type="text"
                  placeholder="e.g. 044-25301000 or Toll-free 15100"
                  value={formData.phone || ''}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Official Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. regrgenl@nic.in or tnslsa@gmail.com"
                  value={formData.email || ''}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Website URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://hcmadras.tn.gov.in or tnlegalservices.tn.gov.in"
                  value={formData.website || ''}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Timings */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Working Hours / Timings
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM - 5:45 PM (Mon - Fri)"
                  value={formData.timings || ''}
                  onChange={e => setFormData({ ...formData, timings: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Google Maps Link */}
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Google Maps URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://maps.google.com/..."
                  value={formData.google_maps_url || ''}
                  onChange={e => setFormData({ ...formData, google_maps_url: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Full Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Full Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Gate No. 6, North Fort Road, High Court Campus, Chennai - 600 104"
                  value={formData.address || ''}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-text-primary mb-1.5">
                  Description / Jurisdiction Details
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Provides free legal aid, legal advice, Lok Adalat referrals, and mediation services."
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Verified Checkbox */}
              <div className="md:col-span-2 flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="verified-checkbox"
                  checked={formData.verified !== false}
                  onChange={e => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                />
                <label htmlFor="verified-checkbox" className="text-sm font-medium text-text-primary cursor-pointer">
                  Mark as Verified Official Listing
                </label>
              </div>

            </div>
            
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

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" /> Legal Services & Courts Management
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Manage high courts, district legal services authorities, taluk committees, bar councils, and legal aid listings.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCsvExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border hover:bg-border/50 text-text-primary rounded-xl text-sm font-medium transition-colors shadow-sm active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-primary" /> Export CSV
          </button>
          
          {canEdit && (
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border hover:bg-border/50 text-text-primary rounded-xl text-sm font-medium transition-colors shadow-sm active:scale-95 cursor-pointer">
              <Upload className="w-4 h-4 text-primary" /> Import CSV
              <input type="file" accept=".csv" onChange={handleCsvImport} className="hidden" />
            </label>
          )}

          {canEdit && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Legal Record
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-border shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search office name, address, phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="relative">
          <select 
            value={categoryFilter} 
            onChange={e => setCategoryFilter(e.target.value)} 
            className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Categories ({items.length})</option>
            {LEGAL_CATEGORIES.filter(c => c !== 'All Offices').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <select 
            value={cityFilter} 
            onChange={e => setCityFilter(e.target.value)} 
            className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Cities / Districts ({allLocations.length})</option>
            {allLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Data */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-2xl border border-border">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/50 text-text-muted text-xs font-bold uppercase tracking-wider">
                  <th className="p-4">Office / Court Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">City/District</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Address</th>
                  <th className="p-4 text-center">Status</th>
                  {canEdit && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text-primary">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                    
                    {/* Office Name */}
                    <td className="p-4 font-bold">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                      </div>
                      {item.website && (
                        <a
                          href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline font-normal inline-flex items-center gap-1 mt-0.5"
                        >
                          <Globe className="w-3 h-3" /> {item.website.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-lg whitespace-nowrap">
                        {item.category}
                      </span>
                    </td>

                    {/* City/District */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-medium text-slate-800">{item.city || '-'}</span>
                      {item.district && item.district !== item.city && (
                        <span className="block text-xs text-text-muted">({item.district})</span>
                      )}
                    </td>

                    {/* Contact Info */}
                    <td className="p-4 text-xs">
                      {item.phone && (
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <PhoneCall className="w-3 h-3 text-primary shrink-0" />
                          <span className="truncate max-w-[180px]">{item.phone}</span>
                        </div>
                      )}
                      {item.email && (
                        <div className="text-primary hover:underline flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <a href={`mailto:${item.email}`} className="truncate max-w-[180px]">{item.email}</a>
                        </div>
                      )}
                    </td>

                    {/* Address */}
                    <td className="p-4 max-w-[220px] whitespace-normal break-words text-xs text-text-muted">
                      <div className="line-clamp-2" title={item.address}>
                        {item.address}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      {item.verified !== false ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Unverified
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    {canEdit && (
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 7 : 6} className="p-8 text-center text-text-muted">
                      No legal office records match the specified filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-border bg-surface/30 flex items-center justify-between text-xs text-text-muted">
            <span>Total records: {filtered.length} of {items.length}</span>
            <span>Module: Legal Services</span>
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
      <LegalAdminContent />
    </Suspense>
  );
}
