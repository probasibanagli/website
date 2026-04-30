'use client';
import AdminModulePage from '@/components/admin/AdminModulePage';

export default function AdminEmergencyPage() {
  return (
    <AdminModulePage
      moduleKey="emergency"
      collectionName="hospitals"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'city', label: 'City' },
        { key: 'area', label: 'Area' },
        { key: 'phone', label: 'Phone' },
        { key: 'emergency_phone', label: 'Emergency Phone' },
        { key: 'is_24_7', label: '24/7' },
      ]}
      formFields={[
        { key: 'name', label: 'Hospital Name', required: true },
        { key: 'city', label: 'City', required: true },
        { key: 'area', label: 'Area' },
        { key: 'address', label: 'Full Address' },
        { key: 'phone', label: 'Phone' },
        { key: 'emergency_phone', label: 'Emergency Phone' },
        { key: 'specializations', label: 'Specializations (comma-separated)' },
        { key: 'is_24_7', label: '24/7 Service', type: 'select', options: ['true', 'false'] },
        { key: 'has_bengali_doctor', label: 'Bengali Doctor', type: 'select', options: ['true', 'false'] },
        { key: 'google_maps_url', label: 'Google Maps URL' },
      ]}
    />
  );
}
