# AiGent-Orange-BF6

## Description

AiGent-Orange-BF6 is a template repository to generate new Battlefield 6 Mod repositories that are bootstrapped for LLM-assisted development as well as equipped with some useful documentation to refer to derived from official mod examples and the SDK itself.

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
1. Read through the documentation and the official examples so you have an idea of what you're doing. You'll need the SDK, you can download it from https://portal.battlefield.com/bf6/experiences. Read through the documentation in the `.llm` folder. I've generated some helpful documentation, you can see what the files I've included are below.
2. Write your project brief using the template I've included.
3. Have your IDE generate a granular todo list that has phases that basically follow a semantic versioning roadmap.
4. Start development following guidelines in `.llm/dev_guidelines.md` (or your custom built instructions file you generate for your IDE using the script described below).
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
