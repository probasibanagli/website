'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth/AuthContext';
import { canAccess } from '@/lib/permissions';
import { Loader2, Shield, Check, X, Eye, Trash2, Calendar, User, Tag } from 'lucide-react';
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
  
  // Preview Modal
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

  const handleApprove = async (id: string, title: string) => {
    if (!canEdit) return;
    try {
      await updateDoc(doc(db, 'blog_posts', id), {
        published: true,
        status: 'approved',
        updated_at: new Date().toISOString()
      });

      setPosts(prev => prev.map(p => p.id === id ? { ...p, published: true, status: 'approved' } : p));
      
      // Log activity
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Blog Post Approved',
          performed_by: profile?.full_name || 'Admin',
          user_role: profile?.role,
          details: `Approved blog post: "${title}"`
        })
      }).catch(() => {});

      alert('Blog post approved and published successfully!');
    } catch (e) {
      console.error(e);
      alert('Error approving blog post.');
    }
  };

  const handleReject = async (id: string, title: string) => {
    if (!canEdit) return;
    try {
      await updateDoc(doc(db, 'blog_posts', id), {
        published: false,
        status: 'rejected',
        updated_at: new Date().toISOString()
      });

      setPosts(prev => prev.map(p => p.id === id ? { ...p, published: false, status: 'rejected' } : p));

      // Log activity
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Blog Post Rejected',
          performed_by: profile?.full_name || 'Admin',
          user_role: profile?.role,
          details: `Rejected blog post: "${title}"`
        })
      }).catch(() => {});

      alert('Blog post rejected successfully.');
    } catch (e) {
      console.error(e);
      alert('Error rejecting blog post.');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!canManage) return;
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
      setPosts(prev => prev.filter(p => p.id !== id));

      // Log activity
      await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Blog Post Deleted',
          performed_by: profile?.full_name || 'Admin',
          user_role: profile?.role,
          details: `Deleted blog post: "${title}"`
        })
      }).catch(() => {});

      alert('Blog post deleted successfully.');
    } catch (e) {
      console.error(e);
      alert('Error deleting blog post.');
    }
  };

  const publishedPosts = posts.filter(p => p.published);
  const pendingPosts = posts.filter(p => !p.published && p.status === 'pending');

  if (!canView) {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-text-primary mb-2">No Access</h2>
        <p className="text-text-muted">You do not have permission to access the Blog panel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Blog Post Management</h1>
        <p className="text-text-muted text-sm mt-1">Verify and approve community blog submissions</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6">
        <button
          onClick={() => setActiveTab('published')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'published' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Published Posts ({publishedPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          Pending Approvals ({pendingPosts.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <>
          {/* Published posts list */}
          {activeTab === 'published' && (
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface/50 border-b border-border">
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Blog Title</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Author</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Tags</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Created</th>
                    {(canEdit || canManage) && <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {publishedPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-surface transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-text-primary">{post.title}</p>
                        <p className="text-xs text-text-muted font-mono">{post.slug}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-primary">{post.author}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map(t => (
                            <span key={t} className="text-[10px] font-medium px-2 py-0.5 bg-surface border border-border rounded-full text-text-muted">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-text-muted">
                        {new Date(post.created_at).toLocaleDateString('en-IN')}
                      </td>
                      {(canEdit || canManage) && (
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setPreviewPost(post)} className="p-2 rounded-xl border border-border hover:bg-surface text-text-muted hover:text-primary transition-colors cursor-pointer">
                              <Eye className="w-4 h-4" />
                            </button>
                            {canManage && (
                              <button onClick={() => handleDelete(post.id, post.title)} className="p-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {publishedPosts.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm italic">No published posts yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pending approvals list */}
          {activeTab === 'pending' && (
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface/50 border-b border-border">
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Blog Title</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Author</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Excerpt</th>
                    <th className="text-left px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Created</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Approval Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pendingPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-surface transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-text-primary">{post.title}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-primary">{post.author}</td>
                      <td className="px-5 py-4 text-xs text-text-muted max-w-xs truncate">{post.excerpt}</td>
                      <td className="px-5 py-4 text-xs text-text-muted">
                        {new Date(post.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setPreviewPost(post)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border text-xs text-text-muted hover:text-primary transition-all cursor-pointer">
                            <Eye className="w-3.5 h-3.5" /> Preview
                          </button>
                          {canEdit && (
                            <>
                              <button onClick={() => handleApprove(post.id, post.title)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl text-xs font-bold text-green-700 transition-all cursor-pointer">
                                <Check className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button onClick={() => handleReject(post.id, post.title)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold text-red-700 transition-all cursor-pointer">
                                <X className="w-3.5 h-3.5" /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingPosts.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-text-muted text-sm italic">No pending approvals</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPreviewPost(null)} />
          <div className="relative bg-white rounded-3xl border border-border w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-text-primary">Blog Post Preview</h3>
              <button onClick={() => setPreviewPost(null)} className="p-2 rounded-xl hover:bg-surface text-text-muted transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-3 bg-surface/30">
              <button onClick={() => setPreviewPost(null)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-text-muted hover:bg-surface transition-colors">Close</button>
              {!previewPost.published && previewPost.status === 'pending' && canEdit && (
                <>
                  <button onClick={() => { handleReject(previewPost.id, previewPost.title); setPreviewPost(null); }} className="inline-flex items-center gap-1 px-5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm font-bold text-red-700 transition-all cursor-pointer">
                    Reject Post
                  </button>
                  <button onClick={() => { handleApprove(previewPost.id, previewPost.title); setPreviewPost(null); }} className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer">
                    Approve & Publish
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
