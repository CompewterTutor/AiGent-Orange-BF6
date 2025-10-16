# Battlefield 6 Portal - Mod Development Checklist

This high-level checklist covers the essential phases and tasks for developing a Portal game mode. Use this to track your progress and ensure you haven't missed critical steps.

---

## Phase 1: Planning & Design

### Game Mode Concept
- [ ] Define core gameplay mechanics
- [ ] Identify win/loss conditions
- [ ] Determine player count (min/max)
- [ ] Choose team configuration (1v1, 2v2, FFA, Co-op, etc.)
- [ ] Define round/match structure
- [ ] Plan respawn behavior
- [ ] Create initial game mode brief (use `brief.md` template)

### Technical Requirements
- [ ] List required game objects (HQs, capture points, interact points, area triggers)
- [ ] Identify needed maps/levels
- [ ] Plan UI elements (HUD, menus, notifications)
- [ ] Define player variables/stats to track
- [ ] List special equipment or weapons needed
- [ ] Identify VFX/SFX requirements

---

## Phase 2: Project Setup

### File Structure
- [ ] Create mod folder: `mods/YourModName/`
- [ ] Copy template: `template.ts` → `YourModName.ts`
- [ ] Create brief file: `mods/YourModName/brief.md`
- [ ] Update VERSION constant in mod file
- [ ] Enable debug flags for development

### Initial Configuration
- [ ] Set minimum player count
- [ ] Configure combat start delay
- [ ] Set spawn mode (AutoSpawn, ManualSpawn, etc.)
- [ ] Configure friendly fire
- [ ] Define default team assignments

---

## Phase 3: Core Implementation

### Game State Management
- [ ] Define GameState enum values
- [ ] Implement state transition logic
- [ ] Add victory condition checks
- [ ] Handle game over scenarios
- [ ] Implement countdown/lobby phase

### Player Management
- [ ] Extend JsPlayer class with custom properties
- [ ] Implement player initialization in OnPlayerJoinGame
- [ ] Handle player cleanup in OnPlayerLeaveGame
- [ ] Track player statistics (score, kills, deaths, etc.)
- [ ] Implement team assignment logic

### Core Game Loop
- [ ] Implement TickUpdate() for fast updates (60fps)
- [ ] Implement ThrottledUpdate() for slow updates (1s)
- [ ] Add victory condition checking
- [ ] Handle round/match progression
- [ ] Implement respawn logic

### Event Handlers
- [ ] OnGameModeStarted - initialization logic
- [ ] OnPlayerJoinGame - player join handling
- [ ] OnPlayerLeaveGame - player leave/cleanup
- [ ] OnPlayerDeployed - spawn handling
- [ ] OnPlayerDied - death handling
- [ ] OnPlayerEarnedKill - kill tracking
- [ ] OnPlayerInteract - interaction handling (if needed)
- [ ] OnPlayerEnterAreaTrigger - area trigger entry (if needed)
- [ ] OnPlayerExitAreaTrigger - area trigger exit (if needed)
- [ ] OnCapturePointCaptured - capture point logic (if needed)
- [ ] OnVehicleSpawned - vehicle handling (if needed)

---

## Phase 4: Game Objects

### HQ/Spawn Setup
- [ ] Identify HQ object IDs in Godot
- [ ] Enable/disable HQs appropriately
- [ ] Configure spawn points
- [ ] Set team spawns
- [ ] Test spawn locations

### Capture Points (if applicable)
- [ ] Add capture point objects in Godot
- [ ] Record object IDs
- [ ] Implement capture logic
- [ ] Add capture progress UI
- [ ] Handle team ownership changes

### Interact Points (if applicable)
- [ ] Add interact point objects in Godot
- [ ] Record object IDs
- [ ] Implement interaction logic
- [ ] Add interaction prompts
- [ ] Handle cooldowns/restrictions

### Area Triggers (if applicable)
- [ ] Add area trigger objects in Godot
- [ ] Record object IDs
- [ ] Implement enter/exit logic
- [ ] Add boundary warnings/effects
- [ ] Test trigger volumes

---

## Phase 5: UI Implementation

### Lobby/Waiting UI
- [ ] Design lobby screen layout
- [ ] Display player count
- [ ] Show countdown timer
- [ ] Add match info/rules
- [ ] Test with ParseUI or manual creation

### In-Game HUD
- [ ] Display scores/objectives
- [ ] Show player stats
- [ ] Add timer displays
- [ ] Implement progress bars
- [ ] Add team indicators

### Messages & Notifications
- [ ] Implement MessageUI class
- [ ] Add kill feed messages
- [ ] Add objective notifications
- [ ] Add round start/end messages
- [ ] Configure message durations

### End Game UI
- [ ] Display final scores
- [ ] Show winner/loser
- [ ] Add match statistics
- [ ] Implement scoreboard

