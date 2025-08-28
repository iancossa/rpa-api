from fastapi import FastAPI
from pydantic import BaseModel
from routes import automation
import threading
from consumer import start_consumer

app = FastAPI()
app.include_router(automation.router)

# Start RabbitMQ consumer in background thread
consumer_thread = threading.Thread(target=start_consumer, daemon=True)
consumer_thread.start()
class TaskRequest(BaseModel):
    task_name: str
    params: dict

#health check
@app.get("/")
def read_root():
    return {"message": "Automation service is up!"}

@app.post("/run-task")
def run_task(request: TaskRequest):
    # Simulate task execution
    print(f"Running task: {request.task_name} with params {request.params}")
    return {"status": "success", "task": request.task_name}
