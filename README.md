# Cipherleaf's precursor
---
A tiny, client-side encrypted message pad. Your words are encrypted before they ever touch the server.

## What's this all about?
---
Cipherleaf is an experimental notepad app built for learning and playing with
- End-to-end encryption
- Frontend + Backend integration
- Rust compiled to WebAssembly
- Full-stack development from scratch

It's simple. You enter a passphrase. You write encrypted messagess.

Only someone with the same passphrase can read them.

## How it works
---
- Frontend written in TypeScript
- Encryption is handled entirely in the browser using Rust -> WASM.
- The server (FastAPI) never sees plaintext - only encrypted bytes.
- Messages are stored as ciphertexts (lists of integers).

## Why?
---
This project is a learning playground.

It's a first dive into building a full-stack app by hand - no big frameworks, no shortcuts, just cryptographic curiosity and a love for tinkering.

## Running locally
---
### Prerequisites
---
- Python 3.11
- Rust + wasm-pack
- [TypeScript compiler](https://aka.ms/tsc)

### Install dependencies
---
- Installing wasm-pack
```bash
cargo install wasm-pack
```

- Installing PyPI packages
```bash
pip install -r requirements
```

### Compile Rust to WebAssembly
---
```bash
cd static/js/aes_ctr_rsts
wasm-pack build --target web
```

### Transpile the frontend TypeScript
---
```bash
cd ..
tsc
```

### Start the FastAPI backend
---
Change directory to the root directory of the repository and run...
```bash
uvicorn app:main --reload
```

## Status
---
Because of the way the encryption keys are derived by the passphrase, as well as the AES mode implemented this software is not safe for real world application - it's just a neat proof of concept.

The encryption engine used in Cipherleaf can be found [here](https://github.com/janiejestemja/aes_ctr_rspy) in a version that compiles into a Python module (installable via pip) instead of WebAssembly.

## License
---
MIT License
