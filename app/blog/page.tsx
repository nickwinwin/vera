import Link from 'next/link';
import { Shield, ArrowRight, Clock, Calendar } from 'lucide-react';
import { blogArticles } from './content';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-brand-warm-white">
      <nav className="border-b border-brand-border/60 bg-white/90 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-beige rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold">VERA</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/faq" className="text-sm text-brand-secondary hover:text-brand-dark">FAQ</Link>
            <Link href="/register" className="btn-primary text-sm">Starten</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold text-brand-beige uppercase tracking-[0.2em] mb-4">Blog</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Wissen für Ihr Studio</h1>
          <p className="text-lg text-brand-secondary/80 max-w-xl mx-auto">
            NiSV-Compliance, Digitalisierung und Best Practices für Kosmetikstudios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group bg-white border border-brand-border/60 rounded-2xl p-8 hover:border-brand-beige/30 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-brand-beige uppercase tracking-[0.1em] bg-brand-beige/10 px-3 py-1 rounded-full">
                  {article.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-beige transition-colors">
                {article.title}
              </h2>
              <p className="text-brand-secondary text-sm leading-relaxed mb-6">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-brand-muted">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                </div>
                <span className="text-brand-beige font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Lesen <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-brand-border/60 py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <Shield className="w-4 h-4 text-brand-beige" /> VERA NiSV-AUDIT
          </div>
          <div className="flex gap-6 text-sm text-brand-secondary">
            <Link href="/faq" className="hover:text-brand-beige">FAQ</Link>
            <Link href="/impressum" className="hover:text-brand-beige">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-brand-beige">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}