import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/cn';
import type { CmsLanguage, ResolvedBlogPost } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { FadeIn } from '../../ui/FadeIn';
import { Button } from '../../ui/Button';
import { SectionHeading } from '../../composites/SectionHeading';
import { ROUTES } from '../../../lib/constants';
import { fetchPublicPosts } from '../../../services/blogService';
import { Calendar, ArrowRight } from 'lucide-react';

export interface BlogTeaserSectionProps extends React.HTMLAttributes<HTMLElement> {
  language: CmsLanguage;
}

const TEXTS = {
  pt: {
    headline: 'Últimas do Blog',
    subtitle: 'Histórias de impacto, conquistas e o dia a dia da nossa atuação no Coque.',
    readMore: 'Ler matéria',
    allPosts: 'Ver todas as postagens →',
  },
  en: {
    headline: 'Latest from Blog',
    subtitle: 'Stories of impact, achievements, and our day-to-day work in Coque.',
    readMore: 'Read story',
    allPosts: 'View all posts →',
  },
};

export const BlogTeaserSection = ({ language, className, ...props }: BlogTeaserSectionProps) => {
  const [posts, setPosts] = useState<ResolvedBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const t = TEXTS[language] || TEXTS.pt;

  useEffect(() => {
    let isMounted = true;
    fetchPublicPosts(language)
      .then((data) => {
        if (isMounted) {
          // Keep only the 3 most recent posts
          setPosts(data.slice(0, 3));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching teaser posts:', err);
        if (isMounted) {
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
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading || posts.length === 0) {
    return null; // Don't show the teaser section if loading or empty
  }

  return (
    <section
      id="blog-teaser"
      className={cn('w-full bg-white py-20 sm:py-28 border-t border-gray-100', className)}
      {...props}
    >
      <Block>
        <div className="flex flex-col gap-12">
          {/* Header */}
          <FadeIn className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <SectionHeading
              headline={t.headline}
              subtitle={t.subtitle}
              size="md"
              tone="default"
            />
            <Button
              href={ROUTES.blog}
              variant="unstyled"
              className="text-[color:var(--color-surface-orange)] hover:text-[color:var(--color-link-hover)] font-bold text-sm sm:text-base flex items-center gap-2 group shrink-0 transition-colors"
            >
              <span>{t.allPosts}</span>
            </Button>
          </FadeIn>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {posts.map((post, idx) => (
              <FadeIn key={post.id} delay={idx * 100}>
                <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-accent-peach)] hover:shadow-sm">
                  {/* Cover */}
                  <Link to={`${ROUTES.blog}/${post.slug}`} className="aspect-video w-full overflow-hidden bg-gray-100 block">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-tag-bg)] text-[color:var(--color-accent-peach)]">
                        <span className="text-lg font-bold opacity-30">Coque</span>
                      </div>
                    )}
                  </Link>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Date */}
                    <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 text-base sm:text-lg font-bold text-[color:var(--color-tag-bg)] transition-colors group-hover:text-[color:var(--color-surface-orange)] line-clamp-2">
                      <Link to={`${ROUTES.blog}/${post.slug}`}>{post.title}</Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="mb-5 line-clamp-3 text-xs sm:text-sm text-gray-600 leading-relaxed flex-1">
                      {post.excerpt || post.content.substring(0, 100).replace(/[#*`_[\]]/g, '') + '...'}
                    </p>

                    {/* Read more button */}
                    <Link
                      to={`${ROUTES.blog}/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[color:var(--color-surface-orange)] hover:text-[color:var(--color-link-hover)] transition-colors mt-auto group/link"
                    >
                      <span>{t.readMore}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </Block>
    </section>
  );
};

BlogTeaserSection.displayName = 'BlogTeaserSection';
