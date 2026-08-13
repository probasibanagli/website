'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, User, Calendar, Plus, Loader2, X, Upload, ArrowRight, Tag, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/lib/auth/AuthContext';
import { collection, getDocs, setDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sampleBlogPosts } from '@/data/sample-data';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author?: string;
  tags: string[];
  published: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  created_at: string;
  image?: string;
}

export default function BlogPage() {
  const { profile, firebaseUser } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    image: '',
  });

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select an image file.');
      return;
    }

    try {
      const compressedBase64 = await compressImage(file);
      setForm(prev => ({ ...prev, image: compressedBase64 }));
      setFormError('');
    } catch (err) {
      setFormError('Failed to compress image.');
    }
  };

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Check verification
  const isVerified = profile && profile.email_verified && profile.phone_verified;

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch(`/api/public/firestore?collection=blog_posts&whereField=published&whereValue=true`);
        if (!res.ok) {
          throw new Error('Failed to fetch blog posts from API');
        }
        const json = await res.json();
        const dbBlogs = (json.items || []) as BlogPost[];
        
        // Merge with sample posts (deduplicating by id/slug)
        const dbIds = new Set(dbBlogs.map(b => b.id));
        const merged = [...dbBlogs, ...sampleBlogPosts.filter(b => !dbIds.has(b.id))];
        
        // Sort by date desc
        merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setBlogs(merged);
      } catch (e) {
        console.error(e);
        // Fallback to sample data on error
        setBlogs(sampleBlogPosts as BlogPost[]);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const handleOpenModal = () => {
    if (!firebaseUser) {
      alert('Please log in to submit a blog post.');
      return;
    }
    if (!isVerified) {
      alert('You must register and verify both your Phone Number and Email ID before submitting a blog.');
      return;
    }
    setForm({ title: '', excerpt: '', content: '', tags: '', image: '' });
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!form.title.trim() || !form.content.trim()) {
      setFormError('Title and Content are required fields.');
      return;
    }

    setSaving(true);
    try {
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const now = new Date().toISOString();

      const newPost: BlogPost = {
        id,
        title: form.title.trim(),
        slug,
        excerpt: form.excerpt.trim() || form.content.trim().slice(0, 150) + '...',
        content: form.content.trim(),
        author: profile?.full_name || 'Anonymous User',
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        published: false,
        status: 'pending',
        created_at: now,
        image: form.image,
      };

      await setDoc(doc(db, 'blog_posts', id), newPost);

      // Log activity
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Blog Submitted for Approval',
          performed_by: profile?.full_name || 'User',
          user_role: profile?.role || 'user',
          details: `Submitted blog post: "${form.title.trim()}"`
        })
      }).catch(() => {});

      setFormSuccess('Blog post submitted successfully! It will be published once an Admin approves it.');
      setTimeout(() => {
        setShowModal(false);
      }, 2500);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit blog post.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
              <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
              <span className="text-text-primary font-medium">Blog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Community Blog</h1>
            <p className="mt-1 text-text-muted text-sm">Tips, guides, and stories shared by Bengalis in Tamil Nadu.</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 sm:self-end"
          >
            <Plus className="w-4 h-4" /> Submit a Blog Post
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="w-16 h-5 rounded-md" />
                    <Skeleton className="w-24 h-5 rounded-md" />
                  </div>
                  <Skeleton className="w-full h-6 mt-2" />
                  <Skeleton className="w-3/4 h-6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogs.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full group p-0 overflow-hidden hover:border-primary/20 transition-all hover:shadow-lg">
                  <div className="h-48 bg-primary-light flex items-center justify-center relative overflow-hidden">
                    {post.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl opacity-30">📜</span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.map((tag) => <Badge key={tag} variant="default"><Tag className="w-2.5 h-2.5 mr-1" />{tag}</Badge>)}
                    </div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-text-muted mt-2 line-clamp-2">{post.excerpt}</p>}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Blog Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-3xl border border-border w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-xl font-bold text-text-primary">Submit a Blog Post</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-surface text-text-muted transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" /> {formError}
                </div>
              )}
              {formSuccess && (
                <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> {formSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">Blog Title *</label>
                <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. Life in Chennai as a Bengali student" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">Excerpt (Short Summary)</label>
                <input type="text" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. A quick guide detailing my experiences..." />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">Content *</label>
                <textarea required rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm resize-none" placeholder="Write your full story here..." />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">Tags (Comma-separated)</label>
                <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" placeholder="e.g. student, chennai, lifestyle" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">Cover Image (Optional)</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm" />
                {form.image && (
                  <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setForm({ ...form, image: '' })} className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"><X className="w-3 h-3" /></button>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:bg-surface transition-colors">Cancel</button>
                <button type="submit" disabled={saving || !!formSuccess} className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-md active:scale-95 cursor-pointer">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {saving ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
