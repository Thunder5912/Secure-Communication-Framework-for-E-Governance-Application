const fs = require('fs');

function logAction(action) {
  const logLine = `${new Date().toISOString()} - ${action}\n`;
  fs.appendFileSync('./logs_audit.txt', logLine);
}

module.exports = { logAction };
