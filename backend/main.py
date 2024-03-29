## This file is COMPLETE

## -----------------------------------------------------

from fastapi import FastAPI
from dotenv import dotenv_values
from azure.cosmos.aio import CosmosClient
from azure.cosmos import PartitionKey, exceptions
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from routes import router as router
from api.google import router as google_router 
import openai

config = dotenv_values(".env")
app = FastAPI(title="Boardly Endpoints")
database_name = "boardly_db"
container_name = "boardly_container"

origins = [
    "http://localhost:3000",
    "http://localhost",
    "127.0.0.1",
    "127.0.0.1:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, secret_key="add any string...")
app.include_router(router, prefix="/boardly")
app.include_router(google_router, prefix="/google")

@app.on_event("startup")
async def startup_db_client():
    # Connect to CosmosDB
    app.cosmos_client = CosmosClient(config["URI"], config["KEY"])
    await get_or_create_db(database_name)
    await get_or_create_container(container_name)

async def get_or_create_db(db_name):
    try:
        app.database  = app.cosmos_client.get_database_client(db_name)
        return await app.database.read()
    except exceptions.CosmosResourceNotFoundError:
        print("Creating database")
        return await app.cosmos_client.create_database(db_name)
     
async def get_or_create_container(container_name):
    try:        
        app.boardly_container = app.database.get_container_client(container_name)
        return await app.boardly_container.read()   
    except exceptions.CosmosResourceNotFoundError:
        print("Creating container with id as partition key")
        return await app.database.create_container(id=container_name, partition_key=PartitionKey(path="/id"))
    except exceptions.CosmosHttpResponseError:
        raise