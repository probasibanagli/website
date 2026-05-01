'use client';

import AdminModulePage from '@/components/admin/AdminModulePage';

export default function AdminStayPage() {
  return (
    <AdminModulePage
      moduleKey="stay"
      collectionName="listings"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' },
        { key: 'city', label: 'City' },
        { key: 'area', label: 'Area' },
        { key: 'price_per_month', label: 'Price/Month' },
        { key: 'gender', label: 'Gender' },
      ]}
      formFields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['pg', 'hotel', 'rental'], required: true },
        { key: 'city', label: 'City', required: true },
        { key: 'area', label: 'Area', required: true },
        { key: 'address', label: 'Address' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'price_per_month', label: 'Price per Month (₹)', type: 'number' },
        { key: 'room_type', label: 'Room Type', type: 'select', options: ['single', 'double', 'triple'] },
        { key: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'mixed'] },
        { key: 'owner_name', label: 'Owner Name' },
        { key: 'owner_phone', label: 'Owner Phone' },
        { key: 'owner_whatsapp', label: 'Owner WhatsApp' },
        { key: 'google_maps_url', label: 'Google Maps URL' },
      ]}
    />
  );
}
