@echo off
echo >> Setting up Harvester (you only do this once)...
python -m venv .venv
call .venv\Scripts\activate
pip install --upgrade pip -q
pip install -r requirements.txt -q
echo.
echo >> Done. Environment ready.
echo >> Now just run:  rebuild.bat https://theirsite.com
