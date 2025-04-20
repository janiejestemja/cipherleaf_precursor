import init, { AesCtrSecret } from "./pkg/aes_ctr_rsts.js";
await init();

const input = document.getElementById("textInput") as HTMLInputElement;
const button = document.getElementById("submitButton") as HTMLInputElement;
const list = document.getElementById("listContainer") as HTMLInputElement;

const key = new TextEncoder().encode("2".repeat(32));
const nonce = new TextEncoder().encode("4".repeat(8));

function renderList(items: number[][]) {
    list.innerHTML = ""; 

    items.forEach( (item, index) => {
        const li = document.createElement("li");
        const p = document.createElement("p");

        try {
            const encryptedBytes = new Uint8Array(item);
            const decrypted = new AesCtrSecret(key, nonce).encrypt(encryptedBytes);
            const decryptedText = new TextDecoder().decode(decrypted);
            p.textContent = decryptedText;
        } catch (e) {
            p.textContent = "[decryption failed]";
        }

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
    const items: number[][] = await response.json();
    renderList(items);
}

button.addEventListener("click", async () => {
    const text = input.value.trim();

    if (text !== "") {
        const encoded = new TextEncoder().encode(text);
        const encrypted = new AesCtrSecret(key, nonce).encrypt(encoded);
        const encryptedList = Array.from(encrypted);

        await fetch("/items", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ text: encryptedList }),
        });
        input.value = "";
        fetchItems();
    }
});

window.onload = fetchItems;
fetchItems();
