import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/ProtectedRoute';
import { Guest, RSVP } from '../types';
import { 
  Users, CheckCircle2, XCircle, Percent, Plus, Trash2, 
  Music, MessageSquare, AlertCircle, PlusCircle, MinusCircle, Crown
} from 'lucide-react';

interface DashboardData {
  guests: Guest[];
  rsvps: RSVP[];
}

export const Admin: React.FC = () => {
  const { token, guest: currentAdmin } = useAuth();
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rsvps' | 'guests'>('rsvps');

  // New Guest Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPartyName, setNewPartyName] = useState('');
  const [newMembers, setNewMembers] = useState<string[]>(['']);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Access Denied');
      }
      setData(resData);
    } catch (err: any) {
      setError(err.message || 'An error occurred fetching admin statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  // Dynamic Members handler for guest creator
  const handleAddMemberField = () => {
    setNewMembers([...newMembers, '']);
  };

  const handleRemoveMemberField = (index: number) => {
    if (newMembers.length === 1) return;
    const updated = [...newMembers];
    updated.splice(index, 1);
    setNewMembers(updated);
  };

  const handleMemberNameChange = (index: number, value: string) => {
    const updated = [...newMembers];
    updated[index] = value;
    setNewMembers(updated);
  };

  const handleAddGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setFormSubmitting(true);

    const filteredMembers = newMembers.map(m => m.trim()).filter(m => m !== '');

    if (!newUsername.trim() || !newPassword.trim() || !newPartyName.trim() || filteredMembers.length === 0) {
      setFormError('Please fill in all fields. Guests must have at least one party member.');
      setFormSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: newUsername.trim(),
          password: newPassword.trim(),
          name: newPartyName.trim(),
          members: filteredMembers
        })
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to create guest.');
      }

      setFormSuccess(`Guest account "${newPartyName}" created successfully!`);
      setNewUsername('');
      setNewPassword('');
      setNewPartyName('');
      setNewMembers(['']);
      setShowAddForm(false);
      
      // Refresh list
      fetchDashboardData();
    } catch (err: any) {
      setFormError(err.message || 'An error occurred.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteGuest = async (username: string, friendlyName: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete "${friendlyName}"? This will permanently delete their account and any submitted RSVP.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/guests/${username}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to delete guest.');
      }

      // Refresh list
      fetchDashboardData();
    } catch (err: any) {
      alert(err.message || 'An error occurred during deletion.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0', color: 'var(--color-primary)' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem' }}>Loading administrative board...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', borderColor: '#F1B5B5', backgroundColor: '#F8DADA', color: '#721C24' }}>
          <AlertCircle size={36} style={{ marginBottom: '1rem' }} />
          <h2>Administrative Access Denied</h2>
          <div className="page-divider" style={{ backgroundColor: '#721C24' }}></div>
          <p>{error || 'You do not have permission to view this page.'}</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalParties = data.guests.length;
  const totalInvitedGuests = data.guests.reduce((sum, g) => sum + g.members.length, 0);
  
  const submittedPartiesCount = data.rsvps.length;
  const rsvpCompletionRate = totalParties > 0 ? Math.round((submittedPartiesCount / totalParties) * 100) : 0;

  let totalAttendingGuests = 0;
  let totalDeclinedGuests = 0;
  let dietaryCount = 0;

  data.rsvps.forEach(r => {
    if (r.attending) {
      r.membersRSVP.forEach(m => {
        if (m.attending) {
          totalAttendingGuests++;
          if (m.dietary && m.dietary.trim() !== '' && m.dietary.toLowerCase() !== 'none') {
            dietaryCount++;
          }
        } else {
          totalDeclinedGuests++;
        }
      });
    } else {
      // If the party overall declined, everyone in that party declined
      const matchedGuest = data.guests.find(g => g.username === r.username);
      const partySize = matchedGuest ? matchedGuest.members.length : 1;
      totalDeclinedGuests += partySize;
    }
  });

  const pendingGuestsCount = totalInvitedGuests - totalAttendingGuests - totalDeclinedGuests;

  return (
    <div className="container fade-in">
      <header className="page-header" style={{ paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
          <Crown size={28} fill="currentColor" />
          <span style={{ fontSize: '1.2rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Admin Dashboard</span>
        </div>
        <h1>RSVP & Guest Management</h1>
        <div className="page-divider"></div>
        <p className="page-subtitle">Welcome back, {currentAdmin?.name}. Here is the real-time status of your invitations.</p>
      </header>

      {/* Analytics Grid */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '3.5rem' 
      }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ backgroundColor: 'var(--color-blush)', padding: '1rem', borderRadius: '50%', color: 'var(--color-primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', letterSpacing: '0.05em' }}>Invited Guests</h4>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)', color: 'var(--color-primary)' }}>
              {totalInvitedGuests} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', fontWeight: 'normal' }}>({totalParties} parties)</span>
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ backgroundColor: '#E2ECD8', padding: '1rem', borderRadius: '50%', color: '#40592E' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', letterSpacing: '0.05em' }}>Attending</h4>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)', color: '#40592E' }}>
              {totalAttendingGuests} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', fontWeight: 'normal' }}>confirmed</span>
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ backgroundColor: '#F8DADA', padding: '1rem', borderRadius: '50%', color: '#721C24' }}>
            <XCircle size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', letterSpacing: '0.05em' }}>Declined / Pending</h4>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)', color: '#721C24' }}>
              {totalDeclinedGuests} <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', fontWeight: 'normal' }}>/ {pendingGuestsCount} left</span>
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ backgroundColor: 'rgba(197, 160, 89, 0.15)', padding: '1rem', borderRadius: '50%', color: 'var(--color-accent)' }}>
            <Percent size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', letterSpacing: '0.05em' }}>RSVP Response</h4>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', fontFamily: 'var(--font-serif)', color: 'var(--color-accent-hover)' }}>
              {rsvpCompletionRate}% <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', fontWeight: 'normal' }}>({submittedPartiesCount} done)</span>
            </p>
          </div>
        </div>
      </section>

      {/* Admin Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid var(--color-border)', 
        marginBottom: '2rem',
        gap: '2rem'
      }}>
        <button
          onClick={() => setActiveTab('rsvps')}
          style={{
            background: 'none',
            border: 'none',
            padding: '1rem 0',
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            color: activeTab === 'rsvps' ? 'var(--color-primary)' : 'var(--color-text-light)',
            borderBottom: activeTab === 'rsvps' ? '3px solid var(--color-primary)' : '3px solid transparent',
            transition: 'var(--transition)'
          }}
        >
          RSVP Response List ({submittedPartiesCount})
        </button>
        <button
          onClick={() => setActiveTab('guests')}
          style={{
            background: 'none',
            border: 'none',
            padding: '1rem 0',
            fontFamily: 'var(--font-sans)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            color: activeTab === 'guests' ? 'var(--color-primary)' : 'var(--color-text-light)',
            borderBottom: activeTab === 'guests' ? '3px solid var(--color-primary)' : '3px solid transparent',
            transition: 'var(--transition)'
          }}
        >
          Manage Invited Guests ({totalParties})
        </button>
      </div>

      {/* Content Panels */}
      {activeTab === 'rsvps' ? (
        <div className="card" style={{ overflowX: 'auto', padding: '1.5rem' }}>
          {data.rsvps.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-light)' }}>
              No RSVP responses have been submitted yet.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: '0.8rem' }}>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Party Name</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Overall Status</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Members & Dietary</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Extra Details</th>
                </tr>
              </thead>
              <tbody>
                {data.rsvps.map((rsvp, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)', verticalAlign: 'top' }}>
                    
                    {/* Party Name */}
                    <td style={{ padding: '1.2rem 0.5rem' }}>
                      <strong style={{ display: 'block', fontSize: '1rem' }}>{rsvp.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>@{rsvp.username}</span>
                    </td>

                    {/* Overall Status */}
                    <td style={{ padding: '1.2rem 0.5rem' }}>
                      <span className={`rsvp-status-badge ${rsvp.attending ? 'attending' : 'declined'}`} style={{ marginTop: '0.2rem' }}>
                        {rsvp.attending ? 'Attending' : 'Declined'}
                      </span>
                    </td>

                    {/* Attendance & Dietary Details per party member */}
                    <td style={{ padding: '1.2rem 0.5rem', maxWidth: '350px' }}>
                      {rsvp.attending ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {rsvp.membersRSVP.map((m, mIdx) => {
                            return (
                              <div key={mIdx} style={{ fontSize: '0.9rem', backgroundColor: 'var(--color-bg)', padding: '0.6rem 0.8rem', borderRadius: '6px', borderLeft: m.attending ? '3px solid var(--color-primary)' : '3px solid #E15B64' }}>
                                <div style={{ fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between' }}>
                                  <span>{m.memberName}</span>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: m.attending ? '#40592E' : '#721C24' }}>
                                    {m.attending ? 'Attending' : 'Declined'}
                                  </span>
                                </div>
                                {m.attending && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', color: 'var(--color-text-light)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                                    {m.dietary && m.dietary.trim() !== '' && m.dietary.toLowerCase() !== 'none' ? (
                                      <span style={{ color: '#C25C15', fontWeight: 500, backgroundColor: 'rgba(211, 126, 40, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', width: 'fit-content' }}>
                                        ⚠️ Dietary: {m.dietary}
                                      </span>
                                    ) : (
                                      <span style={{ color: 'var(--color-text-light)', fontStyle: 'italic' }}>
                                        No dietary requirements
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--color-text-light)' }}>
                          Party declined invitation
                        </span>
                      )}
                    </td>

                    {/* Extra details (Song, Message) */}
                    <td style={{ padding: '1.2rem 0.5rem', fontSize: '0.9rem', maxWidth: '300px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {rsvp.songRequest && (
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                            <Music size={14} style={{ color: 'var(--color-accent)', marginTop: '0.2rem' }} />
                            <span>
                              <strong style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', display: 'block' }}>Song Request:</strong>
                              {rsvp.songRequest}
                            </span>
                          </div>
                        )}
                        {rsvp.message && (
                          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                            <MessageSquare size={14} style={{ color: 'var(--color-secondary)', marginTop: '0.2rem' }} />
                            <span>
                              <strong style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', display: 'block' }}>Message:</strong>
                              <span style={{ fontStyle: 'italic', color: 'var(--color-text-light)' }}>"{rsvp.message}"</span>
                            </span>
                          </div>
                        )}
                        {!rsvp.songRequest && !rsvp.message && (
                          <span style={{ color: 'var(--color-text-light)', fontStyle: 'italic' }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Add Guest Button and slide-out Form */}
          <section>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <Plus size={18} />
              {showAddForm ? 'Close Registration Form' : 'Register New Guest Party'}
            </button>

            {formSuccess && (
              <div className="card" style={{ backgroundColor: '#E2ECD8', color: '#3A4D2E', marginTop: '1.5rem', padding: '1rem 1.5rem' }}>
                {formSuccess}
              </div>
            )}

            {showAddForm && (
              <div className="card fade-in" style={{ marginTop: '1.5rem', maxWidth: '600px', backgroundColor: 'var(--color-blush)' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>New Guest Party Invitation</h3>
                
                {formError && <div className="login-error" style={{ marginBottom: '1rem' }}>{formError}</div>}

                <form onSubmit={handleAddGuestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div className="form-group">
                    <label htmlFor="party-name">Friendly Party / Family Name</label>
                    <input
                      id="party-name"
                      type="text"
                      className="input-control"
                      placeholder="e.g. Mr & Mrs Higgins, or Chloe & Partner"
                      value={newPartyName}
                      onChange={(e) => setNewPartyName(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="party-username">Guest Username</label>
                      <input
                        id="party-username"
                        type="text"
                        className="input-control"
                        placeholder="e.g. higginsfamily (lowercase, letters/numbers only)"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="party-password">Guest Passcode</label>
                      <input
                        id="party-password"
                        type="text"
                        className="input-control"
                        placeholder="e.g. love"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Dynamic Party Members fields */}
                  <div className="form-group">
                    <label>Party Members (Individual Guest Names)</label>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                      Add the precise names of everyone included in this party. They will RSVP and select meals individually under these names.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {newMembers.map((member, index) => (
                        <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="input-control"
                            style={{ flexGrow: 1 }}
                            placeholder={`Guest #${index + 1} Name`}
                            value={member}
                            onChange={(e) => handleMemberNameChange(index, e.target.value)}
                          />
                          {newMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMemberField(index)}
                              style={{ background: 'none', border: 'none', color: '#721C24', cursor: 'pointer' }}
                              title="Remove Guest"
                            >
                              <MinusCircle size={22} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleAddMemberField}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.4rem', 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--color-primary)', 
                        fontWeight: 600, 
                        marginTop: '0.8rem', 
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      <PlusCircle size={16} />
                      Add Another Guest
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-accent" 
                    style={{ marginTop: '1rem' }}
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? 'Registering...' : 'Generate Invitation Account'}
                  </button>
                </form>
              </div>
            )}
          </section>

          {/* Invited Guests Directory */}
          <div className="card" style={{ overflowX: 'auto', padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.2rem', color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>Guest Invitation Ledger</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', paddingBottom: '0.8rem' }}>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Party / Family Name</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Login Username</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Passcode</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase' }}>Individual Members</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.guests.map((g, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <strong style={{ color: 'var(--color-text-dark)' }}>{g.name}</strong>
                      {g.is_admin && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: '#ffffff', backgroundColor: 'var(--color-accent)', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>Admin</span>}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', fontSize: '0.95rem' }}>{g.username}</td>
                    <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', fontSize: '0.95rem', color: 'var(--color-text-light)' }}>{g.password || '••••'}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {g.members.map((m, mIdx) => (
                          <span key={mIdx} style={{ fontSize: '0.8rem', backgroundColor: 'var(--color-blush)', padding: '0.2rem 0.6rem', borderRadius: '20px', color: 'var(--color-primary)' }}>
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                      {!g.is_admin ? (
                        <button
                          onClick={() => handleDeleteGuest(g.username, g.name)}
                          style={{ background: 'none', border: 'none', color: '#C22525', cursor: 'pointer', transition: 'var(--transition)' }}
                          title="Delete Invitation Account"
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', fontStyle: 'italic' }}>Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
