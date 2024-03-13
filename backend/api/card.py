from fastapi import Request
from fastapi.encoders import jsonable_encoder
from models import Board, CardList, Card
from typing import List

async def card_create(request: Request, card_item: Card):
    card_item.id = "card_" + card_item.id
    card_item = jsonable_encoder(card_item)
    card_item = await request.app.boardly_container.create_item(card_item)
    return card_item

async def card_get(request: Request, id: str):
    id = "card_" + id
    pk = id
    try:
        card_item = await request.app.boardly_container.read_item(id, partition_key=pk)
        return card_item
    except CosmosHttpResponseError as ex:
        if ex.status_code == 404:
            return None  # User not found
        else:
            raise  # reraises error for frontend

async def card_delete(request: Request, id: str):
    id = "card_" + id
    pk = id
    await request.app.boardly_container.delete_item(id, partition_key=pk)
    return "Item successfully deleted!"

async def card_update(request: Request, card_item: Card):
    # Updates every field in the requested Board to be updated
    existing_item = await request.app.boardly_container.read_item(card_item.id, partition_key = card_item.id)
    existing_item_dict = jsonable_encoder(existing_item)
    update_dict = jsonable_encoder(card_item)
    for (k) in update_dict.keys():
        existing_item_dict[k] = update_dict[k]
    return await request.app.boardly_container.replace_item(card_item.id, existing_item_dict)

async def update_card_field(request: Request, card_id: str, field_name: str, new_value):
    existing_card = await request.app.boardly_container.read_item(card_id, partition_key=card_id)
    if hasattr(existing_card, field_name):
        setattr(existing_card, field_name, new_value)
    else:
        return {"error": f"Field '{field_name}' does not exist in the card model"}
    await request.app.boardly_container.replace_item(card_id, existing_card)
    return {"message": f"Field '{field_name}' updated successfully"}

# gets all cards for a particular cardlist
async def card_get_cardlists(request: Request, cardlist_id: str) -> List[Card]:
    _cards = []
    cardlist_item = await cardlist_get(request, cardlist_id)
    # grab individual boards
    cardlist_dict = jsonable_encoder(cardlist_item)
    cardlist_cards = user_dict['cards']
    for card_id in cardlist_cards:
            query = f"SELECT * FROM c WHERE STARTSWITH(c.id, 'card_{card_id}')"
            async for card in request.app.boardly_container.query_items(
                query=query
            ):
                _cards.append(card)
    return _cards

async def card_get_all(request: Request) -> List[Card]:
    cards = []
    query = "SELECT * FROM c WHERE c.id LIKE 'card_%'"
    async for card in request.app.boardly_container.query_items(
        query=query
    ):
        cards.append(card)
    return cards
