'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Hospital, BengaliDoctor, BengaliStaff } from '@/types';
import { Plus, Pencil, Trash2, X, Loader2, Shield, Building2, UserRound, PhoneCall, CheckCircle, Users } from 'lucide-react';

const CHENNAI_AREAS = ['Adyar', 'Alandur', 'Ambattur', 'Anna Nagar', 'Ashok Nagar', 'Aminjikarai', 'Avadi', 'Besant Nagar', 'Broadway', 'Chromepet', 'Egmore', 'Guindy', 'Kilpauk', 'Kodambakkam', 'Kolathur', 'Madipakkam', 'Madhavaram', 'Mambalam', 'Manapakkam', 'Medavakkam', 'Mogappair', 'Nanganallur', 'OMR', 'Pallavaram', 'Perambur', 'Porur', 'Royapettah', 'Saidapet', 'Sholinganallur', 'Tambaram', 'T Nagar', 'Thiruvanmiyur', 'Triplicane', 'Vadapalani', 'Velachery', 'Villivakkam', 'Virugambakkam', 'West Mambalam', 'Greams Road', 'Gandhi Nagar', 'Koyambedu', 'Mylapore', 'Perungudi'].sort();
const LANGUAGES = ['Bengali', 'Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'Urdu'];

const SAMPLE_HOSPITALS = [
  { name: 'Apollo Hospital Chennai', city: 'Chennai', area: 'Greams Road', emergency_phone: '1066', phone: '044-28293333', is_24_7: true, has_bengali_doctor: true, main_branch: true, specializations: ['Cardiology', 'Neurology', 'Oncology'], description: 'Leading multi-specialty hospital.', images: ['/images/hospitals/apollo-chennai.jpg'] },
  { name: 'MGM Healthcare Chennai', city: 'Chennai', area: 'Aminjikarai', emergency_phone: '044-45688888', phone: '044-45688888', is_24_7: true, has_bengali_doctor: true, main_branch: false, specializations: ['Heart Transplant', 'Orthopedics'], description: 'State of the art healthcare.', images: ['/images/hospitals/mgm-healthcare.jpg'] },
  { name: 'MIOT International Chennai', city: 'Chennai', area: 'Manapakkam', emergency_phone: '105710', phone: '044-22492288', is_24_7: true, has_bengali_doctor: true, main_branch: true, specializations: ['Orthopedics', 'Trauma'], description: 'Pioneers in orthopedic care.', images: ['/images/hospitals/miot-international.jpg'] },
  { name: 'Fortis Malar Hospital Chennai', city: 'Chennai', area: 'Adyar', emergency_phone: '044-42892222', phone: '044-42892222', is_24_7: true, has_bengali_doctor: true, main_branch: false, specializations: ['Cardiology', 'Gynecology'], description: 'Comprehensive medical care.', images: ['/images/hospitals/fortis-malar.jpg'] },
  { name: 'SIMS Hospital Chennai', city: 'Chennai', area: 'Vadapalani', emergency_phone: '044-20002001', phone: '044-20002001', is_24_7: true, has_bengali_doctor: true, main_branch: false, specializations: ['Gastroenterology', 'Neurology'], description: 'Expert medical professionals.', images: ['/images/hospitals/sims-hospital.jpg'] }
];

const SAMPLE_DOCTORS = [
  { doctor_name: 'Dr. Anirban Roy', specialization: 'Cardiologist', experience: '15 years', languages: ['Bengali', 'English', 'Tamil'] },
  { doctor_name: 'Dr. Saptarshi Chatterjee', specialization: 'Neurologist', experience: '12 years', languages: ['Bengali', 'English'] },
  { doctor_name: 'Dr. Debasish Banerjee', specialization: 'Orthopedic Surgeon', experience: '20 years', languages: ['Bengali', 'English', 'Hindi'] },
  { doctor_name: 'Dr. Soumya Mukherjee', specialization: 'General Physician', experience: '8 years', languages: ['Bengali', 'English', 'Tamil'] },
  { doctor_name: 'Dr. Priyanka Ghosh', specialization: 'Gynecologist', experience: '10 years', languages: ['Bengali', 'English'] }
];

export default function AdminEmergencyPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors' | 'staff' | 'contacts'>('hospitals');
  
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
      
      for (let i=0; i<SAMPLE_DOCTORS.length; i++) {
        const d = SAMPLE_DOCTORS[i];
        const id = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        // Assign to a random hospital we just created, or cycle through
        const hId = hospitalDocs[i % hospitalDocs.length].id;
        const payload = { ...d, id, hospital_id: hId, created_at: now };
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
        ? { specializations: '', images: '', main_branch: false, is_24_7: false, has_bengali_doctor: false } 
        : { languages: [] }
    );
    setShowForm(true);
  }

  function openEdit(item: any) {
    setEditId(item.id);
    const data = { ...item };
    if (activeTab === 'hospitals') {
      if (Array.isArray(data.images)) data.images = data.images.join('\n');
      if (Array.isArray(data.specializations)) data.specializations = data.specializations.join('\n');
    }
    if (activeTab === 'doctors' || activeTab === 'staff') {
      if (!Array.isArray(data.languages)) data.languages = [];
    }
    setFormData(data);
    setShowForm(true);
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
        payload.images = typeof payload.images === 'string' 
          ? payload.images.split('\n').map((s: string) => s.trim()).filter(Boolean) : [];
        payload.specializations = typeof payload.specializations === 'string' 
          ? payload.specializations.split('\n').map((s: string) => s.trim()).filter(Boolean) : [];
      } else {
        if (!Array.isArray(payload.languages)) {
           payload.languages = [];
        }
      }

      // OPTIMISTIC UI UPDATE
      if (editId) {
        if (activeTab === 'hospitals') {
          setHospitals(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as Hospital : i));
        } else if (activeTab === 'doctors') {
          setDoctors(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as BengaliDoctor : i));
        } else {
          setStaff(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as BengaliStaff : i));
        }
      } else {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        payload.id = id;
        payload.created_at = now;
        
        if (activeTab === 'hospitals') {
          setHospitals(prev => [{ ...payload } as Hospital, ...prev]);
        } else if (activeTab === 'doctors') {
          setDoctors(prev => [{ ...payload } as BengaliDoctor, ...prev]);
        } else {
          setStaff(prev => [{ ...payload } as BengaliStaff, ...prev]);
        }
      }
      
      // Close form immediately for fast UX
      setShowForm(false);
      setSaving(false);

      // BACKGROUND SYNC TO FIRESTORE
      if (editId) {
        await updateDoc(doc(db, collectionName, editId), { ...payload, updated_at: now });
      } else {
        await setDoc(doc(db, collectionName, payload.id), { ...payload });
      }
    } catch (e) {
      console.error(e);
      alert('Error saving item to database.');
    } finally {
      // setSaving(false) already called for optimistic UI

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
          {canEdit && activeTab !== 'contacts' && (
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
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospital</th>
                  </>
                ) : (
                  <>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Staff Name</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Department</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospital</th>
                  </>
                )}
                {(canEdit || canManage) && <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(activeTab === 'hospitals' 
                 ? hospitals 
                 : activeTab === 'doctors' 
                   ? doctors.filter(d => selectedHospitalFilter === 'all' || d.hospital_id === selectedHospitalFilter) 
                   : staff.filter(s => selectedHospitalFilter === 'all' || s.hospital_id === selectedHospitalFilter)
              ).map((item: any) => (
                <tr key={item.id} className="hover:bg-surface transition-colors">
                  {activeTab === 'hospitals' ? (
                    <>
                      <td className="px-5 py-4 text-sm text-text-primary font-medium">{item.name}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.city}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.phone}</td>
                      <td className="px-5 py-4 text-sm font-bold text-red-600">{item.emergency_phone || '-'}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.main_branch ? <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-1 rounded">Main</span> : <span className="text-text-muted text-xs">Branch</span>}</td>
                    </>
                  ) : activeTab === 'doctors' ? (
                    <>
                      <td className="px-5 py-4 text-sm text-text-primary font-medium">{item.doctor_name}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.specialization}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">
                        {hospitals.find(h => h.id === item.hospital_id)?.name || 'Unknown'}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-4 text-sm text-text-primary font-medium">{item.name}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.role}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">{item.department}</td>
                      <td className="px-5 py-4 text-sm text-text-muted">
                        {hospitals.find(h => h.id === item.hospital_id)?.name || 'Unknown'}
                      </td>
                    </>
                  )}
                  {(canEdit || canManage) && (
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canEdit && <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>}
                        {canManage && <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {(activeTab === 'hospitals' ? hospitals : activeTab === 'doctors' ? doctors : staff).length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm italic">No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl border border-border w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-text-primary">{editId ? 'Edit' : 'Add'} {activeTab === 'hospitals' ? 'Hospital' : activeTab === 'doctors' ? 'Doctor' : 'Staff'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-surface text-text-muted transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
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
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">State *</label>
                      <input type="text" value={formData.state || 'Tamil Nadu'} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">District *</label>
                      <input type="text" value={formData.district || 'Chennai'} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Area</label>
                      <select value={formData.area || ''} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="">Select Area...</option>
                        {CHENNAI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Full Address</label>
                      <input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone</label>
                      <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Emergency Phone</label>
                      <input type="text" value={formData.emergency_phone || ''} onChange={e => setFormData({...formData, emergency_phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Email</label>
                      <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Website</label>
                      <input type="text" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Google Maps Link</label>
                      <input type="text" value={formData.google_maps_url || ''} onChange={e => setFormData({...formData, google_maps_url: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="is_24_7" checked={!!formData.is_24_7} onChange={e => setFormData({...formData, is_24_7: e.target.checked})} className="w-5 h-5 rounded border-border" />
                        <label htmlFor="is_24_7" className="text-sm font-semibold text-text-primary cursor-pointer">24/7 Service</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="has_bengali_doctor" checked={!!formData.has_bengali_doctor} onChange={e => setFormData({...formData, has_bengali_doctor: e.target.checked})} className="w-5 h-5 rounded border-border" />
                        <label htmlFor="has_bengali_doctor" className="text-sm font-semibold text-text-primary cursor-pointer">Has Bengali Doctor</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="has_bengali_staff" checked={!!formData.has_bengali_staff} onChange={e => setFormData({...formData, has_bengali_staff: e.target.checked})} className="w-5 h-5 rounded border-border" />
                        <label htmlFor="has_bengali_staff" className="text-sm font-semibold text-text-primary cursor-pointer">Has Bengali Staff</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="main_branch" checked={!!formData.main_branch} onChange={e => setFormData({...formData, main_branch: e.target.checked})} className="w-5 h-5 rounded border-border" />
                        <label htmlFor="main_branch" className="text-sm font-semibold text-text-primary cursor-pointer">Main Branch</label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Specializations (One per line)</label>
                      <textarea rows={3} value={formData.specializations || ''} onChange={e => setFormData({...formData, specializations: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm resize-none" placeholder="Cardiology&#10;Neurology" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Description / Services Offered</label>
                      <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm resize-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Images (One URL per line)</label>
                      <textarea rows={3} value={formData.images || ''} onChange={e => setFormData({...formData, images: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm resize-none" placeholder="https://example.com/image1.jpg" />
                    </div>
                  </div>
                </>
              ) : activeTab === 'doctors' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Doctor Name *</label>
                      <input type="text" value={formData.doctor_name || ''} onChange={e => setFormData({...formData, doctor_name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Specialization *</label>
                      <input type="text" value={formData.specialization || ''} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Assign to Hospital *</label>
                      <select value={formData.hospital_id || ''} onChange={e => setFormData({...formData, hospital_id: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="">Select Hospital...</option>
                        {hospitals.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Experience (e.g. 10 years)</label>
                      <input type="text" value={formData.experience || ''} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Photo URL</label>
                      <input type="text" value={formData.photo || ''} onChange={e => setFormData({...formData, photo: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone</label>
                      <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Email</label>
                      <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Languages</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
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
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 bg-surface/50 rounded-xl border border-border">
                      <h4 className="md:col-span-2 text-sm font-bold text-text-primary">Social Media Profiles</h4>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">LinkedIn URL</label>
                        <input type="url" value={formData.social_links?.linkedin || ''} onChange={e => setFormData({...formData, social_links: {...formData.social_links, linkedin: e.target.value}})} className="w-full px-4 py-2 bg-white border border-border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Facebook URL</label>
                        <input type="url" value={formData.social_links?.facebook || ''} onChange={e => setFormData({...formData, social_links: {...formData.social_links, facebook: e.target.value}})} className="w-full px-4 py-2 bg-white border border-border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">Instagram URL</label>
                        <input type="url" value={formData.social_links?.instagram || ''} onChange={e => setFormData({...formData, social_links: {...formData.social_links, instagram: e.target.value}})} className="w-full px-4 py-2 bg-white border border-border rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-text-primary mb-1.5">X (Twitter) URL</label>
                        <input type="url" value={formData.social_links?.x || ''} onChange={e => setFormData({...formData, social_links: {...formData.social_links, x: e.target.value}})} className="w-full px-4 py-2 bg-white border border-border rounded-lg text-sm" />
                      </div>
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
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Role * (e.g. Receptionist)</label>
                      <input type="text" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Department</label>
                      <input type="text" value={formData.department || ''} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Assign to Hospital *</label>
                      <select value={formData.hospital_id || ''} onChange={e => setFormData({...formData, hospital_id: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="">Select Hospital...</option>
                        {hospitals.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Experience (e.g. 5 years)</label>
                      <input type="text" value={formData.experience || ''} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Availability (e.g. Mon-Fri 9AM-5PM)</label>
                      <input type="text" value={formData.availability || ''} onChange={e => setFormData({...formData, availability: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Photo URL</label>
                      <input type="text" value={formData.photo || ''} onChange={e => setFormData({...formData, photo: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone</label>
                      <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Email</label>
                      <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Languages</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Description</label>
                      <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm resize-none" />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-surface/30">
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
