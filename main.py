from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List

app = FastAPI()

items: List[str] = []

class Item(BaseModel):
    text: str

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def serve_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/items")
async def get_items():
    return items

@app.post("/items")
async def add_item(item: Item):
    items.append(item.text)
    return {"status": "ok", "items": items}

@app.delete("/items/{index}")
async def delete_item(index: int):
    try:
        items.pop(index)
        return {"status": "deleted", "items": items}
    except IndexError:
        raise HTTPException(status_code=404, detail="Item not found")
