'use client';
import AdminModulePage from '@/components/admin/AdminModulePage';

export default function AdminServicesPage() {
  return (
    <AdminModulePage
      moduleKey="services"
      collectionName="colleges"
      columns={[
        { key: 'ranking', label: 'Rank' },
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' },
        { key: 'city', label: 'City' },
        { key: 'area', label: 'Area' },
        { key: 'phone', label: 'Phone' },
      ]}
      formFields={[
        { key: 'image_url', label: 'Cover Image', type: 'image' },
        { key: 'category', label: 'Category', type: 'select', options: ['college', 'school'], required: true },
        { key: 'name', label: 'Institution Name', required: true },
        { key: 'type', label: 'Type / Board', type: 'select', options: ['engineering', 'medical', 'arts_science', 'cbse', 'icse', 'kv'], required: true },
        { key: 'ranking', label: 'Ranking / Priority (1 = Top, 2 = Second, etc.)', type: 'number' },
        { key: 'city', label: 'City', required: true },
        { key: 'area', label: 'Area' },
        { key: 'address', label: 'Address' },
        { key: 'phone', label: 'Phone' },
        { key: 'website', label: 'Website URL' },
        { key: 'google_maps_url', label: 'Google Maps URL' },
        { key: 'staff_contacts', label: 'Bengali Staff / Professors', type: 'staff_contacts' },
      ]}
    />
  );
}
