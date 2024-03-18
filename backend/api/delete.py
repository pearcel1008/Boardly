from fastapi import Request
from fastapi.encoders import jsonable_encoder
from models import Board, CardList, Card
from api.card import card_get, update_card_field
from api.cardlist import cardlist_get, update_cardlist_field
from api.board import board_get
from api.user import user_get
from typing import List

async def card_delete(request: Request, id: str):
    id = "card_" + id
    pk = id
    # remove from parent cardlist
    deleted_card = await card_get(request, id.split("card_", 1)[-1])
    deleted_order = deleted_card['order']
    parent_item = await cardlist_get(request, deleted_card['parent_id'])
    parent_item['cards'].remove(id.split("card_", 1)[-1])
    parent_item_dict = jsonable_encoder(parent_item)
    await request.app.boardly_container.replace_item("cardlist_" + deleted_card['parent_id'], parent_item_dict)
    # update the other cards' order field
        # cards below removed card should have order decreased
    cards = parent_item['cards']
    for card_id in cards:
        # get the card
        card_item = await card_get(request, card_id)
        if card_item['order'] > deleted_order:
            new_val = card_item['order'] - 1
            await update_card_field(request, card_item['id'], "order", new_val)
    # remove card from database
    await request.app.boardly_container.delete_item(id, partition_key=pk)
    return "Item successfully deleted!"

async def cardlist_delete(request: Request, id: str):
    id = "cardlist_" + id
    pk = id
    # delete all cards from cardlist
    deleted_cardlist = await cardlist_get(request, id.split("cardlist_", 1)[-1])
    cards = deleted_cardlist['cards']
    deleted_order = deleted_cardlist['order']
    for card in cards:
        await card_delete(request, card)
    # remove from parent cardlist
    parent_item = await board_get(request, deleted_cardlist['parent_id'])
    parent_item['cardlists'].remove(id.split("cardlist_", 1)[-1])
    parent_item_dict = jsonable_encoder(parent_item)
    await request.app.boardly_container.replace_item("board_" + deleted_cardlist['parent_id'], parent_item_dict)
    # update the other cards' order field
        # cards below removed card should have order decreased
    cardlists = parent_item['cardlists']
    for cardlist_id in cardlists:
        # get the card
        cardlist_item = await cardlist_get(request, cardlist_id)
        if cardlist_item['order'] > deleted_order:
            new_val = cardlist_item['order'] - 1
            await update_cardlist_field(request, cardlist_item['id'], "order", new_val)
    # remove card from database
    await request.app.boardly_container.delete_item(id, partition_key=pk)
    return "Item successfully deleted!"


async def board_delete(request: Request, id: str):
    id = "board_" + id
    pk = id
    # delete all cardlists from board
    board_item = await board_get(request, id.split("board_", 1)[-1])
    cardlists = board_item['cardlists']
    for cardlist in cardlists:
        await cardlist_delete(request, cardlist)
    # remove from parent user
    parent_item = await user_get(request, board_item['parent_id'])
    parent_item['board_member'].remove(id.split("board_", 1)[-1])
    parent_item_dict = jsonable_encoder(parent_item)
    await request.app.boardly_container.replace_item("user_" + board_item['parent_id'], parent_item_dict)
    await request.app.boardly_container.delete_item(id, partition_key=pk)
    return "Item successfully deleted!"