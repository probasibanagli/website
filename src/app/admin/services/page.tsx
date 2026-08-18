'use client';
import AdminModulePage from '@/components/admin/AdminModulePage';
import { CITIES, CITY_AREAS } from '@/lib/constants';

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
        { key: 'category', label: 'Category', type: 'select', options: ['college', 'school'], required: true },
        { key: 'name', label: 'Institution Name', required: true },
        { 
          key: 'type', 
          label: 'Type / Board', 
          type: 'select', 
          options: (formData) => {
            if (formData.category === 'school') return ['cbse', 'icse', 'state_board', 'kv', 'international'];
            if (formData.category === 'college') return ['engineering', 'medical', 'arts_science', 'law', 'management'];
            return ['engineering', 'medical', 'arts_science', 'law', 'management', 'cbse', 'icse', 'state_board', 'kv', 'international'];
          }, 
          required: true 
        },
        { key: 'ranking', label: 'Ranking / Priority (1 = Top, 2 = Second, etc.)', type: 'number' },
        { key: 'city', label: 'City', type: 'select', options: CITIES, required: true },
        { key: 'area', label: 'Area', type: 'select', options: (formData) => formData.city && typeof formData.city === 'string' ? (CITY_AREAS[formData.city] || []) : [] },
        { key: 'address', label: 'Address' },
        { key: 'pincode', label: 'Pincode' },
        { key: 'phone', label: 'Phone' },
        { key: 'website', label: 'Website URL' },
        { key: 'google_maps_url', label: 'Google Maps URL' },
        { key: 'staff_contacts', label: 'Bengali Staff / Professors', type: 'staff_contacts' },
      ]}
    />
  );
}
