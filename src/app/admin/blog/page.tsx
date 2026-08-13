'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { Loader2, Shield, Check, X, Eye, Trash2, Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';

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

export default function AdminBlogPage() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'published' | 'pending'>('published');
  
  // Preview State
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  const canView = canAccess(profile?.role || 'user', profile?.permissions, 'blog', 'view');
  const canEdit = canAccess(profile?.role || 'user', profile?.permissions, 'blog', 'edit');
  const canManage = canAccess(profile?.role || 'user', profile?.permissions, 'blog', 'manage');

  useEffect(() => {
    async function loadPosts() {
      try {
        const snap = await getDocs(collection(db, 'blog_posts'));
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (canView) loadPosts();
  }, [canView]);

  async function handleApprove(id: string, title: string) {
    try {
      await updateDoc(doc(db, 'blog_posts', id), {
        published: true,
        status: 'approved',
        updated_at: new Date().toISOString()
      });
      setPosts(prev => prev.map(p => p.id === id ? { ...p, published: true, status: 'approved' } : p));
      alert(`Published "${title}"!`);
    } catch (e) {
      console.error(e);
      alert('Failed to publish post.');
    }
  }

  async function handleReject(id: string, title: string) {
    if (!confirm(`Reject "${title}"?`)) return;
    try {
      await updateDoc(doc(db, 'blog_posts', id), {
        published: false,
        status: 'rejected',
        updated_at: new Date().toISOString()
      });
      setPosts(prev => prev.map(p => p.id === id ? { ...p, published: false, status: 'rejected' } : p));
      alert(`Rejected "${title}".`);
    } catch (e) {
      console.error(e);
      alert('Failed to reject post.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Permanently delete this post?')) return;
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete post.');
    }
  }

  const publishedPosts = posts.filter(p => p.published);
  const pendingPosts = posts.filter(p => !p.published && p.status === 'pending');

  if (!canView) return (
    <div className="text-center py-20"><Shield className="w-12 h-12 text-red-500 mx-auto mb-4" /><h2 className="text-xl font-bold text-text-primary mb-2">No Access</h2><p className="text-text-muted">You don&apos;t have permission to access this module.</p></div>
  );

  if (previewPost) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPreviewPost(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface/80 border border-border text-text-muted hover:text-text-primary transition-colors text-sm font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Blog Post Preview</h1>
            <p className="text-text-muted text-sm mt-0.5">Review the blog post details below.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-text-primary">{previewPost.title}</h2>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-text-muted">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> By {previewPost.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Submitted on {new Date(previewPost.created_at).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {previewPost.image && (
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewPost.image} alt={previewPost.title} className="w-full h-full object-cover" />
            </div>
          )}

          {previewPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {previewPost.tags.map(t => (
                <Badge key={t} variant="default"><Tag className="w-3 h-3 mr-1" />{t}</Badge>
              ))}
            </div>
          )}

          {previewPost.excerpt && (
            <div className="p-4 bg-surface rounded-2xl border border-border italic text-sm text-text-muted leading-relaxed">
              {previewPost.excerpt}
            </div>
          )}

          <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
            {previewPost.content}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <button type="button" onClick={() => setPreviewPost(null)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:bg-surface transition-colors border border-border">
              Close Preview
            </button>
            {!previewPost.published && previewPost.status === 'pending' && canEdit && (
              <>
                <button type="button" onClick={() => { handleReject(previewPost.id, previewPost.title); setPreviewPost(null); }} className="inline-flex items-center gap-1 px-5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-700 transition-all cursor-pointer">
                  Reject Post
                </button>
                <button type="button" onClick={() => { handleApprove(previewPost.id, previewPost.title); setPreviewPost(null); }} className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer">
                  Approve & Publish
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Blog Posts Management</h1>
          <p className="text-text-muted text-sm mt-1">Review, approve, or delete community submitted articles</p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-surface p-1 rounded-xl border border-border">
          <button
            onClick={() => setActiveTab('published')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'published'
                ? 'bg-white text-text-primary shadow-sm font-bold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Published ({publishedPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-white text-text-primary shadow-sm font-bold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Pending Approval
            {pendingPosts.length > 0 && (
              <span className="w-5 h-5 bg-amber-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse">
                {pendingPosts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {activeTab === 'published' && (
            <div className="bg-white/50 rounded-2xl border border-border overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface/50 border-b border-border text-left">
                    <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Article Title</th>
                    <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Author</th>
                    <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Created</th>
                    <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {publishedPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-surface transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-text-primary text-sm line-clamp-1">{post.title}</p>
                        <p className="text-xs text-text-muted font-mono">{post.slug}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">{post.author || 'Anonymous'}</td>
                      <td className="px-5 py-4 text-xs text-text-muted">
                        {new Date(post.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-700 border border-green-500/20">
                          <Check className="w-3 h-3" /> Live
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setPreviewPost(post); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-colors cursor-pointer"
                            title="Preview Article"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canManage && (
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors cursor-pointer"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {publishedPosts.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm italic">No published blog posts yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="bg-white/50 rounded-2xl border border-border overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface/50 border-b border-border text-left">
                    <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Submitted Article</th>
                    <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Author</th>
                    <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Date Submitted</th>
                    <th className="px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Review Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pendingPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-surface transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-text-primary text-sm">{post.title}</p>
                        {post.excerpt && <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{post.excerpt}</p>}
                      </td>
                      <td className="px-5 py-4 text-sm text-text-muted">{post.author || 'Anonymous'}</td>
                      <td className="px-5 py-4 text-xs text-text-muted">
                        {new Date(post.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => { setPreviewPost(post); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-surface border border-border rounded-xl text-xs font-bold text-text-primary hover:bg-border/50 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> Preview
                          </button>
                          {canEdit && (
                            <>
                              <button
                                onClick={() => handleApprove(post.id, post.title)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 border border-green-200 rounded-xl text-xs font-bold text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => handleReject(post.id, post.title)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingPosts.length === 0 && (
                    <tr><td colSpan={4} className="px-5 py-12 text-center text-text-muted text-sm italic">No pending approvals</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
