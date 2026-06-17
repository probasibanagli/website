'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, User, Users, GraduationCap, Heart, Camera,
  Briefcase, CheckCircle, BookOpen, Sparkles, Shield, Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import {
  CITIES, HEIGHTS, MARITAL_STATUSES, COMPLEXIONS, FAMILY_TYPES, FAMILY_VALUES, FAMILY_STATUS,
  DIET_TYPES, EDUCATION_LEVELS, INCOME_RANGES, BENGALI_SUBCASTES, WEST_BENGAL_DISTRICTS,
  SMOKING_HABITS, DRINKING_HABITS, MANGLIK_OPTIONS, HOBBIES_LIST, RELIGIONS, BLOOD_GROUPS,
} from '@/lib/constants';
import { saveMyProfile, generateProfileId, getMyProfile } from '@/lib/matrimony-service';
import type { MatrimonialProfile } from '@/types';

const steps = [
  { label: 'Account', icon: User },
  { label: 'Personal', icon: Heart },
  { label: 'Family', icon: Users },
  { label: 'Education', icon: GraduationCap },
  { label: 'Religion', icon: BookOpen },
  { label: 'Preferences', icon: Sparkles },
  { label: 'Photo & Review', icon: Camera },
];

interface FormData {
  [key: string]: string | number | string[] | undefined;
}

const initialFormData: FormData = {
  full_name: '', email: '', phone: '', whatsapp: '',
  date_of_birth: '', gender: '', height: '', weight: '', complexion: '', blood_group: '',
  marital_status: '', mother_tongue: 'Bengali', physical_disability: 'None',
  city: '', native_district: '',
  father_name: '', father_occupation: '', mother_name: '', mother_occupation: '',
  siblings: '', family_type: '', family_values: '', family_status: '',
  education: '', field_of_study: '', institution: '', profession: '', company: '',
  annual_income: '', work_city: '',
  religion: 'Hindu', caste: 'Bengali', sub_caste: '', gotra: '', manglik: '',
  diet: '', smoking: '', drinking: '',
  about_me: '', partner_preference: '',
  pref_age_min: '', pref_age_max: '', pref_height_min: '', pref_height_max: '',
  pref_education: '', pref_profession: '', pref_city: '', pref_income_min: '',
  pref_diet: '', pref_marital_status: '',
};

