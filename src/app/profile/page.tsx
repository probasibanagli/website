'use client';

import React from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-display text-text-primary mb-8">My Profile</h1>

        <Card padding="lg" className="mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl text-white">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Guest User</h2>
              <p className="text-sm text-text-muted">Please login to view your profile</p>
              <Link href="/auth/login" className="mt-3 inline-block">
                <Button variant="primary" size="sm">Login to Continue</Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="flex items-center gap-4 opacity-50">
            <Settings className="w-6 h-6 text-text-muted" />
            <div>
              <h3 className="font-bold">Account Settings</h3>
              <p className="text-sm text-text-muted">Update your profile information</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 opacity-50">
            <Shield className="w-6 h-6 text-text-muted" />
            <div>
              <h3 className="font-bold">Security</h3>
              <p className="text-sm text-text-muted">Password & privacy settings</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
