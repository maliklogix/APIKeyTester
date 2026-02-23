require('dotenv').config();
const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Provider test definitions ──────────────────────────────────────────────
const providers = {

  // ═══════════════════════ AI MODELS (7) ═══════════════════════

  openai: async (key) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Say hi' }],
        max_tokens: 5,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || JSON.stringify(data.error || data);
      const type = res.status === 401 ? 'invalid' : res.status === 429 ? 'rate_limited' : res.status === 402 ? 'insufficient_credits' : 'error';
      return { success: false, status: res.status, type, message: msg };
    }
    return {
      success: true, status: 200, type: 'valid',
      message: 'API key is valid',
      details: {
        model: data.model,
        usage: data.usage,
        organization: res.headers.get('openai-organization') || 'N/A',
      },
    };
  },

  anthropic: async (key) => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Say hi' }],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || JSON.stringify(data.error || data);
      const type = res.status === 401 ? 'invalid' : res.status === 429 ? 'rate_limited' : 'error';
      return { success: false, status: res.status, type, message: msg };
    }
    return {
      success: true, status: 200, type: 'valid',
      message: 'API key is valid',
      details: { model: data.model, usage: data.usage },
    };
  },

  gemini: async (key) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Say hi' }] }],
        generationConfig: { maxOutputTokens: 5 },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || JSON.stringify(data.error || data);
      const type = res.status === 400 ? 'invalid' : res.status === 429 ? 'rate_limited' : res.status === 403 ? 'api_disabled' : 'error';
      return { success: false, status: res.status, type, message: msg };
    }
    return {
      success: true, status: 200, type: 'valid',
      message: 'API key is valid',
      details: { model: 'gemini-2.0-flash', candidates: data.candidates?.length || 0 },
    };
  },

  mistral: async (key) => {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: 'Say hi' }],
        max_tokens: 5,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || data.message || JSON.stringify(data);
      const type = res.status === 401 ? 'invalid' : res.status === 429 ? 'rate_limited' : 'error';
      return { success: false, status: res.status, type, message: msg };
    }
    return {
      success: true, status: 200, type: 'valid',
      message: 'API key is valid',
      details: { model: data.model, usage: data.usage },
    };
  },

  deepseek: async (key) => {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Say hi' }],
        max_tokens: 5,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || data.message || JSON.stringify(data);
      const type = res.status === 401 ? 'invalid' : res.status === 429 ? 'rate_limited' : 'error';
      return { success: false, status: res.status, type, message: msg };
    }
    return {
      success: true, status: 200, type: 'valid',
      message: 'API key is valid',
      details: { model: data.model, usage: data.usage },
    };
  },

  groq: async (key) => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: 'Say hi' }],
        max_tokens: 5,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || JSON.stringify(data.error || data);
      const type = res.status === 401 ? 'invalid' : res.status === 429 ? 'rate_limited' : 'error';
      return { success: false, status: res.status, type, message: msg };
    }
    return {
      success: true, status: 200, type: 'valid',
      message: 'API key is valid',
      details: {
        model: data.model,
        usage: data.usage,
        system_fingerprint: data.system_fingerprint,
      },
    };
  },

  cohere: async (key) => {
    const res = await fetch('https://api.cohere.com/v2/chat', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'command-r',
        messages: [{ role: 'user', content: 'Say hi' }],
        max_tokens: 5,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.message || JSON.stringify(data);
      const type = res.status === 401 ? 'invalid' : res.status === 429 ? 'rate_limited' : 'error';
      return { success: false, status: res.status, type, message: msg };
    }
    return {
      success: true, status: 200, type: 'valid',
      message: 'API key is valid',
      details: { model: data.model || 'command-r' },
    };
  },

  // ═══════════════════════ IMAGE GENERATION (2) ═══════════════════════

  leonardo: async (key) => {
    const res = await fetch('https://cloud.leonardo.ai/api/rest/v1/me', {
      headers: { 'Authorization': `Bearer ${key}` },
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error || data.message || JSON.stringify(data);
      const type = res.status === 401 ? 'invalid' : res.status === 403 ? 'forbidden' : 'error';
      return { success: false, status: res.status, type, message: msg };
    }
    const info = data.user_details?.[0] || data;
    return {
      success: true, status: 200, type: 'valid',
      message: 'API key is valid',
      details: {
        username: info.user?.username || 'N/A',
        tokenRenewalDate: info.tokenRenewalDate || 'N/A',
        apiConcurrencySlots: info.apiConcurrencySlots || 'N/A',
      },
    };
  },

  fal: async (key) => {
    const res = await fetch('https://queue.fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: { 'Authorization': `Key ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'test',
        image_size: { width: 256, height: 256 },
        num_images: 1,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.detail || data.message || JSON.stringify(data);
      const type = res.status === 401 ? 'invalid' : res.status === 403 ? 'forbidden' : 'error';
      return { success: false, status: res.status, type, message: msg };
    }
    return {
      success: true, status: 200, type: 'valid',
      message: 'API key is valid — job submitted successfully',
      details: { request_id: data.request_id || 'Accepted', status: data.status || 'IN_QUEUE' },
    };
  },

  // ═══════════════════════ SOCIAL & PLATFORMS (6) ═══════════════════════

  facebook: async (key) => {
    const res = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${encodeURIComponent(key)}`);
    const data = await res.json();
    if (data.error) {
      const type = data.error.code === 190 ? 'expired' : 'invalid';
      return { success: false, status: 400, type, message: data.error.message };
    }
    return {
      success: true, status: 200, type: 'valid',
      message: 'Access token is valid',
      details: { name: data.name, id: data.id },
    };
  },

  youtube: async (key) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=1&key=${encodeURIComponent(key)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || JSON.stringify(data.error || data);
      const type = res.status === 400 ? 'invalid' : res.status === 403 ? 'quota_exceeded' : 'error';
      return { success: false, status: res.status, type, message: msg };
    }
    const video = data.items?.[0];
    return {
      success: true, status: 200, type: 'valid',
      message: 'API key is valid',
      details: {
        totalResults: data.pageInfo?.totalResults || 0,
        sampleVideo: video?.snippet?.title || 'N/A',
      },
    };
  },

  linkedin: async (key) => {
    const res = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${key}` },
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.message || JSON.stringify(data);
      return { success: false, status: res.status, type: 'invalid', message: msg };
    }
    return {
      success: true, status: 200, type: 'valid',
      message: 'Access token is valid',
      details: { name: data.name || `${data.given_name} ${data.family_name}`, email: data.email },
    };
  },

  tiktok: async (key) => {
    const res = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url', {
      headers: { 'Authorization': `Bearer ${key}` },
    });
    const data = await res.json();
    if (!res.ok || data.error?.code) {
      const msg = data.error?.message || JSON.stringify(data);
      return { success: false, status: res.status, type: 'invalid', message: msg };
    }
    return {
      success: true, status: 200, type: 'valid',
      message: 'Access token is valid',
      details: { display_name: data.data?.user?.display_name || 'N/A' },
    };
  },

  pinterest: async (key) => {
    const res = await fetch('https://api.pinterest.com/v5/user_account', {
      headers: { 'Authorization': `Bearer ${key}` },
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.message || JSON.stringify(data);
      return { success: false, status: res.status, type: 'invalid', message: msg };
    }
    return {
      success: true, status: 200, type: 'valid',
      message: 'Access token is valid',
      details: { username: data.username, account_type: data.account_type },
    };
  },

  stripe: async (key) => {
    const res = await fetch('https://api.stripe.com/v1/balance', {
      headers: { 'Authorization': `Bearer ${key}` },
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || JSON.stringify(data.error || data);
      return { success: false, status: res.status, type: 'invalid', message: msg };
    }
    const isTest = key.startsWith('sk_test_') || key.startsWith('rk_test_');
    const available = data.available || [];
    return {
      success: true, status: 200, type: 'valid',
      message: `API key is valid (${isTest ? 'Test Mode' : 'Live Mode'})`,
      details: {
        mode: isTest ? 'test' : 'live',
        livemode: data.livemode,
        balance: available.map(b => `${(b.amount / 100).toFixed(2)} ${b.currency.toUpperCase()}`).join(', ') || '0.00',
      },
    };
  },
};

// ── POST /api/test/:provider ───────────────────────────────────────────────
app.post('/api/test/:provider', async (req, res) => {
  const { provider } = req.params;
  const { key } = req.body;

  if (!key?.trim()) {
    return res.json({ success: false, status: 400, type: 'error', message: 'API key is required', responseTime: 0 });
  }

  const handler = providers[provider];
  if (!handler) {
    return res.json({ success: false, status: 404, type: 'error', message: `Unknown provider: ${provider}`, responseTime: 0 });
  }

  const start = Date.now();
  try {
    const result = await handler(key.trim());
    result.responseTime = Date.now() - start;
    res.json(result);
  } catch (err) {
    res.json({
      success: false,
      status: 500,
      type: 'error',
      message: `Connection failed: ${err.message}`,
      responseTime: Date.now() - start,
    });
  }
});

// ── Health ──────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', providers: Object.keys(providers).length });
});

// ── UI ───────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ── Boot ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  API Key Tester  |  Ready');
  console.log(`  http://localhost:${PORT}`);
  console.log(`  ${Object.keys(providers).length} providers available`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
