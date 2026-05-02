import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GOVT_SERVICES } from '@/lib/constants';

export default function GovernmentPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Government Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Government Services</h1>
          <p className="mt-2 text-text-muted">Quick access to essential government portals and schemes.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GOVT_SERVICES.map((service) => (
            <Card key={service.id} className="group flex flex-col">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{service.title}</h3>
                  <span className="text-xs text-text-muted bg-surface px-2 py-0.5 rounded-full">{service.category}</span>
                </div>
              </div>
              <p className="text-sm text-text-muted mt-3 leading-relaxed flex-1">{service.description}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <a href={service.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    Go to Official Portal <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
