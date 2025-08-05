const amqp = require('amqplib');

const QUEUE_NAME = 'task_notification_queue';
const DLQ_NAME = 'task_notification_dlq';
const MAX_RETRIES = 3;

async function startConsumer() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Setup main queue with DLQ
    await channel.assertQueue(DLQ_NAME);
    await channel.assertQueue(QUEUE_NAME, {
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': DLQ_NAME
      }
    });

    console.log('👂 Notification service listening for messages...');
    
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        try {
          const data = JSON.parse(msg.content.toString());
          const retryCount = msg.properties.headers?.['x-retry-count'] || 0;
          
          console.log(`🔔 Processing notification (attempt ${retryCount + 1}):`, data);
          
          await processMessage(data);
          channel.ack(msg);
          
        } catch (error) {
          console.error('❌ Processing failed:', error.message);
          handleFailure(channel, msg);
        }
      }
    });
  } catch (error) {
    console.error('Consumer error:', error);
  }
}

async function processMessage(data) {
  switch (data.type) {
    case 'TASK_ASSIGNED':
      await handleTaskAssigned(data);
      break;
    default:
      throw new Error(`Unknown message type: ${data.type}`);
  }
}

function handleFailure(channel, msg) {
  const retryCount = msg.properties.headers?.['x-retry-count'] || 0;
  
  if (retryCount < MAX_RETRIES) {
    // Retry with delay
    setTimeout(() => {
      channel.publish('', QUEUE_NAME, msg.content, {
        headers: { 'x-retry-count': retryCount + 1 }
      });
      channel.ack(msg);
    }, 5000 * (retryCount + 1)); // Exponential backoff
  } else {
    // Send to DLQ
    console.log('💀 Max retries exceeded, sending to DLQ');
    channel.nack(msg, false, false);
  }
}

async function handleTaskAssigned(data) {
  // Simulate potential failure
  if (Math.random() < 0.3) {
    throw new Error('Notification service temporarily unavailable');
  }
  
  console.log(`📧 Sending notification to ${data.to}: Task "${data.title}" has been assigned`);
  // Add email/SMS/push notification logic here
}

module.exports = startConsumer;