#!/usr/bin/env bash
if [ -z "$1" ]; then echo "Usage: ./rebuild.sh https://theirsite.com"; exit 1; fi
source .venv/bin/activate 2>/dev/null
python harvest.py "$1" --crawl
