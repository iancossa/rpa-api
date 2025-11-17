const amqp = require('amqplib');

const QUEUE_NAME = 'task_notification_queue';

async function startConsumer() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);

    console.log('👂 Listening for messages...');
    channel.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          console.log('📩 Received message:', data);
          channel.ack(msg);
        } catch (parseError) {
          console.error('❌ Error parsing message:', parseError);
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (error) {
    console.error('❌ Consumer error:', error);
    throw error;
  }
}

module.exports = startConsumer;
