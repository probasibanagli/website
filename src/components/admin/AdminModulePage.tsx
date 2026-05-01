'use client';

import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    () =>
      formFields.reduce((acc, field) => {
        acc[field.key] = '';
        return acc;
      }, {} as Record<string, string>)
  );

  const rows = useMemo(() => {
    return sampleListings;
  }, []);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setSelectedId(null);
    setFormValues(
      formFields.reduce((acc, field) => {
        acc[field.key] = '';
        return acc;
      }, {} as Record<string, string>)
    );
  };

  return (
    <div className="min-h-screen bg-surface py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-8">

        <div>
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Admin module
          </p>
          <h1 className="text-3xl font-bold">
            Manage {collectionName}
          </h1>
          <p className="text-sm text-gray-500">
            Edit and manage {moduleKey} listings.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">

          {/* TABLE */}
          <Card className="overflow-x-auto p-0">
            <table className="min-w-full">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="text-left p-3 text-sm">
                      {col.label}
                    </th>
                  ))}
                  <th className="p-3 text-sm">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((item: Listing) => (
                  <tr key={item.id} className="border-t">
                    {columns.map((col) => (
                      <td key={col.key} className="p-3 text-sm">
                        {String((item as any)[col.key] ?? '')}
                      </td>
                    ))}
                    <td className="p-3">
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

          {/* FORM */}
          <Card className="p-4 space-y-4">

            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {selectedId ? 'Edit Listing' : 'New Listing'}
              </h2>

              <Button variant="ghost" size="sm" onClick={handleClear}>
                Clear
              </Button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => e.preventDefault()}
            >
              {formFields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-medium">
                    {field.label}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      className="w-full border p-2 rounded"
                      value={formValues[field.key]}
                      onChange={(e) =>
                        handleChange(field.key, e.target.value)
                      }
                    />
                  ) : field.type === 'select' ? (
                    <select
                      className="w-full border p-2 rounded"
                      value={formValues[field.key]}
                      onChange={(e) =>
                        handleChange(field.key, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="w-full border p-2 rounded"
                      type={field.type ?? 'text'}
                      value={formValues[field.key]}
                      onChange={(e) =>
                        handleChange(field.key, e.target.value)
                      }
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={handleClear}>
                  Reset
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>

          </Card>
        </div>
      </div>
    </div>
  );
}