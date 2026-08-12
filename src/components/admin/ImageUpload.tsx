'use client';

import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Loader2, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}

export default function ImageUpload({ value, onChange, folder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const storage = getStorage();
      const fileExt = compressedFile.name.split('.').pop() || 'jpg';
      const storageRef = ref(storage, `${folder}/${Date.now()}.${fileExt}`);
      await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(storageRef);
      onChange(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange('')} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors cursor-pointer">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
        />
        {uploading && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
