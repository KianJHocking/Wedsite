const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from parent root folder first, then fallback to current folder
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'wedding-secret-key-2026-bespoke-love';

app.use(cors());
app.use(express.json());

// Initialize Supabase Client
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

let supabase;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn("WARNING: Supabase URL or Anon Key missing. DB requests will fail. Define SUPABASE_URL and SUPABASE_ANON_KEY in environment variables.");
}

// Helper to check Supabase configuration
const checkSupabase = (res) => {
  if (!supabase) {
    res.status(500).json({ error: 'Database connection is not configured on the cloud server.' });
    return false;
  }
  return true;
};

// Middleware: Authenticate JWT Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware: Authenticate Admin Privileges
const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (!req.user || !req.user.is_admin) {
      return res.status(403).json({ error: 'Administrative privileges required.' });
    }
    next();
  });
};

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  if (!checkSupabase(res)) return;

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const normalizedUsername = username.trim().toLowerCase();

  try {
    const { data: guest, error } = await supabase
      .from('guests')
      .select('*')
      .eq('username', normalizedUsername)
      .maybeSingle();

    if (error) {
      console.error('Database read error during login:', error);
      return res.status(500).json({ error: 'Error connecting to database' });
    }

    if (!guest || guest.password !== password.trim()) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create JWT token
    const tokenPayload = {
      username: guest.username,
      name: guest.name,
      members: guest.members, // In Supabase, jsonb columns are auto-parsed to JavaScript objects/arrays
      is_admin: guest.is_admin || false
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      guest: tokenPayload
    });
  } catch (err) {
    console.error('Unhandled login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ guest: req.user });
});

// GET /api/rsvp
app.get('/api/rsvp', authenticateToken, async (req, res) => {
  if (!checkSupabase(res)) return;

  try {
    const { data: rsvp, error } = await supabase
      .from('rsvps')
      .select('*')
      .eq('username', req.user.username.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('Database fetch error during RSVP query:', error);
      return res.status(500).json({ error: 'Error fetching RSVP data' });
    }

    if (rsvp) {
      // Map database snake_case fields back to frontend camelCase expectations
      res.json({
        rsvp: {
          username: rsvp.username,
          name: rsvp.name,
          attending: rsvp.attending,
          membersRSVP: rsvp.members_rsvp,
          message: rsvp.message,
          songRequest: rsvp.song_request,
          updatedAt: rsvp.updated_at
        }
      });
    } else {
      res.json({ rsvp: null });
    }
  } catch (err) {
    console.error('Unhandled RSVP GET error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/rsvp
app.post('/api/rsvp', authenticateToken, async (req, res) => {
  if (!checkSupabase(res)) return;

  const { attending, membersRSVP, message, songRequest } = req.body;

  if (attending === undefined || !Array.isArray(membersRSVP)) {
    return res.status(400).json({ error: 'Invalid RSVP details submitted' });
  }

  try {
    const dbRsvp = {
      username: req.user.username.toLowerCase(),
      name: req.user.name,
      attending,
      members_rsvp: membersRSVP,
      message: message || '',
      song_request: songRequest || '',
      updated_at: new Date().toISOString()
    };

    const { data: rsvp, error } = await supabase
      .from('rsvps')
      .upsert(dbRsvp)
      .select()
      .single();

    if (error) {
      console.error('Database upsert error during RSVP save:', error);
      return res.status(500).json({ error: 'Failed to save RSVP to cloud database.' });
    }

    res.json({
      success: true,
      rsvp: {
        username: rsvp.username,
        name: rsvp.name,
        attending: rsvp.attending,
        membersRSVP: rsvp.members_rsvp,
        message: rsvp.message,
        songRequest: rsvp.song_request,
        updatedAt: rsvp.updated_at
      }
    });
  } catch (err) {
    console.error('Unhandled RSVP POST error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/dashboard - Fetch all guests and RSVPs for administrative stats/lists
app.get('/api/admin/dashboard', authenticateAdmin, async (req, res) => {
  if (!checkSupabase(res)) return;

  try {
    const { data: guests, error: guestsError } = await supabase
      .from('guests')
      .select('*')
      .order('name', { ascending: true });

    const { data: rsvps, error: rsvpsError } = await supabase
      .from('rsvps')
      .select('*');

    if (guestsError || rsvpsError) {
      console.error('Admin fetch database error:', guestsError || rsvpsError);
      return res.status(500).json({ error: 'Failed to retrieve administrative data.' });
    }

    // Map database snake_case fields to camelCase for the frontend
    const mappedRsvps = rsvps.map(rsvp => ({
      username: rsvp.username,
      name: rsvp.name,
      attending: rsvp.attending,
      membersRSVP: rsvp.members_rsvp,
      message: rsvp.message,
      songRequest: rsvp.song_request,
      updatedAt: rsvp.updated_at
    }));

    res.json({
      guests: guests.map(g => ({
        username: g.username,
        name: g.name,
        members: g.members,
        is_admin: g.is_admin
      })),
      rsvps: mappedRsvps
    });
  } catch (err) {
    console.error('Unhandled admin dashboard fetch error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/admin/guests - Admin registers a new guest party on-the-fly
app.post('/api/admin/guests', authenticateAdmin, async (req, res) => {
  if (!checkSupabase(res)) return;

  const { username, password, name, members } = req.body;

  if (!username || !password || !name || !Array.isArray(members)) {
    return res.status(400).json({ error: 'All guest registration fields are required.' });
  }

  const normalizedUsername = username.trim().toLowerCase();

  try {
    const { data: existing, error: checkError } = await supabase
      .from('guests')
      .select('username')
      .eq('username', normalizedUsername)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: 'Username already exists.' });
    }

    const { data: newGuest, error: insertError } = await supabase
      .from('guests')
      .insert({
        username: normalizedUsername,
        password: password.trim(),
        name: name.trim(),
        members
      })
      .select()
      .single();

    if (insertError) {
      console.error('Admin guest insert error:', insertError);
      return res.status(500).json({ error: 'Failed to create guest account.' });
    }

    res.json({
      success: true,
      guest: {
        username: newGuest.username,
        name: newGuest.name,
        members: newGuest.members
      }
    });
  } catch (err) {
    console.error('Unhandled admin guest insert error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/admin/guests/:username - Admins deletes a guest party (cascades to their RSVP)
app.delete('/api/admin/guests/:username', authenticateAdmin, async (req, res) => {
  if (!checkSupabase(res)) return;

  const targetUsername = req.params.username.toLowerCase();

  try {
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('username', targetUsername);

    if (error) {
      console.error('Admin guest deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete guest.' });
    }

    res.json({ success: true, message: `Guest ${targetUsername} deleted.` });
  } catch (err) {
    console.error('Unhandled admin guest deletion error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Local dev runner fallback
if (process.env.NODE_ENV !== 'production' && require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Local Express Server listening on port ${PORT}`);
  });
}

module.exports = app;
