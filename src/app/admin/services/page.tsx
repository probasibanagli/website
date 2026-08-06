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
        { key: 'name', label: 'College Name', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['engineering', 'medical', 'arts_science'], required: true },
        { key: 'ranking', label: 'Ranking / Priority (1 = Top, 2 = Second, etc.)', type: 'number' },
        { key: 'city', label: 'City', required: true },
        { key: 'area', label: 'Area' },
        { key: 'address', label: 'Address' },
        { key: 'phone', label: 'Phone' },
        { key: 'website', label: 'Website URL' },
        { key: 'google_maps_url', label: 'Google Maps URL' },
      ]}
    />
  );
}
