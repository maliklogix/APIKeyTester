# API Key Tester

A sleek, self-hosted web tool to **instantly validate API keys** for 15+ providers. Paste a key, hit test, and get real-time results — all without your keys ever being stored or logged.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)
![Providers](https://img.shields.io/badge/Providers-15-6366f1)

---

## Features

- **15 API Providers** across 3 categories — test them all from one dashboard
- **Instant Validation** — real-time results with response time metrics
- **Privacy First** — keys are never stored, logged, or sent to third parties
- **Dark / Light Theme** — toggle with one click, preference saved locally
- **Test History** — session-based history to track your results (never persisted)
- **Minimal Footprint** — lightweight requests (e.g., `max_tokens: 5`) to keep costs near zero

---

## Supported Providers

| Category | Providers |
|---|---|
| **AI Models** | OpenAI · Anthropic Claude · Google Gemini · Mistral · DeepSeek · Groq · Cohere |
| **Image Generation** | Leonardo AI · FAL AI |
| **Social & Platforms** | Facebook · YouTube · LinkedIn · TikTok · Pinterest · Stripe |

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/maliklogix/APIKeyTester.git
cd APIKeyTester

# Install dependencies
npm install

# Start the server
npm start
```

Open **http://localhost:3000** in your browser.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port the server runs on |

Create a `.env` file in the root directory to customize:

```env
PORT=3000
```

---

## How It Works

1. **Paste** your API key into the provider's card
2. **Test** — the server makes a single, minimal API call to verify the key
3. **Results** — get instant feedback: valid, invalid, expired, rate-limited, or insufficient credits

The Express server acts as a proxy to avoid browser CORS restrictions. Each key is used for one validation request and immediately discarded.

---

## Tech Stack

- **Backend** — Node.js + Express
- **Frontend** — Vanilla HTML/CSS/JS (single-page, no build step)
- **Styling** — Custom CSS with CSS variables for theming
- **Fonts** — Inter (Google Fonts)

---

## Project Structure

```
APIKeyTester/
├── server.js          # Express server with provider test handlers
├── views/
│   └── index.html     # Single-page frontend (UI + logic)
├── public/            # Static assets
├── package.json
└── .env               # Environment variables
```

---

## Security

- API keys are **never stored, logged, cached, or transmitted** to any third party
- Keys are used for a single validation request and immediately discarded
- The server acts only as a CORS proxy — no data persistence of any kind
- The project is fully open-source for transparency

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-provider`)
3. Commit your changes (`git commit -m 'Add new provider'`)
4. Push to the branch (`git push origin feature/new-provider`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/maliklogix">maliklogix</a>
</p>
