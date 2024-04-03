from pydantic import BaseModel
from typing import Optional, List

class Users(BaseModel):
    username: str
    email: str
    password: str

class History(BaseModel):
    player1: str
    player2: str
    winner: str
    date: str

