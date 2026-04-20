# Setup Guide

## Backend
1. Create a virtual environment: `python -m venv venv`
2. Activate it: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
3. Install dependencies: `pip install -r requirements/dev.txt`
4. Run migrations: `python manage.py migrate`
5. Start server: `python manage.py runserver`

## Frontend
1. Navigate to `frontend/`
2. Install npm packages: `npm install`
3. Start Expo: `npx expo start`

## Contracts
1. Install Rust and Soroban CLI.
2. Build contracts: `cargo build --target wasm32-unknown-unknown --release`
