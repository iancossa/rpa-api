from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class TaskRequest(BaseModel):
    task_name: str
    params: dict

@app.get("/")
def read_root():
    return {"message": "Automation service is up!"}

@app.post("/run-task")
def run_task(request: TaskRequest):
    # Simulate task execution
    print(f"Running task: {request.task_name} with params {request.params}")
    return {"status": "success", "task": request.task_name}
