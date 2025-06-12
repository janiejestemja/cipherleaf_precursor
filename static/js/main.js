import init, { AesCtrSecret } from "./pkg/aes_ctr_rsts.js";
await init();
const input = document.getElementById("textInput");
const button = document.getElementById("submitButton");
const list = document.getElementById("listContainer");
let passphrase = "";
while (!passphrase) {
    passphrase = prompt("Enter passphrase: ")?.trim() || "";
}
const { key, nonce } = await deriveKeyAndNonce(passphrase);
console.log(key);
console.log(nonce);
async function deriveKeyAndNonce(passphrase) {
    const encoder = new TextEncoder();
    const data = encoder.encode(passphrase);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = new Uint8Array(hashBuffer);
    const key = hashArray.slice(0, 32);
    const nonce = hashArray.slice(0, 8).reverse();
    return { key, nonce };
}
function renderList(items) {
    list.innerHTML = "";
    items.forEach((item, index) => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        try {
            const encryptedBytes = new Uint8Array(item);
            const decrypted = new AesCtrSecret(key, nonce).encrypt(encryptedBytes);
            const decryptedText = new TextDecoder().decode(decrypted);
            p.textContent = decryptedText;
        }
        catch (e) {
            p.textContent = "[decryption failed]";
        }
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
        const encoded = new TextEncoder().encode(text);
        const encrypted = new AesCtrSecret(key, nonce).encrypt(encoded);
        const encryptedList = Array.from(encrypted);
        await fetch("/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: encryptedList }),
        });
        input.value = "";
        fetchItems();
    }
});
window.onload = fetchItems;
fetchItems();
