# This file holds functions related to logging in with github

from fastapi import Request
from typing import List
import httpx, json
from dotenv import dotenv_values
from api.user import user_get, user_create
from models import User
from datetime import datetime
from fastapi.responses import RedirectResponse

config = dotenv_values(".env")
github_client_id = config["GITHUB_CLIENT_ID"]
github_client_secret = config["GITHUB_CLIENT_SECRET"]

# User id = Github id for those signing in this way
# Pull from Github user API

async def get_github_user_data(request: Request, access_token: str):
    async with httpx.AsyncClient() as client:
        headers = {"Authorization": f"Bearer {access_token}"}
        response = await client.get("https://api.github.com/user", headers=headers)
    return response.json()

# This function is what is returned to after Github auth

async def login_callback(request: Request, code: str):
    params = {
        'client_id': github_client_id,
        'client_secret': github_client_secret,
        'code': code
    }
    headers = {'Accept': 'application/json'}
    async with httpx.AsyncClient() as client:
        response = await client.post(url='https://github.com/login/oauth/access_token', params=params, headers=headers)
    response_json = response.json()
    access_token = response_json['access_token']
    user_data = await get_github_user_data(request, access_token)

    # Check if user exists
    user_state = await user_get(request, str(user_data["id"]))

    if not user_state:
        # If the user doesn't exist, create a new user with id = Github id
        user_data_for_creation = User (
            id = str(user_data["id"]),
            username = user_data["login"],
            email = "", # email not provided by GitHub API
            password = "",  # Might generate a password to store in real world application
            date_registered = str(datetime.now().date()), 
            board_member = []
        )
                    
        # Create the user in your database
        created_user = await user_create(request, user_data_for_creation)
    return RedirectResponse(f'http://localhost:3000/dashboard?user_id={str(user_data["id"])}')