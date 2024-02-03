from fastapi import APIRouter, Request
from fastapi.encoders import jsonable_encoder
from typing import List
from fastapi.responses import RedirectResponse
from dotenv import dotenv_values
import httpx

from models import User
from api import user, github, login

# Tags for organizing Swagger UI

tags_metadata = [
    {"name": "User"},
    {"name": "GitHub Login"},
    {"name": "Standard Login"}
]

router = APIRouter()

config = dotenv_values(".env")
github_client_id = config["GITHUB_CLIENT_ID"]
github_client_secret = config["GITHUB_CLIENT_SECRET"]

# User manipulation 

@router.post("/user/create", response_model=User, tags=["User"])
async def user_create(request: Request, user_item: User):
    return await user.user_create(request, user_item)

@router.get("/user/get", response_model=User, tags=["User"])
async def user_get(request: Request, id: str):
    return await user.user_get(request, id)

@router.delete("/user/delete", tags=["User"])
async def user_delete(request: Request, id: str):
    await user.user_delete(request, id)

@router.post("/user/update", response_model=User, tags=["User"])
async def user_update(request: Request, user_item: User):
    return await user.user_update(request, user_item)

@router.get("/user/get/all", response_model=List[User], tags=["User"])
async def user_get_all(request: Request):
    return await user.user_get_all(request)

# GitHub Login

@router.get("/github/login", tags=["GitHub Login"])
def login_with_github(request: Request):
    return RedirectResponse(f'https://github.com/login/oauth/authorize?client_id={github_client_id}', status_code=302)

@router.get("/login/callback", tags=["GitHub Login"])
async def login_callback(request: Request, code: str):
    return await github.login_callback(request, code)

@router.get("/github/get/user", tags=["GitHub Login"])
async def get_github_user_data(request: Request, access_token: str):
    return await github.github_authorize_url(request, access_token)

# Standard Login 

@router.post("/login", tags=["Standard Login"])
async def cred_get(request: Request, email: str, password: str):
    return await login.cred_get(request, email, password)