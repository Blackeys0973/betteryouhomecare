#!/usr/bin/env bash
set -e
echo ">> Setting up Harvester (you only do this once)..."
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip -q
pip install -r requirements.txt -q
echo ""
echo ">> Done. Environment ready."
echo ">> Now just run:  ./rebuild.sh https://theirsite.com"
