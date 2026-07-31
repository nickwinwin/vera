import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { blogArticles } from '../content';

export async function generateStaticParams() {
  return blogArticles.map((a) => ({ slug: a.slug }));
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-brand-warm-white">
      <nav className="border-b border-brand-border/60 bg-white/90 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
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

      <article className="max-w-3xl mx-auto px-6 py-20">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold text-brand-beige uppercase tracking-[0.1em] bg-brand-beige/10 px-3 py-1 rounded-full">
            {article.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-6 leading-tight">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-brand-muted mb-12 pb-8 border-b border-brand-border/60">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {article.date}</span>
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {article.readTime}</span>
        </div>
        <div className="prose prose-gray max-w-none">
          {article.body.split('\n').map((line, i) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return <h2 key={i} className="text-2xl font-bold text-brand-dark mt-10 mb-4">{line.replace(/\*\*/g, '')}</h2>;
            }
            if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
              return <li key={i} className="text-brand-secondary leading-relaxed ml-4 mb-1">{line}</li>;
            }
            if (line.startsWith('- ')) {
              return <li key={i} className="text-brand-secondary leading-relaxed ml-4 mb-1 list-disc">{line.replace('- ', '')}</li>;
            }
            if (line.trim() === '') return <div key={i} className="h-4" />;
            return <p key={i} className="text-brand-secondary leading-relaxed mb-4">{line}</p>;
          })}
        </div>
        <div className="mt-16 pt-8 border-t border-brand-border/60 text-center">
          <Link href="/register" className="inline-flex items-center gap-2 bg-brand-beige text-white px-8 py-3.5 rounded-full font-medium hover:bg-brand-beige/90 transition-all shadow-lg shadow-brand-beige/20">
            VERA 14 Tage kostenlos testen
          </Link>
        </div>
      </article>

      <footer className="border-t border-brand-border/60 py-12">
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