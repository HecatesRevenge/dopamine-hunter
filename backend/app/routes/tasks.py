from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from ..models import Task, TaskStatus, TaskCreate
from ..db.storage import users, tasks
from ..services.id_service import id_service
from ..core.exceptions import UserNotFoundError, TaskNotFoundError

router = APIRouter()

@router.get("/users/{user_id}/tasks", response_model=list[Task])
async def get_tasks_endpoint(user_id: int):
    """Get all tasks for a specific user"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return list(user.tasks.values())

@router.post("/users/{user_id}/tasks", response_model=Task)
async def create_task_endpoint(user_id: int, task: TaskCreate):
    """Create a new task"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    task_obj = Task(
        id=id_service.generate_task_id(), 
        title=task.title, 
        description=task.description, 
        status=task.status, 
        user_id=user_id
    )
    user.tasks[task_obj.id] = task_obj
    tasks[task_obj.id] = task_obj
    return task_obj

@router.get("/users/{user_id}/tasks/{task_id}", response_model=Task)
async def get_task_endpoint(user_id: int, task_id: int):
    """Get a specific task by ID"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    task = user.tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task

@router.put("/users/{user_id}/tasks/{task_id}", response_model=Task)
async def update_task_endpoint(user_id: int, task_id: int, task_update: Task):
    """Update a task"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    task = user.tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Preserve original creation time
    task_update.created_at = task.created_at
    task_update.id = task_id
    task_update.user_id = user_id
    
    # Set completion time if task is being completed
    if task_update.completed_at is None and task.status != TaskStatus.COMPLETED and task_update.status == TaskStatus.COMPLETED:
        task_update.completed_at = datetime.now()
    
    user.tasks[task_id] = task_update
    tasks[task_id] = task_update
    return task_update

@router.delete("/users/{user_id}/tasks/{task_id}")
async def delete_task_endpoint(user_id: int, task_id: int):
    """Delete a task"""
    user = users.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    task = user.tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    user.tasks.pop(task_id)
    tasks.pop(task_id, None)
    return {"message": "Task deleted successfully"}