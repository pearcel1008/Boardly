from fastapi import Request
from fastapi.encoders import jsonable_encoder
from models import Board, CardList, Card
from api.board import board_get
from typing import List
import uuid
from azure.cosmos.exceptions import CosmosHttpResponseError

async def cardlist_create(request: Request, cardlist_item: CardList):
    cardlist_item.id = "cardlist_" + str(uuid.uuid4())
    # update boards's cardlists list
    parent_item = await board_get(request, cardlist_item.parent_id)
    if parent_item['cardlists'] is None:
        parent_item['cardlists'] = []
    parent_item['cardlists'].append(cardlist_item.id.split("cardlist_", 1)[-1])
    # update board in cosmos
    parent_item_dict = jsonable_encoder(parent_item)
    await request.app.boardly_container.replace_item("board_" + cardlist_item.parent_id, parent_item_dict)
    # create cardlist in cosmos
    cardlist_item = jsonable_encoder(cardlist_item)
    cardlist_item = await request.app.boardly_container.create_item(cardlist_item)
    return cardlist_item

async def cardlist_get(request: Request, id: str):
    id = "cardlist_" + id
    pk = id
    try:
        cardlist_item = await request.app.boardly_container.read_item(id, partition_key=pk)
        return cardlist_item
    except CosmosHttpResponseError as ex:
        if ex.status_code == 404:
            return None  # User not found
        else:
            raise  # reraises error for frontend

async def cardlist_update(request: Request, cardlist_item: CardList):
    # Updates every field in the requested Board to be updated
    existing_item = await request.app.boardly_container.read_item(cardlist_item['id'], partition_key = cardlist_item['id'])
    existing_item_dict = jsonable_encoder(existing_item)
    update_dict = jsonable_encoder(cardlist_item)
    for (k) in update_dict.keys():
        existing_item_dict[k] = update_dict[k]
    return await request.app.boardly_container.replace_item(cardlist_item.id, existing_item_dict)

async def update_cardlist_field(request: Request, cardlist_id: str, field_name: str, new_value):
    existing_cardlist = await request.app.boardly_container.read_item(cardlist_id, partition_key = cardlist_id)
    existing_cardlist[field_name] = new_value
    existing_cardlist_dict = jsonable_encoder(existing_cardlist)
    await request.app.boardly_container.replace_item(cardlist_id, existing_cardlist_dict)
    return {"message": f"Field '{field_name}' updated successfully"}

# gets all cardlists for a particular board
async def cardlist_get_boards(request: Request, board_id: str) -> List[CardList]:
    _cardlists = []
    board_item = await board_get(request, board_id)
    # grab individual boards
    board_dict = jsonable_encoder(board_item)
    board_cardlists = board_dict['cardlists']
    for cardlist_id in board_cardlists:
            query = f"SELECT * FROM c WHERE STARTSWITH(c.id, 'cardlist_{cardlist_id}')"
            async for cardlist in request.app.boardly_container.query_items(
                query=query
            ):
                _cardlists.append(cardlist)
    return _cardlists