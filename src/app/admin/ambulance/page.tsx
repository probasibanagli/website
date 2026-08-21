'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { COLLECTIONS } from '@/lib/firestore/collections';
import type { Ambulance } from '@/types';
import { Plus, Pencil, Trash2, Loader2, Shield, Truck, Upload, ArrowLeft, Save, Search } from 'lucide-react';
import { CITIES } from '@/lib/constants';
// @ts-ignore
import * as XLSX from 'xlsx';
import { AlertPopup } from '@/components/ui/AlertPopup';
import { createPortal } from 'react-dom';

function AmbulancePageContent() {
  const { profile } = useAuth();
  
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Ambulance>>({});
  const [saving, setSaving] = useState(false);
  const [cityFilter, setCityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [transportTypeFilter, setTransportTypeFilter] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const moduleKey = 'ambulance';
  const canView = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'view');
  const canEdit = canAccess(profile?.role || 'user', profile?.permissions, moduleKey, 'edit');
  const isClientReady = typeof window !== 'undefined';

  useEffect(() => {
    if (!canView) return;

    const unsubscribe = onSnapshot(
      collection(db, COLLECTIONS.ambulances || 'ambulances'),
      (snap) => {
        setAmbulances(snap.docs.map(d => ({ id: d.id, ...d.data() } as Ambulance)));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [canView]);

  function handleDelete(id: string) {
    setDeleteId(id);
  }

  function executeDelete() {
    if (!deleteId) return;
    setAmbulances(prev => prev.filter(item => item.id !== deleteId));
    deleteDoc(doc(db, COLLECTIONS.ambulances || 'ambulances', deleteId))
      .then(() => {
        showAlert('Ambulance listing deleted successfully.', 'success');
      })
      .catch(e => {
        console.error(e);
        showAlert('Error deleting ambulance listing.', 'error');
      });
    setDeleteId(null);
  }

  function parseCsvText(text: string): string[][] {
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
    return lines;
  }

  function getNormalizedCityValue(value?: string) {
    if (!value) return '';
    const text = String(value).trim();
    if (!text) return '';
    const beforeArrow = text.split('->')[0]?.trim() || text;
    return beforeArrow.replace(/\s*\([^)]*\)\s*$/i, '').trim();
  }

  function inferAmbulanceMainCategory(typeMode?: string, sourceNotes?: string, name?: string) {
    const combined = `${typeMode || ''} ${sourceNotes || ''} ${name || ''}`.toLowerCase();
    if (/train|rail/i.test(combined)) return 'train';
    if (/air|flight|helicopter|charter|jet|fixed wing|aviation/i.test(combined)) return 'flight';
    if (/road|ground|local|ambulance/i.test(combined)) return 'local';
    return 'local';
  }

  function inferAmbulanceSubCategory(name?: string, sourceNotes?: string, rawSubCategory?: string) {
    const combined = `${rawSubCategory || ''} ${name || ''} ${sourceNotes || ''}`.toLowerCase();
    if (/govt|government|108|emergency/i.test(combined)) return 'government';
    if (/private|partner|network|service|ambulance/i.test(combined) && !/govt|government|108/i.test(combined)) return 'private';
    return 'private';
  }

  function inferAmbulanceSize(sizeValue?: string, typeMode?: string, name?: string) {
    const combined = `${sizeValue || ''} ${typeMode || ''} ${name || ''}`.toLowerCase();
    if (/large|big|xl/i.test(combined)) return 'large';
    if (/medium|mid/i.test(combined)) return 'medium';
    if (/small|mini|compact/i.test(combined)) return 'small';
    return 'medium';
  }

  function getHeaderIndex(headers: string[], aliases: string[]) {
    const normalizedAliases = aliases.map(a => a.toLowerCase().replace(/[^a-z0-9]/g, ''));
    return headers.findIndex(header => normalizedAliases.includes(header));
  }

  async function processImportRows(lines: Array<Array<string | number | boolean | null | undefined>>) {
    try {
      setLoading(true);
      if (lines.length < 2) {
        showAlert('Invalid file or empty data.', 'error');
        return;
      }

      const headers = lines[0].map(h => String(h || '').toLowerCase().replace(/[^a-z0-9]/g, ''));

      let nameIdx = getHeaderIndex(headers, ['provider name', 'providername', 'ambulance name', 'ambulance', 'name', 'title', 'service name', 'service provider']);
      const baseCityIdx = getHeaderIndex(headers, ['base city', 'basecity', 'city', 'district', 'area', 'location']);
      const routeDirectionIdx = getHeaderIndex(headers, ['route direction', 'routedirection', 'route', 'direction']);
      let addressIdx = getHeaderIndex(headers, ['address', 'location details', 'details', 'full address', 'route direction']);
      const phoneIdx = getHeaderIndex(headers, ['contact number', 'contactnumber', 'phone', 'mobile', 'contact', 'number']);
      const websiteIdx = getHeaderIndex(headers, ['website', 'link', 'url']);
      const ownershipIdx = getHeaderIndex(headers, ['ownership', 'owner', 'category', 'provider type']);
      let serviceTypeIdx = getHeaderIndex(headers, ['service type', 'servicetype', 'type', 'mode', 'typemode', 'service']);
      const vehicleSizeIdx = getHeaderIndex(headers, ['vehicle size', 'vehiclesize', 'size', 'sizecategory']);
      let notesIdx = getHeaderIndex(headers, ['notes', 'source notes', 'source', 'sourcenotes', 'source/notes']);
      const mainCategoryIdx = getHeaderIndex(headers, ['main category', 'maincategory', 'main']);
      const subCategoryIdx = getHeaderIndex(headers, ['sub category', 'subcategory', 'sub-category', 'sub']);
      const specializationIdx = getHeaderIndex(headers, ['specialization', 'specialities']);
      const icuIdx = getHeaderIndex(headers, ['icu ambulance', 'icuambulance', 'icu']);
      const cardiacIdx = getHeaderIndex(headers, ['cardiac ambulance', 'cardiacambulance', 'cardiac']);
      const neonatalIdx = getHeaderIndex(headers, ['neonatal ambulance', 'neonatalambulance', 'neonatal']);
      const ventilatorIdx = getHeaderIndex(headers, ['ventilator ambulance', 'ventilatorambulance', 'ventilator']);
      const nurseIdx = getHeaderIndex(headers, ['nurse support', 'nursesupport', 'nurse']);
      const multiSpecialtyIdx = getHeaderIndex(headers, ['multi-specialty service', 'multispecialtyservice', 'multi special', 'multispecialty']);
      const patientShiftingIdx = getHeaderIndex(headers, ['patient shifting', 'patientshifting', 'shifting']);
      const deadBodyIdx = getHeaderIndex(headers, ['dead body transportation', 'deadbodytransportation', 'deadbody']);
      const tnToWbIdx = getHeaderIndex(headers, ['tn to wb service', 'tntowbservice', 'tntowb']);
      const wbToTnIdx = getHeaderIndex(headers, ['wb to tn service', 'wbtotnservice', 'wbtotn']);

      let cityIdx = baseCityIdx !== -1 ? baseCityIdx : routeDirectionIdx;

      if (nameIdx === -1) {
        console.warn('Could not match columns by header name, falling back to standard column positions.');
        cityIdx = 2;
        nameIdx = 1;
        serviceTypeIdx = 4;
        addressIdx = 5;
        notesIdx = 6;
      }

      const newItems: Ambulance[] = [];
      const now = new Date().toISOString();

      for (let i = 1; i < lines.length; i++) {
        const r = lines[i];
        const name = nameIdx !== -1 && r[nameIdx] ? String(r[nameIdx]).trim() : '';
        if (!name) continue;

        const rawCity = cityIdx !== -1 && r[cityIdx] ? String(r[cityIdx]) : '';
        const cityValue = getNormalizedCityValue(rawCity);
        const matchedCity = CITIES.find(c => cityValue.toLowerCase().includes(c.toLowerCase())) || (cityValue || 'Chennai');

        const parseBool = (idx: number) => {
          if (idx === -1 || r[idx] === undefined || r[idx] === null) return false;
          const val = String(r[idx]).trim().toLowerCase();
          return val === 'true' || val === '1' || val === 'yes' || val === 'y' || val === '✓' || val === 'checked';
        };

        const rawSubCat = (subCategoryIdx !== -1 && r[subCategoryIdx] ? String(r[subCategoryIdx]).trim() : '') || (ownershipIdx !== -1 && r[ownershipIdx] ? String(r[ownershipIdx]).trim() : '');
        const rawMainCat = mainCategoryIdx !== -1 && r[mainCategoryIdx] ? String(r[mainCategoryIdx]).trim() : '';
        const typeModeValue = serviceTypeIdx !== -1 && r[serviceTypeIdx] ? String(r[serviceTypeIdx]).trim() : '';
        const rawSize = vehicleSizeIdx !== -1 && r[vehicleSizeIdx] ? String(r[vehicleSizeIdx]).trim() : '';
        const notesValue = notesIdx !== -1 && r[notesIdx] ? String(r[notesIdx]).trim() : '';

        const finalSubCat = /^government|^govt/i.test(rawSubCat)
          ? 'government'
          : /^private|^partner/i.test(rawSubCat)
            ? 'private'
            : inferAmbulanceSubCategory(name, notesValue, rawSubCat);

        const finalMainCat: 'flight' | 'local' | 'train' = /train|rail/i.test(`${rawMainCat} ${typeModeValue}`)
          ? 'train'
          : /air|flight|helicopter|charter|jet|fixed wing/i.test(`${rawMainCat} ${typeModeValue}`)
          ? 'flight'
          : inferAmbulanceMainCategory(typeModeValue, notesValue, name);

        const finalSize = inferAmbulanceSize(rawSize, typeModeValue, name);

        const item: Ambulance = {
          id: `amb-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          name,
          city: matchedCity,
          phone: phoneIdx !== -1 && r[phoneIdx] ? String(r[phoneIdx]).trim() : '',
          address: (addressIdx !== -1 && r[addressIdx] ? String(r[addressIdx]).trim() : '') || rawCity,
          website: websiteIdx !== -1 && r[websiteIdx] ? String(r[websiteIdx]).trim() : '',
          sub_category: finalSubCat,
          main_category: finalMainCat,
          size_category: finalSize,
          type_mode: typeModeValue,
          source_notes: notesValue,
          specialization: specializationIdx !== -1 && r[specializationIdx] ? String(r[specializationIdx]).trim() : '',
          icu_ambulance: parseBool(icuIdx),
          cardiac_ambulance: parseBool(cardiacIdx),
          neonatal_ambulance: parseBool(neonatalIdx),
          ventilator_ambulance: parseBool(ventilatorIdx),
          nurse_support: parseBool(nurseIdx),
          multi_specialty: parseBool(multiSpecialtyIdx),
          patient_shifting: parseBool(patientShiftingIdx),
          dead_body_transport: parseBool(deadBodyIdx),
          tn_to_wb: parseBool(tnToWbIdx),
          wb_to_tn: parseBool(wbToTnIdx),
          created_at: now,
          updated_at: now,
        };

        if (!item.main_category) {
          item.main_category = inferAmbulanceMainCategory(item.type_mode, item.source_notes, item.name);
        }
        if (!item.sub_category) {
          item.sub_category = inferAmbulanceSubCategory(item.name, item.source_notes, '');
        }
        if (!item.size_category) {
          item.size_category = inferAmbulanceSize('', item.type_mode, item.name);
        }

        newItems.push(item);
      }

      if (newItems.length === 0) {
        showAlert('No valid rows found in file.', 'warning');
        return;
      }

      setAmbulances(prev => [...newItems, ...prev]);

      for (const item of newItems) {
        const docPayload = { ...item };
        if (docPayload.main_category === undefined) {
          delete docPayload.main_category;
        }
        if (docPayload.size_category === undefined) {
          delete docPayload.size_category;
        }
        await setDoc(doc(db, COLLECTIONS.ambulances || 'ambulances', item.id), docPayload);
      }

      showAlert(`Successfully imported ${newItems.length} ambulance records!`, 'success');
    } catch (err) {
      console.error(err);
      showAlert('Error parsing file. Please make sure format is valid.', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isXlsx = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    const reader = new FileReader();

    if (isXlsx) {
      reader.onload = async (evt) => {
        try {
          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows: Array<Array<string | number | boolean | null | undefined>> = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          processImportRows(rows);
        } catch (err) {
          console.error(err);
          showAlert('Error reading Excel file.', 'error');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = async (evt) => {
        const text = evt.target?.result as string;
        if (!text) return;
        const rows = parseCsvText(text);
        processImportRows(rows);
      };
      reader.readAsText(file);
    }
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
      showAlert('Name and City are required fields.', 'warning');
      return;
    }
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload: Ambulance = {
        ...formData,
        id: editId || `amb-${Date.now()}`,
        name: formData.name || '',
        city: formData.city || '',
        main_category: formData.main_category || inferAmbulanceMainCategory(formData.type_mode, formData.source_notes, formData.name),
        sub_category: formData.sub_category || inferAmbulanceSubCategory(formData.name, formData.source_notes, formData.sub_category || ''),
        size_category: formData.size_category || inferAmbulanceSize(formData.size_category, formData.type_mode, formData.name),
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
      showAlert('Error saving ambulance details.', 'error');
      setSaving(false);
    }
  }

  const filtered: Ambulance[] = ambulances
    .map(item => ({
      ...item,
      name: item.name || '',
      city: item.city || '',
      main_category: item.main_category || inferAmbulanceMainCategory(item.type_mode, item.source_notes, item.name),
      sub_category: item.sub_category || inferAmbulanceSubCategory(item.name, item.source_notes, item.sub_category || ''),
      size_category: item.size_category || inferAmbulanceSize(item.size_category, item.type_mode, item.name),
    } as Ambulance))
    .filter(item => {
      const matchCity = !cityFilter || item.city === cityFilter;
      const matchTransport = !transportTypeFilter || item.main_category === transportTypeFilter;
      const matchAgency = !agencyFilter || item.sub_category === agencyFilter;
      const matchSize = !sizeFilter || item.size_category === sizeFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery = !searchQuery || 
        (item.name || '').toLowerCase().includes(q) ||
        (item.address || '').toLowerCase().includes(q) ||
        (item.phone || '').toLowerCase().includes(q) ||
        (item.sub_category || '').toLowerCase().includes(q);
      return matchCity && matchTransport && matchAgency && matchSize && matchQuery;
    })
    .sort((a, b) => {
      return (a.name || '').localeCompare(b.name || '');
    });

  if (!canView) return (
    <div className="text-center py-20"><Shield className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-text-primary mb-2">No Access</h2><p className="text-text-muted">You do not have permission to access this module.</p></div>
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

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Main Category</label>
                <select value={formData.main_category || ''} onChange={e => setFormData({...formData, main_category: e.target.value as any})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                  <option value="">Select Main Category...</option>
                  <option value="local">Local Ambulance</option>
                  <option value="flight">Flight Ambulance</option>
                  <option value="train">Train Ambulance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Sub-Category</label>
                <select value={formData.sub_category || ''} onChange={e => setFormData({...formData, sub_category: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                  <option value="">Select Sub-Category...</option>
                  <option value="government">Government Ambulance</option>
                  <option value="private">Private Ambulance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Ambulance Size</label>
                <select value={formData.size_category || ''} onChange={e => setFormData({...formData, size_category: e.target.value as any})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                  <option value="">Select Size...</option>
                  <option value="small">Small Ambulance</option>
                  <option value="medium">Medium Ambulance</option>
                  <option value="large">Large Ambulance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1.5">Specialization</label>
                <input type="text" value={formData.specialization || ''} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Trauma care, Neonatal transport" />
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="block text-sm font-semibold text-text-primary">Ambulance Display & Features</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'icu_ambulance', label: 'ICU Ambulance' },
                    { key: 'cardiac_ambulance', label: 'Cardiac Ambulance' },
                    { key: 'neonatal_ambulance', label: 'Neonatal Ambulance' },
                    { key: 'ventilator_ambulance', label: 'Ventilator Ambulance' },
                    { key: 'nurse_support', label: 'Nurse Support' },
                    { key: 'multi_specialty', label: 'Multi-specialty Service' },
                  ].map((feat) => (
                    <label key={feat.key} className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl text-xs font-semibold cursor-pointer hover:bg-surface/80 transition-colors">
                      <input type="checkbox" checked={!!formData[feat.key as keyof Ambulance]} onChange={e => setFormData({...formData, [feat.key]: e.target.checked})} className="rounded text-primary focus:ring-primary/20" />
                      {feat.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="block text-sm font-semibold text-text-primary">Additional Services</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'patient_shifting', label: 'Patient shifting' },
                    { key: 'dead_body_transport', label: 'Dead body transportation' },
                    { key: 'tn_to_wb', label: 'Tamil Nadu to West Bengal ambulance service' },
                    { key: 'wb_to_tn', label: 'West Bengal to Tamil Nadu ambulance service' },
                  ].map((srv) => (
                    <label key={srv.key} className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl text-xs font-semibold cursor-pointer hover:bg-surface/80 transition-colors">
                      <input type="checkbox" checked={!!formData[srv.key as keyof Ambulance]} onChange={e => setFormData({...formData, [srv.key]: e.target.checked})} className="rounded text-primary focus:ring-primary/20" />
                      {srv.label}
                    </label>
                  ))}
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
              <Upload className="w-4 h-4 text-primary" /> Import File
              <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileImport} className="hidden" />
            </label>
          )}
          {canEdit && (
            <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors shadow-md active:scale-95 cursor-pointer">
              <Plus className="w-4 h-4" /> Add New Ambulance
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1 min-w-[200px] w-full md:w-auto">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search ambulances by name or area..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-border text-sm bg-surface cursor-pointer hover:border-primary/50 transition-colors outline-none focus:border-primary min-w-[140px]">
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={transportTypeFilter} onChange={e => setTransportTypeFilter(e.target.value)} className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-border text-sm bg-surface cursor-pointer hover:border-primary/50 transition-colors outline-none focus:border-primary min-w-[160px]">
          <option value="">All Transport Types</option>
          <option value="local">Local</option>
          <option value="flight">Flight</option>
          <option value="train">Train</option>
        </select>
        <select value={agencyFilter} onChange={e => setAgencyFilter(e.target.value)} className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-border text-sm bg-surface cursor-pointer hover:border-primary/50 transition-colors outline-none focus:border-primary min-w-[140px]">
          <option value="">All Agencies</option>
          <option value="government">Government</option>
          <option value="private">Private</option>
        </select>
        <select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)} className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-border text-sm bg-surface cursor-pointer hover:border-primary/50 transition-colors outline-none focus:border-primary min-w-[140px]">
          <option value="">All Sizes</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
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
                  <th className="p-4">Category</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Features</th>
                  <th className="p-4">Type/Mode</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Address</th>
                  {canEdit && <th className="p-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-text-primary">
                {filtered.map(item => {
                  const features = [
                    item.icu_ambulance && 'ICU',
                    item.cardiac_ambulance && 'Cardiac',
                    item.neonatal_ambulance && 'Neonatal',
                    item.ventilator_ambulance && 'Ventilator',
                    item.nurse_support && 'Nurse',
                    item.multi_specialty && 'Multi-Spec',
                    item.patient_shifting && 'Shifting',
                    item.dead_body_transport && 'Dead Body',
                    item.tn_to_wb && 'TN->WB',
                    item.wb_to_tn && 'WB->TN',
                  ].filter(Boolean).join(', ');

                  return (
                    <tr key={item.id} className="hover:bg-surface/30 transition-colors">
                      <td className="p-4 font-bold">
                        <div>{item.name}</div>
                        {item.source_notes && (
                          <div className="text-[10px] font-normal text-text-muted mt-0.5" title="Source/Notes">
                            Note: {item.source_notes}
                          </div>
                        )}
                        {item.specialization && (
                          <div className="text-[10px] font-semibold text-primary mt-0.5">
                            Spec: {item.specialization}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-xs">
                        <div className="font-bold uppercase text-neutral-700">
                          {item.main_category || 'local'}
                        </div>
                        <div className="text-text-muted capitalize">
                          {item.sub_category || 'private'}
                        </div>
                      </td>
                      <td className="p-4 text-xs capitalize">
                        {item.size_category || <span className="text-text-muted">-</span>}
                      </td>
                      <td className="p-4 text-xs max-w-[150px] truncate" title={features}>
                        {features || <span className="text-text-muted text-xs">-</span>}
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
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 9 : 8} className="p-8 text-center text-text-muted">No ambulances found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AlertPopup 
        isOpen={alertOpen} 
        message={alertMessage} 
        type={alertType} 
        onClose={() => setAlertOpen(false)} 
      />

      {deleteId && isClientReady && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity duration-300" onClick={() => setDeleteId(null)} />
          <div className="relative w-full max-w-sm overflow-hidden rounded-[32px] bg-white border border-black/5 shadow-2xl z-10 p-8 pt-10 text-center animate-slide-up">
            <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-neutral-900">Confirm Delete</h3>
            <p className="mb-6 text-neutral-500 text-sm">Are you sure you want to delete this ambulance listing?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteId(null)} 
                className="flex-1 py-3 px-4 rounded-xl border border-border text-sm font-semibold text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete} 
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all active:scale-95 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
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
