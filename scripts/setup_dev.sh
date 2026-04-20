#!/bin/bash
# Setup development environment

echo "Setting up backend..."
cp .env.example .env
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements/dev.txt
python manage.py migrate

echo "Setting up frontend..."
cd ../frontend
npm install

echo "Setup complete!"
