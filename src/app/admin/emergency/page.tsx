'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Hospital, BengaliDoctor, BengaliStaff } from '@/types';
import { Building2, Plus, Pencil, Trash2, MapPin, Clock, X, Loader2, Shield, UserRound, PhoneCall, CheckCircle, Users, ArrowLeft, Save } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

function ListingCoverImage({ name, city, mapsUrl, imageUrl, fallbackIcon }: { 
  name: string; 
  city?: string; 
  mapsUrl?: string; 
  imageUrl?: string;
  fallbackIcon: React.ReactNode;
}) {
  const getFallbackImg = (hName: string) => {
    const lower = hName.toLowerCase();
    if (lower.includes('apollo')) return 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('mgm')) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('miot')) return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('fortis')) return 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('kauvery')) return 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('rela')) return 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('ramachandra')) return 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('cmc')) return 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80';
    if (lower.includes('cancer') || lower.includes('adyar')) return 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=80';
  };

  const primarySrc = imageUrl || (mapsUrl ? `/api/public/place-photo?name=${encodeURIComponent(name)}&city=${encodeURIComponent(city || '')}&mapsUrl=${encodeURIComponent(mapsUrl)}&v=3` : getFallbackImg(name));
  const [currentSrc, setCurrentSrc] = useState(primarySrc);
  const [failedOnce, setFailedOnce] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setCurrentSrc(imageUrl || getFallbackImg(name));
    setError(false);
    setFailedOnce(false);
  }, [imageUrl, name]);

  const handleImgError = () => {
    if (!failedOnce) {
      setFailedOnce(true);
      setCurrentSrc(getFallbackImg(name));
    } else {
      setError(true);
    }
  };

  if (error || !currentSrc) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-red-500 opacity-40 scale-[2.5]">
          {fallbackIcon}
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={name}
      onError={handleImgError}
      className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105"
    />
  );
}

const CHENNAI_AREAS = ['Adyar', 'Alandur', 'Ambattur', 'Anna Nagar', 'Ashok Nagar', 'Aminjikarai', 'Avadi', 'Besant Nagar', 'Broadway', 'Chromepet', 'Egmore', 'Guindy', 'Kilpauk', 'Kodambakkam', 'Kolathur', 'Madipakkam', 'Madhavaram', 'Mambalam', 'Manapakkam', 'Medavakkam', 'Mogappair', 'Nanganallur', 'OMR', 'Pallavaram', 'Perambur', 'Porur', 'Royapettah', 'Saidapet', 'Sholinganallur', 'Tambaram', 'T Nagar', 'Thiruvanmiyur', 'Triplicane', 'Vadapalani', 'Velachery', 'Villivakkam', 'Virugambakkam', 'West Mambalam', 'Greams Road', 'Gandhi Nagar', 'Koyembedu', 'Mylapore', 'Perungudi'].sort();
const LANGUAGES = ['Bengali', 'Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'Urdu'];

const PREDEFINED_SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Oncology',
  'Emergency Medicine'
];

const PREDEFINED_DEPARTMENTS = [
  'Reception',
  'Nursing',
  'Pharmacy',
  'Laboratory',
  'Radiology',
  'Administration',
  'Billing',
  'Emergency',
  'ICU',
  'Blood Bank',
  'Maintenance',
  'Security'
];

const SAMPLE_HOSPITALS = [
  { name: 'Apollo Hospital Chennai', city: 'Chennai', area: 'Greams Road', emergency_phone: '1066', phone: '044-28293333', is_24_7: true, has_bengali_doctor: true, main_branch: true, specializations: ['Cardiology', 'Neurology', 'Oncology'], description: 'Leading multi-specialty hospital.', category: 'Private', status: 'Active' },
  { name: 'MGM Healthcare Chennai', city: 'Chennai', area: 'Aminjikarai', emergency_phone: '044-45688888', phone: '044-45688888', is_24_7: true, has_bengali_doctor: true, main_branch: false, specializations: ['Emergency Medicine', 'Orthopedics'], description: 'State of the art healthcare.', category: 'Private', status: 'Active' },
  { name: 'MIOT International Chennai', city: 'Chennai', area: 'Manapakkam', emergency_phone: '105710', phone: '044-22492288', is_24_7: true, has_bengali_doctor: true, main_branch: true, specializations: ['Orthopedics', 'Pediatrics'], description: 'Pioneers in orthopedic care.', category: 'Private', status: 'Active' }
];

