import init, { AesCtrSecret } from "./pkg/aes_ctr_rsts.js";
await init();
const input = document.getElementById("textInput");
const button = document.getElementById("submitButton");
const list = document.getElementById("listContainer");
const key = new TextEncoder().encode("2".repeat(32));
const nonce = new TextEncoder().encode("4".repeat(8));
const secret = new AesCtrSecret(key, nonce);
const data = new TextEncoder().encode("This is a test message...");
const encrypted = secret.encrypt(data);
console.log("Ciphertext: ", encrypted);
const decrypted = new AesCtrSecret(key, nonce).encrypt(encrypted);
console.log("Deciphered text: ", new TextDecoder().decode(decrypted));
function renderList(items) {
    list.innerHTML = "";
    items.forEach((item, index) => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = item;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.addEventListener("click", async () => {
            await fetch(`/items/${index}`, { method: "DELETE" });
            fetchItems();
        });
        li.appendChild(p);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}
async function fetchItems() {
    const response = await fetch("/items");
    const items = await response.json();
    renderList(items);
}
button.addEventListener("click", async () => {
    const text = input.value.trim();
    if (text !== "") {
        await fetch("/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        input.value = "";
        fetchItems();
    }
});
window.onload = fetchItems;
