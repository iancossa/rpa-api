const amqp = require('amqplib');

const QUEUE_NAME = 'task_notification_queue';

async function startConsumer() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);

    console.log('👂 Notification service listening for messages...');
    
    channel.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log('🔔 Processing notification:', data);
        
        // Process different message types
        switch (data.type) {
          case 'TASK_ASSIGNED':
            handleTaskAssigned(data);
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
        
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Consumer error:', error);
  }
}

function handleTaskAssigned(data) {
  console.log(`📧 Sending notification to ${data.to}: Task "${data.title}" has been assigned`);
  // Add email/SMS/push notification logic here
}

module.exports = startConsumer;