#creating endpoints
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/automation")

class AutomationRequest(BaseModel):
    userId: str
    taskType: str

@router.post("/run-task")
async def run_task(data: AutomationRequest):
   # log the task or simulate triggering automation
    print(f"Received automation task: {data.taskType} for user {data.userId}")
    
    # You can insert actual logic here, e.g., enqueue task, trigger script, etc.
    
    return {"message": f"Task {data.taskType} triggered for user {data.userId}"}
