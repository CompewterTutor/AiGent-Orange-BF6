# AiGent-Orange-BF6

## Description

AiGent-Orange-BF6 is a template repository to generate new Battlefield 6 Mod repositories that are bootstrapped for LLM-assisted development as well as equipped with some useful documentation to refer to derived from official mod examples and the SDK itself.


## Support

***Current version of the BF6 SDK is `1.0.1.0`***

### Download SDK

You can download the current SDK from https://portal.battlefield.com/bf6/experiences

### Guides to using the Portal Godot-based Editor:

- Intro to Portal Guide: https://www.ea.com/games/battlefield/battlefield-6/news/portal-101-introduction-to-battlefield-portal
- Portal 101 - Advanced Creations: https://www.ea.com/games/battlefield/battlefield-6/news/portal-101-advanced-creations
- Battlefield Creator Program: https://www.ea.com/games/battlefield/battlefield-6/news/introducing-the-battlefield-creator-program
- Portal Main Hub: https://www.ea.com/games/battlefield/battlefield-6/portal
- Browse Community Portal Experiences: https://www.ea.com/games/battlefield/battlefield-6/portal/browse

## How To Use

1. Go to the repository github project page.
2. Click the create repository from template button
3. Name your MOD repository
4. Go to your new project's github page.
5. Clone your repository to your local BF6 SDK mods directory (SomeLocation/PortalSDK/mods)
6. Start development. Depending on your LLM/IDE of choice, there are several ways to do this outlined below, but all of them basically follow the same workflow.

## Development Guide

### General

The basic workflow is fairly simple:

1. Read through the documentation and the official examples so you have an idea of what you're doing. Read through the markdown files in the `.llm` folder. I've generated some helpful documentation; you can see what the files I've included are for below. I'd start with the `.llm/common_checklist.md` to get a general idea of what it'll take to do your mod.
2. Write your project brief using the template I've included. This is basically a description of your mod, your idea.the game type, the rules, etc.
3. Have your IDE generate a granular todo list that has phases that basically follow a semantic versioning roadmap. You can use one of the prompts in `.llm/prompts.md` to do so.
4. Start development following guidelines in `.llm/dev_guidelines.md` (or your custom built instructions file you generate for your IDE using the script described below). You can instruct your LLM to get started with a generic prompt in `.llm/prompts.md`
5. Track of your progress in `.llm/todo.md` and `.llm/memory.md` or if you are using a memory MCP server you can use that instead. I've provided prompts to use either in the `.llm/prompts.md` file.

### VSCode CoPilot

### Claude Code

### ChatGPT Codex

### Cline

### RooCode

### Others

As outlined in the general section above, I haven't used all of the different ways to code with LLMs in depth, but the concept here is generally the same.

## Files Included

### LLM

- `DOCS/common_checklist.md` : This has a basic outline of what most mods will need to implement so you have an idea of what it will take to develop your mod.
- `todo.md`
- `memory.md`
- `dev_guidelines.md`

### Useful Scripts

***These are python scripts using the python bundled with the sdk, at this time 3.11.11***

- `version_bump.py` - This script will bump the version of your mod in the manner you choose with the commandline options. You can choose to bump major, minor, or patch and you can choose whether or not to create a tag.
- `generate_llm_instructions.py` - This script will create an instruction file for the LLM of your choosing. Right now I don't support much because I find its easier to just use some common generic prompts that include the files I want in the context per task so that I can leave out instructions when I choose. If you'd like to generate files for copilot or for claude, they will be generated from the dev_guidelines.md. I recommend this so that if the upstream ever updates the dev guidelines due to an SDK version update or whatever, you can pull down and generate and manually merge with your local llm instructions without losing anything or dealing with messy merging/rebasing.
- `check_for_update.py` - checks for an update to the template repository and also the BF6 SDK. I'll try to keep this up to date.
