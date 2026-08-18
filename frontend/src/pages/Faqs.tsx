import React from 'react';
import { Accordion } from '../components/Accordion';
import { HelpCircle } from 'lucide-react';

export const Faqs: React.FC = () => {
  return (
    <div className="container fade-in">
      <header className="page-header">
        <h1>Frequently Asked Questions</h1>
        <div className="page-divider"></div>
        <p className="page-subtitle">Got questions? We've gathered some important details to help you plan your day with us.</p>
      </header>

      <section style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <HelpCircle size={48} color="var(--color-accent)" strokeWidth={1.5} />
      </section>

      <div className="accordion">
        <Accordion title="When should I RSVP by?">
          <p>Please submit your RSVP through this website by <strong>July 1st, 2027</strong>. This helps us finalize numbers and specific culinary choices with our caterers and venue coordinator.</p>
        </Accordion>

        <Accordion title="Can I bring a plus one?">
          <p>Due to the intimate capacity constraints of our historical venue, we are only able to accommodate the guests specifically listed on your invitation. When you logged in, you saw the precise names associated with your party. If you believe there is an error, please get in touch with us directly!</p>
        </Accordion>

        <Accordion title="What is the dress code?">
          <p>The dress code for our celebration is <strong>Formal / Black-Tie Optional</strong>. We suggest gentlemen wear a tuxedo or a dark suit and tie, and ladies wear a formal evening gown, elegant midi dress, or sophisticated pantsuit.</p>
        </Accordion>

        <Accordion title="Are children welcome?">
          <p>While we love all of the children in our lives, our wedding day will be an <strong>adults-only celebration</strong> (with the exception of infants under 12 months and children in the immediate bridal party). We hope this advance notice allows you to plan ahead and enjoy a wonderful night off with us!</p>
        </Accordion>

        <Accordion title="Where is the venue and how do I get there?">
          <p>Our ceremony and evening reception will both take place at the historic <strong>Somerset House</strong>, located on the Strand in London (WC2R 1LA).</p>
          <p style={{ marginTop: '0.8rem' }}><strong>By Tube:</strong> The nearest London Underground stations are Temple (District & Circle lines) and Covent Garden (Piccadilly line), both within a 5-minute walk.</p>
          <p style={{ marginTop: '0.8rem' }}><strong>By Rail:</strong> Charing Cross Station is a 7-minute walk away, providing direct national rail connections.</p>
        </Accordion>

        <Accordion title="Where do you recommend I stay?">
          <p>We have arranged discounted room blocks at a couple of fantastic hotels nearby for our traveling guests:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><strong>The Waldorf Hilton:</strong> A luxury option just a 3-minute walk from Somerset House. Mention our wedding party for a 15% discount.</li>
            <li><strong>Strand Palace Hotel:</strong> Excellent comfort and amenities directly on the Strand, a 4-minute walk. Use promo code <em>WEDDING2027</em>.</li>
            <li><strong>Premier Inn London Holborn:</strong> A great budget-friendly option located a 12-minute walk from the venue.</li>
          </ul>
        </Accordion>

        <Accordion title="What should I do if I have dietary requirements?">
          <p>Our catering team is fully equipped to accommodate a wide variety of allergies and dietary preferences (including gluten-free, vegan, vegetarian, and nut allergies). Please ensure you list your specific requirements for <em>each guest in your party</em> in the <strong>RSVP section</strong> of this website when you confirm your attendance.</p>
        </Accordion>

        <Accordion title="Are you registered for gifts?">
          <p>Your presence at our wedding is the absolute greatest gift we could ever ask for. However, if you would like to honor us with a gift, we will have a cards box at the reception, or you can contribute to our honeymoon fund as we plan our dream trip to Japan in autumn 2027.</p>
        </Accordion>
      </div>

      <div className="card" style={{ marginTop: '4rem', textAlign: 'center', backgroundColor: 'var(--color-blush)', borderColor: 'var(--color-border)' }}>
        <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Still have questions?</h3>
        <p style={{ color: 'var(--color-text-light)', fontSize: '0.95rem' }}>
          No problem at all! Feel free to reach out to either of us via phone, text, or WhatsApp, and we'll be happy to help.
        </p>
      </div>
    </div>
  );
};
