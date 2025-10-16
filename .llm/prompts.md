# BF6 Mod SDK Useful Prompts

## Setup

### Initial Documentation Generation
***This is for when the SDK changes so we can redo our documentation and other dev guidelines and skeleton files. You shouldn't have to run this unless your template repository is out of date compared to BF6 Mod SDK***

Develop a dev guidelines file with best practicer guidelines and other tips for llms to follow based on official mod code for battlefield 6 found in Vertigo.ts BombSquad.ts AcePursuit.ts and Exfil.ts. SDK documentation can be found in index.ts and index.d.ts. Generate a human readable documentation markdown file based on index and index.d in DOCS/BF6_SDK.md. Create a skeleton typescript file with a basic code layout and include essential functions and events that are generic and would be common to all game modes that are found inside the official mods in the context. Generate a high level checklist for mod development and include it in DOCS/common_checklist.md. Create a skeleton brief.md file with sections to describe a game like description and rules and number of players and win conditions and ui elements and player variables and teams etc

### TODO Generation
***This prompt will generate a granular todo list for your llm to keep track of progress with throughout development that is based on the information in your brief.md so fill that out first then run this prompt***

### Basic Development
***This is a generic development prompt essentially bootstrapping each separate task. Cater this to your liking per task.***


### Cleanup Documentation
***Run this prompt when your todo and memory documentation for your LLM are getting long and taking up a lot of context. I typically try to keep my todo and memory files under 5-600 lines.

