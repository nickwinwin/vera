import Link from 'next/link';
import { Shield, ArrowRight, Clock, Calendar } from 'lucide-react';
import { blogArticles } from './content';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-brand-warm-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-brand-border/30">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex justify-between h-20 items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-28 h-10 relative">
                <svg className="w-full h-full text-brand-beige" viewBox="0 0 28 10" fill="none"><text x="0" y="9" fontSize="10" fontWeight="bold" fill="currentColor">VERA</text></svg>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-10">
              <Link href="/#features" className="text-sm text-brand-secondary hover:text-brand-dark transition-colors tracking-wide">Features</Link>
              <Link href="/#pricing" className="text-sm text-brand-secondary hover:text-brand-dark transition-colors tracking-wide">Preise</Link>
              <Link href="/faq" className="text-sm text-brand-secondary hover:text-brand-dark transition-colors tracking-wide">FAQ</Link>
              <Link href="/blog" className="text-sm text-brand-secondary hover:text-brand-dark transition-colors tracking-wide">Blog</Link>
              <div className="flex items-center gap-6">
                <Link href="/login" className="text-sm text-brand-secondary hover:text-brand-dark transition-colors tracking-wide">Login</Link>
                <Link href="/register" className="btn-primary shadow-sm shadow-brand-beige/20">Starten</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold text-brand-beige uppercase tracking-[0.2em] mb-4">Blog</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Wissen für Ihr Studio</h1>
          <p className="text-lg text-brand-secondary/80 max-w-xl mx-auto">
            NiSV-Compliance, Digitalisierung und Best Practices für Kosmetikstudios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogArticles.map((article) => (
            <Link
              key={article.slug}
              href={"/blog/" + article.slug}
              className="group bg-white border border-brand-border/60 rounded-2xl overflow-hidden hover:border-brand-beige/30 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden bg-brand-warm-white">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute top-4 left-4 text-xs font-bold text-white uppercase tracking-[0.1em] bg-brand-beige/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {article.category}
                </span>
              </div>
              <div className="p-7">
                <h2 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-beige transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-brand-secondary text-sm leading-relaxed mb-6 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-brand-muted">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
                  </div>
                  <span className="text-brand-beige font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Lesen <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-brand-border/60 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
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


