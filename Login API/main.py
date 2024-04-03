from fastapi import FastAPI, HTTPException, Depends,status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models import Users,History
from database import db
from bson import ObjectId
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for simplicity
    allow_credentials=True,
    allow_methods=["POST","GET","PUT","DELETE"],  # Specifies which methods are allowed, add "OPTIONS" if needed
    allow_headers=["*"],  # Specifies which headers are allowed
)

def users_entity(entity) -> dict:
    return {
        "id": str(entity["_id"]),
        "username": entity["username"],
        "email": entity["email"],
        "password": entity["password"],
    }

def history(entity) -> dict:
    return {
        "id": str(entity["_id"]),
        "player1": entity["player1"],
        "player2": entity["player2"],
        "winner": entity["winner"],
        "date": entity["date"],
    }

@app.post("/users/", response_model=Users)
async def create_movie(movie: Users):
    movie = dict(movie)
    result = db.users.insert_one(movie)
    movie["_id"] = result.inserted_id
    return users_entity(movie)

@app.post("/history/", response_model=History)
async def create_movie(movie: History):
    movie = dict(movie)
    result = db.history.insert_one(movie)
    movie["_id"] = result.inserted_id
    return history(movie)

@app.get("/history/", response_model=List[History])
async def read_all_movies():
    movies = db.history.find()
    return [history(movie) for movie in movies]

@app.get("/users/", response_model=List[Users])
async def read_all_movies():
    movies = db.users.find()
    return [users_entity(movie) for movie in movies]

@app.get("/users/{id}", response_model=Users)
async def read_movie(id: str):
    movie = db.users.find_one({"_id": ObjectId(id)})
    if movie is not None:
        return users_entity(movie)
    raise HTTPException(status_code=404, detail=f"User {id} not found")

@app.put("/users/{id}", response_model=Users)
async def update_movie(id: str, movie_update: Users):
    db.users.update_one({"_id": ObjectId(id)}, {"$set": movie_update.dict(exclude_unset=True)})
    movie = db.users.find_one({"_id": ObjectId(id)})
    if movie is not None:
        return users_entity(movie)
    raise HTTPException(status_code=404, detail=f"User {id} not found")


@app.delete("/users/{id}", response_model=Users)
async def delete_movie(id: str):
    movie = db.users.find_one({"_id": ObjectId(id)})
    if movie is not None:
        db.users.delete_one({"_id": ObjectId(id)})
        return users_entity(movie)
    raise HTTPException(status_code=404, detail=f"User {id} not found")



def authenticate_user(username: str, password: str):
    user = db.users.find_one({"username": username})
    if not user or user['password'] != password:
        return False
    return True

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_authenticated = authenticate_user(form_data.username, form_data.password)
    if not user_authenticated:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    return {"message": f"Welcome {form_data.username}!"}