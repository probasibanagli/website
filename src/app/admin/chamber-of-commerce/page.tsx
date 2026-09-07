'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { ChamberBusiness, ChamberJobOpening } from '@/types';
import { BUSINESS_CATEGORIES, INITIAL_CHAMBER_BUSINESSES } from '@/data/chamber-of-commerce-data';
import { CITIES } from '@/lib/constants';
import {
  Building2, Briefcase, Plus, Pencil, Trash2, X, Loader2, Shield,
  Search, CheckCircle2, Clock, XCircle, Filter, Download, ArrowLeft,
  Save, Phone, Mail, Globe, MapPin, BadgeCheck, AlertTriangle, Eye,
  Check, RefreshCw, Layers, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ChamberOfCommerceAdminPage() {
  const { profile } = useAuth();
  
  const moduleKey = 'chamber_of_commerce';
  const canView = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'view');
  const canEdit = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'edit');
  const canManage = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'manage');

  // State
  const [items, setItems] = useState<ChamberBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ChamberBusiness>>({});
  const [saving, setSaving] = useState(false);

  // Rejection Modal
  const [rejectingItem, setRejectingItem] = useState<ChamberBusiness | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Detail Modal
  const [viewItem, setViewItem] = useState<ChamberBusiness | null>(null);

  // Load Data
  useEffect(() => {
    if (canView) {
      loadData();
    }
  }, [canView]);

  async function loadData() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.chamber_of_commerce || 'chamber_of_commerce'));
      if (!snap.empty) {
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChamberBusiness));
        if (fetched.length > 0) {
          setItems(fetched);
          return;
        }
      }
      // If Firestore is empty, initialize with default seed data
      setItems(INITIAL_CHAMBER_BUSINESSES);
    } catch (err) {
      console.error('Error fetching chamber businesses:', err);
      setItems(INITIAL_CHAMBER_BUSINESSES);
    } finally {
      setLoading(false);
    }
  }

  // Quick Approve
  const handleApprove = async (item: ChamberBusiness) => {
    try {
      const updated: Partial<ChamberBusiness> = {
        verified: true,
        verification_status: 'verified',
        verified_at: new Date().toISOString(),
        verified_by: profile?.full_name || 'Admin',
        updated_at: new Date().toISOString(),
      };
      await setDoc(doc(db, COLLECTIONS.chamber_of_commerce || 'chamber_of_commerce', item.id), { ...item, ...updated }, { merge: true });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, ...updated } : i));
    } catch (err: any) {
      console.error('Error approving business:', err);
      alert('Failed to approve: ' + err.message);
    }
  };

  // Reject
  const handleConfirmReject = async () => {
    if (!rejectingItem) return;
    try {
      const updated: Partial<ChamberBusiness> = {
        verified: false,
        verification_status: 'rejected',
        rejection_reason: rejectionReason || 'Information could not be verified.',
        updated_at: new Date().toISOString(),
      };
      await setDoc(doc(db, COLLECTIONS.chamber_of_commerce || 'chamber_of_commerce', rejectingItem.id), { ...rejectingItem, ...updated }, { merge: true });
      setItems(prev => prev.map(i => i.id === rejectingItem.id ? { ...i, ...updated } : i));
      setRejectingItem(null);
      setRejectionReason('');
    } catch (err: any) {
      console.error('Error rejecting business:', err);
      alert('Failed to reject: ' + err.message);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this business listing?')) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.chamber_of_commerce || 'chamber_of_commerce', id));
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err: any) {
      console.error('Error deleting business:', err);
      alert('Failed to delete: ' + err.message);
    }
  };

  // Open Form for Create / Edit
  const handleOpenForm = (item?: ChamberBusiness) => {
    if (item) {
      setEditId(item.id);
      setFormData({ ...item });
    } else {
      setEditId(null);
      setFormData({
        business_name: '',
        owner_name: '',
        category: 'IT & Software Solutions',
        description: '',
        address: '',
        city: 'Chennai',
        state: 'Tamil Nadu',
        contact_phone: '',
        contact_email: '',
        whatsapp: '',
        website: '',
        verified: true,
        verification_status: 'verified',
        hiring_status: 'not_hiring',
        services_offered: [],
        job_openings: [],
      });
    }
    setShowForm(true);
  };

  // Save Form
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.business_name || !formData.owner_name || !formData.contact_phone || !formData.city) {
      alert('Please fill in required fields: Business Name, Owner Name, Contact Phone, City.');
      return;
    }

    setSaving(true);
    try {
      const id = editId || `boc-${Date.now()}`;
      const payload: ChamberBusiness = {
        id,
        business_name: formData.business_name || '',
        owner_name: formData.owner_name || '',
        category: formData.category || 'Other Services',
        sub_category: formData.sub_category || '',
        gst_number: formData.gst_number || '',
        year_established: formData.year_established || undefined,
        description: formData.description || '',
        services_offered: Array.isArray(formData.services_offered) ? formData.services_offered : [],
        address: formData.address || '',
        area: formData.area || '',
        city: formData.city || 'Chennai',
        district: formData.district || formData.city || '',
        state: formData.state || 'Tamil Nadu',
        pincode: formData.pincode || '',
        contact_email: formData.contact_email || '',
        contact_phone: formData.contact_phone || '',
        whatsapp: formData.whatsapp || '',
        website: formData.website || '',
        google_maps_url: formData.google_maps_url || '',
        logo_url: formData.logo_url || '',
        hiring_status: formData.hiring_status || 'not_hiring',
        job_openings: formData.job_openings || [],
        verified: formData.verified ?? true,
        verification_status: formData.verification_status || 'verified',
        verified_at: formData.verified_at || new Date().toISOString(),
        verified_by: formData.verified_by || profile?.full_name || 'Admin',
        is_active: true,
        created_at: formData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await setDoc(doc(db, COLLECTIONS.chamber_of_commerce || 'chamber_of_commerce', id), payload, { merge: true });

      setItems(prev => {
        const existing = prev.find(i => i.id === id);
        if (existing) {
          return prev.map(i => i.id === id ? payload : i);
        }
        return [payload, ...prev];
      });

      setShowForm(false);
    } catch (err: any) {
      console.error('Error saving business:', err);
      alert('Failed to save business: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Business Name', 'Owner Name', 'Category', 'City', 'Phone', 'Email', 'Status', 'Hiring Status', 'Jobs Count', 'Created At'];
    const rows = items.map(i => [
      `"${(i.business_name || '').replace(/"/g, '""')}"`,
      `"${(i.owner_name || '').replace(/"/g, '""')}"`,
      `"${(i.category || '').replace(/"/g, '""')}"`,
      `"${(i.city || '').replace(/"/g, '""')}"`,
      `"${(i.contact_phone || '').replace(/"/g, '""')}"`,
      `"${(i.contact_email || '').replace(/"/g, '""')}"`,
      `"${i.verification_status}"`,
      `"${i.hiring_status}"`,
      i.job_openings?.length || 0,
      `"${i.created_at || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bengali_chamber_of_commerce_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Tab filter
      if (activeTab === 'pending' && item.verification_status !== 'pending') return false;
      if (activeTab === 'verified' && item.verification_status !== 'verified') return false;
      if (activeTab === 'rejected' && item.verification_status !== 'rejected') return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.business_name.toLowerCase().includes(q) ||
          item.owner_name.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.gst_number?.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Category
      if (categoryFilter && item.category !== categoryFilter) return false;

      // City
      if (cityFilter && item.city.toLowerCase() !== cityFilter.toLowerCase()) return false;

      return true;
    });
  }, [items, activeTab, searchQuery, categoryFilter, cityFilter]);

  // Counts
  const pendingCount = items.filter(i => i.verification_status === 'pending').length;
  const verifiedCount = items.filter(i => i.verification_status === 'verified').length;
  const rejectedCount = items.filter(i => i.verification_status === 'rejected').length;

  if (!canView) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-xs text-slate-500">You do not have permission to view the Chamber of Commerce module.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ─── Header & Top Actions ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">Bengali Chamber of Commerce</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF0EC] text-[#D85A30] border border-[#EADED9]">
              {items.length} Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review registration submissions, verify Bengali-owned enterprises, manage career openings, and maintain business directory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {canEdit && (
            <Button
              onClick={() => handleOpenForm()}
              className="bg-[#D85A30] hover:bg-[#c04a22] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Business Directly</span>
            </Button>
          )}
        </div>
      </div>

      {/* ─── Metric Counter Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{items.length}</div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${pendingCount > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-slate-200/80 shadow-2xs'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Pending Review</span>
            {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">{pendingCount}</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Verified & Active</span>
          <div className="text-2xl font-black text-emerald-900 mt-1">{verifiedCount}</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Rejected</span>
          <div className="text-2xl font-black text-red-900 mt-1">{rejectedCount}</div>
        </div>
      </div>

      {/* ─── Tabs & Filters ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-2xs font-bold'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <span>Pending Review</span>
              {pendingCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${activeTab === 'pending' ? 'bg-white text-amber-700' : 'bg-amber-200 text-amber-800'}`}>
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'verified'
                  ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Verified ({verifiedCount})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'rejected'
                  ? 'bg-red-700 text-white shadow-2xs font-bold'
                  : 'text-red-700 hover:bg-red-50'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search business name, owner, city, GST..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="">All Categories</option>
              {BUSINESS_CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            >
              <option value="">All Cities</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Bengaluru">Bengaluru</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Business Table ─── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs">Loading businesses...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-sm font-semibold">No businesses match the current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-100">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Business & Owner</th>
                  <th className="px-4 py-3">Category & City</th>
                  <th className="px-4 py-3">Contact Details</th>
                  <th className="px-4 py-3">Hiring / Jobs</th>
                  <th className="px-4 py-3">Verification Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Business Name & Owner */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF0EC] border border-[#EADED9] flex items-center justify-center text-[#D85A30] font-black text-sm shrink-0">
                          {item.logo_url ? (
                            <img src={item.logo_url} alt="" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            item.business_name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{item.business_name}</p>
                          <p className="text-[11px] text-slate-500">
                            Prop: <span className="font-semibold text-slate-700">{item.owner_name}</span>
                            {item.gst_number && <span className="text-slate-400"> • GST: {item.gst_number}</span>}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category & City */}
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-900">{item.category}</p>
                      <p className="text-[11px] text-slate-500">{item.area ? `${item.area}, ` : ''}{item.city}</p>
                    </td>

                    {/* Contact Details */}
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-900">{item.contact_phone}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-[150px]">{item.contact_email}</p>
                    </td>

                    {/* Hiring / Jobs */}
                    <td className="px-4 py-3.5">
                      {item.job_openings && item.job_openings.length > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <Briefcase className="w-3 h-3" /> {item.job_openings.length} Opening(s)
                        </span>
                      ) : item.hiring_status === 'hiring' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          Hiring
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No Openings</span>
                      )}
                    </td>

                    {/* Verification Status */}
                    <td className="px-4 py-3.5">
                      {item.verification_status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : item.verification_status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold animate-pulse">
                          <Clock className="w-3.5 h-3.5" /> Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Approve button if pending or rejected */}
                        {canEdit && item.verification_status !== 'verified' && (
                          <button
                            onClick={() => handleApprove(item)}
                            title="Approve & Verify"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer border border-emerald-200"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Quick Reject button if pending or verified */}
                        {canEdit && item.verification_status !== 'rejected' && (
                          <button
                            onClick={() => { setRejectingItem(item); setRejectionReason(''); }}
                            title="Reject Listing"
                            className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition-colors cursor-pointer border border-red-200"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* View Full */}
                        <button
                          onClick={() => setViewItem(item)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit */}
                        {canEdit && (
                          <button
                            onClick={() => handleOpenForm(item)}
                            title="Edit Listing"
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete */}
                        {canManage && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete Permanently"
                            className="p-1.5 rounded-lg bg-slate-100 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Rejection Reason Modal ─── */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">Reject Registration Submission</h3>
            <p className="text-xs text-slate-600">
              Provide a reason for rejecting <strong>{rejectingItem.business_name}</strong>. The owner will be able to see this feedback.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="e.g. Phone number could not be reached, invalid registration document, or incomplete address details."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-2xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── View Full Detail Modal ─── */}
      {viewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-[#FAF0EC] to-white border-b border-[#EADED9] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{viewItem.business_name}</h3>
                <p className="text-xs text-slate-500">Registered by {viewItem.owner_name}</p>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div><span className="text-slate-400 block font-medium">Category:</span><strong>{viewItem.category}</strong></div>
                <div><span className="text-slate-400 block font-medium">GST / Reg:</span><strong>{viewItem.gst_number || 'N/A'}</strong></div>
                <div><span className="text-slate-400 block font-medium">Phone:</span><strong>{viewItem.contact_phone}</strong></div>
                <div><span className="text-slate-400 block font-medium">Email:</span><strong>{viewItem.contact_email}</strong></div>
                <div><span className="text-slate-400 block font-medium">City:</span><strong>{viewItem.city} ({viewItem.area || 'N/A'})</strong></div>
                <div><span className="text-slate-400 block font-medium">Established:</span><strong>{viewItem.year_established || 'N/A'}</strong></div>
                <div><span className="text-slate-400 block font-medium">Verification Status:</span><strong className="capitalize">{viewItem.verification_status}</strong></div>
                <div><span className="text-slate-400 block font-medium">Created:</span><strong>{new Date(viewItem.created_at).toLocaleString()}</strong></div>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Description</h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{viewItem.description}</p>
              </div>

              {viewItem.services_offered && viewItem.services_offered.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Services Offered</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewItem.services_offered.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-700">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {viewItem.job_openings && viewItem.job_openings.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">Active Job Openings ({viewItem.job_openings.length})</h4>
                  <div className="space-y-2">
                    {viewItem.job_openings.map(j => (
                      <div key={j.id} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                        <div className="flex justify-between font-bold text-emerald-900">
                          <span>{j.title} ({j.job_type})</span>
                          <span>{j.salary_range}</span>
                        </div>
                        {j.description && <p className="text-slate-600 mt-1">{j.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Create / Edit Admin Form Modal ─── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-gradient-to-r from-[#FAF0EC] to-white border-b border-[#EADED9] flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{editId ? 'Edit Business Listing' : 'Add New Verified Business'}</h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.business_name || ''}
                    onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Owner / Proprietor Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.owner_name || ''}
                    onChange={e => setFormData({ ...formData, owner_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category || 'IT & Software Solutions'}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium"
                  >
                    {BUSINESS_CATEGORIES.filter(c => c !== 'All Categories').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City *</label>
                  <select
                    value={formData.city || 'Chennai'}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-medium"
                  >
                    {CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    value={formData.gst_number || ''}
                    onChange={e => setFormData({ ...formData, gst_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.contact_phone || ''}
                    onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.contact_email || ''}
                    onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.whatsapp || ''}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Verification Status</label>
                  <select
                    value={formData.verification_status || 'verified'}
                    onChange={e => setFormData({
                      ...formData,
                      verification_status: e.target.value as any,
                      verified: e.target.value === 'verified'
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold"
                  >
                    <option value="verified">Verified (Live)</option>
                    <option value="pending">Pending Review</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#D85A30] hover:bg-[#c04a22] text-white font-bold px-6 py-2 rounded-xl text-xs cursor-pointer shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Business'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
