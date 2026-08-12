'use client';
export const dynamic = 'force-dynamic';
import AdminModulePage from '@/components/admin/AdminModulePage';

export default function AdminEventsPage() {
  return (
    <AdminModulePage
      moduleKey="events"
      collectionName="events"
      columns={[
        { key: 'title', label: 'Event Title' },
        { key: 'event_date', label: 'Date' },
        { key: 'city', label: 'City' },
        { key: 'category', label: 'Category' },
      ]}
      formFields={[
        { key: 'title', label: 'Event Title', required: true },
        { key: 'event_date', label: 'Event Date (YYYY-MM-DD)', required: true },
        { key: 'category', label: 'Category', type: 'select', options: ['festival', 'cultural', 'social', 'religious'], required: true },
        { key: 'city', label: 'City', required: true },
        { key: 'venue', label: 'Venue / Location', required: true },
        { key: 'organizer', label: 'Organizer' },
        { key: 'contact', label: 'Contact Number' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'community_group_id', label: 'Community Group ID' },
        { key: 'image_url', label: 'Cover Image URL (Optional)', type: 'image' },
        { key: 'booking_url', label: 'Booking / RSVP URL' },
        { key: 'google_maps_url', label: 'Google Maps URL' },
      ]}
    />
  );
}
