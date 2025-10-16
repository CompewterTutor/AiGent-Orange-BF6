# Battlefield 6 Portal - Development Guidelines for LLMs

## Overview
This document provides best practices and guidelines for both traditional human brain based or LLM-assisted development of Battlefield 6 Portal game modes. These guidelines are derived from official mods (Vertigo, BombSquad, AcePursuit, Exfil) and SDK patterns.

---

## Core Principles

### 1. **Structure and Organization**
- **Version tracking**: Always include a VERSION constant at the top: `const VERSION = [major, minor, patch]`
- **Debug flags**: Use debug flags for testing (`debugJSPlayer`, `debugTeam`, etc.) with clear comments to disable before sharing
- **Constants over magic numbers**: Define all IDs, timings, and configuration values as named constants at file scope
- **Separation of concerns**: Keep game state, player management, UI, and game loop logic separate

### 2. **Naming Conventions**
- **Events**: Use PascalCase prefixed with "On": `OnPlayerJoinGame`, `OnPlayerDeployed`, `OnPlayerDied`
- **Game state variables**: Use camelCase: `gameOver`, `combatStarted`, `roundEnded`
- **Constants**: Use UPPERCASE for important constants: `BLACKCOLOR`, `REDCOLOR`, `ZEROVEC`
- **UI widgets**: Use descriptive names ending in "Widget" or "UI": `headerWidget`, `lobbyUI`
- **IDs**: Suffix with "ID": `team1HQ1ID`, `startInteractPointID`

### 3. **TypeScript Patterns**

#### Type Declarations
```typescript
// Use type aliases for clarity
type Widget = mod.UIWidget;
type Dict = { [key: string]: any };

// Define custom types for game objects
type Vector3 = { x: number; y: number; z: number };
type Checkpoint = { id: number; position: Vector3; /* ... */ };

// Use enums for game states
enum CaptureState {
    Idle,
    Capturing,
    Contested,
    Victory
}
```

#### Async/Await Pattern
```typescript
// Always use async for game mode startup
export async function OnGameModeStarted() {
    // Wait for minimum players
    while (initialPlayerCount < minimumInitialPlayerCount) {
        await mod.Wait(1);
    }
    
    // Start update loops (don't await these)
    TickUpdate();
    ThrottledUpdate();
}

// Separate update loops for different frequencies
async function TickUpdate() {
    while (true) {
        await mod.Wait(0.016); // 60fps
        // Fast update logic
    }
}

async function ThrottledUpdate() {
    while (true) {
        await mod.Wait(1); // 1 second
        // Slower update logic
    }
}
```

---

## Player Management

### Player Data Pattern (JSPlayer Class)
All official mods use a `JsPlayer` class to track player data:

```typescript
class JsPlayer {
    player: mod.Player;
    playerId: number;
    
    // Game-specific properties
    cash: number = 800;
    isDeployed: boolean = false;
    outOfRound: boolean = false;
    
    // UI references
    lobbyUI: LobbyUI;
    messageUI: MessageUI;
    
    static playerInstances: mod.Player[] = [];
    static #allJsPlayers: { [key: number]: JsPlayer } = {};
    
    constructor(player: mod.Player) {
        this.player = player;
        this.playerId = mod.GetObjId(player);
        JsPlayer.playerInstances.push(this.player);
    }
    
    static get(player: mod.Player) {
        if (!gameOver && mod.GetObjId(player) > -1) {
            let index = mod.GetObjId(player);
            let jsPlayer = this.#allJsPlayers[index];
            if (!jsPlayer) {
                jsPlayer = new JsPlayer(player);
                this.#allJsPlayers[index] = jsPlayer;
            }
            return jsPlayer;
        }
        return undefined;
    }
    
    static removeInvalidJSPlayers(invalidPlayerId: number) {
        delete this.#allJsPlayers[invalidPlayerId];
        // Remove from instances array
        let indexToRemove = -1;
        JsPlayer.playerInstances.forEach((player, i) => {
            if (mod.GetObjId(player) < 0) indexToRemove = i;
        });
        if (indexToRemove > -1) {
            JsPlayer.playerInstances.splice(indexToRemove, 1);
        }
    }
}
```

