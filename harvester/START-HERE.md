# START HERE

Three steps, once. Then you never do this again.

## 1. Open this folder in your coding agent

Claude Code, Codex, Cursor, Windsurf, Antigravity or Copilot — any of them.

**File → Open Folder** and select this folder.

## 2. Install (one time only)

In the terminal, or just ask your agent to "run the setup":

- **Windows:** `setup.bat`
- **Mac / Linux:** `chmod +x setup.sh && ./setup.sh`

## 3. Rebuild your first site

Pick one of two ways.

**The easy way — let your agent do everything.**
In your agent's chat, type:

```
rebuild https://theirsite.com
```

It runs the tool and builds the new site on its own. It reads `CLAUDE.md` for the
full workflow.

**The manual way — prepare the folder only.**

- **Windows:** `rebuild.bat https://theirsite.com`
- **Mac / Linux:** `./rebuild.sh https://theirsite.com`

Then open `output/<domain>/REBUILD_BRIEF.md` and tell your agent to build from it.

---

## Running a list of sites at once

Put one URL per line in a text file, then:

```
python harvest.py --batch urls.txt --crawl
```

Harvester scores every site and prints a ranked summary, so you know which ones are
worth building first.

---

**The full guide, including how to approach the business owner, is in the PDF that
came with your purchase.**

Support: guigrigoletto666@gmail.com · Instagram [@guigrigoletto_](https://instagram.com/guigrigoletto_)