export default function MatrimonialRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(() => {
    // Load draft if exists
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem('pb_matrimony_draft');
      if (draft) {
        try { return { ...initialFormData, ...JSON.parse(draft) }; } catch { /* ignore */ }
      }
    }
    return initialFormData;
  });
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileId, setProfileId] = useState('');

  const updateField = useCallback((field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
  }, []);

  const toggleHobby = useCallback((hobby: string) => {
    setSelectedHobbies(prev => 
      prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]
    );
  }, []);

  const saveDraft = useCallback(() => {
    localStorage.setItem('pb_matrimony_draft', JSON.stringify({ ...formData, hobbies: selectedHobbies }));
    alert('Draft saved successfully! You can continue later.');
  }, [formData, selectedHobbies]);

  const validateStep = useCallback((stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!formData.full_name) newErrors.full_name = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    }
    if (stepIndex === 1) {
      if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.height) newErrors.height = 'Height is required';
      if (!formData.marital_status) newErrors.marital_status = 'Marital status is required';
      if (!formData.city) newErrors.city = 'Current city is required';
      if (!formData.native_district) newErrors.native_district = 'Native district is required';

      // Age validation
      if (formData.date_of_birth) {
        const dob = new Date(formData.date_of_birth as string);
        const age = Math.floor((Date.now() - dob.getTime()) / 31557600000);
        if (age < 18) newErrors.date_of_birth = 'Must be at least 18 years old';
        if (age > 60) newErrors.date_of_birth = 'Age must be between 18-60';
      }
    }
    if (stepIndex === 3) {
      if (!formData.education) newErrors.education = 'Education is required';
      if (!formData.profession) newErrors.profession = 'Profession is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const goNext = useCallback(() => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step, validateStep]);

  const goBack = useCallback(() => {
    setStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmit = useCallback(() => {
    const dob = new Date(formData.date_of_birth as string);
    const age = Math.floor((Date.now() - dob.getTime()) / 31557600000);
    const id = generateProfileId();
    const now = new Date().toISOString();

    const profile: MatrimonialProfile = {
      id: `user-${Date.now()}`,
      user_id: `local-${Date.now()}`,
      profile_id: id,
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
      physical_disability: formData.physical_disability as string,
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
      caste: formData.caste as string,
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
      pref_income_min: formData.pref_income_min as string,
      pref_diet: formData.pref_diet as string,
      pref_marital_status: formData.pref_marital_status as string,
      phone: formData.phone as string,
      email: formData.email as string,
      whatsapp: formData.whatsapp as string,
      verified: false,
      published: true,
      status: 'pending',
      contact_visible_after_login: true,
      created_at: now,
      updated_at: now,
    };

    saveMyProfile(profile);
    localStorage.removeItem('pb_matrimony_draft');
    setProfileId(id);
    setSubmitted(true);
  }, [formData, selectedHobbies]);

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold font-display mb-3">Profile Submitted!</h1>
          <p className="text-text-muted mb-2">Your matrimonial profile has been submitted successfully.</p>
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary font-bold px-6 py-3 rounded-xl mb-6">
            <Shield className="w-5 h-5" />
            Your Profile ID: {profileId}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 mb-8">
            ⚠️ Your profile will be reviewed by our admin team before being published. You&apos;ll be notified once it&apos;s approved.
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/community/matrimonial/dashboard">
              <Button variant="primary" size="lg">Go to Dashboard</Button>
            </Link>
            <Link href="/community/matrimonial">
              <Button variant="outline" size="lg">Browse Profiles</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Select helper component
  const FormSelect = ({ label, field, options, required }: { label: string; field: string; options: readonly string[]; required?: boolean }) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={(formData[field] as string) || ''}
        onChange={(e) => updateField(field, e.target.value)}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer ${
          errors[field] ? 'border-red-400' : 'border-border'
        }`}
      >
        <option value="">Select {label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
    </div>
  );

  const FormInput = ({ label, field, type = 'text', placeholder, required }: { label: string; field: string; type?: string; placeholder?: string; required?: boolean }) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={(formData[field] as string) || ''}
        onChange={(e) => updateField(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
          errors[field] ? 'border-red-400' : 'border-border'
        }`}
      />
      {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <Link href="/community/matrimonial" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Matrimonial
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">
            Register Your Profile
          </h1>
          <p className="mt-2 text-text-muted">
            Complete your matrimonial profile to connect with verified Bengali matches in Tamil Nadu.
          </p>
        </div>

        {/* Step Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 transition-all duration-300 ${
                    i < step ? 'bg-accent text-white' :
                    i === step ? 'bg-primary text-white shadow-md shadow-primary/30' :
                    'bg-gray-100 text-text-muted'
                  }`}>
                    {i < step ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${
                    i <= step ? 'text-primary' : 'text-text-muted'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card padding="lg" hover={false}>
          {/* Step 0: Account Setup */}
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Account Setup</h2>
                  <p className="text-xs text-text-muted">Your basic contact information</p>
                </div>
              </div>
              <FormInput label="Full Name" field="full_name" placeholder="Enter your full name" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Email Address" field="email" type="email" placeholder="your@email.com" required />
                <FormInput label="Phone Number" field="phone" type="tel" placeholder="+91 9876543210" required />
              </div>
              <FormInput label="WhatsApp Number (if different)" field="whatsapp" type="tel" placeholder="+91 9876543210" />
            </div>
          )}

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Personal Details</h2>
                  <p className="text-xs text-text-muted">Tell us about yourself</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Date of Birth" field="date_of_birth" type="date" required />
                <FormSelect label="Gender" field="gender" options={['male', 'female']} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormSelect label="Height" field="height" options={HEIGHTS} required />
                <FormInput label="Weight" field="weight" placeholder="65 kg" />
                <FormSelect label="Complexion" field="complexion" options={COMPLEXIONS} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Blood Group" field="blood_group" options={BLOOD_GROUPS} />
                <FormSelect label="Marital Status" field="marital_status" options={MARITAL_STATUSES} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Current City (Tamil Nadu)" field="city" options={CITIES} required />
                <FormSelect label="Native District (West Bengal)" field="native_district" options={WEST_BENGAL_DISTRICTS} required />
              </div>
              <FormInput label="Mother Tongue" field="mother_tongue" placeholder="Bengali" />
            </div>
          )}

          {/* Step 2: Family Details */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Family Details</h2>
                  <p className="text-xs text-text-muted">About your family background</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Father's Name" field="father_name" placeholder="Father's full name" />
                <FormInput label="Father's Occupation" field="father_occupation" placeholder="e.g., Retired Bank Manager" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Mother's Name" field="mother_name" placeholder="Mother's full name" />
                <FormInput label="Mother's Occupation" field="mother_occupation" placeholder="e.g., Homemaker, Teacher" />
              </div>
              <FormInput label="Siblings" field="siblings" placeholder="e.g., 1 Elder Sister (Married), 1 Younger Brother" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormSelect label="Family Type" field="family_type" options={FAMILY_TYPES} />
                <FormSelect label="Family Values" field="family_values" options={FAMILY_VALUES} />
                <FormSelect label="Family Status" field="family_status" options={FAMILY_STATUS} />
              </div>
            </div>
          )}

          {/* Step 3: Education & Career */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Education & Career</h2>
                  <p className="text-xs text-text-muted">Your academic and professional details</p>
                </div>
              </div>
              <FormSelect label="Highest Education" field="education" options={EDUCATION_LEVELS} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Field of Study" field="field_of_study" placeholder="e.g., Computer Science, Medicine" />
                <FormInput label="Institution" field="institution" placeholder="e.g., IIT Madras, CMC Vellore" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Profession" field="profession" placeholder="e.g., Software Engineer, Doctor" required />
                <FormInput label="Company / Employer" field="company" placeholder="e.g., Google, TCS, Govt." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Annual Income" field="annual_income" options={INCOME_RANGES} />
                <FormInput label="Work City" field="work_city" placeholder="Same as current city?" />
              </div>
            </div>
          )}

          {/* Step 4: Religion & Lifestyle */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Religion & Lifestyle</h2>
                  <p className="text-xs text-text-muted">Cultural and lifestyle preferences</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Religion" field="religion" options={RELIGIONS} />
                <FormSelect label="Sub-Caste / Community" field="sub_caste" options={BENGALI_SUBCASTES} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Gotra" field="gotra" placeholder="e.g., Kashyap, Bharadwaj" />
                <FormSelect label="Manglik Status" field="manglik" options={MANGLIK_OPTIONS} />
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
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => toggleHobby(hobby)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        selectedHobbies.includes(hobby)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-text-muted border-border hover:border-primary/50'
                      }`}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Partner Preferences */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Partner Preferences</h2>
                  <p className="text-xs text-text-muted">What you&apos;re looking for in a life partner</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <FormInput label="Age Min" field="pref_age_min" type="number" placeholder="22" />
                <FormInput label="Age Max" field="pref_age_max" type="number" placeholder="32" />
                <FormSelect label="Height Min" field="pref_height_min" options={HEIGHTS} />
                <FormSelect label="Height Max" field="pref_height_max" options={HEIGHTS} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Preferred Education" field="pref_education" options={EDUCATION_LEVELS} />
                <FormInput label="Preferred Profession" field="pref_profession" placeholder="e.g., Doctor, Engineer, Any" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormSelect label="Preferred City" field="pref_city" options={CITIES} />
                <FormSelect label="Preferred Diet" field="pref_diet" options={DIET_TYPES} />
                <FormSelect label="Preferred Marital Status" field="pref_marital_status" options={MARITAL_STATUSES} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">About Your Ideal Partner</label>
                <textarea
                  value={(formData.partner_preference as string) || ''}
                  onChange={(e) => updateField('partner_preference', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Describe what you're looking for in a life partner..."
                />
              </div>
            </div>
          )}

          {/* Step 6: Photo & Review */}
          {step === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Photo & Review</h2>
                  <p className="text-xs text-text-muted">Add your photo and review your profile</p>
                </div>
              </div>

              {/* Photo Upload placeholder */}
              <div className="text-center py-6 border-2 border-dashed border-border rounded-xl bg-surface">
                <div className="w-20 h-20 rounded-full bg-white border-2 border-dashed border-primary/30 mx-auto flex items-center justify-center mb-3">
                  <Camera className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-sm font-bold mb-1">Upload Profile Photo</h3>
                <p className="text-xs text-text-muted mb-3">JPG or PNG, max 5MB</p>
                <Button variant="outline" size="sm">Choose Photo</Button>
              </div>

              {/* About Me */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">About Me</label>
                <textarea
                  value={(formData.about_me as string) || ''}
                  onChange={(e) => updateField('about_me', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Tell potential matches about yourself — your personality, interests, values..."
                />
              </div>

              {/* Review Summary */}
              <div className="bg-surface rounded-xl p-5 space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" /> Profile Summary
                </h3>
                
                {[
                  { title: 'Personal', items: [
                    ['Name', formData.full_name], ['Gender', formData.gender], ['DOB', formData.date_of_birth],
                    ['Height', formData.height], ['City', formData.city], ['Native', formData.native_district],
                    ['Marital Status', formData.marital_status], ['Complexion', formData.complexion],
                  ]},
                  { title: 'Family', items: [
                    ['Father', formData.father_name], ['Occupation', formData.father_occupation],
                    ['Mother', formData.mother_name], ['Family Type', formData.family_type],
                  ]},
                  { title: 'Education & Career', items: [
                    ['Education', formData.education], ['Field', formData.field_of_study],
                    ['Profession', formData.profession], ['Company', formData.company],
                    ['Income', formData.annual_income],
                  ]},
                  { title: 'Religion & Lifestyle', items: [
                    ['Religion', formData.religion], ['Sub-caste', formData.sub_caste],
                    ['Diet', formData.diet], ['Smoking', formData.smoking], ['Drinking', formData.drinking],
                  ]},
                ].map(section => (
                  <div key={section.title}>
                    <h4 className="text-sm font-semibold text-primary mb-2">{section.title}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                      {section.items.map(([label, value]) => (
                        <p key={label as string}><span className="text-text-muted">{label as string}:</span> <span className="font-medium">{(value as string) || '—'}</span></p>
                      ))}
                    </div>
                  </div>
                ))}

                {selectedHobbies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-primary mb-2">Hobbies</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedHobbies.map(h => (
                        <span key={h} className="px-2 py-0.5 rounded-full text-xs bg-primary-light text-primary font-medium">{h}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                ⚠️ Your profile will be reviewed by our admin team before being published. We verify all profiles to ensure authenticity. You&apos;ll be notified once it&apos;s approved.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <div className="flex gap-2">
              <Button variant="ghost" onClick={goBack} disabled={step === 0}>
                <ArrowLeft className="w-4 h-4" /> Previous
              </Button>
              <Button variant="ghost" onClick={saveDraft} className="text-text-muted">
                <Save className="w-4 h-4" /> Save Draft
              </Button>
            </div>
            {step < steps.length - 1 ? (
              <Button variant="primary" onClick={goNext}>
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="primary" onClick={handleSubmit}>
                <CheckCircle className="w-4 h-4" /> Submit for Review
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
