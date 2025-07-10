from fastapi import FastAPI
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
# CORS allows our front end and backend to communicate basically imagine 2 different servers and CORS is the pipeline 
# or middleware ... ALSO delete this before commit markus

app = FastAPI() #app instance 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # Allow any frontend (for dev) For development only.  
    allow_credentials=True, #In production, set this to your actual frontend URL like https://bargainbaskets.com.
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("x")# yeah lets not leave this in the commit
db = client["sample_mflix"]
collection = db["users"]
# cluster -> databasename -> collection

@app.get("/api/items")
def get_items():
    items = list(collection.find({}, {"_id": 0, "password": 0,}))  # exclude _id field
    return {"items": items}

# to see list of item(s) goto http://127.0.0.1:8000/api/items
#uvicorn Main:app --reload
# to load the website