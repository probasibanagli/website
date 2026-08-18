'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { GovernmentServiceItem } from '@/types';
import { 
  Plus, Pencil, Trash2, X, Loader2, Shield, Landmark, Search, 
  Globe, FileText, CheckCircle2, XCircle, Clock, CreditCard, 
  Building, Upload, Download, ExternalLink, MapPin, Tag, ArrowLeft, Save
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';

const INITIAL_GOVT_SERVICES: Omit<GovernmentServiceItem, 'id'>[] = [
  {
    title: 'Aadhaar Card Correction & Update Services',
    category: 'identity',
    description: 'Guidelines and official portals for updating demographic data, biometric updates, address changes, and mobile number linking in Aadhaar.',
    official_url: 'https://myaadhaar.uidai.gov.in',
    online_portal_name: 'myAadhaar Portal (UIDAI)',
    offline_centres: ['Aadhaar Seva Kendra - Ripon Building, Chennai', 'Collectorate Aadhaar Kendra, Coimbatore', 'Taluk Office Aadhaar Centre, Madurai'],
    documents_required: ['Proof of Identity (Voter ID, Passport, PAN)', 'Proof of Address (Utility Bill, Bank Passbook)', 'Date of Birth Proof'],
    fees: '₹50 (Demographic Update) / ₹100 (Biometric Update)',
    processing_time: '5 - 15 Working Days',
    is_active: true,
  },
  {
    title: 'Voter ID (EPIC) Registration & Address Transfer',
    category: 'identity',
    description: 'Online application for Form 6 (New Voter), Form 8 (Correction & Shift of Residence within/outside assembly constituency).',
    official_url: 'https://voters.eci.gov.in',
    online_portal_name: 'Voters Service Portal (ECI)',
    offline_centres: ['ERO Office / Taluk Office Chennai', 'Corporation Zonal Offices'],
    documents_required: ['Passport size Photograph', 'Age Proof (Aadhaar / Birth Cert)', 'Address Proof in TN'],
    fees: 'Free',
    processing_time: '15 - 30 Working Days',
    is_active: true,
  },
  {
    title: 'Tamil Nadu Smart Ration Card (TNPDS)',
    category: 'welfare',
    description: 'Application for new Smart Ration Card, family member addition/deletion, shop change, and head of family alteration.',
    official_url: 'https://www.tnpds.gov.in',
    online_portal_name: 'TNPDS Official Portal',
    offline_centres: ['Arasu e-Seva Centres (TNeGA)', 'Assistant Commissioner Offices (Civil Supplies)'],
    documents_required: ['Aadhaar Cards of all family members', 'Gas Connection Details', 'Electricity Bill / Rental Agreement'],
    fees: 'Free / ₹20 for card print at e-Seva',
    processing_time: '15 - 30 Days',
    is_active: true,
  },
  {
    title: 'Passport Seva & Tatkaal Application',
    category: 'passport',
    description: 'Fresh passport issuance, re-issue on expiry, name change, address change, and Tatkaal application booking.',
    official_url: 'https://passportindia.gov.in',
    online_portal_name: 'Passport Seva Online Portal',
    offline_centres: ['PSK Saligramam (Chennai)', 'PSK Tambaram (Chennai)', 'PSK Aminjikarai (Chennai)', 'PSK Coimbatore', 'PSK Madurai'],
    documents_required: ['Aadhaar Card', 'Birth Certificate / Class 10 Certificate', 'Bank Passbook with photo'],
    fees: '₹1,500 (Normal) / ₹3,500 (Tatkaal)',
    processing_time: '7 - 15 Days (Normal) / 1 - 3 Days (Tatkaal)',
    is_active: true,
  },
  {
    title: 'File a Complaint & Police Verification (TN)',
    category: 'police',
    description: 'Online police verification for job employment, tenant verification, domestic help check, and self-verification.',
    official_url: 'https://eservices.tnpolice.gov.in/CCTNSENHANCED/serviceVerification.html',
    online_portal_name: 'TN Police e-Services Portal',
    offline_centres: ['Jurisdictional Police Station in TN'],
    documents_required: ['Aadhaar Card / Voter ID', 'Applicant Photograph', 'Employment Offer Letter / Rental Draft'],
    fees: '₹500 for Individuals / ₹1,000 for Commercial',
    processing_time: '7 - 14 Days',
    is_active: true,
  },
  {
    title: 'Driving Licence & Vehicle RTO Services (Parivahan)',
    category: 'transport',
    description: 'Learner Licence (LLR) booking, Permanent Driving Licence test slot, DL renewal, and International Driving Permit (IDP).',
    official_url: 'https://parivahan.gov.in',
    online_portal_name: 'Parivahan Sewa (Ministry of Road Transport)',
    offline_centres: ['RTO Chennai Central (Ayanavaram)', 'RTO Chennai South (Thiruvanmiyur)', 'RTO Tambaram', 'RTO Coimbatore'],
    documents_required: ['Medical Fitness Certificate (Form 1A)', 'Age & Address Proof', 'Existing LLR / DL'],
    fees: '₹200 (LLR) / ₹500 (DL Test & Smart Card)',
    processing_time: 'Same Day Test Slot',
    is_active: true,
  },
  {
    title: 'Ayushman Bharat - PM-JAY & TN CM Comprehensive Health Insurance',
    category: 'welfare',
    description: 'Cashless health insurance coverage up to ₹5 Lakhs per family per year for empanelled government and private hospitals.',
    official_url: 'https://pmjay.gov.in',
    online_portal_name: 'PM-JAY National Portal & TN CMCHIS Portal',
    offline_centres: ['Kiosk in Government General Hospitals (GH)', 'District Collectorate Kiosks'],
    documents_required: ['Smart Ration Card', 'Aadhaar Card', 'Income Certificate (if applicable)'],
    fees: 'Free for eligible beneficiaries',
    processing_time: 'Instant / e-Card Download',
    is_active: true,
  },
  {
    title: 'FRRO Visa & Foreigner Registration (Chennai)',
    category: 'other',
    description: 'Foreigners Regional Registration Office (FRRO) services including visa extension, exit permit, and student visa registration.',
    official_url: 'https://indianfrro.gov.in',
    online_portal_name: 'e-FRRO Portal (Ministry of Home Affairs)',
    offline_centres: ['Bureau of Immigration, Shastri Bhavan, Nungambakkam, Chennai'],
    documents_required: ['Valid Passport & Visa', 'Proof of Residence / Form C', 'Bonafide Certificate from University / Employer'],
    fees: 'Varies by visa type and country',
    processing_time: '3 - 7 Working Days',
    is_active: true,
  },
];

function GovernmentServicesAdminContent() {
  const { profile, firebaseUser } = useAuth();
  
  const [items, setItems] = useState<GovernmentServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<GovernmentServiceItem>>({
    title: '',
    category: 'identity',
    description: '',
    official_url: '',
    online_portal_name: '',
    fees: '',
    processing_time: '',
    documents_required: [],
    offline_centres: [],
    is_active: true,
  });
  
  const [docsInput, setDocsInput] = useState('');
  const [centresInput, setCentresInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const moduleKey = 'government_services';
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
      const snap = await getDocs(collection(db, COLLECTIONS.government_services || 'government_services'));
      let fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as GovernmentServiceItem));
      
      // Auto-seed initial items if collection is empty
      if (fetched.length === 0 && (canEdit || canManage)) {
        console.log('Seeding initial Government Services data...');
        for (const service of INITIAL_GOVT_SERVICES) {
          const newDocRef = doc(collection(db, COLLECTIONS.government_services || 'government_services'));
          const itemWithId: GovernmentServiceItem = {
            id: newDocRef.id,
            ...service,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await setDoc(newDocRef, itemWithId);
          fetched.push(itemWithId);
        }
      }

      setItems(fetched);
    } catch (e: any) {
      console.error('Error loading government services:', e);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenForm(item?: GovernmentServiceItem) {
    if (item) {
      setEditId(item.id);
      setFormData(item);
      setDocsInput(item.documents_required ? item.documents_required.join(', ') : '');
      setCentresInput(item.offline_centres ? item.offline_centres.join(', ') : '');
    } else {
      setEditId(null);
      setFormData({
        title: '',
        category: 'identity',
        description: '',
        official_url: '',
        online_portal_name: '',
        fees: '',
        processing_time: '',
        is_active: true,
      });
      setDocsInput('');
      setCentresInput('');
    }
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) return alert('You do not have permission to add or edit government services.');
    if (!formData.title?.trim()) return alert('Please enter a service title.');

    setSaving(true);
    try {
      const docsArray = docsInput.split(',').map(s => s.trim()).filter(Boolean);
      const centresArray = centresInput.split(',').map(s => s.trim()).filter(Boolean);

      const payload: Omit<GovernmentServiceItem, 'id'> = {
        title: formData.title.trim(),
        category: formData.category || 'identity',
        description: formData.description?.trim() || '',
        official_url: formData.official_url?.trim() || '',
        online_portal_name: formData.online_portal_name?.trim() || '',
        documents_required: docsArray,
        offline_centres: centresArray,
        fees: formData.fees?.trim() || '',
        processing_time: formData.processing_time?.trim() || '',
        is_active: formData.is_active ?? true,
        updated_at: new Date().toISOString(),
      };

      if (editId) {
        await updateDoc(doc(db, COLLECTIONS.government_services || 'government_services', editId), payload as any);
      } else {
        const newRef = doc(collection(db, COLLECTIONS.government_services || 'government_services'));
        await setDoc(newRef, {
          id: newRef.id,
          ...payload,
          created_at: new Date().toISOString(),
        });
      }

      setShowForm(false);
      await loadData();
    } catch (e: any) {
      console.error(e);
      alert('Failed to save government service data: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(item: GovernmentServiceItem) {
    if (!canEdit) return alert('You do not have permission to update status.');
    try {
      const ref = doc(db, COLLECTIONS.government_services || 'government_services', item.id);
      await updateDoc(ref, { is_active: !item.is_active, updated_at: new Date().toISOString() });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !item.is_active } : i));
    } catch (e: any) {
      console.error(e);
      alert('Error updating status');
    }
  }

  async function handleDelete(id: string) {
    if (!canManage) return alert('Only admins with Manage permission can delete government services.');
    if (!confirm('Are you sure you want to delete this government service record?')) return;
    try {
      await deleteDoc(doc(db, COLLECTIONS.government_services || 'government_services', id));
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      console.error(e);
      alert('Error deleting service');
    }
  }

  const filteredItems = items.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.online_portal_name?.toLowerCase().includes(q) ||
      item.offline_centres?.some(c => c.toLowerCase().includes(q))
    );
    return matchesCategory && matchesSearch;
  });

  if (!canView) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-border p-8">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-text-primary mb-2">Access Denied</h2>
        <p className="text-text-muted">You do not have permission to view or manage Government Services data.</p>
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
              {editId ? 'Edit Government Service' : 'Add New Government Service'}
            </h1>
            <p className="text-text-muted text-sm mt-0.5">Fill in service details and official portals below.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Service Title *</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Voter ID Address Update (Form 8)"
                className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Category</label>
                <select
                  value={formData.category || 'identity'}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                >
                  <option value="identity">Identity (Aadhaar/Voter)</option>
                  <option value="welfare">Welfare & Ration</option>
                  <option value="passport">Passport</option>
                  <option value="police">Police Verification</option>
                  <option value="transport">Transport & RTO</option>
                  <option value="other">Visa & Other Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Official Portal Name</label>
                <input
                  type="text"
                  value={formData.online_portal_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, online_portal_name: e.target.value }))}
                  placeholder="e.g. TNPDS / Voters Service Portal"
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Official Website URL</label>
              <input
                type="url"
                value={formData.official_url || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, official_url: e.target.value }))}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Description & Guidelines</label>
              <textarea
                maxLength={250}
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide step-by-step instructions or background info... (Max 250 chars)"
                className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <p className="text-right text-[10px] text-text-muted mt-1">{(formData.description || '').length}/250</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Fees Details</label>
                <input
                  type="text"
                  value={formData.fees || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, fees: e.target.value }))}
                  placeholder="e.g. ₹50 / Free"
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Processing Time</label>
                <input
                  type="text"
                  value={formData.processing_time || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, processing_time: e.target.value }))}
                  placeholder="e.g. 7 - 14 Days"
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Required Documents (comma separated)</label>
              <input
                type="text"
                value={docsInput}
                onChange={(e) => setDocsInput(e.target.value)}
                placeholder="Aadhaar Card, Passport photo, Address Proof"
                className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">CSC - Customer Service Centres (comma separated)</label>
              <input
                type="text"
                value={centresInput}
                onChange={(e) => setCentresInput(e.target.value)}
                placeholder="Arasu e-Seva Centre Ripon Building, Taluk Office Tambaram"
                className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active ?? true}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 text-primary rounded accent-primary cursor-pointer"
              />
              <label htmlFor="is_active" className="text-xs font-medium text-text-primary cursor-pointer">
                Active (Visible to public users)
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving} className="min-w-[100px]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : editId ? 'Save Changes' : 'Create Record'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold font-display text-text-primary">Government Services Data</h1>
            <Badge variant={canManage ? 'verified' : canEdit ? 'amber' : 'default'}>
              {profile?.role === 'superadmin' ? 'Super Admin' : canManage ? 'Manage Access' : canEdit ? 'Edit Access' : 'View Access'}
            </Badge>
          </div>
          <p className="text-sm text-text-muted">
            Manage government service procedures, official online portal links, required document lists, and offline centers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canEdit && (
            <Button variant="primary" onClick={() => handleOpenForm()} className="shadow-md flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Government Service
            </Button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'identity', label: 'Identity (Aadhaar/Voter)' },
            { id: 'welfare', label: 'Welfare & Ration' },
            { id: 'passport', label: 'Passport' },
            { id: 'police', label: 'Police Verification' },
            { id: 'transport', label: 'RTO & Transport' },
            { id: 'other', label: 'Visa & Other' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                categoryFilter === cat.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface text-text-muted border-border hover:bg-surface/80 hover:text-text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service, portal, documents..."
            className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Grid / Table */}
      {loading ? (
        <div className="flex justify-center py-20 bg-white rounded-2xl border border-border">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-border p-6">
          <Landmark className="w-12 h-12 text-text-muted mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-text-primary">No Government Services Found</h3>
          <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
            {searchQuery || categoryFilter !== 'all' ? 'Try adjusting your search query or filter.' : 'Click "Add Government Service" above to add new records.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <Card key={item.id} className="p-5 flex flex-col justify-between relative group hover:border-primary/40 transition-all border border-border bg-white shadow-sm">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      disabled={!canEdit}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                        item.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Click to toggle status"
                    >
                      {item.is_active ? '● Active' : '○ Inactive'}
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base text-text-primary mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed line-clamp-3 mb-4">{item.description}</p>

                <div className="space-y-2 border-t border-border/60 pt-3 text-xs text-text-muted">
                  {item.official_url && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                      <a href={item.official_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate font-medium flex items-center gap-1">
                        {item.online_portal_name || 'Official Portal'} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {item.fees && (
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span><strong>Fees:</strong> {item.fees}</span>
                    </div>
                  )}

                  {item.processing_time && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span><strong>Processing Time:</strong> {item.processing_time}</span>
                    </div>
                  )}

                  {item.documents_required && item.documents_required.length > 0 && (
                    <div className="flex items-start gap-1.5 pt-1">
                      <FileText className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="line-clamp-2"><strong>Required:</strong> {item.documents_required.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] text-text-muted">
                  Updated {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'Recently'}
                </span>

                <div className="flex items-center gap-1.5">
                  {canEdit && (
                    <Button variant="outline" size="sm" onClick={() => handleOpenForm(item)} className="h-8 px-2.5 text-xs flex items-center gap-1 cursor-pointer">
                      <Pencil className="w-3 h-3 text-amber-600" /> Edit
                    </Button>
                  )}

                  {canManage && (
                    <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)} className="h-8 px-2.5 text-xs text-red-600 border-red-200 hover:bg-red-50 cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}

export default function GovernmentServicesAdminPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <GovernmentServicesAdminContent />
    </Suspense>
  );
}
