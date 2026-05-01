'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { sampleListings } from '@/data/sample-data';
import type { Listing } from '@/types';

interface Column {
  key: string;
  label: string;
}

interface FormField {
  key: string;
  label: string;
  type?: 'text' | 'select' | 'textarea' | 'number';
  options?: string[];
  required?: boolean;
}

interface AdminModulePageProps {
  moduleKey: string;
  collectionName: string;
  columns: Column[];
  formFields: FormField[];
}

export default function AdminModulePage({
  moduleKey,
  collectionName,
  columns,
  formFields,
}: AdminModulePageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>(
    formFields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {})
  );

  const rows = useMemo(() => {
    if (moduleKey === 'stay') {
      return sampleListings;
    }
    return sampleListings;
  }, [moduleKey]);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setSelectedId(null);
    setFormValues(formFields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));
  };

  return (
    <div className="min-h-screen bg-surface py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <p className="text-sm text-text-muted uppercase tracking-[0.16em]">Admin module</p>
          <h1 className="text-3xl font-bold text-text-primary">Manage {collectionName}</h1>
          <p className="text-sm text-text-muted">
            Edit, review, and add stay listings for the {moduleKey} module.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="overflow-x-auto p-0">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-surface">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-4 py-3 text-left text-sm font-semibold text-text-muted"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((item: Listing) => (
                  <tr key={item.id} className="hover:bg-surface">
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-sm text-text-primary">
                        {String((item as any)[column.key] ?? '')}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedId(item.id)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-text-muted uppercase tracking-[0.16em]">Form</p>
                <h2 className="text-xl font-semibold text-text-primary">
                  {selectedId ? 'Edit Listing' : 'New Listing'}
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>

            <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
              {formFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label htmlFor={field.key} className="block text-sm font-medium text-text-primary">
                    {field.label}
                    {field.required ? ' *' : ''}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.key}
                      value={formValues[field.key]}
                      onChange={(event) => handleChange(field.key, event.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      id={field.key}
                      value={formValues[field.key]}
                      onChange={(event) => handleChange(field.key, event.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">Select</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.key}
                      type={field.type ?? 'text'}
                      value={formValues[field.key]}
                      onChange={(event) => handleChange(field.key, event.target.value)}
                      className="w-full rounded-xl border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <Button variant="ghost" type="button" onClick={handleClear}>
                  Reset
                </Button>
                <Button type="submit">Save Listing</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
