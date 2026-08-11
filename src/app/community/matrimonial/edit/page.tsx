'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Save, User, Users, GraduationCap, Heart, BookOpen, Sparkles, Utensils, CheckCircle,
  Camera, Video, Trash2, AlertTriangle, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AutocompleteSelect } from '@/components/ui/AutocompleteSelect';
import { CustomSelect } from '@/components/ui/CustomSelect';
import {
  CITIES, HEIGHTS, MARITAL_STATUSES, COMPLEXIONS, FAMILY_TYPES, FAMILY_VALUES, FAMILY_STATUS,
  DIET_TYPES, EDUCATION_LEVELS, INCOME_RANGES, CASTE_MAPPING, WEST_BENGAL_DISTRICTS,
  SMOKING_HABITS, DRINKING_HABITS, MANGLIK_OPTIONS, HOBBIES_LIST, RELIGIONS, BLOOD_GROUPS, NAKSHATRAS, SUBCASTE_MAPPING, RAASIS, RAASI_NAKSHATRAS_MAPPING,
  FIELDS_OF_STUDY, INSTITUTIONS, PROFESSIONS, COMPANIES, WORK_CITIES, GOTRAS, PARENT_OCCUPATIONS, ALL_CASTES, ALL_SUBCASTES, NATIVE_CITIES,
  AGE_RANGES, HEIGHT_RANGES, parseAgeRange, parseHeightRange,
} from '@/lib/constants';
import { getMyProfile, saveMyProfile, storeMedia, getMedia } from '@/lib/matrimony-service';
import type { MatrimonialProfile } from '@/types';

import { useAuth } from '@/lib/auth/AuthContext';

interface FormData {
  [key: string]: string | number | string[] | undefined;
}

