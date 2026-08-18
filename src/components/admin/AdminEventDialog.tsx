'use client';

import React, { useState } from 'react';
import { CommunityEvent } from '@/types';
import { saveEvent, deleteEvent } from '@/lib/events-service';
import { Button } from '@/components/ui/button';
import { X, Save, Trash2, Loader2, Camera, MapPin, Calendar, Users, ListOrdered } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { CITIES } from '@/lib/constants';

interface AdminEventDialogProps {
  existingEvent?: CommunityEvent;
  onClose: () => void;
  onSaved: () => void;
  onDeleted?: () => void;
}

export function AdminEventDialog({ existingEvent, onClose, onSaved, onDeleted }: AdminEventDialogProps) {
  const [formData, setFormData] = useState<Partial<CommunityEvent>>(
    existingEvent || {
      title: '',
      description: '',
      event_date: '',
      category: 'festival',
      city: '',
      venue: '',
      organizer: '',
      contact: '',
      booking_url: '',
      google_maps_url: '',
    }
  );

  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.event_date) {
      setError('Title and Event Date are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await saveEvent(formData);
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to save event');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingEvent?.id) return;
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deleteEvent(existingEvent.id);
        if (onDeleted) onDeleted();
      } catch (err: any) {
        setError(err.message || 'Failed to delete event');
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-surface">
          <h2 className="text-xl font-bold text-text-primary">
            {existingEvent ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form id="event-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Event Title *</label>
                <Input
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Durga Puja 2026"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Event Date *</label>
                <Input
                  type="date"
                  name="event_date"
                  value={formData.event_date || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category || 'festival'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="festival">Festival</option>
                  <option value="cultural">Cultural</option>
                  <option value="social">Social</option>
                  <option value="religious">Religious</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">City</label>
                <select
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a City...</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-1">Address</label>
                <Input
                  name="venue"
                  value={formData.venue || ''}
                  onChange={handleChange}
                  placeholder="e.g. Besant Nagar Beach"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-1">Google Maps URL</label>
                <Input
                  name="google_maps_url"
                  value={formData.google_maps_url || ''}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-1">Description</label>
                <textarea
                  maxLength={250}
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Details about the event... (Max 250 chars)"
                />
                <p className="text-right text-[10px] text-text-muted mt-1">{(formData.description || '').length}/250</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Organizer</label>
                <Input
                  name="organizer"
                  value={formData.organizer || ''}
                  onChange={handleChange}
                  placeholder="Name of association or person"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">Contact Info</label>
                <Input
                  name="contact"
                  value={formData.contact || ''}
                  onChange={handleChange}
                  placeholder="Phone or email"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t bg-surface flex items-center justify-between">
          <div>
            {existingEvent && (
              <Button 
                type="button"
                onClick={handleDelete}
                disabled={loading || isDeleting}
                className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" form="event-form" variant="primary" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {existingEvent ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
