from fastapi import Request
from fastapi.encoders import jsonable_encoder
from models import User
from typing import List


async def user_create(request: Request, user_item: User):
    user_item.id = "user_" + user_item.id
    user_item = jsonable_encoder(user_item)
    user_item = await request.app.boardly_container.create_item(user_item)
    return user_item