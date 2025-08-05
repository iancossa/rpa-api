require('dotenv').config();
const startConsumer = require('./mq/consumer');
const connectToDB = require('./utils/db');

(async () => {
  if (process.env.USE_MONGODB === 'true') {
    await connectToDB();
  }

  startConsumer();
})();
