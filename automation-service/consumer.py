import pika
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def process_task(ch, method, properties, body):
    try:
        message = json.loads(body)
        task_id = message.get('taskId')
        task_type = message.get('type')
        payload = message.get('payload')
        
        logger.info(f"Received task: ID={task_id}, Type={task_type}, Payload={payload}")
        
        # Process the automation task here
        # Add your automation logic based on task_type
        
        ch.basic_ack(delivery_tag=method.delivery_tag)
        
    except Exception as e:
        logger.error(f"Error processing task: {e}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

def start_consumer():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    
    channel.queue_declare(queue='automation_queue', durable=True)
    channel.basic_consume(queue='automation_queue', on_message_callback=process_task)
    
    logger.info("Waiting for automation tasks...")
    channel.start_consuming()

if __name__ == "__main__":
    start_consumer()