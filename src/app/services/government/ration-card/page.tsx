'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Home, UserPlus, Download, Edit3, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';

export default function RationCardPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 py-8 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/services/government" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Government Services
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">Ration Card (TNPDS)</h1>
            <Badge variant="amber" className="text-xs border-white/20 bg-white/10 text-white">PDS Tamil Nadu</Badge>
          </div>
          <p className="text-white/80 mt-2">Tamil Nadu Public Distribution System (TNPDS). Apply for new Smart Ration Card, add/remove family members, or download e-Ration card.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Service Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* New Application */}
          <Card className="flex flex-col border-border hover:border-emerald-500 transition-all p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 text-emerald-800">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">New Smart Card</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Apply for a fresh Smart Family Card online with valid address proof and family photograph.</p>
            <a href="https://www.tnpds.gov.in/pages/registercard/register-card.xhtml" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white border-none cursor-pointer">
                Apply New Card <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>

          {/* Member Addition / Update */}
          <Card className="flex flex-col border-border hover:border-emerald-500 transition-all p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 text-emerald-800">
              <Edit3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Modify Member Details</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Add a family member, remove a member, or update address details on your Smart Ration Card.</p>
            <a href="https://www.tnpds.gov.in/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-emerald-300 text-emerald-800 hover:bg-emerald-50 cursor-pointer">
                Modify Card <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>

          {/* e-Ration Card Download */}
          <Card className="flex flex-col border-border hover:border-emerald-500 transition-all p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 text-emerald-800">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Download e-Ration Card</h3>
            <p className="text-sm text-text-muted flex-1 mb-6">Download a digital PDF copy of your Smart Ration Card using registered mobile OTP.</p>
            <a href="https://www.tnpds.gov.in/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-emerald-300 text-emerald-800 hover:bg-emerald-50 cursor-pointer">
                Download PDF <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </Card>
        </div>

        {/* Requirements & Documents */}
        <Card className="border-border p-6">
          <h3 className="text-lg font-bold text-text-primary mb-3">Required Documents for New Smart Ration Card:</h3>
          <ul className="space-y-2.5 list-disc list-inside text-sm text-text-muted">
            <li>Aadhaar cards of all family members to be included.</li>
            <li>Proof of residence in Tamil Nadu (Electricity Bill, Gas Connection Bill, Rental Agreement, or Passport).</li>
            <li>Passport size photograph of the Head of the Family (HOF).</li>
            <li>No Card Certificate (if migrating from another state or family structure).</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
