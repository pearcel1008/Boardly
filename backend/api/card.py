from fastapi import Request
from fastapi.encoders import jsonable_encoder
from models import Board, CardList, Card
from api.cardlist import cardlist_get
from typing import List
from uuid import uuid4
from azure.cosmos.exceptions import CosmosHttpResponseError

async def card_create(request: Request, card_item: Card):
    card_item.id = "card_" + str(uuid.uuid4())
    # update cardlist's cards list
    parent_item = await cardlist_get(request, card_item.parent_id)
    if parent_item['cards'] is None:
        parent_item['cards'] = []
    parent_item['cards'].append(card_item.id.split("card_", 1)[-1])
    # update cardlist in cosmos
    parent_item_dict = jsonable_encoder(parent_item)
    await request.app.boardly_container.replace_item("cardlist_" + card_item.parent_id, parent_item_dict)
    # create card in cosmos
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

async def card_update(request: Request, card_item: Card):
    # Updates every field in the requested Board to be updated
    existing_item = await request.app.boardly_container.read_item(card_item.id, partition_key = card_item.id)
    existing_item_dict = jsonable_encoder(existing_item)
    update_dict = jsonable_encoder(card_item)
    for (k) in update_dict.keys():
        existing_item_dict[k] = update_dict[k]
    return await request.app.boardly_container.replace_item(card_item.id, existing_item_dict)

async def update_card_field(request: Request, card_id: str, field_name: str, new_value):
    existing_card = await request.app.boardly_container.read_item(card_id, partition_key = card_id)
    existing_card[field_name] = new_value
    existing_card_dict = jsonable_encoder(existing_card)
    await request.app.boardly_container.replace_item(card_id, existing_card_dict)
    return {"message": f"Field '{field_name}' updated successfully"}

# gets all cards for a particular cardlist
async def card_get_cardlists(request: Request, cardlist_id: str) -> List[Card]:
    _cards = []
    cardlist_item = await cardlist_get(request, cardlist_id)
    # grab individual boards
    cardlist_dict = jsonable_encoder(cardlist_item)
    cardlist_cards = cardlist_dict['cards']
    for card_id in cardlist_cards:
            query = f"SELECT * FROM c WHERE STARTSWITH(c.id, 'card_{card_id}')"
            async for card in request.app.boardly_container.query_items(
                query=query
            ):
                _cards.append(card)
    return _cards

# list move will be like the "within same list" part
# Edge Case 1: Moving first card in a list (All cards need adjustments if moving list-to-list; if moving within a list then the cards between old position and new position need to be shifted up)
    # Separate if for moving 1st card within a list
# Edge Case 2: Moving last card in a list (no adjustments to old list needed if moving list-to-list)

async def card_move(request: Request, card_id: str, old_list_id: str, new_list_id: str = None, target_position: int = None):
    # get the card being moved
    # get all the cards in old_list_id
    # Within same list:
        # if new_list_id is none:
            # set card's postion to target_position
            # for cards with position >= moving_card's and id != moving_card's, increase order field
                # update each card in DB (card_update_field?)
            # update moving_card in DB
            # DO NOT NEED TO UPDATE THE CURRENT LIST AT ALL BC IT DOESN'T GAF ABOUT CARDS' ORDERS

    # To another list:
        # if new_list_id is not None:
            # remove card from old list
                # update cards below old card (order - 1)
                # remove from cardlist's list of cards
            # add card to new list in target position 
    return {"message": "Card moved successfully!"}