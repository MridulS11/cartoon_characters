import React, { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { MINIMAL_WORKS, type MinimalWorkItem } from '../data/squadData';

const MinimalTiltCard: React.FC<{ item: MinimalWorkItem }> = ({ item }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hovered: false });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - ny) * 10,
      ry: (nx - 0.5) * 12,
      hovered: true,
    });
  };

  const handleLeave = () => {
    setTilt({ rx: 0, ry: 0, hovered: false });
  };

  return (
    <article
      ref={cardRef}
      className="minimal-card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(
          2
        )}deg) translateZ(${tilt.hovered ? '8px' : '0px'})`,
      }}
    >
      <div className="minimal-card__meta" style={{ transform: 'translateZ(18px)' }}>
        <span className="minimal-card__index">{item.index}</span>
        <span className="minimal-card__year">{item.year}</span>
      </div>

      <div className="minimal-card__content" style={{ transform: 'translateZ(26px)' }}>
        <h3>{item.title}</h3>
        <p className="minimal-card__category">{item.category}</p>
        <p className="minimal-card__summary">{item.summary}</p>
      </div>

      <div className="minimal-card__footer" style={{ transform: 'translateZ(18px)' }}>
        <span>Explore</span>
        <ArrowUpRight size={16} />
      </div>
    </article>
  );
};

export const WorldsSection: React.FC = () => {
  return (
    <section id="work" className="minimal-section">
      <div className="minimal-section__inner">
        <div className="minimal-section__header">
          <span className="minimal-section__label">Selected Work</span>
          <h2>Ideas in motion.</h2>
        </div>

        <div className="minimal-grid">
          {MINIMAL_WORKS.map((item) => (
            <MinimalTiltCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