export default function EditMatrimonialProfile() {
  const router = useRouter();
  const { firebaseUser, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>({});
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState('personal');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MatrimonialProfile | null>(null);

  // Media states
  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([null, null, null, null, null]);
  const [profilePictureIndex, setProfilePictureIndex] = useState<number>(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) {
      router.push('/auth/login?redirect=/community/matrimonial/edit');
      return;
    }

    let mounted = true;
    const loadProfile = async () => {
      try {
        const myProfile = await getMyProfile(firebaseUser.uid);
        if (!mounted) return;
        
        if (!myProfile) {
          router.push('/community/matrimonial/register');
          return;
        }
        
        setProfile(myProfile);
        setSelectedHobbies(myProfile.hobbies || []);
        if (myProfile.profile_picture_index !== undefined) {
          setProfilePictureIndex(myProfile.profile_picture_index);
        } else if (myProfile.profile_photo && myProfile.photos) {
          const idx = myProfile.photos.findIndex(p => p === myProfile.profile_photo);
          if (idx !== -1) setProfilePictureIndex(idx);
        }
        const data: FormData = {};
        Object.entries(myProfile).forEach(([key, value]) => {
          if (typeof value === 'string' || typeof value === 'number' || Array.isArray(value)) data[key] = value;
        });
        if (!data.pref_age_range && (myProfile.pref_age_min || myProfile.pref_age_max)) {
          data.pref_age_range = `${myProfile.pref_age_min || 18} - ${myProfile.pref_age_max || 50} yrs`;
        }
        if (!data.pref_height_range && (myProfile.pref_height_min || myProfile.pref_height_max)) {
          data.pref_height_range = `${myProfile.pref_height_min || "5'0\""} - ${myProfile.pref_height_max || "6'0\""}`;
        }
        setFormData(data);

        // Load media from Firestore / Storage URLs
        const previews: (string | null)[] = [null, null, null, null, null];
        for (let i = 0; i < 5; i++) {
          if (myProfile.photos?.[i]) {
            const url = await getMedia(myProfile.photos[i]);
            if (url) previews[i] = url;
          }
        }
        setPhotoPreviews(previews);

        if (myProfile.video) {
          const vUrl = await getMedia(myProfile.video);
          if (vUrl) setVideoPreview(vUrl);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => { mounted = false; };
  }, [router, firebaseUser, authLoading]);

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
    setSaved(false);
  }, []);

  const toggleHobby = useCallback((hobby: string) => {
    setSelectedHobbies(prev =>
      prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]
    );
    setSaved(false);
  }, []);

  const handlePhotoChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
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
      const url = await storeMedia(`profile_${profile.id}_photo_${index}`, file);
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
      setSaved(false);
    } catch (err) {
      console.error(err);
      setUploadError('Failed to upload photo.');
    }
  };

  const handlePhotoRemove = (index: number) => {
    if (!profile) return;
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
    setSaved(false);
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setUploadError('Only video files are allowed.');
      return;
    }
    
    const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB limit
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

      const url = await storeMedia(`profile_${profile.id}_video`, file);
      setVideoPreview(url);
      setFormData(prev => ({ ...prev, video: url }));
      setUploadError('');
      setSaved(false);
    } catch (err) {
      console.error(err);
      setUploadError('Failed to process video file.');
    }
  };

  const handleVideoRemove = () => {
    setVideoPreview(null);
    setFormData(prev => ({ ...prev, video: '' }));
    setSaved(false);
  };

  const handleSave = useCallback(async () => {
    if (!profile) return;
    const dobStr = formData.date_of_birth as string;
    const dobParts = dobStr ? dobStr.split('-') : [];
    const isDobComplete = dobParts.length === 3 && dobParts.every(p => p !== '');
    const dob = isDobComplete ? new Date(dobStr) : null;
    const age = dob && !isNaN(dob.getTime()) ? Math.floor((Date.now() - dob.getTime()) / 31557600000) : profile.age;

    const parsedAge = parseAgeRange(formData.pref_age_range as string);
    const parsedHeight = parseHeightRange(formData.pref_height_range as string);

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
      about_me: (formData.about_me as string) || '',
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
      pref_diet: formData.pref_diet as string,
      pref_marital_status: formData.pref_marital_status as string,
      phone: formData.phone as string,
      email: formData.email as string,
      whatsapp: formData.whatsapp as string,
      social_handle: formData.social_handle as string,
      profile_picture_index: profilePictureIndex,
      profile_photo: ((formData.photos as string[]) || [])[profilePictureIndex] || ((formData.photos as string[]) || []).find(p => p && p !== '') || profile.profile_photo || '',
      photos: (formData.photos as string[]) || profile.photos || [],
      video: (formData.video as string) || profile.video || '',
      updated_at: new Date().toISOString(),
    };

    await saveMyProfile(updatedProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [profile, formData, selectedHobbies]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  const FormSelect = ({ label, field, options }: { label: string; field: string; options: readonly string[] }) => {
    const hasOther = options.includes('Other') || options.includes('Others');
    const selectOptions = hasOther ? options : [...options, 'Other'];
    const otherValue = options.includes('Others') ? 'Others' : 'Other';

    const currentValue = (formData[field] as string) || '';
    const isPresetOption = options.includes(currentValue);

    const isCustom = !!(
      currentValue === 'Other' ||
      currentValue === 'Others' ||
      (!isPresetOption && currentValue !== '')
    );
    const selectValue = isCustom ? otherValue : currentValue;

    return (
      <div className="space-y-1.5 w-full">
        <CustomSelect
          label={label}
          value={selectValue}
          onChange={(val) => {
            if (val === otherValue) {
              updateField(field, otherValue);
            } else {
              updateField(field, val);
            }
          }}
          options={selectOptions}
          placeholder={`Select ${label}`}
          searchable={false}
        />

        {isCustom && (
          <div className="relative animate-fade-in">
            <input
              type="text"
              autoFocus
              value={formData[field] === otherValue ? '' : (formData[field] as string || '')}
              onChange={(e) => {
                const val = e.target.value;
                updateField(field, val === '' ? otherValue : val);
              }}
              placeholder={`Type your ${label.toLowerCase()}...`}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 mt-1.5 bg-amber-50/40"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-[10px] font-medium text-amber-600/70 bg-amber-100 px-1.5 py-0.5 rounded-md">Custom</span>
          </div>
        )}
      </div>
    );
  };

  const FormInput = ({ label, field, type = 'text', placeholder }: { label: string; field: string; type?: string; placeholder?: string }) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary">{label}</label>
      <input type={type} value={(formData[field] as string) || ''} onChange={(e) => updateField(field, e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
    </div>
  );

  const DateOfBirthInput = ({ label, field }: { label: string; field: string }) => {
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
        <label className="block text-sm font-medium text-text-primary">{label}</label>
        <div className="grid grid-cols-3 gap-2">
          <CustomSelect
            value={day || ''}
            onChange={(val) => handleDateChange(val, month || '', year || '')}
            options={days}
            placeholder="Day"
            searchable={false}
            position="bottom"
          />
          <CustomSelect
            value={month || ''}
            onChange={(val) => handleDateChange(day || '', val, year || '')}
            options={months}
            placeholder="Month"
            searchable={false}
            position="bottom"
          />
          <CustomSelect
            value={year || ''}
            onChange={(val) => handleDateChange(day || '', month || '', val)}
            options={years}
            placeholder="Year"
            searchable={true}
            position="bottom"
          />
        </div>
      </div>
    );
  };

  const sections = [
    { key: 'personal', label: 'Personal', icon: User },
    { key: 'family', label: 'Family', icon: Users },
    { key: 'education', label: 'Education', icon: GraduationCap },
    { key: 'religion', label: 'Religion & Lifestyle', icon: BookOpen },
    { key: 'preferences', label: 'Preferences', icon: Sparkles },
    { key: 'about', label: 'About', icon: Heart },
    { key: 'media', label: 'Photos & Video', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-surface bg-alpana">
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
                <DateOfBirthInput label="Date of Birth" field="date_of_birth" />
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
                <FormSelect label="Native City" field="native_district" options={NATIVE_CITIES} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormInput label="Phone" field="phone" type="tel" placeholder="+91..." />
                <FormInput label="Email" field="email" type="email" />
                <FormInput label="Social Media Handle" field="social_handle" placeholder="@username" />
              </div>
            </div>
          )}

          {/* Family */}
          {activeSection === 'family' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">Family Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Father's Name" field="father_name" />
                <FormSelect label="Father's Occupation" field="father_occupation" options={PARENT_OCCUPATIONS} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Mother's Name" field="mother_name" />
                <FormSelect label="Mother's Occupation" field="mother_occupation" options={PARENT_OCCUPATIONS} />
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
                <FormSelect label="Field of Study" field="field_of_study" options={FIELDS_OF_STUDY} />
                <FormSelect label="Institution" field="institution" options={INSTITUTIONS} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Profession" field="profession" options={PROFESSIONS} />
                <FormSelect label="Company" field="company" options={COMPANIES} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Annual Income" field="annual_income" options={INCOME_RANGES} />
                <FormSelect label="Work City" field="work_city" options={WORK_CITIES} />
              </div>
            </div>
          )}

          {/* Religion & Lifestyle */}
          {activeSection === 'religion' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">Religion & Lifestyle</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Religion" field="religion" options={RELIGIONS} />
                <FormSelect 
                  label="Caste" 
                  field="caste" 
                  options={formData.religion && CASTE_MAPPING[formData.religion as string] ? CASTE_MAPPING[formData.religion as string] : ALL_CASTES} 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect 
                  label="Sub-Caste" 
                  field="sub_caste" 
                  options={formData.caste && SUBCASTE_MAPPING[formData.caste as string] ? SUBCASTE_MAPPING[formData.caste as string] : ALL_SUBCASTES} 
                />
                <FormSelect label="Manglik" field="manglik" options={MANGLIK_OPTIONS} />
              </div>
              {formData.religion === 'Hindu' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-orange-50/30 border border-orange-100/50 animate-fade-in">
                  <FormSelect label="Gotra" field="gotra" options={GOTRAS} />
                  <FormSelect label="Raasi (Zodiac Sign)" field="raasi" options={RAASIS} />
                  {formData.raasi && (
                    <FormSelect 
                      label="Star (Nakshatra)" 
                      field="star" 
                      options={RAASI_NAKSHATRAS_MAPPING[formData.raasi as string] || []} 
                    />
                  )}
                </div>
              )}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Partner Age Range" field="pref_age_range" options={AGE_RANGES} />
                <FormSelect label="Partner Height Range" field="pref_height_range" options={HEIGHT_RANGES} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect label="Pref. Education" field="pref_education" options={EDUCATION_LEVELS} />
                <FormSelect label="Pref. Profession" field="pref_profession" options={PROFESSIONS} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormSelect label="Pref. Work City" field="pref_city" options={WORK_CITIES} />
                <FormSelect label="Pref. Diet" field="pref_diet" options={DIET_TYPES} />
                <FormSelect label="Pref. Marital Status" field="pref_marital_status" options={MARITAL_STATUSES} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">About Ideal Partner</label>
                <textarea value={(formData.partner_preference as string) || ''} onChange={(e) => updateField('partner_preference', e.target.value.slice(0, 500))} rows={4} maxLength={500} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Describe your ideal partner — personality, values, lifestyle..." />
                <p className={`text-[10px] font-medium text-right ${((formData.partner_preference as string) || '').length > 450 ? 'text-amber-500' : 'text-text-muted'}`}>{((formData.partner_preference as string) || '').length}/500</p>
              </div>
            </div>
          )}

          {/* About */}
          {activeSection === 'about' && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold mb-4">About Me</h2>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">Tell potential matches about yourself</label>
                <textarea value={(formData.about_me as string) || ''} onChange={(e) => updateField('about_me', e.target.value.slice(0, 500))} rows={6} maxLength={500} className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Share your personality, values, interests, what makes you unique..." />
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-text-muted">A good description helps get more matches</p>
                  <p className={`text-[10px] font-medium ${((formData.about_me as string) || '').length > 450 ? 'text-amber-500' : 'text-text-muted'}`}>{((formData.about_me as string) || '').length}/500</p>
                </div>
              </div>
            </div>
          )}

          {/* Photos & Video */}
          {activeSection === 'media' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Photos & Video</h2>
                  <p className="text-xs text-text-muted">Manage your profile media</p>
                </div>
              </div>

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
                  <h3 className="text-sm font-semibold text-text-primary mb-2">Upload Profile Video (1 Video)</h3>
                  <p className="text-xs text-text-muted mb-3">Upload a short intro video. Size must be optimized and under 10MB (max 30 seconds).</p>
                  
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
