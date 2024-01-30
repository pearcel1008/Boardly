## This file is complete

## -----------------------------------------------------

from fastapi import FastAPI
from dotenv import dotenv_values
from azure.cosmos.aio import CosmosClient
from azure.cosmos import PartitionKey, exceptions
from routes import router as router

config = dotenv_values(".env")
app = FastAPI(title="Boardly Endpoints")
database_name = "boardly_db"
container_name = "boardly_container"

app.include_router(router, prefix="/boardly")

@app.on_event("startup")
async def startup_db_client():
    # Connect to CosmosDB
    app.cosmos_client = CosmosClient(config["URI"], config["KEY"])
    await get_or_create_db(database_name)
    await get_or_create_container(container_name)
    # Connect to OpenAI


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