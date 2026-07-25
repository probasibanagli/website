'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Heart, ShieldPlus, Edit3, Link as LinkIcon, Info, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AyushmanBharatPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-[#7a2d14] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/services/government" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Government Services
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Ayushman Bharat (PM-JAY)</h1>
          </div>
          <p className="text-white/80 mt-2">Pradhan Mantri Jan Arogya Yojana - Health insurance covering ₹5 lakh per family per year.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Info Banner */}
        <Card className="bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3 text-amber-800">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              <strong>About PM-JAY:</strong> It provides a health cover of ₹5 lakhs per family per year for secondary and tertiary care hospitalization across public and private empaneled hospitals in India. It is completely cashless and paperless.
            </p>
          </div>
        </Card>

        {/* 1. New Application */}
        <Card className="border-border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              <ShieldPlus className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-text-primary mb-2">New Application / Check Eligibility</h2>
              <p className="text-sm text-text-muted mb-4">
                Not everyone is eligible. Eligibility is based on the SECC 2011 data or active Ration Card (for some states). You can check your eligibility online and apply for the Ayushman card.
              </p>
              
              <div className="bg-surface p-4 rounded-xl mb-4 border border-border">
                <h4 className="text-sm font-bold text-text-primary mb-2">Steps to Apply:</h4>
                <ol className="list-decimal list-inside text-sm text-text-muted space-y-1.5 ml-1">
                  <li>Visit the PMJAY Beneficiary Portal.</li>
                  <li>Login using your Mobile Number (OTP).</li>
                  <li>Select your State, Scheme (PMJAY), District, and Search by (Aadhaar / Name / Ration Card).</li>
                  <li>If your name appears, click on "Authenticate" to complete e-KYC and generate your card.</li>
                </ol>
              </div>

              <a href="https://beneficiary.nha.gov.in/" target="_blank" rel="noopener noreferrer">
                <Button variant="primary">
                  Login to Apply / Check Eligibility <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </Card>

        {/* 2. Update Existing Card */}
        <Card className="border-border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              <Edit3 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-text-primary mb-2">Update Existing Card / Add Member</h2>
              <p className="text-sm text-text-muted mb-4">
                You can add new family members (like a newborn baby or a new spouse) to your existing Ayushman family structure if you are already a beneficiary.
              </p>

              <div className="bg-surface p-4 rounded-xl mb-4 border border-border">
                <h4 className="text-sm font-bold text-text-primary mb-2">How to Update/Add Member:</h4>
                <ul className="list-disc list-inside text-sm text-text-muted space-y-1.5 ml-1">
                  <li>Login to the Beneficiary Portal.</li>
                  <li>Search for your approved family details.</li>
                  <li>Click on the <strong>Add Family Member</strong> option next to your approved card.</li>
                  <li>Provide documents (Birth Certificate, Marriage Certificate, Ration Card) to prove relationship.</li>
                </ul>
              </div>

              <a href="https://beneficiary.nha.gov.in/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  Update Details / Add Member <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </Card>

        {/* 3. Aadhaar Linking Guide */}
        <Card className="border-border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              <LinkIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-text-primary mb-2">Aadhaar Linking Guide (e-KYC)</h2>
              <p className="text-sm text-text-muted mb-4">
                To download your Ayushman card, your PM-JAY record must be linked with your Aadhaar (e-KYC).
              </p>

              <div className="bg-surface p-4 rounded-xl mb-4 border border-border">
                <h4 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-primary" /> e-KYC Process
                </h4>
                <ul className="space-y-3 text-sm text-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-text-primary">1.</span>
                    <span>When you find your name on the Beneficiary Portal, it may say "Unidentified" or "Not Generated".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-text-primary">2.</span>
                    <span>Click on the Action button (Aadhaar icon) to link your Aadhaar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-text-primary">3.</span>
                    <span>Verify your Aadhaar using OTP, Fingerprint, or Face Auth (if using the mobile app).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-text-primary">4.</span>
                    <span>Ensure your Aadhaar Photo and details match the PM-JAY database (minimum 80% match recommended).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-text-primary">5.</span>
                    <span>Once approved, you can instantly download your Ayushman PDF Card.</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <a href="https://beneficiary.nha.gov.in/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    Complete e-KYC Now <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
