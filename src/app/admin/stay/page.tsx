'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { Plus, Pencil, Trash2, X, Loader2, Shield, Phone, MessageSquare, Mail, Globe, MapPin, Hospital, HelpCircle } from 'lucide-react';

interface ListingItem {
  id: string;
  name: string;
  city: string;
  area: string;
  address?: string;
  description?: string;
  accommodation_type: 'PG' | 'Hotel' | 'Service Apartment' | 'Rental Home';
  contact_person_name: string;
  contact_whatsapp: string;
  contact_email?: string;
  contact_phone?: string;
  gender?: 'male' | 'female' | 'mixed';
  price_range?: string;
  price_daily?: number;
  price_monthly?: number;
  website_link?: string;
  nearby_hospital?: string;
  landmark?: string;
  created_at?: string;
}

export default function AdminStayPage() {
  const { profile, firebaseUser } = useAuth();
  const [items, setItems] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<ListingItem>>({
    name: '',
    city: '',
    area: '',
    address: '',
    description: '',
    accommodation_type: 'PG',
    contact_person_name: '',
    contact_whatsapp: '',
    contact_email: '',
    contact_phone: '',
    gender: 'mixed',
    price_range: '',
    price_daily: 0,
    price_monthly: 0,
    website_link: '',
    nearby_hospital: '',
    landmark: '',
  });

  const canView = canAccess(profile?.role || 'user', profile?.permissions, 'stay', 'view');
  const canEdit = canAccess(profile?.role || 'user', profile?.permissions, 'stay', 'edit');
  const canManage = canAccess(profile?.role || 'user', profile?.permissions, 'stay', 'manage');

  useEffect(() => {
    async function loadItems() {
      try {
        const snap = await getDocs(collection(db, 'listings'));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as ListingItem)));
      } catch (e: unknown) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (canView) loadItems();
  }, [canView]);

  function openAdd() {
    setEditId(null);
    setFormData({
      name: '',
      city: '',
      area: '',
      address: '',
      description: '',
      accommodation_type: 'PG',
      contact_person_name: '',
      contact_whatsapp: '',
      contact_email: '',
      contact_phone: '',
      gender: 'mixed',
      price_range: '',
      price_daily: 0,
      price_monthly: 0,
      website_link: '',
      nearby_hospital: '',
      landmark: '',
    });
    setShowForm(true);
  }

  function openEdit(item: ListingItem) {
    setEditId(item.id);
    setFormData({ ...item });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.area || !formData.contact_person_name || !formData.contact_whatsapp) {
      alert('Please fill out all required fields (Name, City, Area, Contact Person, and WhatsApp number).');
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload = { ...formData };

      // Clean up fields based on type
      if (payload.accommodation_type !== 'PG') {
        delete payload.gender;
      }

      if (payload.accommodation_type === 'Hotel') {
        delete payload.price_monthly;
      }

      if (editId) {
        await updateDoc(doc(db, 'listings', editId), { ...payload, updated_at: now });
        setItems(prev => prev.map(i => i.id === editId ? { ...i, ...payload } : i));
        
        // Log activity
        await fetch('/api/admin/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'Stay Listing Updated',
            performed_by: profile?.full_name || 'Admin',
            user_role: profile?.role,
            details: `Updated stay listing "${payload.name}" (${payload.accommodation_type})`
          })
        }).catch(() => {});

        alert('Listing updated successfully!');
      } else {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        await setDoc(doc(db, 'listings', id), { ...payload, id, created_at: now });
        setItems(prev => [{ ...payload, id, created_at: now } as ListingItem, ...prev]);

        // Log activity
        await fetch('/api/admin/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'Stay Listing Created',
            performed_by: profile?.full_name || 'Admin',
            user_role: profile?.role,
            details: `Created stay listing "${payload.name}" (${payload.accommodation_type})`
          })
        }).catch(() => {});

        alert('Listing added successfully!');
      }
      setShowForm(false);
    } catch (e) {
      console.error(e);
      alert('Error saving listing.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!canManage) return;
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteDoc(doc(db, 'listings', id));
      setItems(prev => prev.filter(i => i.id !== id));

      // Log activity
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Stay Listing Deleted',
          performed_by: profile?.full_name || 'Admin',
          user_role: profile?.role,
          details: `Deleted stay listing "${name}"`
        })
      }).catch(() => {});

      alert('Listing deleted successfully!');
    } catch (e) {
      console.error(e);
      alert('Error deleting listing.');
    }
  }

  if (!canView) {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-text-primary mb-2">No Access</h2>
        <p className="text-text-muted">You do not have permission to view Stay & Accommodations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Stay & Accommodations</h1>
          <p className="text-text-muted text-sm mt-1">{items.length} total listings</p>
        </div>
        {canEdit && (
          <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-md active:scale-95">
            <Plus className="w-4 h-4" /> Add Listing
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-surface/50 border-b border-border">
                <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Accommodation Name</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Location</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Contact Person</th>
                <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Pricing</th>
                {(canEdit || canManage) && <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-surface transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                      {item.gender && (
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.gender === 'male' ? 'bg-blue-50 text-blue-600' :
                          item.gender === 'female' ? 'bg-pink-50 text-pink-600' :
                          'bg-purple-50 text-purple-600'
                        }`}>
                          {item.gender.toUpperCase()} Only
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-primary font-medium">{item.accommodation_type}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-text-primary">{item.area}</p>
                    <p className="text-xs text-text-muted">{item.city}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p className="font-semibold text-text-primary">{item.contact_person_name}</p>
                    <p className="text-xs text-text-muted font-mono">{item.contact_whatsapp}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-primary">
                    {item.accommodation_type === 'Hotel' ? (
                      <span>₹{item.price_daily || '0'} / day</span>
                    ) : (
                      <div className="text-xs space-y-0.5">
                        {item.price_monthly ? <p>₹{item.price_monthly} / month</p> : null}
                        {item.price_daily ? <p>₹{item.price_daily} / day</p> : null}
                        {item.price_range ? <p>Range: {item.price_range}</p> : null}
                      </div>
                    )}
                  </td>
                  {(canEdit || canManage) && (
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && (
                          <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors cursor-pointer">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canManage && (
                          <button onClick={() => handleDelete(item.id, item.name)} className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-text-muted text-sm italic">No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Accommodation Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl border border-border w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-text-primary">{editId ? 'Edit' : 'Add'} Accommodation Listing</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-surface text-text-muted transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Basic Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Property / Accommodation Name *</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Kolkata PG or City Stay Hotel" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Accommodation Type *</label>
                    <select value={formData.accommodation_type} onChange={e => setFormData({ ...formData, accommodation_type: e.target.value as any })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm">
                      <option value="PG">PG</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Service Apartment">Service Apartment</option>
                      <option value="Rental Home">Rental Home</option>
                    </select>
                  </div>
                  {/* Gender Only when PG is selected */}
                  {formData.accommodation_type === 'PG' && (
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1.5">Target Gender *</label>
                      <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as any })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm">
                        <option value="mixed">Mixed / All</option>
                        <option value="male">Male Only</option>
                        <option value="female">Female Only</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="font-bold text-sm text-accent uppercase tracking-wider">Contact Person Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Contact Person Name *</label>
                    <input required type="text" value={formData.contact_person_name} onChange={e => setFormData({ ...formData, contact_person_name: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Amit Sen" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">WhatsApp Number (Mandatory) *</label>
                    <input required type="tel" value={formData.contact_whatsapp} onChange={e => setFormData({ ...formData, contact_whatsapp: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. +91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Email ID</label>
                    <input type="email" value={formData.contact_email} onChange={e => setFormData({ ...formData, contact_email: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. owner@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Phone Number (Optional)</label>
                    <input type="tel" value={formData.contact_phone} onChange={e => setFormData({ ...formData, contact_phone: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 044-123456" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Website Link (Optional)</label>
                    <input type="url" value={formData.website_link} onChange={e => setFormData({ ...formData, website_link: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. https://example.com" />
                  </div>
                </div>
              </div>

              {/* Pricing Details */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="font-bold text-sm text-amber-600 uppercase tracking-wider">Pricing Configuration</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.accommodation_type === 'Hotel' ? (
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1.5">Price Per Day (₹) *</label>
                      <input required type="number" value={formData.price_daily || ''} onChange={e => setFormData({ ...formData, price_daily: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 1500" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Price Per Month (₹)</label>
                        <input type="number" value={formData.price_monthly || ''} onChange={e => setFormData({ ...formData, price_monthly: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 8000" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Price Per Day (₹) (Optional)</label>
                        <input type="number" value={formData.price_daily || ''} onChange={e => setFormData({ ...formData, price_daily: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 400" />
                      </div>
                    </>
                  )}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Price Range Description</label>
                    <input type="text" value={formData.price_range} onChange={e => setFormData({ ...formData, price_range: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. ₹5,000 - ₹12,000 based on sharing options" />
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="font-bold text-sm text-green-600 uppercase tracking-wider">Location & Surroundings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">City *</label>
                    <input required type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Chennai" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Area *</label>
                    <input required type="text" value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Guindy" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Detailed Address</label>
                    <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm resize-none" placeholder="e.g. 12, Park Street, near bus stop" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Nearby Hospital</label>
                    <input type="text" value={formData.nearby_hospital} onChange={e => setFormData({ ...formData, nearby_hospital: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Apollo Hospital (1.2 km)" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Landmark</label>
                    <input type="text" value={formData.landmark} onChange={e => setFormData({ ...formData, landmark: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Near Metro Station Gate 2" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Description</label>
                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm resize-none" placeholder="Enter other features or specifications..." />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
