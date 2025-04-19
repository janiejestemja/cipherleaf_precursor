"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const input = document.getElementById("textInput");
const button = document.getElementById("submitButton");
const list = document.getElementById("listContainer");
function renderList(items) {
    list.innerHTML = "";
    items.forEach((item, index) => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = item;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            yield fetch(`/items/${index}`, { method: "DELETE" });
            fetchItems();
        }));
        li.appendChild(p);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}
function fetchItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("/items");
        const items = yield response.json();
        renderList(items);
    });
}
button.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const text = input.value.trim();
    if (text !== "") {
        yield fetch("/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        input.value = "";
        fetchItems();
    }
}));
window.onload = fetchItems;
