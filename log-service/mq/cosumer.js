const amqp = require('amqplib');
const saveToFile = require('../utils/logger');
const Log = require('../models/Log');

const QUEUE_NAME = 'log_queue';

async function startConsumer() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue(QUEUE_NAME);
  console.log('📥 Listening to log_queue...');

  ch.consume(QUEUE_NAME, async (msg) => {
    if (msg !== null) {
      const log = JSON.parse(msg.content.toString());
      console.log('📝 Received log:', log);

      saveToFile(log);

      if (process.env.USE_MONGODB === 'true') {
        try {
          await Log.create(log);
          console.log('📦 Saved log to MongoDB');
        } catch (err) {
          console.error('❌ MongoDB log save failed:', err.message);
        }
      }

      ch.ack(msg);
    }
  });
}

module.exports = startConsumer;
