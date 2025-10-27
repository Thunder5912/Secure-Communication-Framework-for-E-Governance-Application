
---

## 🖥️ server/server.js
```js
const https = require('https');
const fs = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken');
const { encrypt, decrypt } = require('./crypto');
const { verifyRole } = require('./rbac');
const { logAction } = require('./audit');
const config = require('./config');

const app = express();
app.use(express.json());

// Simple login route to issue JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    const token = jwt.sign({ user: 'admin', roles: ['admin'] }, config.jwtSecret, { expiresIn: '10m' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Protected route
app.post('/secure', verifyRole(['admin']), (req, res) => {
  try {
    const encrypted = req.body.encrypted;
    const decrypted = decrypt(encrypted);
    logAction(`Received secure data from ${req.user?.user || 'unknown'}`);
    res.json({ message: 'Data received securely', data: decrypted });
  } catch (err) {
    res.status(400).json({ error: 'Decryption failed' });
  }
});

// HTTPS setup
const httpsOptions = {
  key: fs.readFileSync(config.serverKey),
  cert: fs.readFileSync(config.serverCert)
};

https.createServer(httpsOptions, app).listen(config.port, () => {
  console.log(`Secure Server running at https://localhost:${config.port}`);
});
