from fastapi import Request
from fastapi.encoders import jsonable_encoder
from models import Board, CardList, Card
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

async def board_get_all(request: Request) -> List[Board]:
    boards = []
    query = "SELECT * FROM c WHERE c.id LIKE 'board_%'"
    async for board in request.app.boardly_container.query_items(
        query=query
    ):
        boards.append(board)
    return boards