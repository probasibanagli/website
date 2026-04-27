import React from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { sampleBlogPosts } from '@/data/sample-data';

export const metadata = {
  title: 'Blog — ProbasiBangali',
  description: 'Tips, guides, and stories for Bengalis living in Tamil Nadu.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
            <span className="text-text-primary font-medium">Blog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-text-primary">Blog</h1>
          <p className="mt-2 text-text-muted">Tips, guides, and stories for Bengalis in Tamil Nadu.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleBlogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full group p-0 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center">
                  <span className="text-5xl opacity-30">📜</span>
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
      </div>
    </div>
  );
}
