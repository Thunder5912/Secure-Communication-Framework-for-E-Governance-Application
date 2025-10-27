const axios = require('axios');
const https = require('https');
const { encrypt } = require('../server/crypto');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function runClient() {
  try {
    const login = await axios.post('https://localhost:8443/login', {
      username: 'admin',
      password: '1234'
    }, { httpsAgent });

    const token = login.data.token;
    console.log('JWT Token:', token);

    const message = 'Confidential message from client to server.';
    const encrypted = encrypt(message);

    const response = await axios.post('https://localhost:8443/secure', {
      encrypted
    }, {
      headers: { Authorization: `Bearer ${token}` },
      httpsAgent
    });

    console.log('Server Response:', response.data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runClient();
