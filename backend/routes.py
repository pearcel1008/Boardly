from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from typing import List

from models import User
from api import user

router = APIRouter()

@router.post("/user/create", response_model=User)
async def user_create(request: Request, user_item: User):
    return await user.user_create(request, user_item)
