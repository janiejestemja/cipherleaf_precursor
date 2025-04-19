const input = document.getElementById("textInput") as HTMLInputElement;
const button = document.getElementById("submitButton") as HTMLInputElement;
const list = document.getElementById("listContainer") as HTMLInputElement;

function renderList(items: string[]) {
    list.innerHTML = ""; 

    items.forEach( (item, index) => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = item;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener("click", async () => {
            await fetch (`/items/${index}`, {method: "DELETE"} );
            fetchItems();
        });

        li.appendChild(p);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

async function fetchItems() {
    const response = await fetch("/items");
    const items: string[] = await response.json();
    renderList(items);
}

button.addEventListener("click", async () => {
    const text = input.value.trim();

    if (text !== "") {
        await fetch("/items", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ text }),
        });
        input.value = "";
        fetchItems();
    }
});

window.onload = fetchItems;
