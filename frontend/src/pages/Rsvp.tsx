import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/ProtectedRoute';
import { MemberRSVP, RSVP } from '../types';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export const Rsvp: React.FC = () => {
  const { guest, token } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setLoadingSubmit] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [existingRsvp, setExistingRsvp] = useState<RSVP | null>(null);

  // Form states
  const [attending, setAttending] = useState<boolean>(true);
  const [membersRSVP, setMembersRSVP] = useState<MemberRSVP[]>([]);
  const [message, setMessage] = useState('');
  const [songRequest, setSongRequest] = useState('');

  // Sample meal options
  const starters = [
    { value: 'tart', label: 'Goat Cheese & Caramelised Onion Tart (v)' },
    { value: 'soup', label: 'Roasted Tomato & Basil Soup (vg, gf)' },
    { value: 'salmon', label: 'Oak Smoked Salmon with Capers & Dill' }
  ];

  const mains = [
    { value: 'beef', label: 'Slow-Cooked Beef Featherblade with Dauphinoise Potatoes' },
    { value: 'seabass', label: 'Pan-Roasted Seabass with Herb Crushed Potatoes (gf)' },
    { value: 'risotto', label: 'Wild Mushroom & Truffle Risotto (v, vg, gf)' }
  ];

  const desserts = [
    { value: 'fondant', label: 'Warm Chocolate Fondant with Vanilla Bean Ice Cream' },
    { value: 'sorbet', label: 'Exotic Raspberry & Passion Fruit Sorbet (vg, gf)' },
    { value: 'tart-dessert', label: 'Classic Lemon Tart with Clotted Cream' }
  ];

  useEffect(() => {
    const fetchRsvp = async () => {
      if (!token || !guest) return;

      try {
        const response = await fetch('/api/rsvp', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.rsvp) {
          const rsvp: RSVP = data.rsvp;
          setExistingRsvp(rsvp);
          setAttending(rsvp.attending);
          setMessage(rsvp.message);
          setSongRequest(rsvp.songRequest);
          
          // Map fetched RSVP members, ensuring any missing guest party member gets appended
          const mappedMembers = guest.members.map(name => {
            const match = rsvp.membersRSVP.find(m => m.memberName === name);
            return match || { memberName: name, attending: true, mealChoice: starters[0].value + '|' + mains[0].value + '|' + desserts[0].value, dietary: '' };
          });
          setMembersRSVP(mappedMembers);
        } else {
          // Initialize empty RSVP state based on guest names
          const initialMembers = guest.members.map(name => ({
            memberName: name,
            attending: true,
            mealChoice: `${starters[0].value}|${mains[0].value}|${desserts[0].value}`,
            dietary: '',
          }));
          setMembersRSVP(initialMembers);
        }
      } catch (err) {
        console.error('Error fetching RSVP data:', err);
        setErrorMsg('Failed to load your RSVP details. You can still fill out the form below.');
      } finally {
        setLoading(false);
      }
    };

    fetchRsvp();
  }, [token, guest]);

  const handleMemberAttendingChange = (index: number, isAttending: boolean) => {
    const updated = [...membersRSVP];
    updated[index].attending = isAttending;
    setMembersRSVP(updated);
  };

  const handleMemberMealChange = (index: number, course: 'starter' | 'main' | 'dessert', value: string) => {
    const updated = [...membersRSVP];
    const currentMeals = (updated[index].mealChoice || '||').split('|');
    
    let starter = currentMeals[0] || starters[0].value;
    let main = currentMeals[1] || mains[0].value;
    let dessert = currentMeals[2] || desserts[0].value;

    if (course === 'starter') starter = value;
    if (course === 'main') main = value;
    if (course === 'dessert') dessert = value;

    updated[index].mealChoice = `${starter}|${main}|${dessert}`;
    setMembersRSVP(updated);
  };

  const handleMemberDietaryChange = (index: number, dietary: string) => {
    const updated = [...membersRSVP];
    updated[index].dietary = dietary;
    setMembersRSVP(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    // If overall party is not attending, mark all members as not attending
    const finalMembersRSVP = membersRSVP.map(member => ({
      ...member,
      attending: attending ? member.attending : false
    }));

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          attending,
          membersRSVP: finalMembersRSVP,
          message,
          songRequest
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit RSVP');
      }

      setSuccessMsg('Your RSVP has been saved successfully! Thank you.');
      setExistingRsvp(data.rsvp);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0', color: 'var(--color-primary)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem' }}>Loading RSVP details...</div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <header className="page-header">
        <h1>RSVP</h1>
        <div className="page-divider"></div>
        <p className="page-subtitle">Please confirm your attendance by July 1st, 2027. We hope to celebrate with you!</p>
      </header>

      {successMsg && (
        <div className="card" style={{ backgroundColor: '#E2ECD8', borderColor: '#C3D9B5', color: '#3A4D2E', marginBottom: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <CheckCircle size={28} />
          <div>
            <h3 style={{ color: '#3A4D2E', marginBottom: '0.2rem' }}>RSVP Saved</h3>
            <p>{successMsg}</p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="card" style={{ backgroundColor: '#F8DADA', borderColor: '#F1B5B5', color: '#721C24', marginBottom: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <AlertCircle size={28} />
          <div>
            <h3 style={{ color: '#721C24', marginBottom: '0.2rem' }}>Error</h3>
            <p>{errorMsg}</p>
          </div>
        </div>
      )}

      {existingRsvp && !successMsg && (
        <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem 2rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Info size={24} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>You have already submitted an RSVP</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                Your response is captured. You can update your selections below at any time.
              </p>
            </div>
          </div>
          <span className={`rsvp-status-badge ${existingRsvp.attending ? 'attending' : 'declined'}`}>
            {existingRsvp.attending ? 'Attending' : 'Declined'}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Overall Attendance Toggle */}
        <section className="card rsvp-header-card">
          <h2 style={{ marginBottom: '1rem' }}>Will you be joining us?</h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem' }}>
            Responding for: <strong style={{ color: 'var(--color-primary)' }}>{guest?.name}</strong> (Party size: {guest?.members.length})
          </p>
          
          <div className="rsvp-selection">
            <button
              type="button"
              className={`rsvp-btn-choice ${attending ? 'selected' : ''}`}
              onClick={() => setAttending(true)}
            >
              Joyfully Accept
            </button>
            <button
              type="button"
              className={`rsvp-btn-choice ${!attending ? 'selected' : ''}`}
              onClick={() => setAttending(false)}
            >
              Regretfully Decline
            </button>
          </div>
        </section>

        {/* Guest Party Subforms - only show if attending */}
        {attending && (
          <section className="card">
            <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              Meal & Attendance Preferences
            </h2>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Please specify the attendance status and custom menu selections for each individual guest in your party.
            </p>

            {membersRSVP.map((member, index) => {
              const currentMeals = (member.mealChoice || '||').split('|');
              const starterValue = currentMeals[0] || starters[0].value;
              const mainValue = currentMeals[1] || mains[0].value;
              const dessertValue = currentMeals[2] || desserts[0].value;

              return (
                <div key={index} className="member-rsvp-card">
                  <h3 className="member-rsvp-name">{member.memberName}</h3>
                  
                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ color: 'var(--color-primary)' }}>Is {member.memberName} attending?</label>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.3rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`member-attending-${index}`}
                          checked={member.attending === true}
                          onChange={() => handleMemberAttendingChange(index, true)}
                        />
                        Yes, attending
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`member-attending-${index}`}
                          checked={member.attending === false}
                          onChange={() => handleMemberAttendingChange(index, false)}
                        />
                        No, cannot attend
                      </label>
                    </div>
                  </div>

                  {member.attending && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
                      
                      {/* Starters */}
                      <div className="form-group">
                        <label htmlFor={`starter-${index}`}>Starter Option</label>
                        <select
                          id={`starter-${index}`}
                          className="input-control"
                          value={starterValue}
                          onChange={(e) => handleMemberMealChange(index, 'starter', e.target.value)}
                        >
                          {starters.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Mains */}
                      <div className="form-group">
                        <label htmlFor={`main-${index}`}>Main Course Option</label>
                        <select
                          id={`main-${index}`}
                          className="input-control"
                          value={mainValue}
                          onChange={(e) => handleMemberMealChange(index, 'main', e.target.value)}
                        >
                          {mains.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Desserts */}
                      <div className="form-group">
                        <label htmlFor={`dessert-${index}`}>Dessert Option</label>
                        <select
                          id={`dessert-${index}`}
                          className="input-control"
                          value={dessertValue}
                          onChange={(e) => handleMemberMealChange(index, 'dessert', e.target.value)}
                        >
                          {desserts.map(d => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Dietary text area */}
                      <div className="form-group">
                        <label htmlFor={`dietary-${index}`}>Dietary Requirements & Allergies</label>
                        <input
                          id={`dietary-${index}`}
                          type="text"
                          className="input-control"
                          placeholder="e.g. Vegetarian, Gluten-Free, Nut Allergies, or None"
                          value={member.dietary}
                          onChange={(e) => handleMemberDietaryChange(index, e.target.value)}
                        />
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* Global Notes (Message and Song Request) */}
        <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2>A Little Extra Fun</h2>
          <div className="page-divider" style={{ margin: '0 0 1rem 0', width: '40px' }}></div>
          
          <div className="form-group">
            <label htmlFor="song">Song Request</label>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '0.4rem' }}>
              What track will get your party onto the dancefloor during the evening reception?
            </p>
            <input
              id="song"
              type="text"
              className="input-control"
              placeholder="Song Title - Artist"
              value={songRequest}
              onChange={(e) => setSongRequest(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message to the Couple</label>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginBottom: '0.4rem' }}>
              Leave us a note, well-wish, advice, or tell us what you are looking forward to most!
            </p>
            <textarea
              id="message"
              className="input-control dietary-textarea"
              placeholder="Your warm messages..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </section>

        {/* Submit Button */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-accent"
            style={{ padding: '1rem 3rem', fontSize: '1.05rem', minWidth: '250px' }}
            disabled={submitting}
          >
            {submitting ? 'Saving RSVP...' : 'Submit RSVP Response'}
          </button>
        </div>
      </form>
    </div>
  );
};
