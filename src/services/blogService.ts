import { ref, get, set, remove, push } from 'firebase/database';
import { database } from '../../firebase';
import { pickLang } from './cmsService';
import type { CmsBlogPost, ResolvedBlogPost, CmsLanguage } from '../types/cms';

const BLOG_POSTS_PATH = 'cms/v3/blog/posts';

/**
 * Fetches all blog posts stored in the database.
 * Used primarily by the Admin Dashboard where draft visibility is required.
 */
export async function fetchAdminPosts(): Promise<CmsBlogPost[]> {
  try {
    const snapshot = await get(ref(database, BLOG_POSTS_PATH));
    if (!snapshot.exists()) return [];
    const val = snapshot.val() as Record<string, CmsBlogPost>;
    return Object.values(val);
  } catch (err) {
    console.error('[blogService] Failed to fetch admin posts', err);
    return [];
  }
}

/**
 * Fetches only published blog posts, resolved with the specified language
 * and sorted in descending chronological order (newest first).
 */
export async function fetchPublicPosts(language: CmsLanguage): Promise<ResolvedBlogPost[]> {
  const posts = await fetchAdminPosts();
  return posts
    .filter((p) => p.published)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      title: pickLang(p.title, language),
      excerpt: pickLang(p.excerpt, language),
      content: pickLang(p.content, language),
      coverImage: p.coverImage || '',
      author: p.author || '',
      published: p.published,
      publishedAt: p.publishedAt,
    }))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/**
 * Fetches a single resolved blog post using its unique slug.
 */
export async function fetchPostBySlug(slug: string, language: CmsLanguage): Promise<ResolvedBlogPost | null> {
  const posts = await fetchAdminPosts();
  const post = posts.find((p) => p.slug === slug && p.published);
  if (!post) return null;
  return {
    id: post.id,
    slug: post.slug,
    title: pickLang(post.title, language),
    excerpt: pickLang(post.excerpt, language),
    content: pickLang(post.content, language),
    coverImage: post.coverImage || '',
    author: post.author || '',
    published: post.published,
    publishedAt: post.publishedAt,
  };
}

/**
 * Saves a blog post (creates a new entry or updates an existing one).
 * Returns the saved post's unique ID.
 */
export async function saveBlogPost(id: string | null, data: Omit<CmsBlogPost, 'id'>): Promise<string> {
  if (id) {
    const postRef = ref(database, `${BLOG_POSTS_PATH}/${id}`);
    await set(postRef, { ...data, id });
    return id;
  } else {
    const newPostRef = push(ref(database, BLOG_POSTS_PATH));
    const newId = newPostRef.key!;
    await set(newPostRef, { ...data, id: newId });
    return newId;
  }
}

/**
 * Deletes a blog post entry from the database.
 */
export async function deleteBlogPost(id: string): Promise<void> {
  const postRef = ref(database, `${BLOG_POSTS_PATH}/${id}`);
  await remove(postRef);
}
