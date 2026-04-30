'use client';
import AdminModulePage from '@/components/admin/AdminModulePage';

export default function AdminCommunityPage() {
  return (
    <AdminModulePage
      moduleKey="community"
      collectionName="community_groups"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'platform', label: 'Platform' },
        { key: 'city', label: 'City' },
        { key: 'member_count', label: 'Members' },
        { key: 'category', label: 'Category' },
      ]}
      formFields={[
        { key: 'name', label: 'Group Name', required: true },
        { key: 'platform', label: 'Platform', type: 'select', options: ['whatsapp', 'telegram', 'facebook', 'instagram'], required: true },
        { key: 'city', label: 'City' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'member_count', label: 'Member Count', type: 'number' },
        { key: 'join_url', label: 'Join URL' },
        { key: 'category', label: 'Category', type: 'select', options: ['general', 'students', 'professionals', 'women', 'seniors'] },
      ]}
    />
  );
}
