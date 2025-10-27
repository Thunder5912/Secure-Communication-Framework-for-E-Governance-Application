const crypto = require('crypto');
const fs = require('fs');

const RSA_PUBLIC_KEY = fs.readFileSync('./certificates/server.pub.pem', 'utf8');
const RSA_PRIVATE_KEY = fs.readFileSync('./certificates/server.key', 'utf8');

function encrypt(text) {
  const aesKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
  let encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  const encryptedKey = crypto.publicEncrypt(RSA_PUBLIC_KEY, aesKey);

  return {
    encryptedKey: encryptedKey.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    ciphertext: encrypted.toString('base64')
  };
}

function decrypt(data) {
  const aesKey = crypto.privateDecrypt(RSA_PRIVATE_KEY, Buffer.from(data.encryptedKey, 'base64'));
  const iv = Buffer.from(data.iv, 'base64');
  const tag = Buffer.from(data.tag, 'base64');
  const ciphertext = Buffer.from(data.ciphertext, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
  decipher.setAuthTag(tag);
  let decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };
