'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { Plus, Pencil, Trash2, Loader2, Shield, ArrowLeft, Save } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { CITIES } from '@/lib/constants';

interface ListingItem {
  id: string;
  name: string;
  city: string;
  area: string;
  address?: string;
  pincode?: string;
  description?: string;
  accommodation_type?: 'PG' | 'Hotel' | 'Service Apartment' | 'Rental Home';
  type?: string;
  contact_person_name?: string;
  owner_name?: string;
  contact_whatsapp?: string;
  owner_phone?: string;
  contact_email?: string;
  contact_phone?: string;
  gender?: 'male' | 'female' | 'mixed';
  price_range?: string;
  price_daily?: number;
  price_monthly?: number;
  price_per_month?: number;
  website_link?: string;
  image_url?: string;
  rating?: string | number;
  google_maps_url?: string;
  map_embed_code?: string;
  nearby_hospital?: string;
  landmark?: string;
  created_at?: string;
  room_type?: string;
  deposit_amount?: number;
  available_rooms?: number;
  amenities?: string[];
  bengali_food?: boolean;
  bengali_friendly?: boolean;
  verified?: boolean;
}

const PREDEFINED_AMENITIES = ['WiFi', 'AC', 'Laundry', 'Power Backup', 'Food', 'RO Water', 'CCTV'];

