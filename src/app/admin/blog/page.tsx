'use client';
import AdminModulePage from '@/components/admin/AdminModulePage';

export default function AdminBlogPage() {
  return (
    <AdminModulePage
      moduleKey="blog"
      collectionName="blog_posts"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'slug', label: 'Slug' },
        { key: 'author', label: 'Author' },
        { key: 'published', label: 'Published' },
        { key: 'created_at', label: 'Created' },
      ]}
      formFields={[
        { key: 'title', label: 'Title', required: true },
        { key: 'slug', label: 'URL Slug', required: true },
        { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
        { key: 'content', label: 'Content', type: 'textarea' },
        { key: 'author', label: 'Author' },
        { key: 'tags', label: 'Tags (comma-separated)' },
        { key: 'cover_image', label: 'Cover Image URL' },
        { key: 'published', label: 'Published', type: 'select', options: ['true', 'false'] },
      ]}
    />
  );
}
