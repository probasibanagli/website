'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Hospital, BengaliDoctor, BengaliStaff } from '@/types';
import { Plus, Pencil, Trash2, X, Loader2, Shield, Building2, UserRound, CheckCircle, Users, Lock, AlertCircle } from 'lucide-react';

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

  const isSuperAdmin = profile?.role === 'superadmin';
  const assignedHospitals = profile?.assigned_hospitals || [];

  // Helper: Check if user has permission to manage a specific hospital ID
  const isHospitalAuthorized = (hospId: string) => {
    if (isSuperAdmin) return true;
    return assignedHospitals.includes(hospId);
  };

  // Scope records to assigned hospitals for Hospital Administrators
  const authorizedHospitals = isSuperAdmin
    ? hospitals
    : hospitals.filter(h => assignedHospitals.includes(h.id));

  const authorizedDoctors = isSuperAdmin
    ? doctors
    : doctors.filter(d => (d.hospital_ids || [d.hospital_id || '']).some(id => assignedHospitals.includes(id)));

  const authorizedStaff = isSuperAdmin
    ? staff
    : staff.filter(s => assignedHospitals.includes(s.hospital_id));

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
    if (!isSuperAdmin) {
      alert('Only Super Admin can seed sample data.');
      return;
    }
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
    const defaultHospId = authorizedHospitals[0]?.id || '';
    setFormData(
      activeTab === 'hospitals'
        ? { specializations: [], category: 'Private', status: 'Active', main_branch: false, is_24_7: false, has_bengali_doctor: false }
        : activeTab === 'doctors'
          ? { hospital_ids: defaultHospId ? [defaultHospId] : [], languages: ['Bengali'], specialization: 'Cardiology', otp_required: true }
          : { hospital_id: defaultHospId, languages: ['Bengali'], department: 'Reception', otp_required: true }
    );
    setShowForm(true);
  }

  function openEdit(item: any) {
    if (activeTab === 'hospitals' && !isHospitalAuthorized(item.id)) {
      alert('Access Denied: You are not authorized to modify this hospital record. Only authorized administrators assigned to this hospital or Super Admin can edit it.');
      return;
    }
    if (activeTab === 'doctors') {
      const docHospIds = item.hospital_ids || [item.hospital_id];
      const hasAuthHosp = isSuperAdmin || docHospIds.some((id: string) => assignedHospitals.includes(id));
      if (!hasAuthHosp) {
        alert('Access Denied: You are not authorized to edit doctors associated with unassigned hospitals.');
        return;
      }
    }
    if (activeTab === 'staff' && !isSuperAdmin && !assignedHospitals.includes(item.hospital_id)) {
      alert('Access Denied: You are not authorized to edit staff associated with unassigned hospitals.');
      return;
    }

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

      const generatedId = editId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      if (!editId) {
        payload.id = generatedId;
        payload.created_at = now;
      }

      // Optimistic UI update
      if (editId) {
        if (activeTab === 'hospitals') {
          setHospitals(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as Hospital : i));
        } else if (activeTab === 'doctors') {
          setDoctors(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as BengaliDoctor : i));
        } else {
          setStaff(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as BengaliStaff : i));
        }
      } else {
        if (activeTab === 'hospitals') {
          setHospitals(prev => [{ ...payload } as Hospital, ...prev]);
        } else if (activeTab === 'doctors') {
          setDoctors(prev => [{ ...payload } as BengaliDoctor, ...prev]);
        } else {
          setStaff(prev => [{ ...payload } as BengaliStaff, ...prev]);
        }
      }

      setShowForm(false);
      setSaving(false);

      // Firestore update
      if (editId) {
        await updateDoc(doc(db, collectionName, editId), { ...payload, updated_at: now });
      } else {
        await setDoc(doc(db, collectionName, payload.id), { ...payload });

        // If Hospital Admin created a new hospital, automatically grant them permission to manage it
        if (activeTab === 'hospitals' && !isSuperAdmin && profile?.uid) {
          const updatedScope = [...assignedHospitals, payload.id];
          await updateDoc(doc(db, 'users', profile.uid), {
            assigned_hospitals: updatedScope,
            updated_at: now
          });
        }
      }

      // Log activity
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: editId ? 'Hospital Record Updated' : 'New Hospital Record Added',
          performed_by: profile?.full_name || 'Admin',
          user_role: profile?.role || 'admin',
          details: `${editId ? 'Updated' : 'Added'} ${activeTab.slice(0, -1)} record: ${payload.name || payload.doctor_name || payload.id}`
        })
      }).catch(() => {});

    } catch (e) {
      console.error(e);
      alert('Error saving item to database.');
    }
  }

  async function handleDelete(id: string) {
    if (activeTab === 'hospitals' && !isHospitalAuthorized(id)) {
      alert('Access Denied: You are not authorized to delete this hospital record.');
      return;
    }
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
    <div className="text-center py-20">
      <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-text-primary mb-2">No Access</h2>
      <p className="text-text-muted">You don&apos;t have permission to access the Hospital Management module.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary">Hospital Management</h1>
            {!isSuperAdmin && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Assigned Scope ({authorizedHospitals.length})
              </span>
            )}
          </div>
          <p className="text-text-muted text-sm mt-1">
            {isSuperAdmin ? 'Super Admin Control: Full management access across all registered hospitals' : 'Hospital Administrator: Manage records for your assigned hospitals'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSuperAdmin && canEdit && (
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

      {/* Access scope banner for Hospital Admin */}
      {!isSuperAdmin && authorizedHospitals.length === 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-bold">No Hospitals Currently Assigned</p>
            <p className="mt-0.5">Your Super Admin has not assigned specific hospitals to your account yet. Contact your Super Admin to grant permissions for your assigned hospital(s).</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab('hospitals')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'hospitals' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
        >
          <Building2 className="w-4 h-4" /> Hospitals ({authorizedHospitals.length})
        </button>
        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'doctors' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
        >
          <UserRound className="w-4 h-4" /> Bengali Doctors ({authorizedDoctors.length})
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${activeTab === 'staff' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
        >
          <Users className="w-4 h-4" /> Bengali Staff ({authorizedStaff.length})
        </button>
      </div>

      {(activeTab === 'doctors' || activeTab === 'staff') && authorizedHospitals.length > 0 && (
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-border shadow-sm">
          <label className="text-sm font-bold text-text-primary whitespace-nowrap">Filter by Hospital:</label>
          <select
            value={selectedHospitalFilter}
            onChange={e => setSelectedHospitalFilter(e.target.value)}
            className="w-full max-w-xs px-3 py-2 bg-surface border border-border rounded-lg text-sm cursor-pointer"
          >
            <option value="all">All Assigned Hospitals ({authorizedHospitals.length})</option>
            {authorizedHospitals.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
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
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">City / Area</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Phone</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Emergency No</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                  </>
                ) : activeTab === 'doctors' ? (
                  <>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Doctor Name</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Specialization</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospitals</th>
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
                 ? authorizedHospitals
                 : activeTab === 'doctors'
                   ? authorizedDoctors.filter(d => selectedHospitalFilter === 'all' || d.hospital_ids?.includes(selectedHospitalFilter) || d.hospital_id === selectedHospitalFilter)
                   : authorizedStaff.filter(s => selectedHospitalFilter === 'all' || s.hospital_id === selectedHospitalFilter)
              ).map((item: any) => {
                const isAuthorized = activeTab === 'hospitals'
                  ? isHospitalAuthorized(item.id)
                  : true;

                return (
                  <tr key={item.id} className="hover:bg-surface transition-colors">
                    {activeTab === 'hospitals' ? (
                      <>
                        <td className="px-5 py-4 text-sm text-text-primary font-medium">
                          <div className="font-bold">{item.name}</div>
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
                            {item.is_24_7 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                                24/7
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-text-muted">{item.area ? `${item.area}, ` : ''}{item.city}</td>
                        <td className="px-5 py-4 text-sm text-text-muted">{item.phone || '-'}</td>
                        <td className="px-5 py-4 text-sm font-bold text-red-600">{item.emergency_phone || '-'}</td>
                        <td className="px-5 py-4 text-sm text-text-muted">
                          {isAuthorized ? (
                            <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Managed
                            </span>
                          ) : (
                            <span className="text-gray-500 font-semibold text-xs bg-gray-100 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                              <Lock className="w-3 h-3" /> Restricted
                            </span>
                          )}
                        </td>
                      </>
                    ) : activeTab === 'doctors' ? (
                      <>
                        <td className="px-5 py-4 text-sm text-text-primary font-medium">{item.doctor_name}</td>
                        <td className="px-5 py-4 text-sm text-text-muted">{item.specialization}</td>
                        <td className="px-5 py-4 text-sm text-text-muted max-w-xs truncate">
                          {item.hospital_ids?.map((hid: string) => hospitals.find(h => h.id === hid)?.name).filter(Boolean).join(', ') || hospitals.find(h => h.id === item.hospital_id)?.name || 'Unknown'}
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
                          {canEdit && (
                            <button
                              onClick={() => openEdit(item)}
                              disabled={!isAuthorized}
                              title={isAuthorized ? 'Edit details' : 'Not authorized for this hospital'}
                              className={`p-2 rounded-lg transition-colors ${isAuthorized ? 'hover:bg-primary/10 text-text-muted hover:text-primary cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canManage && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={!isAuthorized}
                              title={isAuthorized ? 'Delete record' : 'Not authorized for this hospital'}
                              className={`p-2 rounded-lg transition-colors ${isAuthorized ? 'hover:bg-red-50 text-text-muted hover:text-red-500 cursor-pointer' : 'opacity-30 cursor-not-allowed'}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
              {(activeTab === 'hospitals'
                 ? authorizedHospitals
                 : activeTab === 'doctors'
                   ? authorizedDoctors
                   : authorizedStaff
              ).length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-text-muted text-sm italic">
                    No {activeTab} found for your assigned access scope.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Add Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl border border-border w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border bg-surface/30">
              <h3 className="text-lg font-bold text-text-primary">
                {editId ? 'Edit' : 'Add New'} {activeTab === 'hospitals' ? 'Hospital Record' : activeTab === 'doctors' ? 'Doctor Profile' : 'Staff Member'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-surface text-text-muted transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {activeTab === 'hospitals' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Hospital Name *</label>
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="Apollo Hospital" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">City *</label>
                      <input type="text" value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="Chennai" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Area / Location</label>
                      <select value={formData.area || ''} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="">Select Area...</option>
                        {CHENNAI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Category</label>
                      <select value={formData.category || 'Private'} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="Private">Private</option>
                        <option value="Government">Government</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone Number</label>
                      <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="044-28293333" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Emergency Helpline Phone</label>
                      <input type="text" value={formData.emergency_phone || ''} onChange={e => setFormData({...formData, emergency_phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="1066" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Email ID</label>
                      <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="info@apollo.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Official Website</label>
                      <input type="url" value={formData.website || ''} onChange={e => setFormData({...formData, website: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="https://apollohospitals.com" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Address</label>
                      <input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="Greams Lane, Off Greams Road, Chennai" />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_24_7" checked={!!formData.is_24_7} onChange={e => setFormData({...formData, is_24_7: e.target.checked})} className="w-4 h-4 rounded border-border" />
                        <label htmlFor="is_24_7" className="text-sm font-semibold text-text-primary cursor-pointer">24/7 Emergency</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="has_bengali_doctor" checked={!!formData.has_bengali_doctor} onChange={e => setFormData({...formData, has_bengali_doctor: e.target.checked})} className="w-4 h-4 rounded border-border" />
                        <label htmlFor="has_bengali_doctor" className="text-sm font-semibold text-text-primary cursor-pointer">Bengali Doctor</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="has_bengali_staff" checked={!!formData.has_bengali_staff} onChange={e => setFormData({...formData, has_bengali_staff: e.target.checked})} className="w-4 h-4 rounded border-border" />
                        <label htmlFor="has_bengali_staff" className="text-sm font-semibold text-text-primary cursor-pointer">Bengali Staff</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="main_branch" checked={!!formData.main_branch} onChange={e => setFormData({...formData, main_branch: e.target.checked})} className="w-4 h-4 rounded border-border" />
                        <label htmlFor="main_branch" className="text-sm font-semibold text-text-primary cursor-pointer">Main Branch</label>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Departments / Specializations</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Description & Services Offered</label>
                      <textarea rows={3} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm resize-none" placeholder="Provide details about emergency services, facilities, Bengali assistance..." />
                    </div>
                  </div>
                </>
              ) : activeTab === 'doctors' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Doctor Name *</label>
                      <input type="text" value={formData.doctor_name || ''} onChange={e => setFormData({...formData, doctor_name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="Dr. Anirban Roy" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Specialization *</label>
                      <select value={formData.specialization || ''} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="">Select Specialization...</option>
                        {PREDEFINED_SPECIALIZATIONS.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Associated Hospital(s) *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 max-h-48 overflow-y-auto p-3 bg-surface rounded-xl border border-border">
                        {authorizedHospitals.map(h => (
                          <label key={h.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(formData.hospital_ids || []).includes(h.id)}
                              onChange={(e) => {
                                const current = formData.hospital_ids || [];
                                if (e.target.checked) {
                                  setFormData({ ...formData, hospital_ids: [...current, h.id] });
                                } else {
                                  setFormData({ ...formData, hospital_ids: current.filter((hid: string) => hid !== h.id) });
                                }
                              }}
                              className="w-4 h-4 rounded border-border"
                            />
                            <span className="text-sm text-text-primary">{h.name} ({h.city})</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Experience (e.g. 15 years)</label>
                      <input type="text" value={formData.experience || ''} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Photo URL</label>
                      <input type="text" value={formData.photo || ''} onChange={e => setFormData({...formData, photo: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone Number</label>
                      <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Email Address</label>
                      <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Spoken Languages</label>
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
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Staff Name *</label>
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="Staff Full Name" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Role * (e.g. Helpdesk Officer)</label>
                      <input type="text" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Department *</label>
                      <select value={formData.department || ''} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="">Select Department...</option>
                        {PREDEFINED_DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Assigned Hospital *</label>
                      <select value={formData.hospital_id || ''} onChange={e => setFormData({...formData, hospital_id: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="">Select Hospital...</option>
                        {authorizedHospitals.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Phone Number</label>
                      <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Email Address</label>
                      <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Languages Spoken</label>
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
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-3 bg-surface/30">
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} {saving ? 'Saving...' : 'Save Hospital Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
