from datetime import datetime
from fastapi import FastAPI, APIRouter
from starlette.requests import Request
from starlette.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth, OAuthError
from dotenv import dotenv_values
from api.user import User, user_get, user_create
from azure.cosmos.exceptions import CosmosHttpResponseError

config = dotenv_values(".env")
CLIENT_ID = config["GOOGLE_CLIENT_ID"]
CLIENT_SECRET = config["GOOGLE_CLIENT_SECRET"]

router = APIRouter()

oauth = OAuth()
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    client_kwargs={
        'scope': 'email openid profile',
        'redirect_url': 'http://localhost:8000/google/auth'
    }
)

@router.get('/login', tags=["GitHub"])
async def google_login_callback(request: Request):
    url = request.url_for('auth')
    return await oauth.google.authorize_redirect(request, url)

@router.get('/auth', tags=["GitHub"])
async def auth(request: Request):
    token = None
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        print("ERROR")
    if token:
        user = token.get('userinfo')
        if user:
            username = user.email.split('@')[0]
            
            # Check if user exists
            user_state = await user_get(request, str(user.sub))

            if not user_state:
                # If the user doesn't exist, create a new user
                user_data_for_creation = User(
                    id=str(user.sub),
                    username=username,
                    email=user.email,
                    password="",
                    date_registered=str(datetime.now().date()),
                    board_member=[]
                )

                # Create the user in your database
                await user_create(request, user_data_for_creation)
                print("USER CREATED")
            else:
                print("USER EXISTS")
        else:
            print("User info not found in token")
    else:
        print("Token is None. Handle this case accordingly.")
    return RedirectResponse(f'http://localhost:3000/dashboard?user_id={str(user.sub)}')