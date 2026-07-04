const fs = require('fs');

const filePath = 'src/app/admin/emergency/page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace openAdd to handleDelete
const oldMethodsRegex = /  function openAdd\(\) \{.*?(?=  if \(!canView\))/s;
const newMethods = `  function toggleLanguage(lang: string) {
    setFormData((prev: any) => {
      const current = prev.languages || [];
      if (current.includes(lang)) return { ...prev, languages: current.filter((l: string) => l !== lang) };
      return { ...prev, languages: [...current, lang] };
    });
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
      if (Array.isArray(data.images)) data.images = data.images.join('\\n');
      if (Array.isArray(data.specializations)) data.specializations = data.specializations.join('\\n');
    }
    setFormData(data);
    setShowForm(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const collectionName = activeTab === 'hospitals' ? COLLECTIONS.hospitals : activeTab === 'staff' ? (COLLECTIONS.bengali_staff || 'bengali_staff') : COLLECTIONS.bengali_doctors;
      const now = new Date().toISOString();
      const payload = { ...formData };
      
      if (activeTab === 'hospitals') {
        payload.images = typeof payload.images === 'string' ? payload.images.split('\\n').map((s: string) => s.trim()).filter(Boolean) : [];
        payload.specializations = typeof payload.specializations === 'string' ? payload.specializations.split('\\n').map((s: string) => s.trim()).filter(Boolean) : [];
      }

      if (editId) {
        await updateDoc(doc(db, collectionName, editId), { ...payload, updated_at: now });
        if (activeTab === 'hospitals') setHospitals(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as Hospital : i));
        else if (activeTab === 'staff') setStaff(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as BengaliStaff : i));
        else setDoctors(prev => prev.map(i => i.id === editId ? { ...i, ...payload } as BengaliDoctor : i));
      } else {
        const id = \`\${Date.now()}-\${Math.random().toString(36).slice(2, 8)}\`;
        await setDoc(doc(db, collectionName, id), { ...payload, id, created_at: now });
        if (activeTab === 'hospitals') setHospitals(prev => [{ id, ...payload, created_at: now } as Hospital, ...prev]);
        else if (activeTab === 'staff') setStaff(prev => [{ id, ...payload, created_at: now } as BengaliStaff, ...prev]);
        else setDoctors(prev => [{ id, ...payload, created_at: now } as BengaliDoctor, ...prev]);
      }
      setShowForm(false);
    } catch (e) {
      console.error(e);
      alert('Error saving item.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const collectionName = activeTab === 'hospitals' ? COLLECTIONS.hospitals : activeTab === 'staff' ? (COLLECTIONS.bengali_staff || 'bengali_staff') : COLLECTIONS.bengali_doctors;
      await deleteDoc(doc(db, collectionName, id));
      if (activeTab === 'hospitals') setHospitals(prev => prev.filter(i => i.id !== id));
      else if (activeTab === 'staff') setStaff(prev => prev.filter(i => i.id !== id));
      else setDoctors(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      console.error(e);
      alert('Error deleting item.');
    }
  }

`;
content = content.replace(oldMethodsRegex, newMethods);

// Tabs replacement
const oldTabs = \`        <button
          onClick={() => setActiveTab('doctors')}
          className={\\\`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap \${activeTab === 'doctors' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}\\\`}
        >
          <UserRound className="w-4 h-4" /> Bengali Doctors
        </button>\`;
const newTabs = oldTabs + \`
        <button
          onClick={() => setActiveTab('staff')}
          className={\\\`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap \${activeTab === 'staff' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}\\\`}
        >
          <Users className="w-4 h-4" /> Bengali Staff
        </button>\`;
content = content.replace(oldTabs, newTabs);

// Table replacement
const oldTableRegex = /<table className="w-full">.*?(?=<\/table >|<\/table>)\s*<\/table>/s;
const newTable = \`{activeTab === 'doctors' ? (
            <div className="p-6 space-y-8">
              {hospitals.map(h => {
                const hospDocs = doctors.filter(d => d.hospital_id === h.id);
                if (hospDocs.length === 0) return null;
                return (
                  <div key={h.id} className="bg-surface rounded-2xl p-5 border border-border">
                    <h3 className="font-bold text-lg mb-4 text-primary border-b border-border pb-2">{h.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hospDocs.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-4 bg-white border border-border rounded-xl shadow-sm">
                          <div>
                            <p className="font-bold text-text-primary">{item.doctor_name}</p>
                            <p className="text-sm text-text-muted mt-1">{item.specialization} • {item.experience || 'N/A'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {canEdit && <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors cursor-pointer"><Pencil className="w-4 h-4" /></button>}
                            {canManage && <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
              {doctors.length === 0 && <div className="text-center py-12 text-text-muted">No doctors found.</div>}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-surface/50 border-b border-border">
                  {activeTab === 'hospitals' ? (
                    <>
                      <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospital Name</th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">City</th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Phone</th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Branch</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Staff Name</th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Role</th>
                      <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Hospital</th>
                    </>
                  )}
                  {(canEdit || canManage) && <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(activeTab === 'hospitals' ? hospitals : staff).map((item: any) => (
                  <tr key={item.id} className="hover:bg-surface transition-colors">
                    {activeTab === 'hospitals' ? (
                      <>
                        <td className="px-5 py-4 text-sm text-text-primary font-medium">{item.name}</td>
                        <td className="px-5 py-4 text-sm text-text-muted">{item.city}</td>
                        <td className="px-5 py-4 text-sm text-text-muted">{item.phone}</td>
                        <td className="px-5 py-4 text-sm text-text-muted">{item.main_branch ? <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-1 rounded">Main</span> : <span className="text-text-muted text-xs">Branch</span>}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-4 text-sm text-text-primary font-medium">{item.name}</td>
                        <td className="px-5 py-4 text-sm text-text-muted">{item.role}</td>
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
                {(activeTab === 'hospitals' ? hospitals : staff).length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm italic">No data yet</td></tr>
                )}
              </tbody>
            </table>
          )}\`;
content = content.replace(oldTableRegex, newTable);

// Modal Form replacement
const oldFormRegex = /            <div className="flex-1 p-6 overflow-y-auto space-y-5">.*?<\/div>\s*<div className="p-6 border-t border-border flex justify-end gap-3 bg-surface\/30">/s;
const newForm = \`            <div className="flex-1 p-6 overflow-y-auto space-y-5">
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
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Area</label>
                      <select value={formData.area || ''} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm">
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
                        <label htmlFor="has_bengali_doctor" className="text-sm font-semibold text-text-primary cursor-pointer">Has Bengali Doctor / Staff</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="main_branch" checked={!!formData.main_branch} onChange={e => setFormData({...formData, main_branch: e.target.checked})} className="w-5 h-5 rounded border-border" />
                        <label htmlFor="main_branch" className="text-sm font-semibold text-text-primary cursor-pointer">Main Branch</label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Specializations (One per line)</label>
                      <textarea rows={3} value={formData.specializations || ''} onChange={e => setFormData({...formData, specializations: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm resize-none" placeholder="Cardiology\\nNeurology" />
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
                      <div className="flex flex-wrap gap-3 p-3 bg-surface border border-border rounded-xl">
                        {LANGUAGES.map(lang => (
                          <label key={lang} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.languages?.includes(lang) || false} onChange={() => toggleLanguage(lang)} className="w-4 h-4 rounded border-border" />
                            <span className="text-sm font-medium">{lang}</span>
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
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Role (e.g. Receptionist) *</label>
                      <input type="text" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Assign to Hospital *</label>
                      <select value={formData.hospital_id || ''} onChange={e => setFormData({...formData, hospital_id: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm cursor-pointer">
                        <option value="">Select Hospital...</option>
                        {hospitals.map(h => <option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Department</label>
                      <input type="text" value={formData.department || ''} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Experience</label>
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
                    <div>
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Availability (e.g. Mon-Fri)</label>
                      <input type="text" value={formData.availability || ''} onChange={e => setFormData({...formData, availability: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Description</label>
                      <textarea rows={2} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm resize-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-text-primary mb-1.5">Languages</label>
                      <div className="flex flex-wrap gap-3 p-3 bg-surface border border-border rounded-xl">
                        {LANGUAGES.map(lang => (
                          <label key={lang} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={formData.languages?.includes(lang) || false} onChange={() => toggleLanguage(lang)} className="w-4 h-4 rounded border-border" />
                            <span className="text-sm font-medium">{lang}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-surface/30">\`;
content = content.replace(oldFormRegex, newForm);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Admin page modified successfully!');
