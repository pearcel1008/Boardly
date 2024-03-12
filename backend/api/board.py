from fastapi import Request
import json
from fastapi.encoders import jsonable_encoder
from models import User, Board, CardList, Card
from api.user import user_get
from typing import List

# Update CardLists
# Update Order (Instead of updating the entire board?)

async def board_create(request: Request, board_item: Board):
    board_item.id = "board_" + board_item.id
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

async def board_delete(request: Request, id: str):
    id = "board_" + id
    pk = id
    await request.app.boardly_container.delete_item(id, partition_key=pk)
    return "Item successfully deleted!"

async def board_update(request: Request, board_item: Board):
    # Updates every field in the requested Board to be updated
    existing_item = await request.app.boardly_container.read_item(board_item.id, partition_key = board_item.id)
    existing_item_dict = jsonable_encoder(existing_item)
    update_dict = jsonable_encoder(board_item)
    for (k) in update_dict.keys():
        existing_item_dict[k] = update_dict[k]
    return await request.app.boardly_container.replace_item(board_item.id, existing_item_dict)

# Won't need to ever call boards like this
# Change to only call a certain user's boards
## Users have lists of board ids, so pass into this then go through the list calling get, give back a set of boards 

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

async def board_get_all(request: Request) -> List[Board]:
    boards = []
    query = "SELECT * FROM c WHERE c.id LIKE 'board_%'"
    async for board in request.app.boardly_container.query_items(
        query=query
    ):
        boards.append(board)
    return boards