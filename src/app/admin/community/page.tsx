'use client';
export const dynamic = 'force-dynamic';
import AdminModulePage from '@/components/admin/AdminModulePage';

export default function AdminCommunityPage() {
  return (
    <AdminModulePage
      moduleKey="community"
      collectionName="community_groups"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'city', label: 'City' },
        { key: 'category', label: 'Category' },
      ]}
      formFields={[
        { key: 'name', label: 'Group Name', required: true },
        { key: 'image_url', label: 'Cover Image', type: 'image' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State', type: 'select', options: ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'All India', 'Global'] },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'member_count', label: 'Member Count (e.g. 500)' },
        { key: 'whatsapp_url', label: 'WhatsApp URL' },
        { key: 'telegram_url', label: 'Telegram URL' },
        { key: 'discord_url', label: 'Discord URL' },
        { key: 'facebook_url', label: 'Facebook URL' },
        { key: 'instagram_url', label: 'Instagram URL' },
        { key: 'linkedin_url', label: 'LinkedIn URL' },
        { key: 'website_url', label: 'Website URL' },
        { key: 'category', label: 'Category', type: 'select', options: ['general', 'students', 'professionals', 'women', 'seniors', 'cultural', 'religious'] },
      ]}
    />
  );
}