export default function AdminStayPage() {
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const searchVal = searchParams.get('search') || '';
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
    image_url: '',
    google_maps_url: '',
    nearby_hospital: '',
    landmark: '',
    room_type: '',
    deposit_amount: undefined,
    available_rooms: undefined,
    amenities: [],
    bengali_food: false,
    bengali_friendly: false,
    verified: false,
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
      image_url: '',
      rating: '',
      google_maps_url: '',
      map_embed_code: '',
      nearby_hospital: '',
      landmark: '',
      room_type: '',
      deposit_amount: undefined,
      available_rooms: undefined,
      amenities: [],
      bengali_food: false,
      bengali_friendly: false,
      verified: false,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openEdit(item: ListingItem) {
    setEditId(item.id);
    setFormData({ ...item });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.area || !formData.contact_person_name || !formData.contact_whatsapp) {
      alert('Please fill out all required fields (Name, City, Area, Contact Person, and WhatsApp number).');
      return;
    }

    if (formData.accommodation_type === 'Hotel') {
      if (!formData.price_daily || formData.price_daily <= 0) {
        alert('Please enter a valid Price Per Day for Hotel.');
        return;
      }
    } else {
      if (!formData.price_monthly || formData.price_monthly <= 0) {
        alert('Please enter a valid Price Per Month.');
        return;
      }
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload: Record<string, any> = { ...formData };

      // Clean up fields based on type
      if (payload.accommodation_type !== 'PG') {
        delete payload.gender;
      }

      if (payload.accommodation_type === 'Hotel') {
        delete payload.price_monthly;
      }

      // Firebase Firestore does not accept 'undefined' values in document fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

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
              {editId ? 'Edit' : 'Add New'} Accommodation Listing
            </h1>
            <p className="text-text-muted text-sm mt-0.5">
              {editId ? 'Update the accommodation details below.' : 'Fill in the details to list a new accommodation.'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <form onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Basic Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Property / Accommodation Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Kolkata PG or City Stay Hotel" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">City *</label>
                  <select required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm">
                    <option value="">Select City...</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Accommodation Type *</label>
                  <select value={formData.accommodation_type} onChange={e => setFormData({ ...formData, accommodation_type: e.target.value as any })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm">
                    <option value="PG">PG</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Service Apartment">Service Apartment</option>
                    <option value="Rental House">Rental House</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Area/Neighborhood *</label>
                  <input required type="text" value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Salt Lake Sector V" />
                </div>
                {formData.accommodation_type === 'PG' && (
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Gender Restriction</label>
                    <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value as any })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm">
                      <option value="mixed">Mixed / All</option>
                      <option value="male">Male Only</option>
                      <option value="female">Female Only</option>
                    </select>
                  </div>
                )}
                <div className="sm:col-span-2 flex items-center gap-2 mt-2">
                  <input type="checkbox" id="verified" checked={formData.verified || false} onChange={e => setFormData({ ...formData, verified: e.target.checked })} className="w-4 h-4 text-primary rounded border-border" />
                  <label htmlFor="verified" className="text-sm font-semibold text-text-primary">Mark as Verified Listing</label>
                </div>
              </div>
            </div>

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
                      <label className="block text-xs font-semibold text-text-primary mb-1.5">Price Per Month (₹) *</label>
                      <input required type="number" value={formData.price_monthly || ''} onChange={e => setFormData({ ...formData, price_monthly: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 8000" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1.5">Price Per Day (₹) (Optional)</label>
                      <input type="number" value={formData.price_daily || ''} onChange={e => setFormData({ ...formData, price_daily: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 400" />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="font-bold text-sm text-indigo-500 uppercase tracking-wider">Features & Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Room Types (Select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {['1 Sharing', '2 Sharing', '3 Sharing', '4 Sharing', '5 Sharing', 'Rental House', 'Other'].map(rt => (
                      <label key={rt} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-lg cursor-pointer hover:bg-border/50 transition-colors">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 text-primary rounded border-border"
                          checked={(formData.room_type || '').includes(rt)}
                          onChange={(e) => {
                            let current = (formData.room_type || '').split(',').map((s: string) => s.trim()).filter(Boolean);
                            if (e.target.checked) {
                              if (!current.includes(rt)) current.push(rt);
                            } else {
                              current = current.filter((a: string) => a !== rt);
                            }
                            setFormData({
                              ...formData,
                              room_type: current.join(', ')
                            });
                          }}
                        />
                        <span className="text-xs font-medium text-text-secondary">{rt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Total Available Rooms</label>
                  <input type="number" value={formData.available_rooms || ''} onChange={e => setFormData({ ...formData, available_rooms: Number(e.target.value) })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 10" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Amenities (Select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_AMENITIES.map(amenity => (
                      <label key={amenity} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-lg cursor-pointer hover:bg-border/50 transition-colors">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 text-primary rounded border-border"
                          checked={(formData.amenities || []).includes(amenity)}
                          onChange={(e) => {
                            const current = formData.amenities || [];
                            setFormData({
                              ...formData,
                              amenities: e.target.checked 
                                ? [...current, amenity] 
                                : current.filter(a => a !== amenity)
                            });
                          }}
                        />
                        <span className="text-xs font-medium text-text-secondary">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 space-y-3">
                  <h5 className="text-xs font-bold text-indigo-700">Bengali Cultural Specifics</h5>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.bengali_food || false} onChange={e => setFormData({ ...formData, bengali_food: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded border-border" />
                      <span className="text-sm font-medium text-text-primary">Serves Bengali Food</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.bengali_friendly || false} onChange={e => setFormData({ ...formData, bengali_friendly: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded border-border" />
                      <span className="text-sm font-medium text-text-primary">Bengali Friendly Environment</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="font-bold text-sm text-green-600 uppercase tracking-wider">Media & Map</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Property Cover Image</label>
                  <ImageUpload 
                    value={formData.image_url || ''} 
                    onChange={(url: string) => setFormData({ ...formData, image_url: url })}
                    folder="admin_uploads/stay"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Google Maps URL</label>
                  <input type="url" value={formData.google_maps_url} onChange={e => setFormData({ ...formData, google_maps_url: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. https://maps.google.com/..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Google Maps Embed Code or URL</label>
                  <input
                    type="text"
                    value={formData.map_embed_code || ''}
                    onChange={e => {
                      let val = e.target.value;
                      if (val.includes('<iframe')) {
                        const match = val.match(/src="([^"]+)"/);
                        if (match && match[1]) val = match[1];
                      }
                      setFormData({ ...formData, map_embed_code: val });
                    }}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm"
                    placeholder="Paste iframe embed HTML or URL (e.g. https://www.google.com/maps/embed?pb=...)"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">Detailed Address</label>
                  <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm resize-none" placeholder="e.g. 12, Park Street, near bus stop" />
                </div>
                {Boolean(formData.address && formData.address.trim()) && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-text-primary mb-1.5">Pincode (6 digits) *</label>
                    <input
                      required
                      type="text"
                      maxLength={6}
                      value={formData.pincode || ''}
                      onChange={e => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm"
                      placeholder="e.g. 600017"
                    />
                  </div>
                )}
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
                  <textarea maxLength={250} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm resize-none" placeholder="Enter other features or specifications (Max 250 characters)..." />
                  <p className="text-right text-[10px] text-text-muted mt-1">{(formData.description || '').length}/250</p>
                </div>
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
        <div className="bg-white/50 rounded-2xl border border-border overflow-hidden shadow-sm">
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
              {items.filter(item => {
                if (!searchVal) return true;
                const q = searchVal.toLowerCase();
                return item.name?.toLowerCase().includes(q) || item.city?.toLowerCase().includes(q) || item.area?.toLowerCase().includes(q);
              }).map(item => (
                <tr key={item.id} className="hover:bg-surface transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-text-primary text-sm flex items-center gap-2">
                      {item.name}
                      {item.verified && <span className="px-2 py-0.5 text-[10px] font-bold bg-green-500/10 text-green-600 rounded-full border border-green-500/20">Verified</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 text-xs font-medium bg-surface text-text-secondary rounded-lg border border-border">
                      {item.accommodation_type || item.type || 'PG'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-muted">{item.area}, {item.city}</td>
                  <td className="px-5 py-4 text-sm text-text-muted">
                    <div>{item.contact_person_name || item.owner_name || '—'}</div>
                    <div className="text-xs text-text-muted font-mono">{item.contact_whatsapp || item.owner_phone || '—'}</div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-text-primary">
                    {(item.accommodation_type || item.type) === 'Hotel' 
                      ? (item.price_daily ? `₹${item.price_daily}/day` : '₹0/day')
                      : (item.price_monthly ? `₹${item.price_monthly}/mo` : (item.price_per_month ? `₹${item.price_per_month}/mo` : (item.price_daily ? `₹${item.price_daily}/day` : '₹0/mo')))}
                  </td>
                  {(canEdit || canManage) && (
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && (
                          <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors cursor-pointer" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canManage && (
                          <button onClick={() => handleDelete(item.id, item.name)} className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors cursor-pointer" title="Delete">
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
    </div>
  );
}
