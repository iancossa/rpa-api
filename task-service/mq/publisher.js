const amqp = require('amqplib');

const QUEUE_NAME = 'task_notification_queue';

async function sendToQueue(message) {
  let connection;
  try {
    connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));

    console.log('📤 Message sent:', message);
  } catch (error) {
    console.error('❌ Error sending message:', error);
    throw error;
  } finally {
    if (connection) {
      setTimeout(() => {
        connection.close().catch(console.error);
      }, 500);
    }
  }
}

module.exports = sendToQueue;
