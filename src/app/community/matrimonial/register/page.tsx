'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, ArrowRight, User, Users, GraduationCap, Heart, Camera, Star,
  Briefcase, CheckCircle, BookOpen, Sparkles, Shield, Save, Video, Trash2, AlertTriangle, MapPin, Info, Lock, Mail, Phone, AlertCircle as AlertCircleIcon, UserPlus, Sliders
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { AutocompleteSelect } from '@/components/ui/AutocompleteSelect';
import { CustomSelect } from '@/components/ui/CustomSelect';
import {
  CITIES, HEIGHTS, MARITAL_STATUSES, COMPLEXIONS, FAMILY_TYPES, FAMILY_VALUES, FAMILY_STATUS,
  DIET_TYPES, EDUCATION_LEVELS, INCOME_RANGES, CASTE_MAPPING, WEST_BENGAL_DISTRICTS,
  SMOKING_HABITS, DRINKING_HABITS, MANGLIK_OPTIONS, HOBBIES_LIST, RELIGIONS, BLOOD_GROUPS, NAKSHATRAS, SUBCASTE_MAPPING, RAASIS, RAASI_NAKSHATRAS_MAPPING,
  FIELDS_OF_STUDY, INSTITUTIONS, PROFESSIONS, COMPANIES, WORK_CITIES, GOTRAS, PARENT_OCCUPATIONS, ALL_CASTES, ALL_SUBCASTES, NATIVE_CITIES,
  AGE_RANGES, HEIGHT_RANGES, parseAgeRange, parseHeightRange,
} from '@/lib/constants';
import { saveMyProfile, generateProfileId, getMyProfile, storeMedia, getMedia } from '@/lib/matrimony-service';
import type { MatrimonialProfile } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';

const steps = [
  { label: 'Account', icon: Shield },
  { label: 'Profile For', icon: Users },
  { label: 'Gender', icon: User },
  { label: 'Basics', icon: Heart },
  { label: 'Community', icon: BookOpen },
  { label: 'Location', icon: MapPin },
  { label: 'Career', icon: Briefcase },
  { label: 'Lifestyle', icon: Sparkles },
  { label: 'Media', icon: Camera },
  { label: 'Preferences', icon: Sliders },
];

interface FormData {
  [key: string]: string | number | string[] | undefined;
}

const initialFormData: FormData = {
  profile_for: '',
  full_name: '', email: '', phone: '', social_handle: '',
  date_of_birth: '', gender: '', height: '', weight: '', complexion: '', blood_group: '',
  marital_status: '', mother_tongue: 'Bengali', physical_disability: 'None',
  city: '', native_district: '',
  father_name: '', father_occupation: '', mother_name: '', mother_occupation: '',
  siblings: '', family_type: '', family_values: '', family_status: '',
  education: '', field_of_study: '', institution: '', profession: '', company: '',
  annual_income: '', work_city: '',
  religion: '', caste: '', sub_caste: '', gotra: '', manglik: '',
  diet: '', smoking: '', drinking: '',
  about_me: '', partner_preference: '',
  pref_age_range: '', pref_height_range: '',
  pref_age_min: '', pref_age_max: '', pref_height_min: '', pref_height_max: '',
  pref_education: '', pref_profession: '', pref_city: '', pref_income_min: '',
  pref_diet: '', pref_marital_status: '',
};


interface FormFieldProps {
  label: string;
  field: string;
  required?: boolean;
  formData: any;
  errors: Record<string, string>;
  updateField: (field: string, value: string | number) => void;
}

interface FormSelectProps extends FormFieldProps {
  options: readonly string[] | string[];
}

