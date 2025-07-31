#creating endpoints
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/automation")

class AutomationRequest(BaseModel):
    userId: str
    taskType: str

class UserRegistrationData(BaseModel):
    userId: str
    email: str
    username: str

@router.post("/run-task")
async def run_task(data: AutomationRequest):
   # log the task or simulate triggering automation
    print(f"Received automation task: {data.taskType} for user {data.userId}")
    
    # You can insert actual logic here, e.g., enqueue task, trigger script, etc.
    
    return {"message": f"Task {data.taskType} triggered for user {data.userId}"}

@router.post("/user-registered")
async def handle_user_registration(data: UserRegistrationData):
    print(f"New user registered: {data.username} ({data.email}) - ID: {data.userId}")
    
    # Automation logic for new user (e.g., setup default workflows, send welcome automation)
    # You can add actual automation tasks here
    
    return {"message": f"User registration processed for {data.username}", "status": "success"}