**Key Points:**
- Use static `get()` method for player retrieval with automatic instantiation
- Track both `playerInstances` array and `#allJsPlayers` dictionary
- Always clean up on player leave with `removeInvalidJSPlayers()`
- Check `mod.GetObjId(player) > -1` before operations

---

## Event Handlers

### Essential Event Structure
```typescript
export async function OnGameModeStarted() {
    // 1. Initialize game state
    // 2. Setup scene objects (HQs, objectives, etc.)
    // 3. Wait for minimum players
    // 4. Start countdown
    // 5. Begin game loops
}

export async function OnPlayerJoinGame(player: mod.Player) {
    // 1. Get or create JsPlayer
    // 2. Check if human or AI
    // 3. Show lobby UI if not started
    // 4. Increment player count
    // 5. Update all lobby UIs
}

export async function OnPlayerLeaveGame(playerId: number) {
    // 1. Clean up player-specific data
    // 2. Remove from JSPlayer tracking
    // 3. Update player counts
    // 4. Check victory conditions
}

export function OnPlayerDeployed(eventPlayer: mod.Player) {
    // 1. Get JsPlayer instance
    // 2. Mark as deployed
    // 3. Teleport to appropriate spawn
    // 4. Setup loadout
    // 5. Show/hide appropriate UI
}

export function OnPlayerDied(eventPlayer: mod.Player, eventOtherPlayer: mod.Player) {
    // 1. Handle player-specific death logic
    // 2. Check for round-ending conditions
    // 3. Update scores/stats
    // 4. Clean up player UI states
}

export async function OnPlayerInteract(player: mod.Player, interactPoint: any) {
    // 1. Get interact point ID
    // 2. Switch on ID for different behaviors
    // 3. Update game state accordingly
}
```

---

## Game Loop Patterns

### Countdown Pattern
```typescript
let combatCountdownStarted = false;
let combatStartDelayRemaining = 60;
let combatStarted = false;

async function CombatCountdown(): Promise<void> {
    combatCountdownStarted = true;
    
    while (combatStartDelayRemaining > -1) {
        UpdateAllLobbyUI();
        await mod.Wait(1);
        combatStartDelayRemaining--;
    }
    
    combatStarted = true;
    HideAllLobbyUI();
    return Promise.resolve();
}
```

### Update Loop Pattern
```typescript
// Fast updates (every frame or 16ms)
async function TickUpdate() {
    let tickRate: number = 0.016;
    while (true) {
        await mod.Wait(tickRate);
        
        // Proximity checks
        // Input handling
        // Progress updates
    }
}

// Slow updates (every second)
async function ThrottledUpdate() {
    while (true) {
        await mod.Wait(1);
        
        if (!gameOver) {
            // Timer updates
            // UI refreshes
            // Position checks
        }
    }
}
```

---

## UI Patterns

### UI Helper Functions
All mods use a `ParseUI()` helper from `modlib/index.ts`:

```typescript
// Create UI with JSON-like structure
let widget = ParseUI({
    type: "Container",
    size: [700, 300],
    position: [0, 100],
    anchor: mod.UIAnchor.TopCenter,
    bgFill: mod.UIBgFill.Blur,
    bgColor: [1, 1, 1],
    bgAlpha: 1,
    playerId: player,  // Player-specific UI
    children: [{
        type: "Text",
        textSize: 36,
        textLabel: MakeMessage(mod.stringkeys.title),
        // ...
    }]
});
```

### UI Class Pattern
```typescript
class LobbyUI {
    #jsPlayer: JsPlayer;
    #rootWidget: mod.UIWidget | undefined;
    #isUIVisible = false;
    
    constructor(jsPlayer: JsPlayer) {
        this.#jsPlayer = jsPlayer;
    }
    
    open() {
        if (!this.#rootWidget) this.#create();
        if (!this.#rootWidget) return;
        mod.SetUIWidgetVisible(this.#rootWidget, true);
        this.#isUIVisible = true;
    }
    
    close() {
        if (this.#rootWidget) {
            mod.SetUIWidgetVisible(this.#rootWidget, false);
            this.#isUIVisible = false;
        }
    }
    
    refresh() {
        // Update UI text/values
    }
    
    #create() {
        this.#rootWidget = ParseUI({/* ... */});
    }
}
```

