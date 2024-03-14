from fastapi import Request
from fastapi.encoders import jsonable_encoder
from models import Board, CardList, Card
from api.card import card_get
from api.cardlist import cardlist_get
from api.board import board_get
from api.user import user_get
from typing import List

async def card_delete(request: Request, id: str):
    id = "card_" + id
    pk = id
    # remove from parent cardlist
    card_item = await card_get(request, id.split("card_", 1)[-1])
    parent_item = await cardlist_get(request, card_item['parent_id'])
    parent_item['cards'].remove(id.split("card_", 1)[-1])
    parent_item_dict = jsonable_encoder(parent_item)
    await request.app.boardly_container.replace_item("cardlist_" + card_item['parent_id'], parent_item_dict)
    # remove card from database
    await request.app.boardly_container.delete_item(id, partition_key=pk)
    return "Item successfully deleted!"

async def cardlist_delete(request: Request, id: str):
    id = "cardlist_" + id
    pk = id
    # delete all cards from cardlist
    cardlist_item = await cardlist_get(request, id.split("cardlist_", 1)[-1])
    cards = cardlist_item['cards']
    for card in cards:
        await card_delete(request, card)
    # remove from parent cardlist
    parent_item = await board_get(request, cardlist_item['parent_id'])
    parent_item['cardlists'].remove(id.split("cardlist_", 1)[-1])
    parent_item_dict = jsonable_encoder(parent_item)
    await request.app.boardly_container.replace_item("board_" + cardlist_item['parent_id'], parent_item_dict)
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