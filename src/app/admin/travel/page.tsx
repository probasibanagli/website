'use client';
import AdminModulePage from '@/components/admin/AdminModulePage';

export default function AdminTravelPage() {
  return (
    <AdminModulePage
      moduleKey="travel"
      collectionName="travel_info"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'city', label: 'City' },
        { key: 'type', label: 'Type' },
        { key: 'description', label: 'Description' },
      ]}
      formFields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'city', label: 'City', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['bus', 'train', 'metro', 'auto', 'cab'] },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'route', label: 'Route Details' },
        { key: 'fare', label: 'Approximate Fare' },
        { key: 'frequency', label: 'Frequency' },
        { key: 'google_maps_url', label: 'Google Maps URL' },
      ]}
    />
  );
}
