import { useEffect, useState } from 'react';
import { useParams, useOutletContext, Link, useNavigate } from 'react-router-dom';
import { PageShell } from '../components/ui/PageShell';
import { Typography } from '../components/ui/Typography';
import { MarkdownContent } from '../components/ui/MarkdownContent';
import type { PublicLayoutContextValue } from './PublicLayout';
import type { ResolvedBlogPost } from '../types/cms';
import { fetchPostBySlug } from '../services/blogService';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const TEXTS = {
  pt: {
    back: 'Voltar para o blog',
    loading: 'Carregando publicação...',
    notFound: 'Publicação não encontrada.',
    by: 'Por',
    ctaTitle: 'Quer fazer parte dessa transformação?',
    ctaDesc: 'O Coque Connecta é mantido por pessoas como você. Sua doação apoia a educação, cultura e tecnologia de crianças e jovens no Coque.',
    ctaButton: 'APOIAR AGORA',
    ctaHref: 'https://benfeitoria.com/projeto/coqueconnecta',
  },
  en: {
    back: 'Back to blog',
    loading: 'Loading publication...',
    notFound: 'Publication not found.',
    by: 'By',
    ctaTitle: 'Want to be part of this transformation?',
    ctaDesc: 'Coque Connecta is sustained by people like you. Your donation supports education, culture, and technology for children and youth in Coque.',
    ctaButton: 'SUPPORT NOW',
    ctaHref: 'https://benfeitoria.com/projeto/coqueconnecta',
  },
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const navigate = useNavigate();

  const [post, setPost] = useState<ResolvedBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const t = TEXTS[language] || TEXTS.pt;

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;

    fetchPostBySlug(slug, language)
      .then((data) => {
        if (isMounted) {
          setPost(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching blog post details:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug, language]);

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

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-24 text-[color:var(--color-tag-bg)] animate-pulse">
          <Typography variant="body" className="font-semibold text-lg">
            {t.loading}
          </Typography>
        </div>
      </PageShell>
    );
  }

  if (!post) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl text-center py-16 space-y-6">
          <Typography variant="h2" className="text-[color:var(--color-tag-bg)]">
            {t.notFound}
          </Typography>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-surface-orange)] px-6 py-2.5 text-sm font-bold text-white hover:bg-[color:var(--color-link-hover)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t.back}</span>
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="max-w-[800px] px-4 sm:px-6">
      {/* Back button */}
      <Link
        to="/blog"
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[color:var(--color-surface-orange)] hover:text-[color:var(--color-link-hover)] transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>{t.back}</span>
      </Link>

      <article className="space-y-8">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="aspect-[21/9] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-sm">
            <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        {/* Title */}
        <Typography variant="h1" className="text-3xl sm:text-4xl font-extrabold text-[color:var(--color-tag-bg)] leading-tight">
          {post.title}
        </Typography>

        {/* Metadados */}
        <div className="flex flex-wrap items-center gap-6 border-y border-gray-200 py-4 text-sm text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[color:var(--color-surface-orange)]" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          {post.author && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[color:var(--color-surface-orange)]" />
              <span>{post.author}</span>
            </div>
          )}
        </div>

        {/* Rich Text Markdown Content */}
        <div className="prose max-w-none text-gray-700 leading-relaxed text-base sm:text-lg space-y-6 pt-2">
          <MarkdownContent content={post.content} />
        </div>
      </article>

      {/* CTA Box (Premium Donation Box) */}
      <section className="mt-16 rounded-2xl bg-[color:var(--color-tag-bg)] p-8 sm:p-12 text-center text-[color:var(--color-tag-text)] shadow-xl relative overflow-hidden">
        {/* Subtle orange tag styling */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[color:var(--color-surface-orange)]" />
        
        <div className="relative z-10 mx-auto max-w-xl space-y-6">
          <Typography variant="h2" className="text-2xl sm:text-3xl font-extrabold text-[color:var(--color-accent-peach)]">
            {t.ctaTitle}
          </Typography>
          <Typography variant="body" tone="onDark" className="text-sm sm:text-base opacity-90 leading-relaxed">
            {t.ctaDesc}
          </Typography>
          <div className="pt-4">
            <a
              href={t.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-[color:var(--color-surface-orange)] px-8 py-3.5 text-sm font-extrabold text-white shadow-md hover:bg-white hover:text-[color:var(--color-tag-bg)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer tracking-wider"
            >
              {t.ctaButton}
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
