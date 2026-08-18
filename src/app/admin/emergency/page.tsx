'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Hospital, BengaliDoctor, BengaliStaff, Pharmacy, HospitalReview } from '@/types';
import { CITIES } from '@/lib/constants';
import ImageUpload from '@/components/admin/ImageUpload';
import { Plus, Pencil, Trash2, X, Loader2, Shield, Building2, UserRound, PhoneCall, CheckCircle, Users, ArrowLeft, Save, Pill, Clock, Truck, Star, MessageSquare, Download, FileSpreadsheet, FileText, Search, Filter } from 'lucide-react';
import { exportToCSV, exportToExcel } from '@/lib/utils/export';

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

const PREDEFINED_DESIGNATIONS = [
  'Senior Consultant',
  'Consultant',
  'Junior Consultant',
  'Associate Consultant',
  'Chief Medical Officer',
  'Medical Officer',
  'Resident Doctor',
  'Head of Department (HOD)',
  'Surgeon',
  'Physician',
  'Senior Resident',
  'Junior Resident',
  'Superintendent',
  'Nursing Superintendent',
  'Head Nurse',
  'Staff Nurse',
  'Senior Nurse',
  'Clinical Nurse Specialist',
  'Chief Pharmacist',
  'Senior Pharmacist',
  'Pharmacist',
  'Lab Technician',
  'Senior Lab Technician',
  'Radiologist',
  'Radiology Technician',
  'Receptionist',
  'Front Desk Executive',
  'Patient Care Coordinator',
  'Medical Social Worker',
  'Administrative Officer',
  'Hospital Administrator'
];

