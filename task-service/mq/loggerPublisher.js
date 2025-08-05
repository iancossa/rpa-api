const amqp = require('amqplib');

const LOG_QUEUE = 'log_queue';

async function sendLog(level, message, data = {}) {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(LOG_QUEUE);

    const logMessage = {
      service: 'task-service',
      action: 'log',
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };

    channel.sendToQueue(LOG_QUEUE, Buffer.from(JSON.stringify(logMessage)));
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Failed to send log:', error.message);
  }
}

module.exports = { sendLog };