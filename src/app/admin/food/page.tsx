'use client';
import AdminModulePage from '@/components/admin/AdminModulePage';

export default function AdminFoodPage() {
  return (
    <AdminModulePage
      moduleKey="food"
      collectionName="food_listings"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' },
        { key: 'city', label: 'City' },
        { key: 'area', label: 'Area' },
        { key: 'phone', label: 'Phone' },
      ]}
      formFields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['restaurant', 'sweets', 'tiffin', 'delivery'], required: true },
        { key: 'city', label: 'City', required: true },
        { key: 'area', label: 'Area' },
        { key: 'address', label: 'Address' },
        { key: 'phone', label: 'Phone' },
        { key: 'whatsapp', label: 'WhatsApp' },
        { key: 'specialties', label: 'Specialties (comma-separated)' },
        { key: 'google_maps_url', label: 'Google Maps URL' },
        { key: 'zomato_url', label: 'Zomato URL' },
        { key: 'swiggy_url', label: 'Swiggy URL' },
      ]}
    />
  );
}