function AdminEmergencyPageContent() {
  const { profile } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors' | 'staff' | 'pharmacies' | 'feedbacks'>('hospitals');

  useEffect(() => {
    if (tabParam && ['hospitals', 'doctors', 'staff', 'pharmacies', 'feedbacks'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);
  
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<BengaliDoctor[]>([]);
  const [staff, setStaff] = useState<BengaliStaff[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [feedbacks, setFeedbacks] = useState<HospitalReview[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState('all');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('all');
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [selectedHospitalFilter, setSelectedHospitalFilter] = useState<string>('all');

  const moduleKey = 'emergency';
  const canView = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'view');
  const canEdit = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'edit');
  const canManage = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'manage');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [hSnap, dSnap, sSnap, pSnap, fSnap] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.hospitals)).catch(() => ({ docs: [] })),
        getDocs(collection(db, COLLECTIONS.bengali_doctors)).catch(() => ({ docs: [] })),
        getDocs(collection(db, COLLECTIONS.bengali_staff || 'bengali_staff')).catch(() => ({ docs: [] })),
        getDocs(collection(db, COLLECTIONS.pharmacies || 'pharmacies')).catch(() => ({ docs: [] })),
        getDocs(collection(db, COLLECTIONS.hospital_reviews || 'hospital_reviews')).catch(() => ({ docs: [] }))
      ]);

      setHospitals(hSnap.docs.map(d => ({ id: d.id, ...d.data() } as Hospital)));
      setDoctors(dSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliDoctor)));
      setStaff(sSnap.docs.map(d => ({ id: d.id, ...d.data() } as BengaliStaff)));
      setPharmacies(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Pharmacy)));

      // Load Reviews from 1) API, 2) Firestore Client SDK, 3) localStorage, 4) Sample fallback
      let allReviews: HospitalReview[] = [];

      // 1) API
      try {
        const apiRes = await fetch('/api/public/firestore?collection=hospital_reviews');
        if (apiRes.ok) {
          const apiJson = await apiRes.json();
          if (Array.isArray(apiJson.items) && apiJson.items.length > 0) {
            allReviews.push(...apiJson.items);
          }
        }
      } catch (err) {}

      // 2) Firestore Client SDK
      if (fSnap.docs && fSnap.docs.length > 0) {
        const clientDocs = fSnap.docs.map(d => ({ id: d.id, ...d.data() } as HospitalReview));
        allReviews.push(...clientDocs);
      }

      // 3) localStorage fallback
      try {
        const localData = localStorage.getItem('hospital_reviews');
        if (localData) {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed)) {
            allReviews.push(...parsed);
          }
        }
      } catch (err) {}

      // Deduplicate by ID
      const map = new Map<string, HospitalReview>();
      allReviews.forEach(r => {
        if (r && r.id && !map.has(r.id)) {
          map.set(r.id, r);
        }
      });

      let finalReviews = Array.from(map.values());

      // 4) If no reviews exist yet, use initial sample reviews
      if (finalReviews.length === 0) {
        finalReviews = [
          {
            id: 'rev-sample-1',
            hospital_id: 'apollo-greams-road',
            hospital_name: 'Apollo Hospital, Greams Road',
            user_name: 'Debashis Roy',
            is_verified: true,
            hospital_rating: 5,
            website_rating: 5,
            category: 'Doctors & Staff',
            comment: 'Exceptional cardiac care. Bengali speaking patient desk staff was very helpful for my mother during admission.',
            created_at: '2026-08-15T10:30:00.000Z'
          },
          {
            id: 'rev-sample-2',
            hospital_id: 'fortis-malar',
            hospital_name: 'Fortis Malar Hospital',
            user_name: 'Sarmistha Mukherjee',
            is_verified: true,
            hospital_rating: 4,
            website_rating: 5,
            category: 'Hospital Services',
            comment: 'Prompt emergency assistance and quick billing process. Website information was 100% accurate.',
            created_at: '2026-08-14T14:15:00.000Z'
          },
          {
            id: 'rev-sample-3',
            hospital_id: 'mgm-healthcare',
            hospital_name: 'MGM Healthcare, Aminjikarai',
            user_name: 'Anirban Das',
            is_verified: true,
            hospital_rating: 5,
            website_rating: 4,
            category: 'Cleanliness',
            comment: 'World class infrastructure and extremely clean ICU facilities. Highly recommend for specialized surgery.',
            created_at: '2026-08-12T09:45:00.000Z'
          }
        ];
      }

      setFeedbacks(finalReviews);

    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteFeedback(id: string) {
    if (!confirm('Are you sure you want to delete this feedback review?')) return;
    try {
      setFeedbacks(prev => prev.filter(f => f.id !== id));
      await deleteDoc(doc(db, COLLECTIONS.hospital_reviews, id)).catch(() => {});
      try {
        const localData = JSON.parse(localStorage.getItem('hospital_reviews') || '[]');
        const updatedLocal = localData.filter((item: any) => item.id !== id);
        localStorage.setItem('hospital_reviews', JSON.stringify(updatedLocal));
      } catch (e) {}
    } catch (e) {
      console.error('Error deleting feedback:', e);
      alert('Error deleting feedback item.');
    }
  }

  function openAdd() {
    setEditId(null);
    setFormData(
      activeTab === 'hospitals' 
        ? { specializations: [], category: 'Private', status: 'Active', main_branch: false, is_24_7: false, has_bengali_doctor: false } 
        : activeTab === 'doctors'
          ? { hospital_ids: [], languages: ['Bengali'], specialization: 'Cardiology', otp_required: true }
          : activeTab === 'staff'
            ? { languages: ['Bengali'], department: 'Reception', otp_required: true }
            : { 
                government_level: 'Central Government',
                scheme_name: 'PMBJP – Pradhan Mantri Bhartiya Janaushadhi Pariyojana',
                pharmacy_type: 'Jan Aushadhi Kendra',
                name: 'Jan Aushadhi Kendra',
                medicine_name: '',
                mrp: '',
                offer_price: '',
                stock: 'In Stock',
                state: 'Tamil Nadu',
                district: 'Chennai',
                city: 'Chennai',
                area: '',
                pin_code: '',
                is_24_7: false, 
                home_delivery: false, 
                languages: ['Bengali', 'English', 'Tamil'] 
              }
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
      if (!data.instagram_url && data.social_links?.instagram) data.instagram_url = data.social_links.instagram;
      if (!data.facebook_url && data.social_links?.facebook) data.facebook_url = data.social_links.facebook;
    }
    if (activeTab === 'staff') {
      if (!Array.isArray(data.languages)) data.languages = [];
      if (data.otp_required === undefined) data.otp_required = true;
      if (!data.instagram_url && data.social_links?.instagram) data.instagram_url = data.social_links.instagram;
      if (!data.facebook_url && data.social_links?.facebook) data.facebook_url = data.social_links.facebook;
    }
    if (activeTab === 'pharmacies') {
      if (!Array.isArray(data.languages)) data.languages = [];
      if (!data.government_level) data.government_level = 'Central Government';
      if (!data.scheme_name) {
        data.scheme_name = data.government_level === 'Central Government' 
          ? 'PMBJP – Pradhan Mantri Bhartiya Janaushadhi Pariyojana' 
          : 'Mudhalvar Marundhagam';
      }
      if (!data.state) data.state = 'Tamil Nadu';
      if (!data.city) data.city = 'Chennai';
      if (data.is_24_7 === undefined) data.is_24_7 = false;
      if (data.home_delivery === undefined) data.home_delivery = false;
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
          : activeTab === 'staff'
            ? (COLLECTIONS.bengali_staff || 'bengali_staff')
            : (COLLECTIONS.pharmacies || 'pharmacies');
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
        const existingSocial = payload.social_links || {};
        payload.social_links = {
          ...existingSocial,
          instagram: payload.instagram_url || existingSocial.instagram || '',
          facebook: payload.facebook_url || existingSocial.facebook || '',
        };
      } else if (activeTab === 'staff') {
        if (!Array.isArray(payload.languages)) {
          payload.languages = [];
        }
        const existingSocial = payload.social_links || {};
        payload.social_links = {
          ...existingSocial,
          instagram: payload.instagram_url || existingSocial.instagram || '',
          facebook: payload.facebook_url || existingSocial.facebook || '',
        };
      } else {
        if (!Array.isArray(payload.languages)) {
          payload.languages = [];
        }
      }

      if (editId) {
        if (activeTab === 'hospitals') {
          setHospitals(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as Hospital : i));
        } else if (activeTab === 'doctors') {
          setDoctors(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as BengaliDoctor : i));
        } else if (activeTab === 'staff') {
          setStaff(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as BengaliStaff : i));
        } else {
          setPharmacies(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as Pharmacy : i));
        }
      } else {
        const id = `${activeTab === 'hospitals' ? 'hosp' : activeTab === 'pharmacies' ? 'pharm' : 'item'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        payload.id = id;
        payload.created_at = now;
        
        if (activeTab === 'hospitals') {
          setHospitals(prev => [{ ...payload } as Hospital, ...prev]);
        } else if (activeTab === 'doctors') {
          setDoctors(prev => [{ ...payload } as BengaliDoctor, ...prev]);
        } else if (activeTab === 'staff') {
          setStaff(prev => [{ ...payload } as BengaliStaff, ...prev]);
        } else {
          setPharmacies(prev => [{ ...payload } as Pharmacy, ...prev]);
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
          : activeTab === 'staff'
            ? (COLLECTIONS.bengali_staff || 'bengali_staff')
            : (COLLECTIONS.pharmacies || 'pharmacies');
      await deleteDoc(doc(db, collectionName, id));
      if (activeTab === 'hospitals') {
        setHospitals(prev => prev.filter(i => i.id !== id));
      } else if (activeTab === 'doctors') {
        setDoctors(prev => prev.filter(i => i.id !== id));
      } else if (activeTab === 'staff') {
        setStaff(prev => prev.filter(i => i.id !== id));
      } else {
        setPharmacies(prev => prev.filter(i => i.id !== id));
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
              {editId ? 'Edit' : 'Add New'} {activeTab === 'hospitals' ? 'Hospital' : activeTab === 'doctors' ? 'Doctor' : activeTab === 'staff' ? 'Staff' : 'Govt Pharmacy'}
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
                    <select value={formData.city || 'Chennai'} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                      <option value="">Select City...</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      {formData.city && !CITIES.includes(formData.city) && (
                        <option value={formData.city}>{formData.city}</option>
                      )}
                    </select>
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
                  {Boolean(formData.address && formData.address.trim()) && (
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Pincode</label>
                      <input type="text" maxLength={6} value={formData.pincode || ''} onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 600020" />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Google Maps Link</label>
                    <input type="text" value={formData.google_maps_url || ''} onChange={e => setFormData({...formData, google_maps_url: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="https://maps.google.com/..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Hospital Cover Image</label>
                    <ImageUpload value={formData.image_url || ''} onChange={(url) => setFormData({...formData, image_url: url})} folder="admin_uploads/hospitals" />
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
                    <select value={formData.designation || ''} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                      <option value="">Select Designation...</option>
                      {PREDEFINED_DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      {formData.designation && !PREDEFINED_DESIGNATIONS.includes(formData.designation) && (
                        <option value={formData.designation}>{formData.designation}</option>
                      )}
                    </select>
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
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Google Rating (e.g. 4.8 ⭐)</label>
                    <input type="number" step="0.1" min="1" max="5" value={formData.google_rating || ''} onChange={e => setFormData({...formData, google_rating: parseFloat(e.target.value) || undefined})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 4.8" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Google Reviews Count</label>
                    <input type="number" min="0" value={formData.google_review_count || ''} onChange={e => setFormData({...formData, google_review_count: parseInt(e.target.value) || undefined})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 326" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Google Review Link / URL</label>
                    <input type="url" value={formData.google_review_url || formData.google_review_link || ''} onChange={e => setFormData({...formData, google_review_url: e.target.value, google_review_link: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. https://maps.google.com/?q=Apollo+Hospitals+Greams+Road+Chennai" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Instagram Profile URL</label>
                    <input type="url" value={formData.instagram_url || ''} onChange={e => setFormData({...formData, instagram_url: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="https://instagram.com/dr_username" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Facebook Profile URL</label>
                    <input type="url" value={formData.facebook_url || ''} onChange={e => setFormData({...formData, facebook_url: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="https://facebook.com/dr_username" />
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
            ) : activeTab === 'staff' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Staff Name *</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Designation</label>
                    <select value={formData.designation || ''} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                      <option value="">Select Designation...</option>
                      {PREDEFINED_DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      {formData.designation && !PREDEFINED_DESIGNATIONS.includes(formData.designation) && (
                        <option value={formData.designation}>{formData.designation}</option>
                      )}
                    </select>
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
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Instagram Profile URL</label>
                    <input type="url" value={formData.instagram_url || ''} onChange={e => setFormData({...formData, instagram_url: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="https://instagram.com/staff_username" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">Facebook Profile URL</label>
                    <input type="url" value={formData.facebook_url || ''} onChange={e => setFormData({...formData, facebook_url: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="https://facebook.com/staff_username" />
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
                    <textarea maxLength={250} rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm resize-none" placeholder="(Max 250 characters)" />
                    <p className="text-right text-[10px] text-text-muted mt-1">{(formData.description || '').length}/250</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  {/* Government Pharmacy Level Selection */}
                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 text-xs font-bold bg-blue-600 text-white rounded-md uppercase tracking-wider">
                        Government Pharmacy
                      </span>
                      <span className="text-xs text-blue-800 font-semibold">
                        Strictly Government Schemes
                      </span>
                    </div>

                    <label className="block text-sm font-semibold text-text-primary mb-2">
                      Government Level *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          government_level: 'Central Government',
                          scheme_name: 'PMBJP – Pradhan Mantri Bhartiya Janaushadhi Pariyojana',
                          pharmacy_type: 'Jan Aushadhi Kendra'
                        })}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          (formData.government_level || 'Central Government') === 'Central Government'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-text-primary border-border hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xl">🏛️</div>
                        <div>
                          <div className="font-bold text-sm">Central Government</div>
                          <div className={`text-xs mt-0.5 ${ (formData.government_level || 'Central Government') === 'Central Government' ? 'text-blue-100' : 'text-text-muted'}`}>
                            PMBJP – Jan Aushadhi Kendra
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          government_level: 'State Government',
                          scheme_name: 'Mudhalvar Marundhagam',
                          pharmacy_type: 'Mudhalvar Marundhagam'
                        })}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                          formData.government_level === 'State Government'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-text-primary border-border hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xl">🏬</div>
                        <div>
                          <div className="font-bold text-sm">State Government (Tamil Nadu)</div>
                          <div className={`text-xs mt-0.5 ${ formData.government_level === 'State Government' ? 'text-emerald-100' : 'text-text-muted'}`}>
                            Mudhalvar Marundhagam
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Scheme Name */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Scheme Name *</label>
                      <input 
                        type="text" 
                        value={formData.scheme_name || ''} 
                        onChange={e => setFormData({...formData, scheme_name: e.target.value})} 
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm font-medium" 
                        placeholder="e.g. PMBJP – Pradhan Mantri Bhartiya Janaushadhi Pariyojana" 
                      />
                    </div>

                    {/* Pharmacy Name */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Pharmacy Name *</label>
                      <input 
                        type="text" 
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" 
                        placeholder="e.g. Jan Aushadhi Kendra - Anna Nagar" 
                      />
                    </div>

                    {/* Medicine Name */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Medicine Name / Specific Product</label>
                      <input 
                        type="text" 
                        value={formData.medicine_name || ''} 
                        onChange={e => setFormData({...formData, medicine_name: e.target.value})} 
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" 
                        placeholder="e.g. Paracetamol 500mg, Metformin, General Generic Medicines" 
                      />
                    </div>

                    {/* Pricing: MRP & Offer Price */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">MRP (₹)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={formData.mrp || ''} 
                          onChange={e => setFormData({...formData, mrp: e.target.value ? Number(e.target.value) : ''})} 
                          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" 
                          placeholder="e.g. 50" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Offer Price (₹)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={formData.offer_price || ''} 
                          onChange={e => setFormData({...formData, offer_price: e.target.value ? Number(e.target.value) : ''})} 
                          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm font-bold text-emerald-600" 
                          placeholder="e.g. 10" 
                        />
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Stock Status</label>
                      <select 
                        value={formData.stock || 'In Stock'} 
                        onChange={e => setFormData({...formData, stock: e.target.value})} 
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer"
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Limited Stock">Limited Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">State *</label>
                      <input 
                        type="text" 
                        value={formData.state || 'Tamil Nadu'} 
                        onChange={e => setFormData({...formData, state: e.target.value})} 
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" 
                        placeholder="e.g. Tamil Nadu" 
                      />
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">District *</label>
                      <input 
                        type="text" 
                        value={formData.district || 'Chennai'} 
                        onChange={e => setFormData({...formData, district: e.target.value})} 
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" 
                        placeholder="e.g. Chennai / Chengalpattu" 
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">City *</label>
                      <select 
                        value={formData.city || 'Chennai'} 
                        onChange={e => setFormData({...formData, city: e.target.value})} 
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer font-medium"
                      >
                        <option value="">Select City...</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        {formData.city && !CITIES.includes(formData.city) && (
                          <option value={formData.city}>{formData.city}</option>
                        )}
                      </select>
                    </div>

                    {/* Area */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Area / Location *</label>
                      <select 
                        value={formData.area || ''} 
                        onChange={e => setFormData({...formData, area: e.target.value})} 
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer font-medium"
                      >
                        <option value="">Select Area / Location...</option>
                        {CHENNAI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                        {formData.area && !CHENNAI_AREAS.includes(formData.area) && (
                          <option value={formData.area}>{formData.area}</option>
                        )}
                      </select>
                    </div>

                    {/* PIN Code */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">PIN Code</label>
                      <input 
                        type="text" 
                        value={formData.pin_code || ''} 
                        onChange={e => setFormData({...formData, pin_code: e.target.value})} 
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" 
                        placeholder="e.g. 600040" 
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone Number</label>
                      <input 
                        type="text" 
                        value={formData.phone || ''} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" 
                        placeholder="e.g. 044-26210001" 
                      />
                    </div>



                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Full Address</label>
                      <input 
                        type="text" 
                        value={formData.address || ''} 
                        onChange={e => setFormData({...formData, address: e.target.value})} 
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" 
                        placeholder="Street name, door number..." 
                      />
                    </div>
                    {Boolean(formData.address && formData.address.trim()) && (
                      <div>
                        <label className="block text-sm font-semibold text-text-primary mb-1.5">Pincode</label>
                        <input type="text" maxLength={6} value={formData.pincode || ''} onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 600020" />
                      </div>
                    )}

                    {/* Opening & Closing Time */}
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Opening Time</label>
                      <input type="text" value={formData.opening_time || ''} onChange={e => setFormData({...formData, opening_time: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 8:00 AM" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Closing Time</label>
                      <input type="text" value={formData.closing_time || ''} onChange={e => setFormData({...formData, closing_time: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. 10:00 PM" />
                    </div>

                    {/* Google Maps URL & Cover Image */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Google Maps URL</label>
                      <input type="text" value={formData.google_maps_url || ''} onChange={e => setFormData({...formData, google_maps_url: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="https://maps.google.com/..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Cover Image</label>
                      <ImageUpload value={formData.image_url || ''} onChange={(url) => setFormData({...formData, image_url: url})} folder="admin_uploads/pharmacies" />
                    </div>

                    {/* Checkboxes */}
                    <div className="md:col-span-2 pt-2 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!formData.is_24_7} onChange={e => setFormData({...formData, is_24_7: e.target.checked})} className="w-4 h-4 rounded border-border" />
                        <span className="text-sm font-semibold text-text-primary">24/7 Available</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!formData.home_delivery} onChange={e => setFormData({...formData, home_delivery: e.target.checked})} className="w-4 h-4 rounded border-border" />
                        <span className="text-sm font-semibold text-text-primary">Home Delivery Available</span>
                      </label>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Description / Scheme Details</label>
                      <textarea maxLength={250} rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm resize-none" placeholder="Government subsidized medicine rates, discount information... (Max 250 characters)" />
                      <p className="text-right text-[10px] text-text-muted mt-1">{(formData.description || '').length}/250</p>
                    </div>
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
          <p className="text-text-muted text-sm mt-1">Manage Hospitals, Doctors, Staff, and Pharmacy</p>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors shadow-md active:scale-95 cursor-pointer">
              <Plus className="w-4 h-4" /> Add New {activeTab === 'hospitals' ? 'Hospital' : activeTab === 'doctors' ? 'Doctor' : activeTab === 'staff' ? 'Staff' : 'Govt Pharmacy'}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('hospitals')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'hospitals' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
        >
          <Building2 className="w-4 h-4" /> Hospitals
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
        <button
          onClick={() => setActiveTab('pharmacies')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'pharmacies' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
        >
          <Pill className="w-4 h-4" /> Govt Pharmacy
        </button>
        <button
          onClick={() => setActiveTab('feedbacks')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'feedbacks' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
        >
          <MessageSquare className="w-4 h-4" /> Feedbacks & Ratings ({feedbacks.length})
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
      ) : activeTab === 'feedbacks' ? (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          {/* Feedback Summary Stats & Excel Export Control */}
          <div className="p-6 bg-white border-b border-border space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Hospital Feedback Management
                </h3>
                <p className="text-xs text-text-muted mt-0.5">View patient reviews, filter comments, and export feedback report to Excel.</p>
              </div>

              {/* EXCEL ONLY EXPORT BUTTON FOR ADMIN */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const exportCols = [
                      { key: 'user_name', label: 'Patient / User Name' },
                      { key: 'hospital_name', label: 'Hospital Name' },
                      { key: 'category', label: 'Feedback Category' },
                      { key: 'hospital_rating', label: 'Hospital Rating' },
                      { key: 'website_rating', label: 'Website Rating' },
                      { key: 'comment', label: 'Review Comment' },
                      { key: 'created_at', label: 'Date Submitted' }
                    ];
                    const rows = feedbacks.map(f => {
                      const hosp = hospitals.find(h => h.id === f.hospital_id);
                      return {
                        ...f,
                        hospital_name: f.hospital_name || hosp?.name || 'General Hospital Feedback'
                      };
                    });
                    exportToExcel('Hospital_User_Feedbacks', rows, exportCols, 'User Feedbacks');
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                  title="Export all hospital feedback to Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Download Excel Report (.xlsx)
                </button>
              </div>
            </div>

            {/* Stats summary banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Avg Hospital Rating</p>
                <p className="text-2xl font-bold text-amber-900 mt-1 flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                  {feedbacks.length > 0 
                    ? (feedbacks.reduce((sum, f) => sum + (f.hospital_rating || 5), 0) / feedbacks.length).toFixed(1) 
                    : '4.8'}
                </p>
              </div>
              <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-xl">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Avg Website Rating</p>
                <p className="text-2xl font-bold text-blue-900 mt-1 flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-blue-400 text-blue-500" />
                  {feedbacks.length > 0 
                    ? (feedbacks.reduce((sum, f) => sum + (f.website_rating || 5), 0) / feedbacks.length).toFixed(1) 
                    : '4.9'}
                </p>
              </div>
              <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Feedbacks</p>
                <p className="text-2xl font-bold text-emerald-900 mt-1">{feedbacks.length}</p>
              </div>
              <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-xl">
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Verified Patients</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {feedbacks.filter(f => f.is_verified !== false).length}
                </p>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search hospital, user name, or comment text..."
                  value={feedbackSearch}
                  onChange={e => setFeedbackSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-xs font-medium focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-text-muted flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Category:</label>
                <select
                  value={feedbackCategoryFilter}
                  onChange={e => setFeedbackCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-surface border border-border rounded-xl text-xs font-medium cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Hospital Services">Hospital Services</option>
                  <option value="Doctors & Staff">Doctors & Staff</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Website Experience">Website Experience</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-text-muted">Rating:</label>
                <select
                  value={feedbackRatingFilter}
                  onChange={e => setFeedbackRatingFilter(e.target.value)}
                  className="px-3 py-2 bg-surface border border-border rounded-xl text-xs font-medium cursor-pointer"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars & Above</option>
                  <option value="3">3 Stars & Above</option>
                </select>
              </div>
            </div>
          </div>

          {/* Feedback Table */}
          <table className="w-full">
            <thead>
              <tr className="bg-surface/50 border-b border-border text-left">
                <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">User / Patient</th>
                <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospital Name</th>
                <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Category</th>
                <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospital Rating</th>
                <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Review Comment</th>
                <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {feedbacks
                .filter(f => {
                  const hosp = hospitals.find(h => h.id === f.hospital_id);
                  const hospName = f.hospital_name || hosp?.name || 'Hospital';
                  const matchesSearch = !feedbackSearch || 
                    f.user_name?.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
                    hospName.toLowerCase().includes(feedbackSearch.toLowerCase()) ||
                    f.comment?.toLowerCase().includes(feedbackSearch.toLowerCase());
                  const matchesCategory = feedbackCategoryFilter === 'all' || f.category === feedbackCategoryFilter;
                  const matchesRating = feedbackRatingFilter === 'all' || (f.hospital_rating || 5) >= Number(feedbackRatingFilter);
                  return matchesSearch && matchesCategory && matchesRating;
                })
                .map(item => {
                  const hosp = hospitals.find(h => h.id === item.hospital_id);
                  const hospName = item.hospital_name || hosp?.name || 'General Hospital Feedback';
                  return (
                    <tr key={item.id} className="hover:bg-surface/30 transition-colors border-b border-border/50">
                      <td className="px-5 py-4">
                        <div className="font-bold text-sm text-text-primary flex items-center gap-1.5">
                          {item.user_name || 'Anonymous Patient'}
                          {item.is_verified !== false && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Verified</span>
                          )}
                        </div>
                        <div className="text-[11px] text-text-muted mt-0.5">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-xs text-text-primary">{hospName}</div>
                        {hosp && <div className="text-[11px] text-text-muted">{hosp.city}</div>}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-surface border border-border rounded-lg text-xs font-semibold text-text-secondary">
                          {item.category || 'General'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 font-bold text-amber-600 text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{item.hospital_rating || 5} / 5</span>
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5">Website: {item.website_rating || 5}/5</div>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-xs text-text-primary line-clamp-2">{item.comment}</p>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {canManage && (
                          <button
                            onClick={() => handleDeleteFeedback(item.id)}
                            className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Feedback"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}

              {feedbacks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-text-muted text-sm italic">
                    No hospital user feedback entries found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-surface/50 border-b border-border">
                {activeTab === 'hospitals' ? (
                  <>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospital Name</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">City</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Phone</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Emergency No</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Branch</th>
                  </>
                ) : activeTab === 'doctors' ? (
                  <>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Doctor Name</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Specialization</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospitals</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Google Reviews</th>
                  </>
                ) : activeTab === 'staff' ? (
                  <>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Staff Name</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Designation</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospital</th>
                  </>
                ) : (
                  <>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Govt Pharmacy Name</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Scheme & Type</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Medicine / Pricing</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Location</th>
                  </>
                )}
                {canEdit && <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(activeTab === 'hospitals' 
                 ? hospitals 
                 : activeTab === 'doctors' 
                   ? doctors.filter(d => selectedHospitalFilter === 'all' || d.hospital_ids?.includes(selectedHospitalFilter) || d.hospital_id === selectedHospitalFilter) 
                   : activeTab === 'staff'
                     ? staff.filter(s => selectedHospitalFilter === 'all' || s.hospital_id === selectedHospitalFilter)
                     : pharmacies
              ).map((item: any) => (
                <tr key={item.id} className="hover:bg-surface transition-colors">
                  {activeTab === 'hospitals' ? (
                    <>
                      <td className="px-5 py-4 text-sm text-text-primary font-medium">
                        <div>{item.name}</div>
                        <div className="flex gap-1.5 mt-1">
                          {item.category && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.category === 'Government' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                              {item.category}
                            </span>
                          )}
                          {item.status && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                              {item.status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">
                        <div>{item.city}</div>
                        {item.pincode && <div className="text-xs text-text-muted font-mono mt-0.5">PIN: {item.pincode}</div>}
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.phone}</td>
                      <td className="px-5 py-4 text-sm font-bold text-red-600">{item.emergency_phone || '-'}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.main_branch ? <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-1 rounded">Main</span> : <span className="text-text-muted text-xs">Branch</span>}</td>
                    </>
                  ) : activeTab === 'doctors' ? (
                    <>
                      <td className="px-5 py-4 text-sm text-text-primary font-medium">
                        <div>{item.doctor_name}</div>
                        {item.designation && <div className="text-xs text-text-muted font-normal mt-0.5">{item.designation}</div>}
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.specialization}</td>
                      <td className="px-5 py-4 text-sm text-text-muted max-w-xs truncate">
                        {item.hospital_ids?.map((hid: string) => hospitals.find(h => h.id === hid)?.name).filter(Boolean).join(', ') || hospitals.find(h => h.id === item.hospital_id)?.name || 'Unknown'}
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-700 text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{item.google_rating ? item.google_rating.toFixed(1) : '4.8'} ⭐</span>
                            <span className="text-text-muted font-normal">({item.google_review_count || 326} reviews)</span>
                          </div>
                          {(item.google_review_url || item.google_review_link) ? (
                            <a
                              href={item.google_review_url || item.google_review_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1"
                            >
                              View Google Reviews
                            </a>
                          ) : (
                            <span className="text-[11px] text-text-muted italic">No link added</span>
                          )}
                        </div>
                      </td>
                    </>
                  ) : activeTab === 'staff' ? (
                    <>
                      <td className="px-5 py-4 text-sm text-text-primary font-medium">
                        <div>{item.name}</div>
                        {item.role && <div className="text-xs text-text-muted font-normal mt-0.5">{item.role}</div>}
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.designation || item.role}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.department}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">
                        {hospitals.find(h => h.id === item.hospital_id)?.name || 'Unknown'}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-4 text-sm text-text-primary font-medium">
                        <div className="font-bold text-text-primary text-base">{item.name}</div>
                        <div className="text-xs font-semibold mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] ${
                            (item.government_level || 'Central Government') === 'Central Government'
                              ? 'bg-blue-100 text-blue-800 font-bold border border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200'
                          }`}>
                            {(item.government_level || 'Central Government') === 'Central Government' ? '🏛️ Central Government' : '🏬 State Government'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">
                        <div className="font-semibold text-text-primary text-xs">{item.scheme_name || (item.government_level === 'State Government' ? 'Mudhalvar Marundhagam' : 'PMBJP')}</div>
                        <div className="text-xs text-text-muted mt-0.5">{item.pharmacy_type || (item.government_level === 'State Government' ? 'Mudhalvar Marundhagam' : 'Jan Aushadhi Kendra')}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">
                        {item.medicine_name && <div className="text-xs font-medium text-text-primary mb-1">{item.medicine_name}</div>}
                        {(item.mrp || item.offer_price) ? (
                          <div className="text-xs flex items-center gap-1.5">
                            {item.mrp && <span className="line-through text-gray-400">₹{item.mrp}</span>}
                            {item.offer_price && <span className="font-bold text-emerald-600">₹{item.offer_price}</span>}
                            {item.stock && <span className="bg-slate-100 text-text-muted px-1.5 py-0.5 rounded text-[10px]">{item.stock}</span>}
                          </div>
                        ) : (
                          <div className="text-xs text-emerald-600 font-medium">Government Subsidized</div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">
                        <div>{item.area ? `${item.area}, ` : ''}{item.city}</div>
                        <div className="text-xs text-text-muted">{item.district || 'Chennai'}, {item.state || 'Tamil Nadu'} {item.pin_code ? `- ${item.pin_code}` : ''}</div>
                      </td>
                    </>
                  )}
                  {(canEdit || canManage) && (
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors cursor-pointer" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors cursor-pointer" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
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
