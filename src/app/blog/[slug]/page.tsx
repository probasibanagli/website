'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { sampleBlogPosts } from '@/data/sample-data';

export default function BlogDetailPage() {
  const params = useParams();
  const post = sampleBlogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return (<div className="min-h-screen flex items-center justify-center"><div className="text-center"><p className="text-5xl mb-4">📜</p><h2 className="text-2xl font-bold mb-2">Post Not Found</h2><Link href="/blog"><Button variant="primary">Back to Blog</Button></Link></div></div>);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => <Badge key={tag} variant="default"><Tag className="w-2.5 h-2.5 mr-1" />{tag}</Badge>)}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary leading-tight">{post.title}</h1>

        <div className="flex items-center gap-4 mt-4 text-sm text-text-muted">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        <div className="h-64 bg-gradient-to-br from-primary-light to-accent-light rounded-2xl my-8 flex items-center justify-center">
          <span className="text-6xl opacity-30">📜</span>
        </div>

        <div className="prose max-w-none text-text-primary leading-relaxed">
          <p className="text-lg text-text-muted">{post.excerpt}</p>
          <p className="mt-6">This is a placeholder for the full blog post content. When connected to a CMS like Sanity.io or the Supabase database, the full article content will be rendered here with rich formatting, images, and links.</p>
          <p className="mt-4">Stay tuned for more helpful content for Bengalis living in Tamil Nadu!</p>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-text-muted mb-4">Enjoyed this article? Share it with your friends!</p>
          <Link href="/blog"><Button variant="outline">← Read More Articles</Button></Link>
        </div>
      </div>
    </div>
  );
}