const SAMPLE_DOCTORS = [
  { doctor_name: 'Dr. Anirban Roy', specialization: 'Cardiology', experience: '15 years', languages: ['Bengali', 'English', 'Tamil'], otp_required: true },
  { doctor_name: 'Dr. Saptarshi Chatterjee', specialization: 'Neurology', experience: '12 years', languages: ['Bengali', 'English'], otp_required: true },
  { doctor_name: 'Dr. Debasish Banerjee', specialization: 'Orthopedics', experience: '20 years', languages: ['Bengali', 'English', 'Hindi'], otp_required: true }
];

function AdminEmergencyPageContent() {
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors' | 'staff'>('hospitals');

  useEffect(() => {
    if (tabParam && ['hospitals', 'doctors', 'staff'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);
  
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<BengaliDoctor[]>([]);
  const [staff, setStaff] = useState<BengaliStaff[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [selectedHospitalFilter, setSelectedHospitalFilter] = useState<string>('all');

  const moduleKey = 'emergency';
  const canView = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'view');
  const canEdit = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'edit');
  const canManage = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'manage');

  useEffect(() => {
    if (canView) {
      loadData();
    }
  }, [canView]);

  async function loadData() {
    setLoading(true);
    try {
      const [hSnap, dSnap, sSnap] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.hospitals)),
        getDocs(collection(db, COLLECTIONS.bengali_doctors)),
        getDocs(collection(db, COLLECTIONS.bengali_staff || 'bengali_staff'))
      ]);
      setHospitals(hSnap.docs.map(d => ({ id: d.id, ...d.data() } as Hospital)));
      setDoctors(dSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliDoctor)));
      setStaff(sSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliStaff)));
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function seedSampleData() {
    if (!confirm('This will insert sample hospitals and doctors. Proceed?')) return;
    setSeeding(true);
    try {
      const now = new Date().toISOString();
      const hospitalDocs = [];
      
      for (const h of SAMPLE_HOSPITALS) {
        const id = `hosp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const payload = { ...h, id, created_at: now };
        await setDoc(doc(db, COLLECTIONS.hospitals, id), payload);
        hospitalDocs.push(payload);
      }
      
      for (let i = 0; i < SAMPLE_DOCTORS.length; i++) {
        const d = SAMPLE_DOCTORS[i];
        const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const hId = hospitalDocs[i % hospitalDocs.length].id;
        const payload = { ...d, id, hospital_id: hId, hospital_ids: [hId], created_at: now };
        await setDoc(doc(db, COLLECTIONS.bengali_doctors, id), payload);
      }
      
      alert('Sample data successfully added!');
      loadData();
    } catch (e) {
      console.error(e);
      alert('Error seeding data.');
    } finally {
      setSeeding(false);
    }
  }

  function openAdd() {
    setEditId(null);
    setFormData(
      activeTab === 'hospitals' 
        ? { specializations: [], category: 'Private', status: 'Active', main_branch: false, is_24_7: false, has_bengali_doctor: false } 
        : activeTab === 'doctors'
          ? { hospital_ids: [], languages: ['Bengali'], specialization: 'Cardiology', otp_required: true }
          : { languages: ['Bengali'], department: 'Reception', otp_required: true }
    );
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openEdit(item: any) {
    setEditId(item.id);
    const data = { ...item };
    if (activeTab === 'hospitals') {
      if (!Array.isArray(data.specializations)) data.specializations = [];
      if (!data.category) data.category = 'Private';
      if (!data.status) data.status = 'Active';
    }
    if (activeTab === 'doctors') {
      if (!Array.isArray(data.hospital_ids)) {
        data.hospital_ids = data.hospital_id ? [data.hospital_id] : [];
      }
      if (!Array.isArray(data.languages)) data.languages = [];
      if (data.otp_required === undefined) data.otp_required = true;
    }
    if (activeTab === 'staff') {
      if (!Array.isArray(data.languages)) data.languages = [];
      if (data.otp_required === undefined) data.otp_required = true;
    }
    setFormData(data);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const collectionName = activeTab === 'hospitals' 
        ? COLLECTIONS.hospitals 
        : activeTab === 'doctors' 
          ? COLLECTIONS.bengali_doctors 
          : (COLLECTIONS.bengali_staff || 'bengali_staff');
      const now = new Date().toISOString();
      const payload = { ...formData };
      
      if (activeTab === 'hospitals') {
        if (!Array.isArray(payload.specializations)) {
          payload.specializations = [];
        }
      } else if (activeTab === 'doctors') {
        if (!Array.isArray(payload.hospital_ids)) {
          payload.hospital_ids = [];
        }
        if (!Array.isArray(payload.languages)) {
          payload.languages = [];
        }
        payload.hospital_id = payload.hospital_ids[0] || '';
      } else {
        if (!Array.isArray(payload.languages)) {
          payload.languages = [];
        }
      }

      if (editId) {
        if (activeTab === 'hospitals') {
          setHospitals(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as unknown as Hospital : i));
        } else if (activeTab === 'doctors') {
          setDoctors(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as unknown as BengaliDoctor : i));
        } else {
          setStaff(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as unknown as BengaliStaff : i));
        }
      } else {
        const id = `${activeTab === 'hospitals' ? 'hosp' : 'item'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        payload.id = id;
        payload.created_at = now;
        
        if (activeTab === 'hospitals') {
          setHospitals(prev => [{ ...payload } as unknown as Hospital, ...prev]);
        } else if (activeTab === 'doctors') {
          setDoctors(prev => [{ ...payload } as unknown as BengaliDoctor, ...prev]);
        } else {
          setStaff(prev => [{ ...payload } as unknown as BengaliStaff, ...prev]);
        }
      }
      
      setShowForm(false);
      setSaving(false);

      // BACKGROUND SYNC
      if (editId) {
        await updateDoc(doc(db, collectionName, editId), { ...payload, updated_at: now });
      } else {
        await setDoc(doc(db, collectionName, payload.id), { ...payload });
      }
    } catch (e) {
      console.error(e);
      alert('Error saving item to database.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const collectionName = activeTab === 'hospitals' 
        ? COLLECTIONS.hospitals 
        : activeTab === 'doctors' 
          ? COLLECTIONS.bengali_doctors 
          : (COLLECTIONS.bengali_staff || 'bengali_staff');
      await deleteDoc(doc(db, collectionName, id));
      if (activeTab === 'hospitals') {
        setHospitals(prev => prev.filter(i => i.id !== id));
      } else if (activeTab === 'doctors') {
        setDoctors(prev => prev.filter(i => i.id !== id));
      } else {
        setStaff(prev => prev.filter(i => i.id !== id));
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting item.');
    }
  }

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
              {editId ? 'Edit' : 'Add New'} {activeTab === 'hospitals' ? 'Hospital' : activeTab === 'doctors' ? 'Doctor' : 'Staff'}
            </h1>
            <p className="text-text-muted text-sm mt-0.5">Fill in the fields below to update records.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <form className="p-6 md:p-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {activeTab === 'hospitals' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Hospital Name *</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">City *</label>
                    <input type="text" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Area/Location *</label>
                    <select value={formData.area || ''} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                      <option value="">Select Area...</option>
                      {CHENNAI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Category *</label>
                    <select value={formData.category || 'Private'} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                      <option value="Private">Private</option>
                      <option value="Government">Government</option>
                      <option value="Trust/Charity">Trust/Charity</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Emergency Helpline *</label>
                    <input type="text" value={formData.emergency_phone || ''} onChange={e => setFormData({...formData, emergency_phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">General Phone</label>
                    <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Full Address</label>
                    <input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Google Maps Link</label>
                    <input type="text" value={formData.google_maps_url || ''} onChange={e => setFormData({...formData, google_maps_url: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="https://maps.google.com/..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Hospital Cover Image</label>
                    <ImageUpload value={formData.image_url || ''} onChange={(url: string) => setFormData({...formData, image_url: url})} folder="admin_uploads/hospitals" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <label className="block text-sm font-semibold text-text-primary">Key Specializations</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {PREDEFINED_SPECIALIZATIONS.map(spec => (
                      <label key={spec} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={(formData.specializations || []).includes(spec)}
                          onChange={(e) => {
                            const current = formData.specializations || [];
                            if (e.target.checked) {
                              setFormData({ ...formData, specializations: [...current, spec] });
                            } else {
                              setFormData({ ...formData, specializations: current.filter((s: string) => s !== spec) });
                            }
                          }}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm text-text-primary">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!formData.is_24_7} onChange={e => setFormData({...formData, is_24_7: e.target.checked})} className="w-4 h-4 rounded border-border" />
                    <span className="text-sm font-semibold text-text-primary">24/7 Emergency Care</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!formData.has_bengali_doctor} onChange={e => setFormData({...formData, has_bengali_doctor: e.target.checked})} className="w-4 h-4 rounded border-border" />
                    <span className="text-sm font-semibold text-text-primary">Bengali Speaking Doctor</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!formData.main_branch} onChange={e => setFormData({...formData, main_branch: e.target.checked})} className="w-4 h-4 rounded border-border" />
                    <span className="text-sm font-semibold text-text-primary">Main Branch</span>
                  </label>
                </div>
              </>
            ) : activeTab === 'doctors' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Doctor Name *</label>
                    <input type="text" value={formData.doctor_name || ''} onChange={e => setFormData({...formData, doctor_name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Dr. Sourav Ganguly" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Specialization *</label>
                    <select value={formData.specialization || 'Cardiology'} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                      {PREDEFINED_SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Designation</label>
                    <input type="text" value={formData.designation || ''} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Senior Consultant" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Experience</label>
                    <input type="text" value={formData.experience || ''} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 15 Years" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Associated Hospitals (Multi-select) *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-surface rounded-xl border border-border max-h-40 overflow-y-auto">
                      {hospitals.map(h => {
                        const isChecked = (formData.hospital_ids || []).includes(h.id);
                        return (
                          <label key={h.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white/50 p-1.5 rounded-lg transition-colors">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = formData.hospital_ids || [];
                                const next = e.target.checked ? [...current, h.id] : current.filter((id: string) => id !== h.id);
                                setFormData({ ...formData, hospital_ids: next, hospital_id: next[0] || '' });
                              }}
                              className="w-4 h-4 rounded border-border"
                            />
                            <span className="truncate">{h.name} ({h.city})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Contact Phone *</label>
                    <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">OPD Timings</label>
                    <input type="text" value={formData.opd_timings || ''} onChange={e => setFormData({...formData, opd_timings: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Mon-Sat 10:00 AM - 2:00 PM" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Languages Spoken</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {LANGUAGES.map(lang => (
                        <label key={lang} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={(formData.languages || []).includes(lang)}
                            onChange={(e) => {
                              const current = formData.languages || [];
                              if (e.target.checked) {
                                setFormData({ ...formData, languages: [...current, lang] });
                              } else {
                                setFormData({ ...formData, languages: current.filter((l: string) => l !== lang) });
                              }
                            }}
                            className="w-4 h-4 rounded border-border"
                          />
                          <span className="text-sm text-text-primary">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3 mt-2">
                    <input 
                      type="checkbox" 
                      id="otp_required" 
                      checked={formData.otp_required !== false} 
                      onChange={e => setFormData({...formData, otp_required: e.target.checked})} 
                      className="w-5 h-5 rounded border-border" 
                    />
                    <label htmlFor="otp_required" className="text-sm font-semibold text-text-primary cursor-pointer">
                      Require OTP verification to view doctor contact number
                    </label>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Staff Name *</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Role/Title *</label>
                    <input type="text" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Senior Nurse / Translator" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Department *</label>
                    <select value={formData.department || 'Reception'} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                      {PREDEFINED_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Hospital *</label>
                    <select value={formData.hospital_id || ''} onChange={e => setFormData({...formData, hospital_id: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                      <option value="">Select Hospital...</option>
                      {hospitals.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone Number *</label>
                    <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Shift/Availability</label>
                    <input type="text" value={formData.shift || ''} onChange={e => setFormData({...formData, shift: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Day Shift 8 AM - 4 PM" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Languages Spoken</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {LANGUAGES.map(lang => (
                        <label key={lang} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={(formData.languages || []).includes(lang)}
                            onChange={(e) => {
                              const current = formData.languages || [];
                              if (e.target.checked) {
                                setFormData({ ...formData, languages: [...current, lang] });
                              } else {
                                setFormData({ ...formData, languages: current.filter((l: string) => l !== lang) });
                              }
                            }}
                            className="w-4 h-4 rounded border-border"
                          />
                          <span className="text-sm text-text-primary">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-3 mt-2">
                    <input 
                      type="checkbox" 
                      id="staff_otp_required" 
                      checked={formData.otp_required !== false} 
                      onChange={e => setFormData({...formData, otp_required: e.target.checked})} 
                      className="w-5 h-5 rounded border-border" 
                    />
                    <label htmlFor="staff_otp_required" className="text-sm font-semibold text-text-primary cursor-pointer">
                      Require OTP verification to view staff profile details
                    </label>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Description</label>
                    <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm resize-none" />
                  </div>
                </div>
              </>
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
          <h1 className="text-2xl font-bold text-text-primary">Hospital Management</h1>
          <p className="text-text-muted text-sm mt-1">Manage Bengali Hospitals, Doctors, and Emergency Contacts</p>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <button onClick={seedSampleData} disabled={seeding} className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-border hover:bg-border/50 text-text-primary rounded-xl text-sm font-medium transition-colors shadow-sm active:scale-95 cursor-pointer disabled:opacity-50">
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />} Load Sample Data
            </button>
          )}
          {canEdit && (
            <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors shadow-md active:scale-95 cursor-pointer">
              <Plus className="w-4 h-4" /> Add New {activeTab === 'hospitals' ? 'Hospital' : activeTab === 'doctors' ? 'Doctor' : 'Staff'}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('hospitals')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'hospitals' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
        >
          <Building2 className="w-4 h-4" /> Bengali Hospitals
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'doctors' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
        >
          <UserRound className="w-4 h-4" /> Bengali Doctors
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'staff' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
        >
          <Users className="w-4 h-4" /> Bengali Staff
        </button>
      </div>

      {(activeTab === 'doctors' || activeTab === 'staff') && hospitals.length > 0 && (
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-border shadow-sm">
          <label className="text-sm font-bold text-text-primary whitespace-nowrap">Filter by Hospital:</label>
          <select 
            value={selectedHospitalFilter} 
            onChange={e => setSelectedHospitalFilter(e.target.value)} 
            className="w-full max-w-xs px-3 py-2 bg-surface border border-border rounded-lg text-sm cursor-pointer"
          >
            <option value="all">All Hospitals</option>
            {hospitals.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[30px]">
          {(activeTab === 'hospitals' 
             ? hospitals 
             : activeTab === 'doctors' 
               ? doctors.filter(d => selectedHospitalFilter === 'all' || d.hospital_ids?.includes(selectedHospitalFilter) || d.hospital_id === selectedHospitalFilter) 
               : staff.filter(s => selectedHospitalFilter === 'all' || s.hospital_id === selectedHospitalFilter)
          ).map((item: any) => (
            <div key={item.id} className="bg-white rounded-[25px] border border-gray-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:border-primary/20 hover:shadow-lg transition-all relative h-full group overflow-hidden min-h-[520px]">
              {activeTab === 'hospitals' ? (
                <>
                  <div className="relative h-[255px] bg-slate-100 overflow-hidden shrink-0">
                    <ListingCoverImage 
                      name={item.name} 
                      city={item.city} 
                      mapsUrl={item.google_maps_url} 
                      imageUrl={item.image_url}
                      fallbackIcon={<Building2 className="w-12 h-12" />}
                    />
                    
                    {/* Gradient Shadow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 z-10 pointer-events-none">
                      <h3 className="text-xl font-bold text-white leading-tight font-display">{item.name}</h3>
                      <div className="flex items-center gap-1.5 mt-2 text-sm text-white/90">
                        <MapPin className="w-4 h-4 text-white shrink-0" />
                        <span>{item.area ? `${item.area}, ` : ''}{item.city}</span>
                      </div>
                    </div>

                    {/* Top-left Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-20">
                      {item.category && (
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider text-white shadow-sm ${item.category === 'Government' ? 'bg-blue-600' : 'bg-orange-600'}`}>
                          {item.category}
                        </span>
                      )}
                      {item.is_24_7 && (
                        <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" /> 24/7
                        </span>
                      )}
                      {item.has_bengali_doctor && (
                        <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                          🩺 Bengali Doctor
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-[22px] flex-1 flex flex-col relative">
                    <div className="flex-1">
                      {item.specializations && item.specializations.length > 0 ? (
                        <div className="flex flex-wrap gap-3 mb-5">
                          {item.specializations.slice(0, 4).map((s: string) => (
                            <span key={s} className="px-3 py-1.5 bg-[#FFF1F0] border border-[#FFA39E] rounded-lg text-xs font-semibold text-[#B81D18]">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-text-muted italic mb-5">No specializations listed</div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-auto border-t border-border/60 pt-4 mb-4">
                      <div className="flex items-center gap-2">
                        {item.status && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                            {item.status}
                          </span>
                        )}
                        {item.main_branch ? (
                          <span className="shrink-0 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">MAIN</span>
                        ) : (
                          <span className="shrink-0 text-text-muted font-bold text-[10px] border border-border px-2 py-0.5 rounded bg-gray-50">BRANCH</span>
                        )}
                      </div>
                      <div className="text-xs font-mono font-medium text-text-muted truncate ml-2">
                         {item.phone}
                      </div>
                    </div>
                  </div>
                </>
              ) : activeTab === 'doctors' ? (
                <div className="p-[22px] flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-4">
                    {item.photo ? (
                      <img src={item.photo} alt={item.doctor_name} className="w-16 h-16 rounded-full object-cover border-2 border-primary/10" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary border-2 border-primary/10">
                        <UserRound className="w-8 h-8" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-text-primary text-lg leading-tight mb-1">{item.doctor_name}</h3>
                      <p className="text-primary font-semibold text-sm">{item.specialization}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-sm text-text-muted mb-4">
                    <p><span className="font-semibold">Exp:</span> {item.experience}</p>
                    <p><span className="font-semibold">Hospital:</span> {hospitals.find((h: any) => h.id === item.hospital_id)?.name || 'Unknown'}</p>
                    {item.languages && item.languages.length > 0 && (
                      <p><span className="font-semibold">Languages:</span> {item.languages.join(', ')}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-[22px] flex flex-col h-full">
                  <h3 className="font-bold text-text-primary text-lg leading-tight mb-1">{item.name}</h3>
                  <p className="text-primary font-semibold text-sm mb-3">{item.role || item.department}</p>
                  <div className="space-y-1.5 text-sm text-text-muted mb-4">
                    <p><span className="font-semibold">Dept:</span> {item.department}</p>
                    <p><span className="font-semibold">Hospital:</span> {hospitals.find((h: any) => h.id === item.hospital_id)?.name || 'Unknown'}</p>
                  </div>
                </div>
              )}

              <div className="mt-auto flex justify-end gap-[12px] px-[22px] pb-[22px]">
                {canEdit && (
                  <button onClick={() => openEdit(item)} className="h-[52px] w-[52px] flex items-center justify-center rounded-[16px] text-primary bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer" title="Edit">
                    <Pencil className="w-5 h-5" />
                  </button>
                )}
                {canManage && (
                  <button onClick={() => handleDelete(item.id)} className="h-[52px] w-[52px] flex items-center justify-center rounded-[16px] text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer" title="Delete">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {(activeTab === 'hospitals' ? hospitals : activeTab === 'doctors' ? doctors : staff).length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-border shadow-sm text-text-muted text-sm italic">
              No data yet
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default function AdminEmergencyPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-2xl border border-border">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-text-muted text-sm font-medium">Loading emergency panel...</p>
      </div>
    }>
      <AdminEmergencyPageContent />
    </Suspense>
  );
}
