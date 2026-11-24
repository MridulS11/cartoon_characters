import { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { HeroScene3D } from './components/HeroScene3D';
import { WorldsSection } from './components/WorldsSection';

export function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / Math.max(window.innerHeight * 0.85, 1))
      );
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="app-root">
      {/* Ultra-Minimal White Navigation */}
      <header className="minimal-nav">
        <a href="#top" className="minimal-nav__brand">
          studio.
        </a>
        <nav className="minimal-nav__links">
          <a href="#top">Home</a>
          <a href="#work">Work</a>
        </nav>
      </header>

      {/* SECTION 1: Minimalist Pure-White 3D Hero */}
      <main id="top" className="hero-section">
        <div
          className="hero-copy"
          style={{
            transform: `translate3d(0, ${-scrollProgress * 28}px, 0)`,
            opacity: Math.max(0.15, 1 - scrollProgress * 1.1),
          }}
        >
          <h1>Hey, welcome to my world.</h1>
          <p>Designing calm, playful experiences for the web.</p>
        </div>

        <div className="hero-stage-wrapper">
          <HeroScene3D scrollProgress={scrollProgress} />
        </div>

        <a href="#work" className="minimal-scroll-cue" aria-label="Scroll to selected work">
          <span>Scroll</span>
          <ArrowDown size={14} />
        </a>
      </main>

      {/* SECTION 2: Minimalist 3D Tilt Work Showcase */}
      <WorldsSection />
    </div>
  );
}

export default App;
