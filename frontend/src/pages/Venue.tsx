import React from 'react';
import { MapPin, Car, Train, Home, Phone, Compass } from 'lucide-react';

export const Venue: React.FC = () => {
  const accommodations = [
    {
      name: "The Ship Inn & Cottages",
      distance: "10 min drive (Mawgan / Porthleven)",
      type: "Traditional Cornish Inn & Lodging",
      phone: "+44 1326 563411",
      description: "A gorgeous, cosy coastal inn offering excellent local seafood and charming boutique room stays nearby."
    },
    {
      name: "Polgrean Farm Coastal Cabins",
      distance: "On-site / Walking distance",
      type: "On-site Glamping & Cabins",
      phone: "+44 1326 572345",
      description: "Charming coastal cabins and luxury glamping tents directly on the farm premises. Limited availability, so book early!"
    },
    {
      name: "The Halzephron Inn",
      distance: "5 min drive (Gunwalloe)",
      type: "Historic coastal hotel",
      phone: "+44 1326 240406",
      description: "A beautiful 500-year-old inn situated on the cliffs of the Lizard Peninsula, with panoramic sea views and comfortable rooms."
    }
  ];

  return (
    <div className="container fade-in">
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
          <MapPin size={32} />
        </div>
        <h1>The Venue</h1>
        <div className="page-divider"></div>
        <p className="page-subtitle">We are getting married at the breathtaking Polgrean Farm in Gunwalloe, Cornwall.</p>
      </header>

      {/* Hero Venue Showcase */}
      <section className="card" style={{ marginBottom: '4rem', padding: '0', overflow: 'hidden' }}>
        <div style={{ 
          height: '250px', 
          background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-blush) 100%)', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          color: 'var(--color-primary)',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px', border: '1px dashed var(--color-accent)', borderRadius: '8px', opacity: 0.5 }}></div>
          <Compass size={48} strokeWidth={1.2} style={{ marginBottom: '1rem', color: 'var(--color-accent)' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: '#ffffff', textShadow: '1px 1px 10px rgba(0,0,0,0.15)', textAlign: 'center', padding: '0 1rem' }}>
            Polgrean Farm
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', letterSpacing: '0.1em', color: '#ffffff', textTransform: 'uppercase', textShadow: '1px 1px 5px rgba(0,0,0,0.1)' }}>
            Gunwalloe, Cornwall
          </p>
        </div>

        <div style={{ padding: '2.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>A Coastal Countryside Celebration</h3>
          <p style={{ color: 'var(--color-text-light)', fontSize: '1.05rem', maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>
            Nestled on the majestic cliffs of the Lizard Peninsula, Polgrean Farm offers panoramic sea views overlooking Mount's Bay, surrounded by wild Cornish wildflower meadows and rolling fields. It is a peaceful, magical setting where the countryside meets the ocean.
          </p>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            backgroundColor: 'var(--color-blush)', 
            padding: '0.6rem 1.2rem', 
            borderRadius: '30px',
            color: 'var(--color-primary)',
            fontWeight: 600,
            fontSize: '0.95rem'
          }}>
            <MapPin size={16} />
            <span>Polgrean Farm, Gunwalloe, Helston, Cornwall, TR12 7QH</span>
          </div>
        </div>
      </section>

      {/* Travel & Directions Grid */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', textAlign: 'center', marginBottom: '2.5rem', color: 'var(--color-primary)' }}>
          Travel & Directions
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--color-primary)' }}>
              <Car size={24} />
              <h3 style={{ fontSize: '1.4rem' }}>Arriving By Car</h3>
            </div>
            <div className="page-divider" style={{ margin: '0', width: '45px' }}></div>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
              Polgrean Farm is located just outside the village of Gunwalloe on the Lizard Peninsula, approximately 10 minutes south of Helston.
            </p>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
              <strong>From Helston:</strong> Take the A3083 south towards Lizard/Cury. Turn right onto the signposted lane for Gunwalloe/Church Cove, and follow the road for approximately 2.5 miles. Look out for our wedding signage directing you into the main farm entrance.
            </p>
            <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', backgroundColor: 'var(--color-blush)', padding: '0.6rem 1rem', borderRadius: '6px' }}>
              🚗 On-site parking is free and abundant in the designated grass field adjacent to the celebration barn.
            </p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--color-primary)' }}>
              <Train size={24} />
              <h3 style={{ fontSize: '1.4rem' }}>Public Transport & Taxis</h3>
            </div>
            <div className="page-divider" style={{ margin: '0', width: '45px' }}></div>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
              For guests travelling from further away, train connections run regularly down into West Cornwall.
            </p>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
              <strong>By Train:</strong> The nearest major railway station is <strong>Redruth Railway Station</strong> or <strong>Penzance Railway Station</strong> (approx. 35-40 minutes drive from the venue). Directly connected to the Great Western Railway line.
            </p>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
              <strong>Local Taxis:</strong> As Gunwalloe is a rural coastal location, Uber is not available. We highly recommend booking local taxis <strong>well in advance</strong> of the wedding weekend:
            </p>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--color-text-light)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <li>Helston Taxis: +44 1326 562211</li>
              <li>Lizard Peninsula Cars: +44 1326 241421</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Accommodations section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', textAlign: 'center', marginBottom: '1.2rem', color: 'var(--color-primary)' }}>
          Where to Stay
        </h2>
        <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          Cornwall is a highly popular destination, so we suggest reserving your accommodation as early as possible.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
          {accommodations.map((hotel, index) => (
            <div key={index} className="card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', padding: '2rem' }}>
              <div style={{ flex: '1 1 500px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>
                  <Home size={18} />
                  <h3 style={{ fontSize: '1.3rem' }}>{hotel.name}</h3>
                </div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>
                  {hotel.type} • {hotel.distance}
                </span>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>{hotel.description}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', backgroundColor: 'var(--color-blush)', padding: '0.5rem 1rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 600 }}>
                <Phone size={14} />
                <span>{hotel.phone}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
