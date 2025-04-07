require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const target = process.env.TARGET_URL || 'https://www.wikipedia.org';
const PORT = process.env.PORT || 3000;

// Fake Homework Submission Portal homepage
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Homework Submission Portal</title>
        <style>
          body { font-family: Arial, sans-serif; background: #f2f2f2; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 100px auto; background: #fff; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center; }
          h1 { margin-top: 0; }
          a { color: #3366cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Homework Submission Portal</h1>
          <p>Welcome to the homework portal. Please click below to access your assignments.</p>
          <p><a href="/proxy">Access Assignments</a></p>
        </div>
      </body>
    </html>
  `);
});

// The proxy route that provides stealthy access to the target site
app.use('/proxy', createProxyMiddleware({
  target,
  changeOrigin: true,
  pathRewrite: { '^/proxy': '' }, // Removes '/proxy' from the URL path when forwarding
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Referer': target,
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('X-Forwarded-For', ''); // Hides your real IP
  },
  onError: (err, req, res) => {
    res.status(500).send('Proxy is currently down, try again later.');
  }
}));

app.listen(PORT, () => {
  console.log(`Stealth School Proxy Running on Port ${PORT}`);
});