---

## Phase 6: Combat & Equipment

### Loadouts
- [ ] Define allowed weapons
- [ ] Configure default loadout
- [ ] Implement custom equipment (if needed)
- [ ] Add equipment restrictions
- [ ] Test weapon balance

### Damage & Health
- [ ] Configure damage modifiers (if needed)
- [ ] Implement custom health systems (if needed)
- [ ] Handle player death logic
- [ ] Add respawn delays/penalties
- [ ] Test damage feedback

### Inventory Management (if applicable)
- [ ] Implement item pickup
- [ ] Add inventory tracking
- [ ] Handle item drops on death
- [ ] Add inventory UI
- [ ] Test item persistence

---

## Phase 7: Teams & Scoring

### Team Configuration
- [ ] Set up team structure
- [ ] Assign team colors/names
- [ ] Implement team balancing
- [ ] Handle team switching
- [ ] Test team assignments

### Scoring System
- [ ] Define point values (kills, objectives, etc.)
- [ ] Implement score tracking
- [ ] Update scores in real-time
- [ ] Display scores in UI
- [ ] Test score accuracy

### Victory Conditions
- [ ] Implement score-based victory
- [ ] Add time-based victory
- [ ] Handle objective-based victory
- [ ] Implement elimination victory (if applicable)
- [ ] Test all win conditions

---

## Phase 8: Polish & Features

### Visual Effects
- [ ] Add VFX for key events (captures, kills, etc.)
- [ ] Implement screen effects (if needed)
- [ ] Add world icons/markers
- [ ] Configure particle effects
- [ ] Test VFX performance

### Sound Effects
- [ ] Add SFX for key events
- [ ] Implement ambient sounds
- [ ] Add UI sounds
- [ ] Configure audio settings
- [ ] Test audio mixing

### Quality of Life
- [ ] Add helpful messages
- [ ] Implement auto-balance
- [ ] Add spectator mode (if needed)
- [ ] Implement pause/resume (if applicable)
- [ ] Add admin commands (if needed)

---

## Phase 9: Testing & Debugging

### Functionality Testing
- [ ] Test with minimum players
- [ ] Test with maximum players
- [ ] Test all game states
- [ ] Test all event handlers
- [ ] Test victory conditions
- [ ] Test edge cases (player leave mid-game, etc.)

### Performance Testing
- [ ] Check for frame drops
- [ ] Monitor console for errors
- [ ] Test with long play sessions
- [ ] Verify memory usage
- [ ] Test on different maps

### Balance Testing
- [ ] Test gameplay pacing
- [ ] Verify spawn locations
- [ ] Check weapon/equipment balance
- [ ] Test round durations
- [ ] Gather player feedback

### Bug Fixes
- [ ] Fix critical bugs
- [ ] Address gameplay issues
- [ ] Resolve UI glitches
- [ ] Fix score/stat tracking bugs
- [ ] Clean up console errors

---

## Phase 10: Finalization

### Code Cleanup
- [ ] Remove debug code
- [ ] Disable debug flags
- [ ] Add comprehensive comments
- [ ] Format code consistently
- [ ] Remove unused functions

### Documentation
- [ ] Update brief.md with final details
- [ ] Document known issues
- [ ] Add setup instructions
- [ ] Create change log
- [ ] Write player guide (optional)

### Final Testing
- [ ] Full playthrough with real players
- [ ] Verify all features work
- [ ] Check for last-minute bugs
- [ ] Test on all supported maps
- [ ] Get final approval

### Release Preparation
- [ ] Update VERSION number
- [ ] Package mod files
- [ ] Create thumbnail/preview
- [ ] Write description
- [ ] Prepare for distribution

---

## Phase 11: Post-Release

### Monitoring
- [ ] Gather player feedback
- [ ] Monitor for bugs
- [ ] Track performance issues
- [ ] Note balance concerns

### Updates
- [ ] Address critical bugs
- [ ] Implement balance changes
- [ ] Add requested features
- [ ] Release patches
- [ ] Update documentation

---

## Quick Reference: Common Pitfalls

⚠️ **Remember to:**
- Use `GetObjId()` for all team comparisons
- Check `IsPlayerValid()` before accessing players
- Clean up UI elements on player leave
- Wait for minimum players before starting
- Disable debug flags before release
- Test object ID reuse scenarios
- Verify async timing with `await mod.Wait()`
- Handle equipment slot removal properly
- Test with player disconnections
- Check for null/undefined returns

---

## Notes

- Check off items as you complete them
- Not all items apply to every game mode
- Adjust checklist based on your specific needs
- Refer to `dev_guidelines.md` for detailed best practices
- Refer to `BF6_SDK.md` for API documentation
- Use `template.ts` as your starting point

Good luck with your mod development! 🎮
