# Standard Login 
from fastapi import Request, HTTPException
from fastapi.encoders import jsonable_encoder
from passlib.context import CryptContext  # Use passlib for password hashing
from azure.cosmos.exceptions import CosmosHttpResponseError

# Create a CryptContext instance
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def cred_get(request: Request, email: str, password: str):
    async for item in request.app.boardly_container.query_items(
        query="SELECT * FROM (SELECT * FROM boardly_container b WHERE b.id LIKE 'user_%') u WHERE u.email = @email",
        parameters=[dict(name="@email", value=email)],
    ):
        user_item = jsonable_encoder(item)
        hashed_password = user_item.get("password", "")

        # Verify the password
        if verify_password(password, hashed_password):
            # Password is correct, return user information
            # board operation
            return user_item
        else:
            # Password is incorrect, raise HTTPException
            raise HTTPException(status_code=401, detail="Invalid credentials")

    # No user found with the given email
    raise HTTPException(status_code=404, detail="User not found")

# Hash a password
def hash_password(password: str):
    return pwd_context.hash(password)

# Verify a password
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)