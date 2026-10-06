@echo off
if "%~1"=="" ( echo Usage: rebuild.bat https://theirsite.com & exit /b 1 )
call .venv\Scripts\activate
python harvest.py %1 --crawl
