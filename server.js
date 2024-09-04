const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Add this middleware to set the CSP header
  server.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "frame-ancestors 'self' http: https: localhost:* 127.0.0.1:*"
    );
    next();
  });

  // Your existing routes and middleware here

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
