import json
import logging
import time
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from file_handler import process_file_operation

logger = logging.getLogger(__name__)

class FileTaskHandler(FileSystemEventHandler):
    """Handle file system events and process JSON task files"""
    
    def __init__(self, task_folder):
        self.task_folder = Path(task_folder)
        
    def on_created(self, event):
        """Process new task files"""
        if not event.is_directory and event.src_path.endswith('.json'):
            self.process_task_file(event.src_path)
    
    def process_task_file(self, task_file_path):
        """Process JSON task file and dispatch to file_handler"""
        try:
            with open(task_file_path, 'r') as f:
                task = json.load(f)
            
            logger.info("Processing task: %s", task.get('action', 'unknown'))
            
            # Dispatch to file_handler
            result = process_file_operation(task)
            
            # Log result
            if result.get('success'):
                logger.info("Task completed successfully: %s", result)
            else:
                logger.error("Task failed: %s", result.get('error'))
            
            # Remove processed task file
            Path(task_file_path).unlink()
            logger.info("Task file removed: %s", task_file_path)
            
        except Exception as e:
            logger.error("Error processing task file %s: %s", task_file_path, str(e))

def start_file_watcher(watch_folder="./tasks", task_folder="./tasks"):
    """Start watching for file changes and task files"""
    
    # Ensure directories exist
    Path(watch_folder).mkdir(exist_ok=True)
    Path(task_folder).mkdir(exist_ok=True)
    
    # Setup file watcher
    event_handler = FileTaskHandler(task_folder)
    observer = Observer()
    observer.schedule(event_handler, task_folder, recursive=False)
    
    logger.info("Starting file watcher on: %s", task_folder)
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Stopping file watcher...")
        observer.stop()
    
    observer.join()

def process_task_json(json_input):
    """Process a single JSON task directly"""
    try:
        task = json.loads(json_input) if isinstance(json_input, str) else json_input
        action = task.get('action')
        
        logger.info("Processing task action: %s", action)
        
        # Map action to operation for file_handler
        if action in ['move', 'copy', 'rename', 'delete', 'organize']:
            task['operation'] = action  # file_handler expects 'operation' key
            result = process_file_operation(task)
            return result
        else:
            logger.error("Invalid action: %s", action)
            return {"success": False, "error": f"Invalid action: {action}"}
            
    except Exception as e:
        logger.error("Error processing task: %s", str(e))
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Example: Process task directly
    example_task = {
        "action": "move",
        "source": "/uploads/invoice1.pdf",
        "destination": "/archive/2025/08/"
    }
    
    result = process_task_json(example_task)
    print(f"Task result: {result}")
    
    # Start file watcher (uncomment to run)
    # start_file_watcher()