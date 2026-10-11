const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  let payload = req.body;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch (e) {
      const params = new URLSearchParams(payload);
      payload = Object.fromEntries(params.entries());
    }
  }
  payload = payload || {};

  // Honeypot spam check
  if (payload.website || payload.hp_check) {
    res.status(400).json({ success: false, message: 'Spam detected. Submission rejected.' });
    return;
  }

  const errors = {};
  const fullName = (payload.fullName || payload.name || '').trim();
  const email = (payload.email || '').trim();
  const phone = (payload.phone || '').trim();
  const discipline = (payload.discipline || payload.projectType || '').trim();
  const location = (payload.location || '').trim();
  const stage = (payload.stage || '').trim();
  const message = (payload.message || '').trim();

  if (!fullName || fullName.length < 2) {
    errors.fullName = 'Full name is required (minimum 2 characters).';
  } else if (fullName.length > 100) {
    errors.fullName = 'Name cannot exceed 100 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'A valid email address is required.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please provide a valid email format (e.g., name@domain.com).';
  }

  if (!discipline) {
    errors.discipline = 'Please select an architectural or design discipline.';
  }

  if (!message || message.length < 10) {
    errors.message = 'Please provide inquiry details (minimum 10 characters).';
  } else if (message.length > 3000) {
    errors.message = 'Message must be under 3000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({
      success: false,
      message: 'Please resolve the highlighted validation errors.',
      errors
    });
    return;
  }

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const referenceId = `GRECE-2026-${randomNum}`;

  const inquiryEntry = {
    referenceId,
    timestamp: new Date().toISOString(),
    fullName,
    email,
    phone: phone || null,
    discipline,
    location: location || null,
    stage: stage || null,
    message
  };

  // Attempt temporary persistence in /tmp or local data
  try {
    const tmpDataDir = path.join('/tmp', 'data');
    if (!fs.existsSync(tmpDataDir)) {
      fs.mkdirSync(tmpDataDir, { recursive: true });
    }
    const tmpFile = path.join(tmpDataDir, 'inquiries.json');
    let existing = [];
    if (fs.existsSync(tmpFile)) {
      try { existing = JSON.parse(fs.readFileSync(tmpFile, 'utf8')); } catch (e) {}
    }
    existing.push(inquiryEntry);
    fs.writeFileSync(tmpFile, JSON.stringify(existing, null, 2), 'utf8');
  } catch (e) {
    // Non-fatal in serverless environments
  }

  res.status(200).json({
    success: true,
    message: 'Thank you for your inquiry. A Gréce architectural advisor will connect with you within 24 hours.',
    referenceId
  });
};
