import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { blogArticles } from '../content';

export async function generateStaticParams() {
  return blogArticles.map((a) => ({ slug: a.slug }));
}

type BodyPart = { type: string; content?: string; checked?: boolean; key: number };

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) notFound();

  const bodyParts: BodyPart[] = article.body.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return { type: 'h2', content: line.replace(/\*\*/g, ''), key: i };
    }
    if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
      return { type: 'h3', content: line.replace(/\*\*/g, ''), key: i };
    }
    if (/^\d+\./.test(line)) {
      return { type: 'li', content: line, key: i };
    }
    if (line.startsWith('- [')) {
      const match = line.match(/- \[( |x)\]/);
      if (match) {
        return { type: 'checkbox', checked: match[1] === 'x', content: line.replace(/^- \[( |x)\]\s*/, ''), key: i };
      }
    }
    if (line.trim() === '') {
      return { type: 'spacer', key: i };
    }
    return { type: 'p', content: line, key: i };
  });

  return (
    <div className="min-h-screen bg-brand-warm-white">
      <nav className="border-b border-brand-border/60 bg-white/90 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-beige rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold">VERA</span>
          </Link>
          <Link href="/blog" className="text-sm text-brand-secondary hover:text-brand-dark flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Alle Artikel
          </Link>
        </div>
      </nav>

      {article.thumbnail && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-warm-white via-brand-warm-white/40 to-transparent" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white border border-brand-border/60 rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold text-brand-beige uppercase tracking-[0.1em] bg-brand-beige/10 px-3 py-1.5 rounded-full">
              {article.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-brand-muted mb-8 pb-8 border-b border-brand-border/60">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {article.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {article.readTime}</span>
          </div>
          <div className="prose prose-gray max-w-none">
            {bodyParts.map((part) => {
              switch (part.type) {
                case 'h2':
                  return <h2 key={part.key} className="text-2xl font-bold text-brand-dark mt-12 mb-4 font-display">{part.content ?? ''}</h2>;
                case 'h3':
                  return <h3 key={part.key} className="text-lg font-bold text-brand-dark mt-8 mb-3">{part.content ?? ''}</h3>;
                case 'li':
                  return <li key={part.key} className="text-brand-secondary leading-relaxed ml-5 mb-1.5 list-decimal">{(part.content ?? '').replace(/^\d+\.\s*/, '')}</li>;
                case 'checkbox':
                  return (
                    <div key={part.key} className="flex items-start gap-3 py-1">
                      <span className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${part.checked ? 'bg-brand-beige border-brand-beige' : 'border-brand-border'}`}>
                        {part.checked && <span className="text-white text-xs">✓</span>}
                      </span>
                      <span className="text-brand-secondary text-sm">{part.content}</span>
                    </div>
                  );
                case 'spacer':
                  return <div key={part.key} className="h-3" />;
                default:
                  return <p key={part.key} className="text-brand-secondary leading-relaxed mb-4 text-[15px]">{part.content ?? ''}</p>;
              }
            })}
          </div>
          <div className="mt-12 pt-8 border-t border-brand-border/60 text-center">
            <Link href="/register" className="inline-flex items-center gap-2 bg-brand-beige text-white px-8 py-3.5 rounded-full font-medium hover:bg-brand-beige/90 transition-all shadow-lg shadow-brand-beige/20">
              VERA 14 Tage kostenlos testen
            </Link>
          </div>
        </div>
      </article>

      <footer className="border-t border-brand-border/60 py-12 mt-20">
        <div className="max-w-3xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <Shield className="w-4 h-4 text-brand-beige" /> VERA NiSV-AUDIT
          </div>
          <div className="flex gap-6 text-sm text-brand-secondary">
            <Link href="/blog" className="hover:text-brand-beige">Blog</Link>
            <Link href="/faq" className="hover:text-brand-beige">FAQ</Link>
            <Link href="/impressum" className="hover:text-brand-beige">Impressum</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}