**Best Practices:**
- Use private fields with `#` prefix
- Lazy initialization in `open()` or constructor
- Always check for undefined before operations
- Provide `open()`, `close()`, `refresh()`, `isOpen()` methods

---

## Vector and Position Management

### Vector Creation
```typescript
// Standard creation
let pos: mod.Vector = mod.CreateVector(x, y, z);

// Common constants
const ZEROVEC: mod.Vector = mod.CreateVector(0, 0, 0);
const ONEVEC: mod.Vector = mod.CreateVector(1, 1, 1);

// Color vectors (RGB from 0-1)
const BLACKCOLOR: number[] = [1, 1, 1];  // Text color
const REDCOLOR: number[] = [1, 0, 0];
const WHITECOLOR: number[] = [0, 0, 0];
```

### Vector Operations
```typescript
// Get components
let x = mod.XComponentOf(vector);
let y = mod.YComponentOf(vector);
let z = mod.ZComponentOf(vector);

// Distance checking
let dist = mod.DistanceBetween(pos1, pos2);
if (dist < threshold) {
    // Do something
}

// Position updates
let playerPos = mod.GetSoldierState(player, mod.SoldierStateVector.GetPosition);
```

---

## Message System

### Message Creation Helper
```typescript
function MakeMessage(message: string, ...args: any[]) {
    switch (args.length) {
        case 0: return mod.Message(message);
        case 1: return mod.Message(message, args[0]);
        case 2: return mod.Message(message, args[0], args[1]);
        default: return mod.Message(message, args[0], args[1], args[2]);
    }
}
```

### Message Display Patterns
```typescript
// Global message to all players
function MessageAllUI(message: mod.Message, textColor: number[]) {
    JsPlayer.playerInstances.forEach(player => {
        let jsPlayer = JsPlayer.get(player);
        if (!jsPlayer) return;
        
        if (jsPlayer.messageUI?.isOpen()) {
            jsPlayer.messageUI.refresh(message);
        } else {
            jsPlayer.messageUI?.open(message, textColor);
        }
    });
    messageTime = messageRemainTime;
}

// Using modlib helpers
import { ShowNotificationMessage } from '../code/modlib/index';
ShowNotificationMessage(MakeMessage(mod.stringkeys.gameStart));
```

---

## Object Management

### Getting Objects by ID
```typescript
// Always assign IDs in Godot first
const team1HQ1ID: number = 1;
const capturePointID: number = 21;

// Get objects
let hq = mod.GetHQ(team1HQ1ID);
let cp = mod.GetCapturePoint(capturePointID);
let interact = mod.GetInteractPoint(interactID);
let worldIcon = mod.GetWorldIcon(iconID);

// Get ID from object
let id = mod.GetObjId(object);
```

### Enabling/Disabling Objects
```typescript
// HQs
mod.EnableHQ(hq, true);

// Objectives
mod.EnableGameModeObjective(capturePoint, true);

// Interact points
mod.EnableInteractPoint(interactPoint, true);

// World icons
mod.EnableWorldIconImage(worldIcon, true);
mod.EnableWorldIconText(worldIcon, true);
mod.SetWorldIconText(worldIcon, MakeMessage(mod.stringkeys.objective));
```

---

## Team Management

### Team Assignment and Checking
```typescript
// Get team
let team = mod.GetTeam(player);
let teamByID = mod.GetTeam(1); // Team ID 1-4

// Set team
mod.SetTeam(player, targetTeam);

// Compare teams
let teamID = mod.GetObjId(team);
if (mod.GetObjId(playerTeam) == mod.GetObjId(enemyTeam)) {
    // Same team
}

// Get players on team
function GetLivingPlayersOnTeam(team: mod.Team): mod.Player[] {
    let teamArr: mod.Player[] = [];
    let teamID = mod.GetObjId(team);
    JsPlayer.playerInstances.forEach(player => {
        let jsPlayer = JsPlayer.get(player);
        if (mod.GetObjId(mod.GetTeam(player)) == teamID 
            && mod.GetSoldierState(player, mod.SoldierStateBool.IsAlive)) {
            teamArr.push(player);
        }
    });
    return teamArr;
}
```

