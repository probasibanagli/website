'use client';

import React from 'react';
import Link from 'next/link';
<<<<<<< HEAD
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, Shield, Loader2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth/AuthContext';
=======
import { User, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
>>>>>>> origin/main

export default function ProfilePage() {
  const router = useRouter();
  const { firebaseUser, profile, loading, logOut } = useAuth();

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!firebaseUser || !profile) {
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
        </div>
      </div>
    );
  }

  const roleBadgeVariant = profile.role === 'superadmin' ? 'bengali' : profile.role === 'admin' ? 'teal' : 'default';
  const roleLabel = profile.role === 'superadmin' ? 'Super Admin' : profile.role === 'admin' ? 'Admin' : 'User';

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-display text-text-primary mb-8">My Profile</h1>

        <Card padding="lg" className="mb-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl text-white">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-2xl font-bold">{profile.full_name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold">{profile.full_name}</h2>
                <Badge variant={roleBadgeVariant}>
                  {profile.role === 'superadmin' && <Crown className="w-3 h-3" />}
                  {roleLabel}
                </Badge>
              </div>
              <p className="text-sm text-text-muted">{profile.email}</p>
              {profile.phone && <p className="text-sm text-text-muted">{profile.phone}</p>}
              <p className="text-xs text-text-muted mt-1">Member since {new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(profile.role === 'admin' || profile.role === 'superadmin') && (
            <Link href="/admin">
              <Card className="flex items-center gap-4 hover:border-primary/30 transition-all cursor-pointer border-2 border-transparent">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-bold">Admin Panel</h3>
                  <p className="text-sm text-text-muted">Manage website content</p>
                </div>
              </Card>
            </Link>
          )}

          <Card className="flex items-center gap-4 opacity-60">
            <Settings className="w-6 h-6 text-text-muted" />
            <div>
              <h3 className="font-bold">Account Settings</h3>
              <p className="text-sm text-text-muted">Update your profile information</p>
            </div>
          </Card>

          <button onClick={handleLogout} className="w-full text-left cursor-pointer">
            <Card className="flex items-center gap-4 hover:border-red-300 transition-all border-2 border-transparent">
              <LogOut className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-bold text-red-600">Logout</h3>
                <p className="text-sm text-text-muted">Sign out of your account</p>
              </div>
            </Card>
          </button>
        </div>
      </div>
    </div>
  );
}
