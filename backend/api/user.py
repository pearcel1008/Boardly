# This file should be finished

from fastapi import Request
from fastapi.encoders import jsonable_encoder
from models import User
from typing import List
from azure.cosmos.exceptions import CosmosHttpResponseError
from api.login import hash_password

# pk and id are the same, stored in database with "user_" preceeding

async def user_create(request: Request, user_item: User):
    user_item.id = "user_" + user_item.id
    user_item.password = hash_password(user_item.password)  # Hash the password
    user_item = jsonable_encoder(user_item)
    user_item = await request.app.boardly_container.create_item(user_item)
    return user_item

async def user_get(request: Request, id: str):
    id = "user_" + id
    pk = id
    try:
        user_item = await request.app.boardly_container.read_item(id, partition_key=pk)
        return user_item
    except CosmosHttpResponseError as ex:
        if ex.status_code == 404:
            return None  # User not found
        else:
            raise  # reraises error for frontend

async def user_delete(request: Request, id: str):
     id = "user_" + id
     pk = id
     await request.app.boardly_container.delete_item(id, partition_key=pk)
     return "Item successfully deleted!"

async def user_update(request: Request, user_item: User):
    # Updates every field in the requested User to be updated
    existing_item = await request.app.boardly_container.read_item(user_item.id, partition_key = user_item.id)
    existing_item_dict = jsonable_encoder(existing_item)
    update_dict = jsonable_encoder(user_item)
    for (k) in update_dict.keys():
        existing_item_dict[k] = update_dict[k]
    return await request.app.boardly_container.replace_item(user_item.id, existing_item_dict)

async def update_user_field(request: Request, user_id: str, field_name: str, new_value):
    existing_user = await request.app.boardly_container.read_item("user_" + user_id, partition_key = "user_" + user_id)
    if hasattr(existing_user, field_name):
        setattr(existing_user, field_name, new_value)
    else:
        return {"error": f"Field '{field_name}' does not exist in the board model"}
    await request.app.boardly_container.replace_item(board_id, existing_board)
    return {"message": f"Field '{field_name}' updated successfully"}

async def user_get_all(request: Request) -> List[User]:
    users = []
    query = "SELECT * FROM c WHERE c.id LIKE 'user_%'"
    async for user in request.app.boardly_container.query_items(
        query=query
    ):
        users.append(user)
    return users