from pydantic import BaseModel
from typing import Optional
from typing import List

class User(BaseModel):
    id : str
    username : str
    email : str
    password: str
    date_registered : str 
    board_member : List[str] = [] ## List of boards user is a member of, key = board_id

