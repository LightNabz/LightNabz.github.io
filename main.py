from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

app.mount("/assets", StaticFiles(directory="assets"), name="assets")

@app.get("/")
def read_index():
    return FileResponse("index.html")