---

## Spawn and Teleport

### Player Spawning
```typescript
// Deploy player
mod.DeployPlayer(player);

// Force deploy all
mod.EnableAllPlayerDeploy(true);

// Undeploy
mod.UndeployAllPlayers();

// Teleport
mod.Teleport(player, position, rotationAngle);

// Teleport to HQ
let hqPos = mod.GetObjectPosition(hq);
mod.Teleport(player, hqPos, 0);
```

### Vehicle Spawning
```typescript
// Setup vehicle spawner
let spawner = mod.SpawnObject(
    mod.RuntimeSpawn_Common.VehicleSpawner,
    position,
    rotation,
    scale
);

// Configure and spawn
mod.SetVehicleSpawnerVehicleType(spawner, mod.VehicleList.Quadbike);
mod.SetVehicleSpawnerRespawnTime(spawner, 5);
mod.ForceVehicleSpawnerSpawn(spawner);
```

---

## Combat and Damage

### Player State Queries
```typescript
// Check if alive
let isAlive = mod.GetSoldierState(player, mod.SoldierStateBool.IsAlive);

// Check if AI
let isAI = mod.GetSoldierState(player, mod.SoldierStateBool.IsAISoldier);

// Check if in vehicle
let isInVehicle = mod.GetSoldierState(player, mod.SoldierStateBool.IsInVehicle);

// Check if prone
let isProne = mod.GetSoldierState(player, mod.SoldierStateBool.IsProne);

// Check if man down (downed state)
let isManDown = mod.GetSoldierState(player, mod.SoldierStateBool.IsManDown);
```

### Damage and Death
```typescript
// Deal damage
mod.DealDamage(player, 50);

// Kill player
mod.Kill(player);

// Kill downed player
if (mod.GetSoldierState(player, mod.SoldierStateBool.IsManDown)) {
    mod.DealDamage(player, 100);
}

// Set friendly fire
mod.SetFriendlyFire(false);
```

---

## Inventory Management

### Adding/Removing Equipment
```typescript
// Add weapons
mod.AddEquipment(player, mod.Weapons.AssaultRifle_M416, weaponPackage);
mod.AddEquipment(player, mod.Weapons.Sidearm_P18, sidearmPackage);

// Remove by slot
mod.RemoveEquipment(player, mod.InventorySlots.PrimaryWeapon);
mod.RemoveEquipment(player, mod.InventorySlots.SecondaryWeapon);

// Check if has equipment
if (mod.HasEquipment(player, mod.Weapons.AssaultRifle_M416)) {
    // Player has this weapon
}

// Set ammo
mod.SetInventoryAmmo(player, mod.InventorySlots.PrimaryWeapon, 999);
mod.SetInventoryMagazineAmmo(player, mod.InventorySlots.PrimaryWeapon, 30);
```

### Input Restrictions
```typescript
// Disable specific inputs
mod.EnableInputRestriction(player, mod.RestrictedInputs.Interact, true);
mod.EnableInputRestriction(player, mod.RestrictedInputs.Sprint, false);

// Common restrictions
mod.RestrictedInputs.Interact
mod.RestrictedInputs.MoveForwardBack
mod.RestrictedInputs.MoveLeftRight
mod.RestrictedInputs.Jump
mod.RestrictedInputs.FireWeapon
```

---

## VFX and SFX

### Spawning Effects
```typescript
// VFX
let vfx = mod.SpawnObject(
    mod.RuntimeSpawn_Common.FX_BASE_Fire_M,
    position,
    rotation,
    scale
);
mod.EnableVFX(vfx, true);

// SFX
let sfx = mod.SpawnObject(
    mod.RuntimeSpawn_Common.SFX_Alarm,
    position,
    rotation
);
mod.EnableSFX(sfx, true);
mod.PlaySound(sfx, volume, targetTeam);

// Common VFX
mod.RuntimeSpawn_Common.FX_BASE_Fire_M
mod.RuntimeSpawn_Common.FX_Sparks
mod.RuntimeSpawn_Common.FX_ArtilleryStrike_Explosion_GS

// Common SFX
mod.RuntimeSpawn_Common.SFX_Alarm
mod.RuntimeSpawn_Common.SFX_Gadgets_C4_Activate_OneShot3D
```

