'use client';
import AdminModulePage from '@/components/admin/AdminModulePage';

export default function AdminServicesPage() {
  return (
    <AdminModulePage
      moduleKey="services"
      collectionName="colleges"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' },
        { key: 'city', label: 'City' },
        { key: 'area', label: 'Area' },
        { key: 'phone', label: 'Phone' },
      ]}
      formFields={[
        { key: 'name', label: 'College Name', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['engineering', 'medical', 'arts', 'management', 'polytechnic'], required: true },
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
