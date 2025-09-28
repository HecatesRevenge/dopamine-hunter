from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from ..models import Task, TaskStatus
from ..db.database import (
    get_tasks, create_task, get_task_by_id, 
    update_task, delete_task
)

router = APIRouter()

@router.get("/", response_model=list[Task])
async def get_tasks_endpoint(profile_id: int | None = Query(None)):
    """Get all tasks, optionally filtered by profile_id"""
    return get_tasks(profile_id)

@router.post("/", response_model=Task)
async def create_task_endpoint(task: Task):
    """Create a new task"""
    task.created_at = datetime.now()
    return create_task(task)

@router.get("/{task_id}", response_model=Task)
async def get_task_endpoint(task_id: int):
    """Get a specific task by ID"""
    task = get_task_by_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=Task)
async def update_task_endpoint(task_id: int, task_update: Task):
    """Update a task"""
    if task_update.status == TaskStatus.COMPLETED:
        task_update.completed_at = datetime.now()
    
    updated_task = update_task(task_id, task_update)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@router.delete("/{task_id}")
async def delete_task_endpoint(task_id: int):
    """Delete a task"""
    if not delete_task(task_id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