---

## Utility Functions

### Random Number Generation
```typescript
function GetRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

function GetRandomFloatInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
```

### Linear Interpolation
```typescript
function Lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}
```

### Distance and Proximity
```typescript
async function GetPlayersInRange(point: mod.Vector, distance: number): Promise<mod.Player[]> {
    let closePlayers: mod.Player[] = [];
    
    JsPlayer.playerInstances.forEach(player => {
        if (mod.GetSoldierState(player, mod.SoldierStateBool.IsAlive)) {
            let pos = mod.GetSoldierState(player, mod.SoldierStateVector.GetPosition);
            let dist = mod.DistanceBetween(pos, point);
            if (dist <= distance) {
                closePlayers.push(player);
            }
        }
    });
    
    return closePlayers;
}
```

---

## Error Handling and Safety

### Validation Patterns
```typescript
// Always validate JsPlayer
let jsPlayer = JsPlayer.get(player);
if (!jsPlayer) {
    console.log("Invalid JSPlayer!");
    return;
}

// Check player validity
if (!mod.IsPlayerValid(player)) {
    return;
}

// Check object ID
if (mod.GetObjId(object) < 0) {
    return;
}

// Guard against gameOver
if (gameOver) {
    return;
}

// Try-catch for equipment operations
try {
    mod.RemoveEquipment(player, slot);
} catch(e) {
    // Slot might be empty
}
```

### Null Checking
```typescript
// Check before use
if (widget) {
    mod.SetUIWidgetVisible(widget, true);
}

// Optional chaining-style checks
jsPlayer.store?.open();
jsPlayer.messageUI?.refresh(message);
```

---

## AI Management

### AI Spawning and Control
```typescript
// Spawn AI soldier
mod.SpawnAIFromAISpawner(
    mod.GetSpawner(spawnerID),
    mod.SoldierClass.Assault,
    team
);

// Check if AI
if (mod.GetSoldierState(player, mod.SoldierStateBool.IsAISoldier)) {
    // Handle AI differently
}

// Set AI behavior
mod.AIBattlefieldBehavior(player);

// Set AI damage modifier
mod.SetAIToHumanDamageModifier(0.1);
```

---

## Performance Considerations

### Optimization Tips
1. **Batch UI updates**: Update all player UIs in one loop rather than individually
2. **Cache frequently accessed values**: Store `mod.GetObjId()` results
3. **Use appropriate update rates**: Fast checks at 16ms, slower at 1s
4. **Limit console.log in production**: Use debug flags
5. **Clean up UI on player leave**: Prevent memory leaks
6. **Avoid nested awaits in loops**: Can cause timing issues

### Common Patterns to Avoid
```typescript
// BAD: Nested awaits
for (let i = 0; i < players.length; i++) {
    await mod.Wait(1); // Don't do this
}

// GOOD: Await after loop
for (let i = 0; i < players.length; i++) {
    // Do work
}
await mod.Wait(1);

// BAD: Repeated ID lookups
if (mod.GetObjId(team) == 1) { /* ... */ }
if (mod.GetObjId(team) == 2) { /* ... */ }

// GOOD: Cache the ID
let teamID = mod.GetObjId(team);
if (teamID == 1) { /* ... */ }
if (teamID == 2) { /* ... */ }
```

---

## Testing and Debugging

### Debug Patterns
```typescript
// Debug flags at top of file
const debugJSPlayer = true;
const debugTeam: boolean = false; // DISABLE BEFORE SHARING
const INSTANT_START = false;

// Conditional debug logging
if (debugJSPlayer) {
    console.log("Player ID:", mod.GetObjId(player));
}

// Skip delays for testing
if (!INSTANT_START) {
    while (countdown > 0) {
        await mod.Wait(1);
        countdown--;
    }
}
```

