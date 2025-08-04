const amqp = require('amqplib');

const QUEUE_NAME = 'task_notification_queue';

async function sendToQueue(message) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME);
  channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));

  console.log('📤 Message sent:', message);
  setTimeout(() => {
    connection.close();
  }, 500);
}

module.exports = sendToQueue;
