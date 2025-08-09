const fs = require('fs');
const path = require('path');

function saveToFile(log) {
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const filename = `${log.service}-${new Date().toISOString().split('T')[0]}.log`;
  const filepath = path.join(logDir, filename);
  const logEntry = `${log.timestamp} [${log.level.toUpperCase()}] ${log.message} ${JSON.stringify(log.data)}\n`;

  fs.appendFileSync(filepath, logEntry);
}

module.exports = saveToFile;