from fastapi import Request
import json
from fastapi.encoders import jsonable_encoder
from models import User, Board, CardList, Card
from api.user import user_get, user_update
from typing import List
from azure.cosmos.exceptions import CosmosHttpResponseError

# Update CardLists
# Update Order (Instead of updating the entire board?)

async def board_create(request: Request, board_item: Board):
    board_item.id = "board_" + board_item.id
    board_item.members.append(board_item.parent_id)
    # update user's board_member list
    parent_item = await user_get(request, board_item.parent_id)
    if parent_item['board_member'] is None:
        parent_item['board_member'] = []
    parent_item['board_member'].append(board_item.id.split("board_", 1)[-1])
    # update user in cosmos
    parent_item_dict = jsonable_encoder(parent_item)
    await request.app.boardly_container.replace_item("user_" + board_item.parent_id, parent_item_dict)
    # create board in cosmos
    board_item = jsonable_encoder(board_item)
    board_item = await request.app.boardly_container.create_item(board_item)
    return board_item

async def board_get(request: Request, id: str):
    id = "board_" + id
    pk = id
    try:
        board_item = await request.app.boardly_container.read_item(id, partition_key=pk)
        return board_item
    except CosmosHttpResponseError as ex:
        if ex.status_code == 404:
            return None  # User not found
        else:
            raise  # reraises error for frontend

async def board_update(request: Request, board_item: Board):
    # Updates every field in the requested Board to be updated
    existing_item = await request.app.boardly_container.read_item(board_item.id, partition_key = board_item.id)
    existing_item_dict = jsonable_encoder(existing_item)
    update_dict = jsonable_encoder(board_item)
    for (k) in update_dict.keys():
        existing_item_dict[k] = update_dict[k]
    return await request.app.boardly_container.replace_item(board_item.id, existing_item_dict)

async def update_board_field(request: Request, board_id: str, field_name: str, new_value):
    existing_board = await request.app.boardly_container.read_item(board_id, partition_key = card_id)
    existing_board[field_name] = new_value
    existing_board_dict = jsonable_encoder(existing_board)
    await request.app.boardly_container.replace_item(board_id, existing_board_dict)
    return {"message": f"Field '{field_name}' updated successfully"}

async def board_get_users(request: Request, user_id: str) -> List[Board]:
    boards = []
    user_item = await user_get(request, user_id)
    # grab individual boards
    user_dict = jsonable_encoder(user_item)
    user_boards = user_dict['board_member']
    for board_id in user_boards:
            query = f"SELECT * FROM c WHERE STARTSWITH(c.id, 'board_{board_id}')"
            async for board in request.app.boardly_container.query_items(
                query=query
            ):
                boards.append(board)
    return boards

# Won't need to ever call boards like this

""" async def board_get_all(request: Request) -> List[Board]:
    boards = []
    query = "SELECT * FROM c WHERE c.id LIKE 'board_%'"
    async for board in request.app.boardly_container.query_items(
        query=query
    ):
        boards.append(board)
    return boards """