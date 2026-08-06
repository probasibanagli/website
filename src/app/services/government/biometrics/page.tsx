'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, ShieldCheck, Lock, Unlock, Fingerprint, Eye, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';

export default function BiometricsPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 py-8 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/services/government" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Government Services
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Aadhaar Biometric Security</h1>
            <Badge variant="amber" className="text-xs border-white/20 bg-white/10 text-white">Security & Privacy</Badge>
          </div>
          <p className="text-white/80 mt-2">Lock or unlock your Aadhaar fingerprint & iris biometrics online to prevent unauthorized authentication.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Security Banner */}
        <Card className="bg-amber-50 border-amber-200 p-6">
          <div className="flex items-start gap-3 text-amber-900">
            <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5 text-amber-700" />
            <div>
              <h3 className="font-bold text-base mb-1">Why Lock Your Aadhaar Biometrics?</h3>
              <p className="text-sm leading-relaxed text-amber-800">
                Locking your biometrics prevents anyone from authenticating financial transactions or SIM registration using your fingerprints or iris scan without your consent. You can temporarily unlock biometrics anytime when visiting a bank or SIM store.
              </p>
            </div>
          </div>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lock Biometrics */}
          <Card className="flex flex-col border-border hover:border-amber-400 transition-all p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4 text-amber-800">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Lock Biometrics</h3>
            <p className="text-sm text-text-muted mb-4 flex-1">
              Secures all 10 fingerprints and iris data. Once locked, any biometric authentication attempt will fail until unlocked by you.
            </p>
            <a href="https://myaadhaar.uidai.gov.in/lock-unlock-aadhaar" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="w-full bg-amber-700 hover:bg-amber-800 text-white border-none cursor-pointer">
                Lock Biometrics Now <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>

          {/* Unlock Biometrics */}
          <Card className="flex flex-col border-border hover:border-amber-400 transition-all p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4 text-amber-800">
              <Unlock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Unlock Biometrics</h3>
            <p className="text-sm text-text-muted mb-4 flex-1">
              Temporarily unlock biometrics for a 10-minute window or permanently unlock when updating biometrics at an Aadhaar centre.
            </p>
            <a href="https://myaadhaar.uidai.gov.in/lock-unlock-aadhaar" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-amber-300 text-amber-800 hover:bg-amber-50 cursor-pointer">
                Unlock Biometrics Portal <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>
        </div>

        {/* Step-by-step Guide */}
        <Card className="border-border p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-amber-700" /> How to Lock/Unlock Biometrics Online
          </h3>
          <ol className="space-y-3 list-decimal list-inside text-sm text-text-muted">
            <li className="pl-1">Go to the official UIDAI myAadhaar Portal (<strong className="text-text-primary">myaadhaar.uidai.gov.in</strong>).</li>
            <li className="pl-1">Click on <strong className="text-text-primary">Login</strong> and enter your 12-digit Aadhaar Number + Captcha.</li>
            <li className="pl-1">Enter the OTP sent to your Aadhaar-linked mobile phone.</li>
            <li className="pl-1">Select the <strong className="text-text-primary">Lock/Unlock Biometrics</strong> service tile.</li>
            <li className="pl-1">Confirm and complete the lock request. You will see a blue lock badge on your profile.</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
