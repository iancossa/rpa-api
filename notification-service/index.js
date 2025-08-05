const dotenv = require('dotenv');
const startConsumer = require('./consumer');

dotenv.config();

console.log('🔔 Notification service starting...');
startConsumer();

console.log('Notification service is running on port 5003');