const FormSelect = ({ label, field, options, required, formData, errors, updateField }: FormSelectProps) => {
  const hasOther = options.includes('Other') || options.includes('Others');
  const selectOptions = hasOther ? options : [...options, 'Other'];
  const otherValue = options.includes('Others') ? 'Others' : 'Other';

  const currentValue = (formData[field] as string) || '';
  const isPresetOption = options.includes(currentValue);

  const [isCustomMode, setIsCustomMode] = useState(() => {
    return currentValue === 'Other' || currentValue === 'Others' || (!isPresetOption && currentValue !== '');
  });

  useEffect(() => {
    if (currentValue === 'Other' || currentValue === 'Others') {
      setIsCustomMode(true);
    } else if (isPresetOption && currentValue !== '') {
      setIsCustomMode(false);
    }
  }, [currentValue, isPresetOption]);

  const selectValue = isCustomMode ? otherValue : currentValue;

  return (
    <div className="space-y-1.5 w-full">
      <CustomSelect
        label={label}
        value={selectValue}
        onChange={(val) => {
          if (val === otherValue) {
            setIsCustomMode(true);
            updateField(field, otherValue);
          } else {
            setIsCustomMode(false);
            updateField(field, val);
          }
        }}
        options={selectOptions}
        placeholder={`Select ${label}`}
        required={required}
        error={errors[field]}
        searchable={false}
      />

      {isCustomMode && (
        <div className="relative animate-fade-in">
          <input
            type="text"
            value={currentValue === otherValue ? '' : currentValue}
            onChange={(e) => {
              const val = e.target.value;
              updateField(field, val === '' ? otherValue : val);
            }}
            placeholder={`Type your ${label.toLowerCase()}...`}
            className={`w-full pl-4 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all mt-1.5 bg-amber-50/40 ${
              errors[field] ? 'border-red-400' : 'border-amber-200'
            }`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-[10px] font-medium text-amber-600/70 bg-amber-100 px-1.5 py-0.5 rounded-md">Custom</span>
        </div>
      )}
    </div>
  );
};

interface FormInputProps extends FormFieldProps {
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

const FormInput = ({ label, field, type = 'text', placeholder, required, formData, errors, updateField, disabled }: FormInputProps) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-text-primary">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      value={(formData[field] as string) || ''}
      onChange={(e) => updateField(field, e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
        errors[field] ? 'border-red-400' : 'border-border'
      } ${disabled ? 'bg-gray-100/80 text-text-muted cursor-not-allowed border-border/80' : ''}`}
    />
    {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
  </div>
);

const DateOfBirthInput = ({ label, field, required, formData, errors, updateField, disabled }: FormFieldProps & { disabled?: boolean }) => {
  const value = (formData[field] as string) || '';
  const parts = value.split('-');
  const year = parts[0] || '';
  const month = parts[1] || '';
  const day = parts[2] || '';

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = [
    { value: '01', label: 'Jan' },
    { value: '02', label: 'Feb' },
    { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' },
    { value: '05', label: 'May' },
    { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' },
    { value: '08', label: 'Aug' },
    { value: '09', label: 'Sep' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => String(currentYear - 18 - i));

  const handleDateChange = (d: string, m: string, y: string) => {
    updateField(field, `${y}-${m}-${d}`);
  };

  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-sm font-medium text-text-primary">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="grid grid-cols-3 gap-2">
        <CustomSelect
          value={day || ''}
          onChange={(val) => handleDateChange(val, month || '', year || '')}
          disabled={disabled}
          options={days}
          placeholder="Day"
          searchable={false}
          position="bottom"
          error={errors[field] ? ' ' : undefined}
        />
        <CustomSelect
          value={month || ''}
          onChange={(val) => handleDateChange(day || '', val, year || '')}
          disabled={disabled}
          options={months}
          placeholder="Month"
          searchable={false}
          position="bottom"
          error={errors[field] ? ' ' : undefined}
        />
        <CustomSelect
          value={year || ''}
          onChange={(val) => handleDateChange(day || '', month || '', val)}
          disabled={disabled}
          options={years}
          placeholder="Year"
          searchable={true}
          position="bottom"
          error={errors[field] ? ' ' : undefined}
        />
      </div>
      {errors[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
    </div>
  );
};
export default function MatrimonialRegisterPage() {
  const router = useRouter();
  const { firebaseUser, profile: userProfile, loading: authLoading } = useAuth();
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

  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        email: userProfile.email || prev.email || '',
        phone: userProfile.phone || prev.phone || '',
        full_name: prev.profile_for === 'Myself' ? (prev.full_name || userProfile.full_name || '') : (prev.full_name || ''),
      }));
    }
  }, [userProfile]);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profileId, setProfileId] = useState('');
  
  // Matrimonial ID generated at mount for media key stability
  const [realId] = useState(() => {
    if (typeof window !== 'undefined') {
      const draft = localStorage.getItem('pb_matrimony_draft');
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed.photos && Array.isArray(parsed.photos)) {
            const firstPhoto = parsed.photos.find((p: string) => p && p.startsWith('profile_'));
            if (firstPhoto) {
              const match = firstPhoto.match(/^profile_(user-\d+)_photo_\d+$/);
              if (match) return match[1];
            }
          }
          if (parsed.video && typeof parsed.video === 'string' && parsed.video.startsWith('profile_')) {
            const match = parsed.video.match(/^profile_(user-\d+)_video$/);
            if (match) return match[1];
          }
        } catch { /* ignore */ }
      }
    }
    return `user-${Date.now()}`;
  });
  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([null, null, null, null, null]);
  const [profilePictureIndex, setProfilePictureIndex] = useState<number>(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');

  // Load media from IndexedDB if we have a draft with photos/videos
  useEffect(() => {
    const loadMediaFromDraft = async () => {
      if (formData.photos && Array.isArray(formData.photos)) {
        const previews = [null, null, null, null, null] as (string | null)[];
        let updated = false;
        for (let i = 0; i < 5; i++) {
          const key = formData.photos[i];
          if (key) {
            const url = await getMedia(key);
            if (url) {
              previews[i] = url;
              updated = true;
            }
          }
        }
        if (updated) {
          setPhotoPreviews(previews);
        }
      }
      if (formData.video && typeof formData.video === 'string') {
        const url = await getMedia(formData.video);
        if (url) {
          setVideoPreview(url);
        }
      }
    };
    loadMediaFromDraft();
  }, [formData.photos, formData.video]);

  const updateField = useCallback((field: string, value: string | number) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'religion') {
        next.caste = '';
        next.sub_caste = '';
        next.gotra = '';
        next.raasi = '';
        next.star = '';
      } else if (field === 'caste') {
        next.sub_caste = '';
      } else if (field === 'raasi') {
        next.star = '';
      }
      return next;
    });
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      if (field === 'religion') {
        delete next.caste;
        delete next.sub_caste;
        delete next.gotra;
        delete next.raasi;
        delete next.star;
      } else if (field === 'caste') {
        delete next.sub_caste;
      } else if (field === 'raasi') {
        delete next.star;
      }
      return next;
    });
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

  const handlePhotoChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Photo size must be less than 5MB.');
      return;
    }
    
    try {
      const url = await storeMedia(`profile_${realId}_photo_${index}`, file);
      if (!url) {
        setUploadError('Failed to process photo file.');
        return;
      }
      
      setPhotoPreviews(prev => {
        const next = [...prev];
        next[index] = url;
        if (prev.every(p => p === null)) {
          setProfilePictureIndex(index);
        }
        return next;
      });
      
      setFormData(prev => {
        const nextPhotos = [...((prev.photos as string[]) || [])];
        nextPhotos[index] = url;
        return { ...prev, photos: nextPhotos };
      });
      
      setUploadError('');
    } catch (err) {
      console.error(err);
      setUploadError('Failed to upload photo.');
    }
  };

  const handlePhotoRemove = (index: number) => {
    setPhotoPreviews(prev => {
      const next = [...prev];
      next[index] = null;
      if (profilePictureIndex === index) {
        const nextIdx = next.findIndex(p => p !== null);
        setProfilePictureIndex(nextIdx !== -1 ? nextIdx : 0);
      }
      return next;
    });
    
    setFormData(prev => {
      const nextPhotos = [...((prev.photos as string[]) || [])];
      nextPhotos[index] = '';
      return { ...prev, photos: nextPhotos };
    });
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setUploadError('Only video files are allowed.');
      return;
    }
    
    const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB optimized limit
    if (file.size > MAX_VIDEO_SIZE) {
      setUploadError(`Video size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 10MB limit. Please compress your video or upload a smaller one.`);
      return;
    }
    
    try {
      setUploadError('');
      // Check video duration client-side
      const duration = await new Promise<number>((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };
        video.onerror = () => {
          resolve(0); // fallback
        };
        video.src = URL.createObjectURL(file);
      });

      if (duration > 30) {
        setUploadError(`Video is too long (${Math.round(duration)} seconds). Please upload a video under 30 seconds for faster loading.`);
        return;
      }

      const url = await storeMedia(`profile_${realId}_video`, file);
      setVideoPreview(url);
      setFormData(prev => ({ ...prev, video: url }));
      setUploadError('');
    } catch (err) {
      console.error(err);
      setUploadError('Failed to process video file.');
    }
  };

  const handleVideoRemove = () => {
    setVideoPreview(null);
    setFormData(prev => ({ ...prev, video: '' }));
  };

  const validateStep = useCallback((stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email as string)) newErrors.email = 'Invalid email address';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    }
    if (stepIndex === 1) {
      if (!formData.profile_for) newErrors.profile_for = 'Please select profile relation';
    }
    if (stepIndex === 2) {
      if (!formData.gender) newErrors.gender = 'Gender is required';
    }
    if (stepIndex === 3) {
      if (!formData.full_name) newErrors.full_name = 'Full name is required';
      
      const dobStr = formData.date_of_birth as string;
      const dobParts = dobStr ? dobStr.split('-') : [];
      const isDobComplete = dobParts.length === 3 && dobParts.every(p => p !== '');
      
      if (!dobStr || !isDobComplete) {
        newErrors.date_of_birth = 'Please select a complete Day, Month, and Year';
      } else {
        const dob = new Date(dobStr);
        const age = Math.floor((Date.now() - dob.getTime()) / 31557600000);
        if (isNaN(age) || age < 18) newErrors.date_of_birth = 'Must be at least 18 years old';
        if (age > 60) newErrors.date_of_birth = 'Age must be between 18-60';
      }
    }
    if (stepIndex === 4) {
      if (!formData.religion) newErrors.religion = 'Religion is required';
      if (!formData.caste) newErrors.caste = 'Caste is required';
      if (!formData.sub_caste) newErrors.sub_caste = 'Sub-caste is required';
    }
    if (stepIndex === 5) {
      if (!formData.city) newErrors.city = 'Current city is required';
      if (!formData.native_district) newErrors.native_district = 'Native district is required';
    }
    if (stepIndex === 6) {
      if (!formData.education) newErrors.education = 'Education is required';
      if (!formData.profession) newErrors.profession = 'Profession is required';
    }
    if (stepIndex === 7) {
      if (!formData.marital_status) newErrors.marital_status = 'Marital status is required';
      if (!formData.height) newErrors.height = 'Height is required';
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

  const handleSubmit = useCallback(async () => {
    const dob = new Date(formData.date_of_birth as string);
    const age = Math.floor((Date.now() - dob.getTime()) / 31557600000);
    const id = await generateProfileId();
    const now = new Date().toISOString();

    const parsedAge = parseAgeRange(formData.pref_age_range as string);
    const parsedHeight = parseHeightRange(formData.pref_height_range as string);

    const profile: MatrimonialProfile = {
      id: realId,
      user_id: firebaseUser ? firebaseUser.uid : `local-${Date.now()}`,
      profile_id: id,
      profile_for: formData.profile_for as string,
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
      gotra: (formData.religion === 'Hindu' ? formData.gotra : '') as string,
      raasi: (formData.religion === 'Hindu' ? formData.raasi : '') as string,
      star: (formData.religion === 'Hindu' ? formData.star : '') as string,
      manglik: formData.manglik as string,
      diet: formData.diet as string,
      smoking: formData.smoking as string,
      drinking: formData.drinking as string,
      hobbies: selectedHobbies,
      about_me: formData.about_me as string,
      partner_preference: (formData.partner_preference as string) || '',
      pref_age_range: (formData.pref_age_range as string) || '',
      pref_height_range: (formData.pref_height_range as string) || '',
      pref_age_min: parsedAge.min || (formData.pref_age_min ? Number(formData.pref_age_min) : undefined),
      pref_age_max: parsedAge.max || (formData.pref_age_max ? Number(formData.pref_age_max) : undefined),
      pref_height_min: parsedHeight.min || (formData.pref_height_min as string) || undefined,
      pref_height_max: parsedHeight.max || (formData.pref_height_max as string) || undefined,
      pref_education: formData.pref_education as string,
      pref_profession: formData.pref_profession as string,
      pref_city: formData.pref_city as string,
      pref_income_min: formData.pref_income_min as string,
      pref_diet: formData.pref_diet as string,
      pref_marital_status: formData.pref_marital_status as string,
      phone: formData.phone as string,
      email: formData.email as string,
      whatsapp: '',
      social_handle: formData.social_handle as string,
      profile_picture_index: profilePictureIndex,
      profile_photo: ((formData.photos as string[]) || [])[profilePictureIndex] || ((formData.photos as string[]) || []).find(p => p && p !== '') || '',
      photos: (formData.photos as string[]) || [],
      video: (formData.video as string) || '',
      verified: false,
      published: false,
      status: 'pending',
      contact_visible_after_login: true,
      created_at: now,
      updated_at: now,
    };

    try {
      await saveMyProfile(profile);
      localStorage.removeItem('pb_matrimony_draft');
      setProfileId(id);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('permission-denied')) {
        setUploadError("Permission denied: You must be logged in and verified to submit a profile. Please login first.");
      } else {
        setUploadError("Failed to save profile. Please check your network connection and try again.");
      }
    }
  }, [formData, selectedHobbies, realId, firebaseUser]);

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-surface bg-alpana flex items-center justify-center px-4">
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="min-h-screen bg-surface bg-alpana flex items-center justify-center px-4">
        <div className="max-w-md w-full animate-fade-in">
          <Card className="border border-primary/20 shadow-xl bg-white/95 backdrop-blur-md p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center mx-auto mb-6 shadow-md">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-3">Sign Up Required</h1>
            <p className="text-text-muted mb-6 text-sm">
              You must create an account and verify your email and phone number before registering a matrimonial profile.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/auth/register">
                <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" /> Sign Up Now
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="w-full">
                  Login to Account
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!userProfile?.email_verified || !userProfile?.phone_verified) {
    return (
      <div className="min-h-screen bg-surface bg-alpana flex items-center justify-center px-4">
        <div className="max-w-md w-full animate-fade-in">
          <Card className="border border-amber-200 shadow-xl bg-white/95 backdrop-blur-md p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-6 shadow-md animate-pulse">
              <AlertCircleIcon className="w-7 h-7 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-3">Verification Required</h1>
            <p className="text-text-muted mb-6 text-sm">
              Both your Email ID and Phone Number must be verified before you can register a matrimonial profile.
            </p>
            <div className="flex flex-col gap-3 text-left mb-6">
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${userProfile?.email_verified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <span className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </span>
                <span>{userProfile?.email_verified ? 'Verified' : 'Pending'}</span>
              </div>
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${userProfile?.phone_verified ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <span className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </span>
                <span>{userProfile?.phone_verified ? 'Verified' : 'Pending'}</span>
              </div>
            </div>
            <Link href="/profile">
              <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" /> Go to Profile to Verify
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface bg-alpana">
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
        <div className="relative">
          {/* Back Button */}
          {step > 0 && (
            <button
              onClick={goBack}
              className="absolute left-4 top-4 w-9 h-9 rounded-full bg-surface border border-border/80 flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border transition-all cursor-pointer z-10"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <Card padding="lg" hover={false} className="relative pt-8 md:pt-10 overflow-visible">
            {/* Header Avatar Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner">
                {step === 0 ? <Shield className="w-7 h-7" /> :
                 step === 1 ? <Users className="w-7 h-7" /> :
                 step === 2 ? <User className="w-7 h-7" /> :
                 step === 3 ? <Heart className="w-7 h-7" /> :
                 step === 4 ? <BookOpen className="w-7 h-7" /> :
                 step === 5 ? <MapPin className="w-7 h-7" /> :
                 step === 6 ? <Briefcase className="w-7 h-7" /> :
                 step === 7 ? <Sparkles className="w-7 h-7" /> :
                 <Camera className="w-7 h-7" />}
              </div>
            </div>

            {/* Step 0: Account Setup */}
            {step === 0 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center max-w-md mx-auto mb-2">
                  <h2 className="text-2xl font-bold font-display text-text-primary">Account Setup</h2>
                  <p className="text-xs text-text-muted mt-1">Enter your basic contact details to get started</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput formData={formData} errors={errors} updateField={updateField} label="Email Address" field="email" type="email" placeholder="your@email.com" required disabled />
                  <FormInput formData={formData} errors={errors} updateField={updateField} label="Phone Number" field="phone" type="tel" placeholder="+91 9876543210" required disabled />
                </div>
              </div>
            )}

            {/* Step 1: Profile For */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center max-w-md mx-auto">
                  <h2 className="text-2xl font-bold font-display text-text-primary">This Profile is for</h2>
                  <p className="text-xs text-text-muted mt-1">Select who you are creating this match profile for</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto py-2">
                  {['Myself', 'My Son', 'My Daughter', 'My Brother', 'My Sister', 'My Friend', 'My Relative'].map((option) => {
                    const isSelected = formData.profile_for === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          updateField('profile_for', option);
                          // Auto pre-select gender
                          if (option === 'My Son' || option === 'My Brother') {
                            updateField('gender', 'male');
                          } else if (option === 'My Daughter' || option === 'My Sister') {
                            updateField('gender', 'female');
                          }
                          
                          // Handle name auto-fill/clear based on relation
                          if (option === 'Myself') {
                            if (!formData.full_name) {
                              updateField('full_name', userProfile?.full_name || '');
                            }
                          } else if (formData.full_name === userProfile?.full_name) {
                            updateField('full_name', '');
                          }

                          // Smooth auto-advance
                          setTimeout(() => {
                            setStep(2);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }, 250);
                        }}
                        className={cn(
                          "py-3 px-4 rounded-xl text-sm font-semibold border text-center transition-all duration-200 cursor-pointer flex items-center justify-center gap-2",
                          isSelected
                            ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]"
                            : "bg-white text-text-primary border-border hover:border-primary hover:bg-primary-light/10"
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {errors.profile_for && (
                  <p className="text-center text-xs text-red-500">{errors.profile_for}</p>
                )}

                {/* Banner notice box */}
                <div className="max-w-lg mx-auto bg-orange-50/50 border border-orange-200 text-orange-800 text-xs p-4 rounded-xl flex items-start gap-2.5 mt-4">
                  <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-left">
                    ProbasiBangali Matrimonial is built for genuine match-seekers from the Bengali community in Tamil Nadu. Any falsification, commercial use, or marriage bureaus is strictly prohibited.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Gender */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center max-w-md mx-auto">
                  <h2 className="text-2xl font-bold font-display text-text-primary">Select Gender</h2>
                  <p className="text-xs text-text-muted mt-1">Gender of the profile owner</p>
                </div>

                <div className="flex gap-4 max-w-sm mx-auto py-2">
                  {['male', 'female'].map((g) => {
                    const isSelected = formData.gender === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          updateField('gender', g);
                          setTimeout(() => {
                            setStep(3);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }, 250);
                        }}
                        className={cn(
                          "flex-1 py-4 px-6 rounded-xl text-sm font-semibold border text-center transition-all duration-200 cursor-pointer capitalize",
                          isSelected
                            ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]"
                            : "bg-white text-text-primary border-border hover:border-primary hover:bg-primary-light/10"
                        )}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>

                {errors.gender && (
                  <p className="text-center text-xs text-red-500">{errors.gender}</p>
                )}
              </div>
            )}

            {/* Step 3: Basics */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center max-w-md mx-auto mb-2">
                  <h2 className="text-2xl font-bold font-display text-text-primary">Basic Details</h2>
                  <p className="text-xs text-text-muted mt-1">Tell us about their basic identity</p>
                </div>
                <FormInput formData={formData} errors={errors} updateField={updateField} label="Full Name" field="full_name" placeholder="Enter full name of profile owner" required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DateOfBirthInput formData={formData} errors={errors} updateField={updateField} label="Date of Birth" field="date_of_birth" required />
                  <FormInput formData={formData} errors={errors} updateField={updateField} label="Mother Tongue" field="mother_tongue" placeholder="Bengali" />
                </div>
              </div>
            )}

            {/* Step 4: Community Details */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center max-w-md mx-auto mb-2">
                  <h2 className="text-2xl font-bold font-display text-text-primary">Religion & Community</h2>
                  <p className="text-xs text-text-muted mt-1">Bengali cultural background details</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Religion" field="religion" options={RELIGIONS} required />
                  <FormSelect 
                    formData={formData} 
                    errors={errors} 
                    updateField={updateField} 
                    label="Caste" 
                    field="caste" 
                    options={formData.religion && CASTE_MAPPING[formData.religion as string] ? CASTE_MAPPING[formData.religion as string] : ALL_CASTES} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect 
                    formData={formData} 
                    errors={errors} 
                    updateField={updateField} 
                    label="Sub-Caste" 
                    field="sub_caste" 
                    options={formData.caste && SUBCASTE_MAPPING[formData.caste as string] ? SUBCASTE_MAPPING[formData.caste as string] : ALL_SUBCASTES} 
                    required 
                  />
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Manglik status" field="manglik" options={MANGLIK_OPTIONS} />
                </div>
                {formData.religion === 'Hindu' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-orange-50/30 border border-orange-100/50 animate-fade-in">
                    <FormSelect formData={formData} errors={errors} updateField={updateField} label="Gotra" field="gotra" options={GOTRAS} />
                    <FormSelect formData={formData} errors={errors} updateField={updateField} label="Raasi (Zodiac Sign)" field="raasi" options={RAASIS} />
                    {formData.raasi && (
                      <FormSelect 
                        formData={formData} 
                        errors={errors} 
                        updateField={updateField} 
                        label="Star (Nakshatra)" 
                        field="star" 
                        options={RAASI_NAKSHATRAS_MAPPING[formData.raasi as string] || []} 
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Location & Family */}
            {step === 5 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center max-w-md mx-auto mb-2">
                  <h2 className="text-2xl font-bold font-display text-text-primary">Location & Family</h2>
                  <p className="text-xs text-text-muted mt-1">Where you live and family background</p>
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> Location
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormSelect formData={formData} errors={errors} updateField={updateField} label="Current City (Tamil Nadu)" field="city" options={CITIES} required />
                    <FormSelect formData={formData} errors={errors} updateField={updateField} label="Native City" field="native_district" options={NATIVE_CITIES} required />
                  </div>
                </div>

                {/* Family */}
                <div className="space-y-3 pt-2 border-t border-border/40">
                  <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-primary" /> Family Background
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput formData={formData} errors={errors} updateField={updateField} label="Father's Name" field="father_name" placeholder="Enter father's name" />
                    <FormSelect formData={formData} errors={errors} updateField={updateField} label="Father's Occupation" field="father_occupation" options={PARENT_OCCUPATIONS} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput formData={formData} errors={errors} updateField={updateField} label="Mother's Name" field="mother_name" placeholder="Enter mother's name" />
                    <FormSelect formData={formData} errors={errors} updateField={updateField} label="Mother's Occupation" field="mother_occupation" options={PARENT_OCCUPATIONS} />
                  </div>
                  <FormInput formData={formData} errors={errors} updateField={updateField} label="Siblings" field="siblings" placeholder="e.g. 1 Elder Brother (Married), 1 Younger Sister" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormSelect formData={formData} errors={errors} updateField={updateField} label="Family Type" field="family_type" options={FAMILY_TYPES} />
                    <FormSelect formData={formData} errors={errors} updateField={updateField} label="Family Values" field="family_values" options={FAMILY_VALUES} />
                    <FormSelect formData={formData} errors={errors} updateField={updateField} label="Family Status" field="family_status" options={FAMILY_STATUS} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Career & Education */}
            {step === 6 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center max-w-md mx-auto mb-2">
                  <h2 className="text-2xl font-bold font-display text-text-primary">Education & Career</h2>
                  <p className="text-xs text-text-muted mt-1">Academic degree and current job situation</p>
                </div>
                <FormSelect formData={formData} errors={errors} updateField={updateField} label="Highest Education" field="education" options={EDUCATION_LEVELS} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Field of Study" field="field_of_study" options={FIELDS_OF_STUDY} />
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Institution" field="institution" options={INSTITUTIONS} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Profession" field="profession" options={PROFESSIONS} required />
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Company / Employer" field="company" options={COMPANIES} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Annual Income" field="annual_income" options={INCOME_RANGES} />
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Work City" field="work_city" options={WORK_CITIES} />
                </div>
              </div>
            )}

            {/* Step 7: Physical Stats & Lifestyle */}
            {step === 7 && (
              <div className="space-y-5 animate-fade-in">
                <div className="text-center max-w-md mx-auto mb-2">
                  <h2 className="text-2xl font-bold font-display text-text-primary">Lifestyle & Stats</h2>
                  <p className="text-xs text-text-muted mt-1">Physical details and habit preferences</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Height" field="height" options={HEIGHTS} required />
                  <FormInput formData={formData} errors={errors} updateField={updateField} label="Weight (kg)" field="weight" placeholder="e.g. 70" />
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Complexion" field="complexion" options={COMPLEXIONS} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Marital Status" field="marital_status" options={MARITAL_STATUSES} required />
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Blood Group" field="blood_group" options={BLOOD_GROUPS} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Diet" field="diet" options={DIET_TYPES} />
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Smoking" field="smoking" options={SMOKING_HABITS} />
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Drinking" field="drinking" options={DRINKING_HABITS} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Physical Disability" field="physical_disability" options={['None', 'Physical Challenge']} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Hobbies & Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {HOBBIES_LIST.map(hobby => (
                      <button
                        key={hobby}
                        type="button"
                        onClick={() => toggleHobby(hobby)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer",
                          selectedHobbies.includes(hobby)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-text-muted border-border hover:border-primary/50'
                        )}
                      >
                        {hobby}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Photos & Video */}
            {step === 8 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center max-w-md mx-auto mb-2">
                  <h2 className="text-2xl font-bold font-display text-text-primary">Photo & Video Intro</h2>
                  <p className="text-xs text-text-muted mt-1">Upload files and write a short description</p>
                </div>

                {/* Upload Section */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1">Upload Photos (Up to 5)</h3>
                    <p className="text-xs text-text-muted mb-3 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      Select your preferred photo as the main <strong>Profile Picture</strong> for this profile.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const preview = photoPreviews[i];
                        const isMain = profilePictureIndex === i && preview !== null;
                        return (
                          <div
                            key={i}
                            className={`aspect-square bg-surface border rounded-xl flex flex-col items-center justify-center relative overflow-hidden group transition-all ${
                              isMain ? 'ring-2 ring-amber-500 border-amber-400 shadow-md' : 'border-border'
                            }`}
                          >
                            {preview ? (
                              <>
                                <img src={preview} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />

                                {isMain ? (
                                  <div className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                                    <Star className="w-2.5 h-2.5 fill-white" /> Main Pic
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setProfilePictureIndex(i)}
                                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-black/75 hover:bg-amber-500 text-white text-[9px] font-medium px-2 py-0.5 rounded-full transition-all flex items-center gap-1 shadow-sm whitespace-nowrap opacity-90 hover:opacity-100 cursor-pointer"
                                  >
                                    <Star className="w-2.5 h-2.5" /> Make Main
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handlePhotoRemove(i)}
                                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <label htmlFor={`photo-upload-${i}`} className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-primary-light/10 transition-colors">
                                <Camera className="w-6 h-6 text-text-muted mb-1 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-semibold text-text-muted">Slot {i + 1}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handlePhotoChange(i, e)}
                                  id={`photo-upload-${i}`}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-2">Intro Video (Optional)</h3>
                    {videoPreview ? (
                      <div className="p-3 border border-border rounded-xl bg-surface flex flex-col items-center gap-3 max-w-sm">
                        <video src={videoPreview} controls className="w-full rounded-lg max-h-40 bg-black" />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleVideoRemove}
                          className="text-red-500 hover:text-red-600 border-red-200 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove Video
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="video-upload" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl bg-surface cursor-pointer hover:bg-primary-light/10 transition-all max-w-sm">
                        <Video className="w-8 h-8 text-text-muted mb-2" />
                        <span className="text-xs font-bold text-text-primary">Choose Intro Video</span>
                        <span className="text-[10px] text-text-muted mt-1">MP4 or WebM, max 10MB, under 30s</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          id="video-upload"
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {uploadError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> {uploadError}
                    </div>
                  )}
                </div>

                {/* Social Media Handle */}
                <FormInput formData={formData} errors={errors} updateField={updateField} label="Social Media Handle (Instagram / Facebook / LinkedIn)" field="social_handle" placeholder="e.g., @username" />

                {/* About Me Textarea */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary">About Me / Description</label>
                  <textarea
                    value={(formData.about_me as string) || ''}
                    onChange={(e) => updateField('about_me', e.target.value.slice(0, 500))}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    placeholder="Share about your personality, interests, values, family life, what makes you unique..."
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-text-muted">A good description helps get more matches</p>
                    <p className={`text-[10px] font-medium ${((formData.about_me as string) || '').length > 450 ? 'text-amber-500' : 'text-text-muted'}`}>
                      {((formData.about_me as string) || '').length}/500
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Step 9: Expectations & Preferences */}
            {step === 9 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center max-w-md mx-auto mb-2">
                  <h2 className="text-2xl font-bold font-display text-text-primary">Expectations & Preferences</h2>
                  <p className="text-xs text-text-muted mt-1">Specify your preference for an expecting match</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Partner Expected Age Range" field="pref_age_range" options={AGE_RANGES} />
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Partner Expected Height Range" field="pref_height_range" options={HEIGHT_RANGES} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Partner Marital Status" field="pref_marital_status" options={MARITAL_STATUSES} />
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Partner Diet Preference" field="pref_diet" options={DIET_TYPES} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Partner Highest Education" field="pref_education" options={EDUCATION_LEVELS} />
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Partner Expected Profession" field="pref_profession" options={PROFESSIONS} />
                  <FormSelect formData={formData} errors={errors} updateField={updateField} label="Partner Preferred Work City" field="pref_city" options={WORK_CITIES} />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-primary">Expectations Description <span className="text-text-muted font-normal">(optional)</span></label>
                  <textarea
                    value={(formData.partner_preference as string) || ''}
                    onChange={(e) => updateField('partner_preference', e.target.value.slice(0, 500))}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    placeholder="Describe the kind of partner you envision — personality, values, lifestyle..."
                  />
                  <p className={`text-[10px] font-medium text-right ${((formData.partner_preference as string) || '').length > 450 ? 'text-amber-500' : 'text-text-muted'}`}>
                    {((formData.partner_preference as string) || '').length}/500
                  </p>
                </div>

                {/* Profile Review Summary */}
                <div className="bg-surface rounded-xl p-5 space-y-4 border border-border">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-primary border-b border-border pb-2">
                    <CheckCircle className="w-5 h-5 text-accent" /> Profile Review
                  </h3>
                  
                  {[
                    { title: 'Personal info', items: [
                      ['Name', formData.full_name], ['Created for', formData.profile_for], ['Gender', formData.gender], ['DOB', formData.date_of_birth],
                      ['Height', formData.height], ['Weight', formData.weight ? `${formData.weight} kg` : null], ['Complexion', formData.complexion], ['Blood Group', formData.blood_group],
                      ['Current City', formData.city], ['Native district', formData.native_district],
                      ['Marital status', formData.marital_status], ['Physical Disability', formData.physical_disability]
                    ]},
                    { title: 'Contact & Family', items: [
                      ['Email', formData.email], ['Phone', formData.phone], ['WhatsApp', formData.whatsapp],
                      ['Father', formData.father_name], ['Mother', formData.mother_name], ['Siblings', formData.siblings]
                    ]},
                    { title: 'Community info', items: [
                      ['Religion', formData.religion], ['Caste', formData.caste], ['Sub-Caste', formData.sub_caste], ['Gotra', formData.gotra],
                      ['Raasi', formData.raasi], ['Star (Nakshatra)', formData.star], ['Manglik', formData.manglik]
                    ]},
                    { title: 'Education & Career', items: [
                      ['Education', formData.education], ['Profession', formData.profession], ['Income', formData.annual_income]
                    ]},
                    { title: 'Expected Match Preferences', items: [
                      ['Age range', `${formData.pref_age_min || 'Any'} - ${formData.pref_age_max || 'Any'} yrs`],
                      ['Height range', `${formData.pref_height_min || 'Any'} - ${formData.pref_height_max || 'Any'}`],
                      ['Marital status', formData.pref_marital_status || 'Any'],
                      ['Education', formData.pref_education || 'Any'],
                      ['Profession', formData.pref_profession || 'Any'],
                      ['Preferred City', formData.pref_city || 'Any']
                    ]}
                  ].map(sec => (
                    <div key={sec.title} className="space-y-1.5">
                      <h4 className="text-xs font-bold text-accent uppercase tracking-wider">{sec.title}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs">
                        {sec.items.map(([lbl, val]) => (
                          <p key={lbl as string}><span className="text-text-muted">{lbl as string}:</span> <span className="font-semibold text-text-primary">{(val as string) || '—'}</span></p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
                  ⚠️ Your profile details will be verified by our administrative team. Once approved, it will be published and visible to other verified match seekers in the community.
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <div className="flex gap-2">
                <Button variant="ghost" onClick={goBack} disabled={step === 0} className="cursor-pointer">
                  <ArrowLeft className="w-4 h-4" /> Previous
                </Button>
                <Button variant="ghost" onClick={saveDraft} className="text-text-muted cursor-pointer">
                  <Save className="w-4 h-4" /> Save Draft
                </Button>
              </div>
              {step < steps.length - 1 ? (
                <Button variant="primary" onClick={goNext} className="cursor-pointer">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSubmit} className="cursor-pointer">
                  <CheckCircle className="w-4 h-4" /> Submit for Review
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
