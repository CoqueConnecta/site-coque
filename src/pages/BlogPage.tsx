import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { PageShell } from '../components/ui/PageShell';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Typography } from '../components/ui/Typography';
import type { PublicLayoutContextValue } from './PublicLayout';
import type { ResolvedBlogPost } from '../types/cms';
import { fetchPublicPosts } from '../services/blogService';
import { Calendar, User, ArrowRight } from 'lucide-react';

const TEXTS = {
  pt: {
    title: 'Blog da Connecta',
    description: 'Acompanhe as histórias de impacto, notícias e conquistas da nossa comunidade no Coque.',
    readMore: 'Ler matéria completa',
    noPosts: 'Nenhuma publicação encontrada no momento.',
    loading: 'Buscando histórias...',
    error: 'Não foi possível carregar as publicações. Por favor, tente novamente mais tarde.',
    by: 'Por',
  },
  en: {
    title: 'Connecta Blog',
    description: 'Follow the stories of impact, news, and achievements of our community in Coque.',
    readMore: 'Read full story',
    noPosts: 'No publications found at the moment.',
    loading: 'Searching for stories...',
    error: 'Could not load publications. Please try again later.',
    by: 'By',
  },
};

export default function BlogPage() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const [posts, setPosts] = useState<ResolvedBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const t = TEXTS[language] || TEXTS.pt;

  useEffect(() => {
    let isMounted = true;
    fetchPublicPosts(language)
      .then((data) => {
        if (isMounted) {
          setPosts(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching blog posts:', err);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [language]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <PageShell>
      <SectionHeader
        title={t.title}
        description={t.description}
        divider
      />

      {isLoading ? (
        /* Skeletons */
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse space-y-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
              <div className="aspect-video w-full rounded-xl bg-gray-200" />
              <div className="h-4 w-1/4 rounded bg-gray-200" />
              <div className="h-6 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-5/6 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      ) : hasError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-[color:var(--color-accent-brown)]">
          <Typography variant="body" className="font-semibold">
            {t.error}
          </Typography>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center text-gray-500">
          <Typography variant="body">{t.noPosts}</Typography>
        </div>
      ) : (
        /* Grid of Posts */
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-accent-peach)] hover:shadow-md"
            >
              {/* Cover Image */}
              <Link to={`/blog/${post.slug}`} className="aspect-video w-full overflow-hidden bg-gray-100">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-tag-bg)] text-[color:var(--color-accent-peach)]">
                    <Typography variant="h2" className="opacity-30">
                      Coque
                    </Typography>
                  </div>
                )}
              </Link>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6">
                {/* Meta details */}
                <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  {post.author && (
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{post.author}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <Typography
                  variant="h3"
                  className="mb-3 text-xl font-bold text-[color:var(--color-tag-bg)] transition-colors group-hover:text-[color:var(--color-surface-orange)]"
                >
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </Typography>

                {/* Excerpt */}
                <Typography variant="body" className="mb-6 line-clamp-3 text-sm text-gray-600 leading-relaxed flex-1">
                  {post.excerpt || post.content.substring(0, 150).replace(/[#*`_[\]]/g, '') + '...'}
                </Typography>

                {/* Footer link */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--color-surface-orange)] hover:text-[color:var(--color-link-hover)] transition-colors"
                  >
                    <span>{t.readMore}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}
