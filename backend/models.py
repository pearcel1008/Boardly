from pydantic import BaseModel
from typing import Optional
from typing import List

class User(BaseModel):
    id : str
    username : str
    email : str
    password: str
    date_registered : str 
    board_member : List[str] = [] # List of boards user is a member of, key = board_id

class Card(BaseModel):
    id : str
    title : str
    description : str
    parent_id : str
    order : int # Order in List

class CardList(BaseModel):
    id: str
    title : str
    cards : List[str] = [] # List of Card ids
    order : int # Order in Board
    parent_id : str

class Board(BaseModel):
    id : str
    title : str
    starred : bool  # true/ false
    parent_id : str
    cardlists : List[str] = [] # List of CardList ids
    members : List[str] = [] # List of users, admin added upon board creation
