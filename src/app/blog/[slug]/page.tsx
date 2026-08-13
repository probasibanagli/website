'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, User, Tag, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { sampleBlogPosts } from '@/data/sample-data';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [suggestedPosts, setSuggestedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      try {
        // Check firestore first
        const q = query(collection(db, 'blog_posts'), where('slug', '==', slug), limit(1));
        const snap = await getDocs(q);
        
        let foundPost: BlogPost | null = null;
        if (!snap.empty) {
          foundPost = { id: snap.docs[0].id, ...snap.docs[0].data() } as BlogPost;
          setPost(foundPost);
        } else {
          // Check sample posts
          const samplePost = sampleBlogPosts.find((p) => p.slug === slug);
          if (samplePost) {
            foundPost = samplePost as BlogPost;
            setPost(foundPost);
          }
        }

        // Fetch suggested posts
        let dbBlogs: BlogPost[] = [];
        try {
          const res = await fetch(`/api/public/firestore?collection=blog_posts&whereField=published&whereValue=true`);
          if (res.ok) {
            const json = await res.json();
            dbBlogs = (json.items || []) as BlogPost[];
          }
        } catch (e) {
          // Ignore
        }

        const dbIds = new Set(dbBlogs.map(b => b.id));
        const merged = [...dbBlogs, ...sampleBlogPosts.filter(b => !dbIds.has(b.id))];
        const suggestions = merged.filter(p => p.slug !== slug).slice(0, 3);
        setSuggestedPosts(suggestions);

      } catch (err) {
        console.error("Error fetching post:", err);
        // Fallback to sample
        const samplePost = sampleBlogPosts.find((p) => p.slug === slug);
        if (samplePost) {
          setPost(samplePost as BlogPost);
        }
        setSuggestedPosts(sampleBlogPosts.filter(p => p.slug !== slug).slice(0, 3));
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

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

        {post.image ? (
          <div className="h-64 sm:h-96 w-full rounded-2xl my-8 overflow-hidden border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="h-64 bg-primary-light rounded-2xl my-8 flex items-center justify-center">
            <span className="text-6xl opacity-30">📜</span>
          </div>
        )}

        <div className="prose max-w-none text-text-primary leading-relaxed">
          {post.content ? (
            <div className="whitespace-pre-wrap">{post.content}</div>
          ) : (
            <>
              <p className="text-lg text-text-muted">{post.excerpt}</p>
              <p className="mt-6">This is a placeholder for the full blog post content. When connected to a CMS like Sanity.io or the Supabase database, the full article content will be rendered here with rich formatting, images, and links.</p>
            </>
          )}
          <p className="mt-4 font-semibold">Stay tuned for more helpful content for Bengalis living in Tamil Nadu!</p>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-text-muted mb-4">Enjoyed this article? Share it with your friends!</p>
        </div>
      </div>

      {suggestedPosts.length > 0 && (
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border mt-8">
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center font-display">More Articles You Might Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {suggestedPosts.map((sp) => (
              <Link key={sp.id} href={`/blog/${sp.slug}`}>
                <Card className="h-full group p-0 overflow-hidden hover:border-primary/20 transition-all hover:shadow-lg">
                  <div className="h-48 bg-primary-light flex items-center justify-center relative overflow-hidden">
                    {sp.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={sp.image} alt={sp.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl opacity-30">📜</span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {sp.tags.map((tag) => <Badge key={tag} variant="default"><Tag className="w-2.5 h-2.5 mr-1" />{tag}</Badge>)}
                    </div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{sp.title}</h3>
                    {sp.excerpt && <p className="text-sm text-text-muted mt-2 line-clamp-2">{sp.excerpt}</p>}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{sp.author}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(sp.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/blog"><Button variant="outline" className="px-8 py-6 rounded-full font-bold shadow-sm hover:shadow-md transition-all">View All Community Blogs <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
        </div>
      )}
    </div>
  );
}
