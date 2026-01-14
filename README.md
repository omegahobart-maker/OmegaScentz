# Gaming Deals Hub — Email Subscribe Setup

This repository includes a static site generator (`build-site.js`) which writes files into `gaming-deals-hub/`, and a small Express server to serve the static site and handle subscription POSTs.

Quick start

1. Install dependencies:

```bash
cd "%USERPROFILE%\OneDrive\Desktop"
npm install
```

2. Generate site files (this creates the `gaming-deals-hub` folder):

```bash
npm run build-site
```

3. Copy `.env.example` to `.env` and set working SMTP values and `TO_EMAIL`.

4. Start the server:

```bash
npm start
```

5. Open http://localhost:3000 and use the subscription form. Submissions will be appended to `gaming-deals-hub/subscribers.txt` and a notification email will be sent to `TO_EMAIL`.

Notes

- The server expects SMTP credentials. Use Mailtrap for testing or a transactional email provider's SMTP settings.
- The client POSTs to `/subscribe`. If you deploy behind a different path, update `subscribe.js`.