### Console Logging Best Practices
```typescript
// Include context in logs
console.log("Player", mod.GetObjId(player), "joined on team", teamID);

// Log state transitions
console.log("Round", roundNum, "ended. Winner:", winningTeam);

// Log errors clearly
console.log("ERROR: Invalid JSPlayer in OnPlayerInteract, ID:", id);
```

---

## Common Gotchas

### 1. Object ID Reuse
**Problem**: When a player leaves and another joins, the new player may get the same Object ID.
**Solution**: Always clean up player-specific data on leave and reinitialize on join.

### 2. UI Persistence
**Problem**: UI elements persist after player leaves if not cleaned up.
**Solution**: Call `destroyUI()` or equivalent in `OnPlayerLeaveGame`.

### 3. Async Timing
**Problem**: Multiple async loops can cause race conditions.
**Solution**: Use flags like `gameOver`, `roundEnded` to coordinate loops.

### 4. Team Comparison
**Problem**: Comparing teams directly doesn't work.
**Solution**: Always use `mod.GetObjId()` for comparisons.

### 5. Equipment Removal
**Problem**: Removing equipment from empty slot throws error.
**Solution**: Wrap in try-catch or check `HasEquipment()` first.

---

## Project Structure

### Recommended File Organization
```
mods/
  YourMod/
    YourMod.ts          # Main game mode logic
    llm/
      dev_guidelines.md # This file
      brief.md          # Game design document
```

### Code Organization Within File
1. **Version and debug flags**
2. **Type definitions and enums**
3. **Constants (IDs, timings, positions)**
4. **Global state variables**
5. **Helper classes (JsPlayer, UI classes)**
6. **Event handlers (exports)**
7. **Update loops**
8. **Helper functions**
9. **UI parsing helpers (or import from modlib)**

---

## Checklist for New Game Modes

Before considering a game mode complete:

- [ ] Version constant defined
- [ ] Debug flags added and documented
- [ ] JsPlayer class with proper cleanup
- [ ] All event handlers implemented
- [ ] Minimum player check before start
- [ ] Update loops for different frequencies
- [ ] UI classes for all player interfaces
- [ ] Proper team management
- [ ] Victory condition checking
- [ ] Player cleanup on leave
- [ ] AI handling (check for `IsAISoldier`)
- [ ] Console logging for debugging
- [ ] Comments on complex logic
- [ ] Constants for all magic numbers
- [ ] Input restrictions as needed
- [ ] Loadout management
- [ ] Message system for player feedback

---

## References

### Key SDK Functions (most commonly used)
- `mod.GetObjId(object)` - Get ID of any game object
- `mod.GetTeam(playerOrID)` - Get team from player or ID
- `mod.Wait(seconds)` - Async delay
- `mod.CreateVector(x, y, z)` - Create position/color vector
- `mod.Message(key, ...args)` - Create localized message
- `mod.GetSoldierState(player, stateType)` - Query player state
- `mod.Teleport(player, position, angle)` - Move player
- `mod.IsPlayerValid(player)` - Check if player object is valid

### Key Files
- `code/mod/index.d.ts` - Full SDK type definitions
- `code/modlib/index.ts` - Helper functions and UI utilities
- `mods/_StartHere_BasicTemplate/BasicTemplate.ts` - Minimal template

---

## Final Tips for LLMs

1. **Start with BasicTemplate.ts**: Use it as a skeleton when creating new modes
2. **Reference official mods**: When unsure, check how Vertigo/BombSquad/etc. solved it
3. **Validate player objects**: Always check validity before operations
4. **Use JsPlayer pattern**: Don't reinvent player tracking
5. **Leverage modlib**: Import helpers from `code/modlib/index.ts`
6. **Test incrementally**: Suggest testing each feature before adding more
7. **Comment heavily**: Portal scripts can get complex fast
8. **Think in phases**: Lobby → Countdown → Game → End → Repeat
9. **Handle edge cases**: Player leave, team switches, late joins
10. **Keep UI responsive**: Update in loops, not just on events

---

*This document will evolve as new patterns and best practices emerge.*
