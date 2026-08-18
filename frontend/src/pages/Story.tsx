import React from 'react';
import { Heart, Camera, Coffee, Sparkles, MapPin } from 'lucide-react';

export const Story: React.FC = () => {
  const milestones = [
    {
      date: "September 14, 2021",
      title: "Where it all began",
      icon: <Coffee size={18} />,
      description: "We bumped into each other at a quiet, independent coffee shop on a rainy Tuesday afternoon. After accidentally swapping our takeaway orders, a simple conversation turned into a three-hour chat about travel, music, and our favorite books."
    },
    {
      date: "October 3, 2021",
      title: "Our First Official Date",
      icon: <Heart size={18} />,
      description: "A stroll through the Royal Botanic Gardens, followed by an amazing plate of fresh pasta in a cosy local Italian bistro. We both knew then that this was the start of something incredibly special."
    },
    {
      date: "August 12, 2023",
      title: "Adopting our furry friend",
      icon: <Sparkles size={18} />,
      description: "We welcomed Winston, our energetic golden retriever, into our family. He quickly became the center of our universe and taught us the true meaning of teamwork and unconditional love."
    },
    {
      date: "December 24, 2025",
      title: "The Proposal",
      icon: <MapPin size={18} />,
      description: "Under the beautiful winter lights at the summit of a scenic peak in Switzerland, surrounded by snow-covered pines, he dropped to one knee and asked the easiest question she had ever had to answer. (She said YES!)"
    }
  ];

  const galleryItems = [
    { label: "Our first trip together", caption: "Paris, 2022" },
    { label: "Adopting Winston", caption: "Summer, 2023" },
    { label: "Scenic hikes", caption: "Lake District, 2024" },
    { label: "The moment she said yes!", caption: "Switzerland, 2025" }
  ];

  return (
    <div className="container fade-in">
      <header className="page-header">
        <h1>Our Story</h1>
        <div className="page-divider"></div>
        <p className="page-subtitle">A collection of milestones, adventures, and laughs that bring us to our wedding day.</p>
      </header>

      <section className="card" style={{ marginBottom: '4rem', padding: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Growing Together
        </h2>
        <p style={{ color: 'var(--color-text-light)', fontSize: '1.05rem', margin: '0 auto 1.5rem auto', maxWidth: '800px', textAlign: 'center' }}>
          Over the past five years, we have built a beautiful life filled with deep conversations, spontaneous road trips, and countless shared dreams. Through every chapter, we have supported and inspired each other to be our truest, best selves.
        </p>
        <p style={{ color: 'var(--color-text-light)', fontSize: '1.05rem', margin: '0 auto auto auto', maxWidth: '800px', textAlign: 'center' }}>
          Today, we stand on the threshold of our greatest adventure yet: marriage. We are incredibly excited to exchange our vows, make lifelong promises, and celebrate this special milestone with you—our dearest family and friends.
        </p>
      </section>

      {/* Interactive Photo Gallery Placeholders */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', textAlign: 'center', marginBottom: '2.5rem', color: 'var(--color-primary)' }}>
          Memory Gallery
        </h2>
        
        <div className="photo-grid">
          {galleryItems.map((item, index) => (
            <div key={index} className="photo-card">
              <div className="photo-placeholder">
                <Camera size={36} strokeWidth={1.5} />
                <span>{item.label}</span>
              </div>
              <div className="photo-caption">{item.caption}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Relationship Timeline */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
          Our Journey
        </h2>
        <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          The moments we cherish, mapped along the timeline of our lives together.
        </p>

        <div className="timeline">
          {milestones.map((item, index) => {
            const sideClass = index % 2 === 0 ? 'timeline-item-left' : 'timeline-item-right';
            return (
              <div key={index} className={`timeline-item ${sideClass}`}>
                <div className="timeline-circle"></div>
                <div className="timeline-content">
                  <span className="timeline-date">{item.date}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                    {item.icon}
                    <h3>{item.title}</h3>
                  </div>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
