from fastapi import Request
from fastapi.encoders import jsonable_encoder
from models import Board, CardList, Card
from typing import List

async def cardlist_create(request: Request, cardlist_item: CardList):
    cardlist_item.id = "cardlist_" + cardlist_item.id
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

async def cardlist_delete(request: Request, id: str):
    id = "cardlist_" + id
    pk = id
    await request.app.boardly_container.delete_item(id, partition_key=pk)
    return "Item successfully deleted!"

async def card_update(request: Request, cardlist_item: CardList):
    # Updates every field in the requested Board to be updated
    existing_item = await request.app.boardly_container.read_item(cardlist_item.id, partition_key = cardlist_item.id)
    existing_item_dict = jsonable_encoder(existing_item)
    update_dict = jsonable_encoder(cardlist_item)
    for (k) in update_dict.keys():
        existing_item_dict[k] = update_dict[k]
    return await request.app.boardly_container.replace_item(cardlist_item.id, existing_item_dict)

async def card_get_all(request: Request) -> List[CardList]:
    cardlists = []
    query = "SELECT * FROM c WHERE c.id LIKE 'cardlist_%'"
    async for cardlist in request.app.boardly_container.query_items(
        query=query
    ):
        cardlists.append(cardlist)
    return cardlists
