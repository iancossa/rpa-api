const amqp = require('amqplib');

const QUEUE_NAME = 'task_notification_queue';

async function startConsumer() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME);

  console.log('👂 Listening for messages...');
  channel.consume(QUEUE_NAME, (msg) => {
    if (msg !== null) {
      const data = JSON.parse(msg.content.toString());
      console.log('📩 Received message:', data);
      channel.ack(msg);
    }
  });
}

module.exports = startConsumer;
