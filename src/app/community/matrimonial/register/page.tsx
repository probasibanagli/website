'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';

const steps = ['Basic Info', 'Education & Work', 'About & Preferences', 'Photo Upload', 'Review'];

export default function MatrimonialRegisterPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    full_name: '', age: '', gender: '', city: '', native_district: '',
    education: '', profession: '', annual_income: '',
    about_me: '', partner_preference: '', religion: '', caste: '',
  });

  const updateField = (field: string, value: string) => setFormData({ ...formData, [field]: value });

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/community/matrimonial" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Matrimonial
        </Link>

        <h1 className="text-3xl font-bold font-display text-text-primary mb-2">Register Your Profile</h1>
        <p className="text-text-muted mb-8">Complete your profile to connect with potential matches.</p>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i <= step ? 'bg-primary text-white' : 'bg-gray-200 text-text-muted'}`}>{i + 1}</div>
              <span className={`text-xs font-medium whitespace-nowrap ${i <= step ? 'text-primary' : 'text-text-muted'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <Card padding="lg">
          {step === 0 && (
            <div className="space-y-4">
              <Input label="Full Name" id="full_name" value={formData.full_name} onChange={(e) => updateField('full_name', e.target.value)} placeholder="Enter your full name" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Age" id="age" type="number" value={formData.age} onChange={(e) => updateField('age', e.target.value)} placeholder="25" />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary">Gender</label>
                  <select value={formData.gender} onChange={(e) => updateField('gender', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm">
                    <option value="">Select</option><option value="male">Male</option><option value="female">Female</option>
                  </select>
                </div>
              </div>
              <Input label="Current City" id="city" value={formData.city} onChange={(e) => updateField('city', e.target.value)} placeholder="Chennai" />
              <Input label="Native District (West Bengal)" id="native_district" value={formData.native_district} onChange={(e) => updateField('native_district', e.target.value)} placeholder="Kolkata, Howrah, etc." />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Input label="Education" id="education" value={formData.education} onChange={(e) => updateField('education', e.target.value)} placeholder="B.Tech, MBA, etc." />
              <Input label="Profession" id="profession" value={formData.profession} onChange={(e) => updateField('profession', e.target.value)} placeholder="Software Engineer, Doctor, etc." />
              <Input label="Annual Income" id="annual_income" value={formData.annual_income} onChange={(e) => updateField('annual_income', e.target.value)} placeholder="8-10 LPA" />
              <Input label="Religion" id="religion" value={formData.religion} onChange={(e) => updateField('religion', e.target.value)} placeholder="Hindu, Muslim, etc." />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">About Me</label>
                <textarea value={formData.about_me} onChange={(e) => updateField('about_me', e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Tell us about yourself..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Partner Preference</label>
                <textarea value={formData.partner_preference} onChange={(e) => updateField('partner_preference', e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="What are you looking for in a partner?" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-24 h-24 rounded-full bg-surface border-2 border-dashed border-border mx-auto flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-bold mb-2">Upload Profile Photo</h3>
              <p className="text-sm text-text-muted mb-4">JPG or PNG, max 5MB</p>
              <Button variant="outline">Choose Photo</Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Review Your Profile</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {formData.full_name || '—'}</p>
                <p><span className="font-medium">Age:</span> {formData.age || '—'} • <span className="font-medium">Gender:</span> {formData.gender || '—'}</p>
                <p><span className="font-medium">City:</span> {formData.city || '—'} • <span className="font-medium">From:</span> {formData.native_district || '—'}</p>
                <p><span className="font-medium">Education:</span> {formData.education || '—'}</p>
                <p><span className="font-medium">Profession:</span> {formData.profession || '—'}</p>
                <p><span className="font-medium">About:</span> {formData.about_me || '—'}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                ⚠️ Your profile will be reviewed by our admin team before being published. You&apos;ll be notified once it&apos;s approved.
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4" /> Previous
            </Button>
            {step < steps.length - 1 ? (
              <Button variant="primary" onClick={() => setStep(step + 1)}>
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="primary">Submit for Review</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
