'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Save, User, Users, GraduationCap, Heart, BookOpen, Sparkles, Utensils, CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  CITIES, HEIGHTS, MARITAL_STATUSES, COMPLEXIONS, FAMILY_TYPES, FAMILY_VALUES, FAMILY_STATUS,
  DIET_TYPES, EDUCATION_LEVELS, INCOME_RANGES, BENGALI_SUBCASTES, WEST_BENGAL_DISTRICTS,
  SMOKING_HABITS, DRINKING_HABITS, MANGLIK_OPTIONS, HOBBIES_LIST, RELIGIONS, BLOOD_GROUPS,
} from '@/lib/constants';
import { getMyProfile, saveMyProfile } from '@/lib/matrimony-service';
import type { MatrimonialProfile } from '@/types';

interface FormData {
  [key: string]: string | number | string[] | undefined;
}

export default function EditMatrimonialProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({});
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('personal');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MatrimonialProfile | null>(null);

  useEffect(() => {
    const myProfile = getMyProfile();
    if (!myProfile) {
      router.push('/community/matrimonial/register');
      return;
    }
    setProfile(myProfile);
    setSelectedHobbies(myProfile.hobbies || []);
    const data: FormData = {};
    Object.entries(myProfile).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') data[key] = value;
    });
    setFormData(data);
    setLoading(false);
  }, [router]);

  const updateField = useCallback((field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }, []);

  const toggleHobby = useCallback((hobby: string) => {
    setSelectedHobbies(prev =>
      prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]
    );
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    if (!profile) return;
    const dob = formData.date_of_birth ? new Date(formData.date_of_birth as string) : null;
    const age = dob ? Math.floor((Date.now() - dob.getTime()) / 31557600000) : profile.age;

    const updatedProfile: MatrimonialProfile = {
      ...profile,
      full_name: formData.full_name as string,
      date_of_birth: formData.date_of_birth as string,
      age,
      gender: formData.gender as string,
      height: formData.height as string,
      weight: formData.weight as string,
      complexion: formData.complexion as string,
      blood_group: formData.blood_group as string,
      marital_status: formData.marital_status as string,
      mother_tongue: formData.mother_tongue as string,
      city: formData.city as string,
      native_district: formData.native_district as string,
      father_name: formData.father_name as string,
      father_occupation: formData.father_occupation as string,
      mother_name: formData.mother_name as string,
      mother_occupation: formData.mother_occupation as string,
      siblings: formData.siblings as string,
      family_type: formData.family_type as string,
      family_values: formData.family_values as string,
      family_status: formData.family_status as string,
      education: formData.education as string,
      field_of_study: formData.field_of_study as string,
      institution: formData.institution as string,
      profession: formData.profession as string,
      company: formData.company as string,
      annual_income: formData.annual_income as string,
      work_city: formData.work_city as string,
      religion: formData.religion as string,
      sub_caste: formData.sub_caste as string,
      gotra: formData.gotra as string,
      manglik: formData.manglik as string,
      diet: formData.diet as string,
      smoking: formData.smoking as string,
      drinking: formData.drinking as string,
      hobbies: selectedHobbies,
      about_me: formData.about_me as string,
      partner_preference: formData.partner_preference as string,
      pref_age_min: formData.pref_age_min ? Number(formData.pref_age_min) : undefined,
      pref_age_max: formData.pref_age_max ? Number(formData.pref_age_max) : undefined,
      pref_height_min: formData.pref_height_min as string,
      pref_height_max: formData.pref_height_max as string,
      pref_education: formData.pref_education as string,
      pref_profession: formData.pref_profession as string,
      pref_city: formData.pref_city as string,
      pref_diet: formData.pref_diet as string,
      pref_marital_status: formData.pref_marital_status as string,
      phone: formData.phone as string,
      email: formData.email as string,
      whatsapp: formData.whatsapp as string,
      updated_at: new Date().toISOString(),
    };

    saveMyProfile(updatedProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [profile, formData, selectedHobbies]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  const FormSelect = ({ label, field, options }: { label: string; field: string; options: readonly string[] }) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary">{label}</label>
      <select value={(formData[field] as string) || ''} onChange={(e) => updateField(field, e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
        <option value="">Select</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const FormInput = ({ label, field, type = 'text', placeholder }: { label: string; field: string; type?: string; placeholder?: string }) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary">{label}</label>
      <input type={type} value={(formData[field] as string) || ''} onChange={(e) => updateField(field, e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );

  const sections = [
    { key: 'personal', label: 'Personal', icon: User },
    { key: 'family', label: 'Family', icon: Users },
    { key: 'education', label: 'Education', icon: GraduationCap },
    { key: 'religion', label: 'Religion & Lifestyle', icon: BookOpen },
    { key: 'preferences', label: 'Preferences', icon: Sparkles },
    { key: 'about', label: 'About', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/community/matrimonial/dashboard" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold font-display">Edit Profile</h1>
            <p className="text-text-muted mt-1">Update your matrimonial profile details</p>
          </div>
          <Button variant="primary" onClick={handleSave} className={saved ? 'bg-accent hover:bg-accent' : ''}>
            {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </Button>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-border overflow-x-auto">
          {sections.map(sec => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.key}
                onClick={() => setActiveSection(sec.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeSection === sec.key ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-primary hover:bg-surface'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {sec.label}
              </button>
            );
          })}
        </div>

        <Card padding="lg" hover={false}>
          {/* Personal */}
          {activeSection === 'personal' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">Personal Details</h2>
              <FormInput label="Full Name" field="full_name" placeholder="Your full name" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Date of Birth" field="date_of_birth" type="date" />
                <FormSelect label="Gender" field="gender" options={['male', 'female']} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormSelect label="Height" field="height" options={HEIGHTS} />
                <FormInput label="Weight" field="weight" placeholder="65 kg" />
                <FormSelect label="Complexion" field="complexion" options={COMPLEXIONS} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Blood Group" field="blood_group" options={BLOOD_GROUPS} />
                <FormSelect label="Marital Status" field="marital_status" options={MARITAL_STATUSES} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Current City (TN)" field="city" options={CITIES} />
                <FormSelect label="Native District (WB)" field="native_district" options={WEST_BENGAL_DISTRICTS} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput label="Phone" field="phone" type="tel" placeholder="+91..." />
                <FormInput label="Email" field="email" type="email" />
                <FormInput label="WhatsApp" field="whatsapp" type="tel" />
              </div>
            </div>
          )}

          {/* Family */}
          {activeSection === 'family' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">Family Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Father's Name" field="father_name" />
                <FormInput label="Father's Occupation" field="father_occupation" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Mother's Name" field="mother_name" />
                <FormInput label="Mother's Occupation" field="mother_occupation" />
              </div>
              <FormInput label="Siblings" field="siblings" placeholder="e.g., 1 Elder Sister (Married)" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormSelect label="Family Type" field="family_type" options={FAMILY_TYPES} />
                <FormSelect label="Family Values" field="family_values" options={FAMILY_VALUES} />
                <FormSelect label="Family Status" field="family_status" options={FAMILY_STATUS} />
              </div>
            </div>
          )}

          {/* Education */}
          {activeSection === 'education' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">Education & Career</h2>
              <FormSelect label="Highest Education" field="education" options={EDUCATION_LEVELS} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Field of Study" field="field_of_study" />
                <FormInput label="Institution" field="institution" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Profession" field="profession" />
                <FormInput label="Company" field="company" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Annual Income" field="annual_income" options={INCOME_RANGES} />
                <FormInput label="Work City" field="work_city" />
              </div>
            </div>
          )}

          {/* Religion & Lifestyle */}
          {activeSection === 'religion' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">Religion & Lifestyle</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Religion" field="religion" options={RELIGIONS} />
                <FormSelect label="Sub-Caste" field="sub_caste" options={BENGALI_SUBCASTES} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Gotra" field="gotra" />
                <FormSelect label="Manglik" field="manglik" options={MANGLIK_OPTIONS} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormSelect label="Diet" field="diet" options={DIET_TYPES} />
                <FormSelect label="Smoking" field="smoking" options={SMOKING_HABITS} />
                <FormSelect label="Drinking" field="drinking" options={DRINKING_HABITS} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Hobbies & Interests</label>
                <div className="flex flex-wrap gap-2">
                  {HOBBIES_LIST.map(hobby => (
                    <button key={hobby} type="button" onClick={() => toggleHobby(hobby)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        selectedHobbies.includes(hobby) ? 'bg-primary text-white border-primary' : 'bg-white text-text-muted border-border hover:border-primary/50'
                      }`}>
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeSection === 'preferences' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">Partner Preferences</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <FormInput label="Age Min" field="pref_age_min" type="number" placeholder="22" />
                <FormInput label="Age Max" field="pref_age_max" type="number" placeholder="32" />
                <FormSelect label="Height Min" field="pref_height_min" options={HEIGHTS} />
                <FormSelect label="Height Max" field="pref_height_max" options={HEIGHTS} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Pref. Education" field="pref_education" options={EDUCATION_LEVELS} />
                <FormInput label="Pref. Profession" field="pref_profession" placeholder="Any" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormSelect label="Pref. City" field="pref_city" options={CITIES} />
                <FormSelect label="Pref. Diet" field="pref_diet" options={DIET_TYPES} />
                <FormSelect label="Pref. Marital Status" field="pref_marital_status" options={MARITAL_STATUSES} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">About Ideal Partner</label>
                <textarea value={(formData.partner_preference as string) || ''} onChange={(e) => updateField('partner_preference', e.target.value)} rows={4} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Describe your ideal partner..." />
              </div>
            </div>
          )}

          {/* About */}
          {activeSection === 'about' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">About Me</h2>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Tell potential matches about yourself</label>
                <textarea value={(formData.about_me as string) || ''} onChange={(e) => updateField('about_me', e.target.value)} rows={6} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Your personality, values, interests, what makes you unique..." />
              </div>
            </div>
          )}

          {/* Save Button (bottom) */}
          <div className="mt-8 pt-6 border-t border-border flex justify-end">
            <Button variant="primary" onClick={handleSave} className={saved ? 'bg-accent hover:bg-accent' : ''}>
              {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
