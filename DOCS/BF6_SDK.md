# Battlefield 6 Portal SDK Documentation

**Version:** 1.0.1.0  
**Status:** Auto-generated reference - Do not modify SDK directly

---

## Table of Contents

1. [Core Types](#core-types)
2. [Enumerations](#enumerations)
3. [Player Functions](#player-functions)
4. [Team Management](#team-management)
5. [Game Objects](#game-objects)
6. [Positioning & Vectors](#positioning--vectors)
7. [UI System](#ui-system)
8. [Messages & Localization](#messages--localization)
9. [Combat & Damage](#combat--damage)
10. [Inventory & Equipment](#inventory--equipment)
11. [Spawning & Deployment](#spawning--deployment)
12. [VFX & SFX](#vfx--sfx)
13. [Game Mode Control](#game-mode-control)
14. [AI Control](#ai-control)
15. [Utility Functions](#utility-functions)

---

## Core Types

The SDK uses opaque types (TypeScript branded types) to provide type safety for game objects.

### Object Types

```typescript
mod.Player         // A player in the game
mod.Team           // A team
mod.Vector         // 3D position or color
mod.Message        // Localized message
mod.UIWidget       // UI element
mod.HQ             // Headquarters spawn point
mod.CapturePoint   // Capture objective
mod.InteractPoint  // Interactable object
mod.AreaTrigger    // Volume trigger
mod.Vehicle        // Vehicle instance
mod.VehicleSpawner // Vehicle spawn point
mod.Spawner        // AI spawn point
mod.SpawnPoint     // Player spawn point
mod.SpatialObject  // Physical object in world
mod.WorldIcon      // 3D world marker
mod.VFX            // Visual effect
mod.SFX            // Sound effect
mod.VO             // Voice over
mod.WeaponPackage  // Weapon configuration
mod.WeaponUnlock   // Weapon type
mod.MCOM           // M-COM objective
mod.Array          // Portal array type
```

### Type Checking

```typescript
// Check object type
mod.IsType(object, mod.Types.Player)
mod.IsType(object, mod.Types.Team)
mod.IsType(object, mod.Types.Vehicle)

// Check player validity
mod.IsPlayerValid(player: mod.Player): boolean

// Compare objects
mod.Equals(object1, object2): boolean
```

---

## Enumerations

### Soldier States (Boolean)

```typescript
mod.SoldierStateBool.IsAlive
mod.SoldierStateBool.IsAISoldier
mod.SoldierStateBool.IsInVehicle
mod.SoldierStateBool.IsInWater
mod.SoldierStateBool.IsProne
mod.SoldierStateBool.IsManDown      // Downed/revivable state
mod.SoldierStateBool.IsSprinting
```

### Soldier States (Number)

```typescript
mod.SoldierStateNumber.CurrentHealth
mod.SoldierStateNumber.MaxHealth
mod.SoldierStateNumber.CurrentArmor
mod.SoldierStateNumber.MaxArmor
```

### Soldier States (Vector)

```typescript
mod.SoldierStateVector.GetPosition
mod.SoldierStateVector.EyePosition
mod.SoldierStateVector.GetFacingDirection
mod.SoldierStateVector.GetVelocity
```

### Vehicle States (Boolean)

```typescript
mod.VehicleStateBool.IsDestroyed
mod.VehicleStateBool.IsDisabled
mod.VehicleStateBool.IsOccupied
```

### Vehicle States (Number)

```typescript
mod.VehicleStateNumber.CurrentHealth
mod.VehicleStateNumber.MaxHealth
mod.VehicleStateNumber.SeatCount
mod.VehicleStateNumber.OccupiedSeatCount
```

### Vehicle States (Vector)

```typescript
mod.VehicleStateVector.VehiclePosition
mod.VehicleStateVector.VehicleForward
mod.VehicleStateVector.VehicleVelocity
```

### Player Death Types

```typescript
mod.PlayerDeathTypes.Weapon
mod.PlayerDeathTypes.Explosion
mod.PlayerDeathTypes.Fall
mod.PlayerDeathTypes.Fire
mod.PlayerDeathTypes.Headshot
mod.PlayerDeathTypes.Melee
mod.PlayerDeathTypes.Redeploy
mod.PlayerDeathTypes.Roadkill
mod.PlayerDeathTypes.Drowning
mod.PlayerDeathTypes.Deserting
mod.PlayerDeathTypes.Penetration
```

### Player Damage Types

```typescript
mod.PlayerDamageTypes.Default
mod.PlayerDamageTypes.Explosion
mod.PlayerDamageTypes.Fall
mod.PlayerDamageTypes.Fire
mod.PlayerDamageTypes.Headshot
mod.PlayerDamageTypes.Melee
```

### Inventory Slots

```typescript
mod.InventorySlots.PrimaryWeapon
mod.InventorySlots.SecondaryWeapon
mod.InventorySlots.GadgetOne
mod.InventorySlots.GadgetTwo
mod.InventorySlots.MeleeWeapon
mod.InventorySlots.Throwable
mod.InventorySlots.ClassGadget
mod.InventorySlots.MiscGadget
```

### Restricted Inputs

```typescript
mod.RestrictedInputs.MoveForwardBack
mod.RestrictedInputs.MoveLeftRight
mod.RestrictedInputs.Jump
mod.RestrictedInputs.Crouch
mod.RestrictedInputs.Prone
mod.RestrictedInputs.Sprint
mod.RestrictedInputs.FireWeapon
mod.RestrictedInputs.Reload
mod.RestrictedInputs.Interact
mod.RestrictedInputs.CameraPitch
mod.RestrictedInputs.CameraYaw
mod.RestrictedInputs.Zoom
mod.RestrictedInputs.SelectPrimary
mod.RestrictedInputs.SelectSecondary
mod.RestrictedInputs.SelectThrowable
mod.RestrictedInputs.SelectMelee
mod.RestrictedInputs.SelectOpenGadget
mod.RestrictedInputs.SelectCharacterGadget
mod.RestrictedInputs.CyclePrimary
mod.RestrictedInputs.CycleFire
```

### Soldier Classes

```typescript
mod.SoldierClass.Assault
mod.SoldierClass.Engineer
mod.SoldierClass.Support
mod.SoldierClass.Recon
```

### Factions

```typescript
mod.Factions.NATO
mod.Factions.PaxArmata
```

### Cameras

```typescript
mod.Cameras.FirstPerson
mod.Cameras.ThirdPerson
mod.Cameras.Free
```

### Maps

```typescript
mod.Maps.Abbasid
mod.Maps.Aftermath
mod.Maps.Battery
mod.Maps.Capstone
mod.Maps.Dumbo
mod.Maps.Firestorm
mod.Maps.Limestone
mod.Maps.Outskirts
mod.Maps.Tungsten
```

### Spawn Modes

```typescript
mod.SpawnModes.AutoSpawn
mod.SpawnModes.ManualSpawn
```

### UI Enumerations

```typescript
// UI Anchors
mod.UIAnchor.TopLeft
mod.UIAnchor.TopCenter
mod.UIAnchor.TopRight
mod.UIAnchor.CenterLeft
mod.UIAnchor.Center
mod.UIAnchor.CenterRight
mod.UIAnchor.BottomLeft
mod.UIAnchor.BottomCenter
mod.UIAnchor.BottomRight

// UI Background Fill
mod.UIBgFill.None
mod.UIBgFill.Solid
mod.UIBgFill.Blur
mod.UIBgFill.OutlineThin
mod.UIBgFill.OutlineThick
mod.UIBgFill.GradientLeft
mod.UIBgFill.GradientRight
mod.UIBgFill.GradientTop
mod.UIBgFill.GradientBottom

// UI Image Types
mod.UIImageType.None
mod.UIImageType.Circle
mod.UIImageType.Square
mod.UIImageType.Icon_Assault
mod.UIImageType.Icon_Engineer
mod.UIImageType.Icon_Support
mod.UIImageType.Icon_Recon

// UI Button Events
mod.UIButtonEvent.Pressed
mod.UIButtonEvent.Released
mod.UIButtonEvent.Hovered
mod.UIButtonEvent.Focused

// Custom Notification Slots
mod.CustomNotificationSlots.HeaderText
mod.CustomNotificationSlots.MessageText1
mod.CustomNotificationSlots.MessageText2
mod.CustomNotificationSlots.MessageText3
mod.CustomNotificationSlots.MessageText4
```

---

## Player Functions

### State Queries

```typescript
// Get player state
mod.GetSoldierState(
    player: mod.Player,
    stateType: mod.SoldierStateBool | mod.SoldierStateNumber | mod.SoldierStateVector
): boolean | number | mod.Vector

// Examples:
let isAlive = mod.GetSoldierState(player, mod.SoldierStateBool.IsAlive);
let health = mod.GetSoldierState(player, mod.SoldierStateNumber.CurrentHealth);
let position = mod.GetSoldierState(player, mod.SoldierStateVector.GetPosition);
```

### Player Management

```typescript
// Get all players
mod.AllPlayers(): mod.Array

// Get player by ID
mod.GetPlayer(id: number): mod.Player

// Check if valid
mod.IsPlayerValid(player: mod.Player): boolean

// Get object ID
mod.GetObjId(player: mod.Player): number

// Count players
mod.NumberOfPlayers(): number

// Get closest player to position
mod.ClosestPlayerTo(position: mod.Vector): mod.Player

// Get players in range
mod.PlayersWithinRange(
    position: mod.Vector,
    radius: number
): mod.Array
```

### Player Actions

```typescript
// Kill player
mod.Kill(player: mod.Player): void

// Deal damage
mod.DealDamage(player: mod.Player, damage: number): void

// Heal player
mod.Heal(player: mod.Player, amount: number): void

// Set health
mod.SetPlayerHealth(player: mod.Player, health: number): void
mod.SetPlayerMaxHealth(player: mod.Player, maxHealth: number): void

// Teleport
mod.Teleport(
    player: mod.Player,
    position: mod.Vector,
    rotationAngle: number
): void

// Set camera
mod.SetPlayerCamera(player: mod.Player, camera: mod.Cameras): void

// Enable/disable inputs
mod.EnableInputRestriction(
    player: mod.Player,
    input: mod.RestrictedInputs,
    enabled: boolean
): void
```

### Player Deploy/Undeploy

```typescript
// Deploy player
mod.DeployPlayer(player: mod.Player): void

// Enable/disable deploy
mod.EnablePlayerDeploy(player: mod.Player, enabled: boolean): void

// Enable all players to deploy
mod.EnableAllPlayerDeploy(enabled: boolean): void

// Undeploy player
mod.UndeployPlayer(player: mod.Player): void

// Undeploy all
mod.UndeployAllPlayers(): void
```

---

## Team Management

### Team Access

```typescript
// Get team from player or ID
mod.GetTeam(playerOrId: mod.Player | number): mod.Team

// Set player team
mod.SetTeam(player: mod.Player, team: mod.Team): void

// Get team ID
mod.GetObjId(team: mod.Team): number

// Compare teams (use GetObjId)
let teamId1 = mod.GetObjId(team1);
let teamId2 = mod.GetObjId(team2);
if (teamId1 == teamId2) { /* same team */ }
```

### Team Settings

```typescript
// Set team score
mod.SetTeamScore(team: mod.Team, score: number): void

// Get team score
mod.GetTeamScore(team: mod.Team): number

// Set friendly fire
mod.SetFriendlyFire(enabled: boolean): void
```

---

## Game Objects

### Getting Objects by ID

All game objects placed in Godot must have an Object ID assigned.

```typescript
// Get objects by ID
mod.GetHQ(id: number): mod.HQ
mod.GetCapturePoint(id: number): mod.CapturePoint
mod.GetInteractPoint(id: number): mod.InteractPoint
mod.GetAreaTrigger(id: number): mod.AreaTrigger
mod.GetWorldIcon(id: number): mod.WorldIcon
mod.GetSpawnPoint(id: number): mod.SpawnPoint
mod.GetSpawner(id: number): mod.Spawner
mod.GetVehicleSpawner(id: number): mod.VehicleSpawner
mod.GetSpatialObject(id: number): mod.SpatialObject

// Get object position
mod.GetObjectPosition(object: mod.Object): mod.Vector

// Get object ID
mod.GetObjId(object: mod.Object): number
```

### Enabling/Disabling Objects

```typescript
// HQs (spawn points)
mod.EnableHQ(hq: mod.HQ, enabled: boolean): void

// Objectives
mod.EnableGameModeObjective(
    objective: mod.CapturePoint | mod.MCOM,
    enabled: boolean
): void

// Interact points
mod.EnableInteractPoint(
    interactPoint: mod.InteractPoint,
    enabled: boolean
): void

// Area triggers
mod.EnableAreaTrigger(
    areaTrigger: mod.AreaTrigger,
    enabled: boolean
): void
```

### Capture Points

```typescript
// Get owner team
mod.GetCurrentOwnerTeam(capturePoint: mod.CapturePoint): mod.Team

// Set capture requirements
mod.SetCapturePointRequiredPlayers(
    capturePoint: mod.CapturePoint,
    count: number
): void

// Set capture time
mod.SetCapturePointTime(
    capturePoint: mod.CapturePoint,
    seconds: number
): void
```

### World Icons

```typescript
// Set icon text
mod.SetWorldIconText(
    worldIcon: mod.WorldIcon,
    message: mod.Message
): void

// Set icon position
mod.SetWorldIconPosition(
    worldIcon: mod.WorldIcon,
    position: mod.Vector
): void

// Set icon owner (team color)
mod.SetWorldIconOwner(
    worldIcon: mod.WorldIcon,
    team: mod.Team
): void

// Enable/disable icon parts
mod.EnableWorldIconText(
    worldIcon: mod.WorldIcon,
    enabled: boolean
): void

mod.EnableWorldIconImage(
    worldIcon: mod.WorldIcon,
    enabled: boolean
): void
```

---

## Positioning & Vectors

### Vector Creation

```typescript
// Create vector
mod.CreateVector(x: number, y: number, z: number): mod.Vector

// Get components
mod.XComponentOf(vector: mod.Vector): number
mod.YComponentOf(vector: mod.Vector): number
mod.ZComponentOf(vector: mod.Vector): number
```

### Vector Math

```typescript
// Add vectors
mod.Add(v1: mod.Vector, v2: mod.Vector): mod.Vector

// Subtract vectors
mod.Subtract(v1: mod.Vector, v2: mod.Vector): mod.Vector

// Multiply vector by scalar
mod.Multiply(vector: mod.Vector, scalar: number): mod.Vector

// Distance between points
mod.DistanceBetween(v1: mod.Vector, v2: mod.Vector): number

// Normalize vector
mod.Normalize(vector: mod.Vector): mod.Vector

// Vector magnitude
mod.Magnitude(vector: mod.Vector): number

// Dot product
mod.DotProduct(v1: mod.Vector, v2: mod.Vector): number

// Cross product
mod.CrossProduct(v1: mod.Vector, v2: mod.Vector): mod.Vector
```

### Direction & Angles

```typescript
// Direction from A to B
mod.DirectionFromAToB(from: mod.Vector, to: mod.Vector): mod.Vector

// Angle constants
mod.Pi(): number        // π (3.14159...)
mod.HalfPi(): number    // π/2
mod.TwoPi(): number     // 2π

// Trig functions
mod.Sin(angle: number): number
mod.Cos(angle: number): number
mod.Tan(angle: number): number
mod.ASin(value: number): number
mod.ACos(value: number): number
mod.ATan(value: number): number
mod.ATan2(y: number, x: number): number
```

---

## UI System

### UI Root and Widgets

```typescript
// Get UI root
mod.GetUIRoot(): mod.UIWidget

// Find widget by name
mod.FindUIWidgetWithName(name: string): mod.UIWidget | null

// Delete widgets
mod.DeleteUIWidget(widget: mod.UIWidget): void
mod.DeleteAllUIWidgets(): void
```

### Creating UI Elements

```typescript
// Add container
mod.AddUIContainer(
    name: string,
    position: mod.Vector,
    size: mod.Vector,
    anchor: mod.UIAnchor,
    parent: mod.UIWidget,
    visible: boolean,
    padding: number,
    backgroundColor: mod.Vector,
    backgroundAlpha: number,
    backgroundFill: mod.UIBgFill,
    restrictTo?: mod.Player | mod.Team
): void

// Add text
mod.AddUIText(
    name: string,
    position: mod.Vector,
    size: mod.Vector,
    anchor: mod.UIAnchor,
    parent: mod.UIWidget,
    visible: boolean,
    padding: number,
    backgroundColor: mod.Vector,
    backgroundAlpha: number,
    backgroundFill: mod.UIBgFill,
    text: mod.Message,
    textSize: number,
    textColor: mod.Vector,
    textAlpha: number,
    textAnchor: mod.UIAnchor,
    restrictTo?: mod.Player | mod.Team
): void

// Add button
mod.AddUIButton(
    name: string,
    position: mod.Vector,
    size: mod.Vector,
    anchor: mod.UIAnchor,
    parent: mod.UIWidget,
    visible: boolean,
    padding: number,
    backgroundColor: mod.Vector,
    backgroundAlpha: number,
    backgroundFill: mod.UIBgFill,
    enabled: boolean,
    baseColor: mod.Vector, baseAlpha: number,
    disabledColor: mod.Vector, disabledAlpha: number,
    pressedColor: mod.Vector, pressedAlpha: number,
    hoverColor: mod.Vector, hoverAlpha: number,
    focusedColor: mod.Vector, focusedAlpha: number,
    restrictTo?: mod.Player | mod.Team
): void

// Add image
mod.AddUIImage(
    name: string,
    position: mod.Vector,
    size: mod.Vector,
    anchor: mod.UIAnchor,
    parent: mod.UIWidget,
    visible: boolean,
    padding: number,
    backgroundColor: mod.Vector,
    backgroundAlpha: number,
    backgroundFill: mod.UIBgFill,
    imageType: mod.UIImageType,
    imageColor: mod.Vector,
    imageAlpha: number,
    restrictTo?: mod.Player | mod.Team
): void
```

### Modifying UI

```typescript
// Set widget properties
mod.SetUIWidgetVisible(widget: mod.UIWidget, visible: boolean): void
mod.SetUIWidgetPosition(widget: mod.UIWidget, position: mod.Vector): void
mod.SetUIWidgetSize(widget: mod.UIWidget, size: mod.Vector): void
mod.SetUIWidgetName(widget: mod.UIWidget, name: string): void

// Set text properties
mod.SetUITextLabel(widget: mod.UIWidget, text: mod.Message): void
mod.SetUITextColor(widget: mod.UIWidget, color: mod.Vector): void
mod.SetUITextAlpha(widget: mod.UIWidget, alpha: number): void

// Set background
mod.SetUIBackgroundColor(widget: mod.UIWidget, color: mod.Vector): void
mod.SetUIBackgroundAlpha(widget: mod.UIWidget, alpha: number): void

// Get widget name
mod.GetUIWidgetName(widget: mod.UIWidget): string
```

### UI Input Mode

```typescript
// Enable UI input (shows cursor, disables game input)
mod.EnableUIInputMode(enabled: boolean, player: mod.Player): void
```

---

## Messages & Localization

### Creating Messages

```typescript
// Create message from string key
mod.Message(key: string): mod.Message
mod.Message(key: string, arg1: any): mod.Message
mod.Message(key: string, arg1: any, arg2: any): mod.Message
mod.Message(key: string, arg1: any, arg2: any, arg3: any): mod.Message

// String keys from localization
mod.stringkeys.yourCustomKey

// Examples:
mod.Message(mod.stringkeys.gameStart)
mod.Message(mod.stringkeys.playerJoined, playerName)
mod.Message(mod.stringkeys.scoreUpdate, team, score)
```

### Displaying Messages

```typescript
// Notification message (top right)
mod.DisplayNotificationMessage(message: mod.Message): void
mod.DisplayNotificationMessage(
    message: mod.Message,
    target: mod.Player | mod.Team
): void

// Game mode message (top center, large)
mod.DisplayGameModeMessage(message: mod.Message): void
mod.DisplayGameModeMessage(
    message: mod.Message,
    target: mod.Player | mod.Team
): void

// Highlighted world log message
mod.DisplayHighlightedWorldLogMessage(message: mod.Message): void
mod.DisplayHighlightedWorldLogMessage(
    message: mod.Message,
    target: mod.Player | mod.Team
): void

// Custom notification (uses modlib helper)
// See modlib/index.ts for DisplayCustomNotificationMessage()
```

---

## Combat & Damage

### Damage

```typescript
// Deal damage to player
mod.DealDamage(player: mod.Player, amount: number): void

// Kill player
mod.Kill(player: mod.Player): void

// Kill vehicle
mod.Kill(vehicle: mod.Vehicle): void

// Damage type comparison
mod.EventDamageTypeCompare(
    damageType: mod.DamageType,
    expectedType: mod.PlayerDamageTypes
): boolean

// Death type comparison
mod.EventDeathTypeCompare(
    deathType: mod.DeathType,
    expectedType: mod.PlayerDeathTypes
): boolean
```

### Health & Healing

```typescript
// Set health
mod.SetPlayerHealth(player: mod.Player, health: number): void
mod.SetPlayerMaxHealth(player: mod.Player, maxHealth: number): void

// Heal
mod.Heal(player: mod.Player, amount: number): void

// Respawn
mod.RespawnPlayer(player: mod.Player): void
```

### Resupply

```typescript
// Resupply player
mod.ResupplyPlayer(
    player: mod.Player,
    resupplyType: mod.ResupplyTypes
): void

// Resupply types
mod.ResupplyTypes.AmmoBox
mod.ResupplyTypes.AmmoCrate
mod.ResupplyTypes.SupplyBag
```

---

## Inventory & Equipment

### Adding Equipment

```typescript
// Add weapon
mod.AddEquipment(
    player: mod.Player,
    weapon: mod.Weapons | mod.Gadgets,
    weaponPackage?: mod.WeaponPackage
): void

// Replace inventory (removes current, adds new)
mod.ReplacePlayerInventory(
    player: mod.Player,
    equipment: mod.Weapons | mod.Gadgets
): void
```

### Removing Equipment

```typescript
// Remove equipment by slot
mod.RemoveEquipment(
    player: mod.Player,
    slot: mod.InventorySlots
): void

// Remove all equipment
mod.RemoveAllEquipment(player: mod.Player): void

// Remove player inventory (specific item)
mod.RemovePlayerInventory(
    player: mod.Player,
    equipment: mod.Weapons | mod.Gadgets
): void

// Remove at slot
mod.RemovePlayerInventoryAtSlot(
    player: mod.Player,
    slot: mod.InventorySlots
): void
```

### Checking Equipment

```typescript
// Check if player has equipment
mod.HasEquipment(
    player: mod.Player,
    equipment: mod.Weapons | mod.Gadgets
): boolean

// Check if slot is active
mod.IsInventorySlotActive(
    player: mod.Player,
    slot: mod.InventorySlots
): boolean
```

### Ammo Management

```typescript
// Set ammo
mod.SetInventoryAmmo(
    player: mod.Player,
    slot: mod.InventorySlots,
    amount: number
): void

// Set magazine ammo
mod.SetInventoryMagazineAmmo(
    player: mod.Player,
    slot: mod.InventorySlots,
    amount: number
): void

// Get ammo
mod.GetInventoryAmmo(
    player: mod.Player,
    slot: mod.InventorySlots
): number

// Get magazine ammo
mod.GetInventoryMagazineAmmo(
    player: mod.Player,
    slot: mod.InventorySlots
): number
```

---

## Spawning & Deployment

### Player Spawning

```typescript
// Set spawn mode
mod.SetSpawnMode(mode: mod.SpawnModes): void
// mod.SpawnModes.AutoSpawn - Players spawn automatically
// mod.SpawnModes.ManualSpawn - Players must manually deploy

// Deploy player
mod.DeployPlayer(player: mod.Player): void

// Enable/disable player deploy
mod.EnablePlayerDeploy(player: mod.Player, enabled: boolean): void
mod.EnableAllPlayerDeploy(enabled: boolean): void

// Undeploy
mod.UndeployPlayer(player: mod.Player): void
mod.UndeployAllPlayers(): void

// Disable player join
mod.DisablePlayerJoin(): void
```

### AI Spawning

```typescript
// Spawn AI from spawner
mod.SpawnAIFromAISpawner(
    spawner: mod.Spawner,
    soldierClass: mod.SoldierClass,
    team: mod.Team
): void

// Set AI damage modifier
mod.SetAIToHumanDamageModifier(modifier: number): void

// Set AI behavior
mod.AIBattlefieldBehavior(player: mod.Player): void
```

### Vehicle Spawning

```typescript
// Set vehicle type
mod.SetVehicleSpawnerVehicleType(
    spawner: mod.VehicleSpawner,
    vehicleType: mod.VehicleList
): void

// Set respawn time
mod.SetVehicleSpawnerRespawnTime(
    spawner: mod.VehicleSpawner,
    seconds: number
): void

// Force spawn
mod.ForceVehicleSpawnerSpawn(
    spawner: mod.VehicleSpawner
): void
```

### Runtime Spawning

```typescript
// Spawn object at position
mod.SpawnObject(
    objectType: mod.RuntimeSpawn_Common | any,
    position: mod.Vector,
    rotation: mod.Vector,
    scale?: mod.Vector
): any

// Example:
let vfx = mod.SpawnObject(
    mod.RuntimeSpawn_Common.FX_BASE_Fire_M,
    position,
    rotation,
    mod.CreateVector(1, 1, 1)
);
```

---

## VFX & SFX

### Visual Effects

```typescript
// Enable/disable VFX
mod.EnableVFX(vfx: mod.VFX, enabled: boolean): void

// Common VFX from RuntimeSpawn_Common
mod.RuntimeSpawn_Common.FX_BASE_Fire_M
mod.RuntimeSpawn_Common.FX_BASE_Fire_L
mod.RuntimeSpawn_Common.FX_BASE_Fire_S
mod.RuntimeSpawn_Common.FX_Sparks
mod.RuntimeSpawn_Common.FX_ArtilleryStrike_Explosion_GS
mod.RuntimeSpawn_Common.FX_BASE_Sparks_Pulse_L
mod.RuntimeSpawn_Common.FX_Granite_Strike_Smoke_Marker_Green
```

### Sound Effects

```typescript
// Enable/disable SFX
mod.EnableSFX(sfx: mod.SFX, enabled: boolean): void

// Play sound
mod.PlaySound(
    sfx: mod.SFX,
    volume: number,
    target?: mod.Team | mod.Player
): void

// Common SFX from RuntimeSpawn_Common
mod.RuntimeSpawn_Common.SFX_Alarm
mod.RuntimeSpawn_Common.SFX_Gadgets_C4_Activate_OneShot3D
mod.RuntimeSpawn_Common.FX_Gadget_C4_Explosives_Detonation
```

---

## Game Mode Control

### Game Flow

```typescript
// Start game mode
// (Triggered automatically, implement export async function OnGameModeStarted())

// End game mode
mod.EndGameMode(winningTeam: mod.Team): void

// Get match time
mod.GetMatchTimeElapsed(): number
mod.GetMatchTimeRemaining(): number
mod.GetRoundTime(): number

// Set round time
mod.SetRoundTimeRemaining(seconds: number): void
```

### Async Control

```typescript
// Wait (for async functions)
mod.Wait(seconds: number): Promise<void>

// Usage:
await mod.Wait(5); // Wait 5 seconds
```

---

## AI Control

### AI Behavior

```typescript
// Set AI to battlefield behavior
mod.AIBattlefieldBehavior(player: mod.Player): void

// Check if AI
let isAI = mod.GetSoldierState(
    player,
    mod.SoldierStateBool.IsAISoldier
);
```

### AI Damage

```typescript
// Set AI to human damage modifier
mod.SetAIToHumanDamageModifier(modifier: number): void
// modifier: 0.1 = AI deals 10% damage to humans
```

---

## Utility Functions

### Arrays

```typescript
// Create empty array
mod.EmptyArray(): mod.Array

// Append to array
mod.AppendToArray(array: mod.Array, value: any): void

// Get value from array
mod.ValueInArray(array: mod.Array, index: number): any

// Remove from array
mod.RemoveFromArrayByIndex(array: mod.Array, index: number): void
mod.RemoveFromArrayByValue(array: mod.Array, value: any): void

// Array count
mod.CountOf(array: mod.Array): number

// First/last of array
mod.FirstOf(array: mod.Array): any
mod.LastOf(array: mod.Array): any
```

### Math

```typescript
// Basic math
mod.Add(a: number, b: number): number
mod.Subtract(a: number, b: number): number
mod.Multiply(a: number, b: number): number
mod.Divide(a: number, b: number): number
mod.Modulo(a: number, b: number): number
mod.Power(base: number, exponent: number): number

// Min/max
mod.Min(a: number, b: number): number
mod.Max(a: number, b: number): number

// Absolute value
mod.AbsoluteValue(value: number): number

// Round/floor/ceiling
mod.RoundToInteger(value: number): number
mod.FloorOf(value: number): number
mod.CeilingOf(value: number): number

// Square root
mod.SquareRoot(value: number): number

// Random
mod.RandomInteger(min: number, max: number): number
mod.RandomReal(min: number, max: number): number
```

### Object Movement

```typescript
// Move object instantly
mod.MoveObject(
    object: mod.SpatialObject,
    deltaPosition: mod.Vector,
    deltaRotation: mod.Vector
): void

// Move object over time
mod.MoveObjectOverTime(
    object: mod.SpatialObject,
    deltaPosition: mod.Vector,
    deltaRotation: mod.Vector,
    duration: number,
    relative: boolean,
    loop: boolean
): void
```

---

## Event Handlers

These are the events you can export from your mod file. The system will call them when appropriate.

### Core Events

```typescript
// Game mode lifecycle
export async function OnGameModeStarted(): Promise<void>
export function OnGameModeEnding(): void
export function OngoingGlobal(): void  // Called every tick

// Player events
export async function OnPlayerJoinGame(player: mod.Player): Promise<void>
export async function OnPlayerLeaveGame(playerId: number): Promise<void>
export function OnPlayerDeployed(player: mod.Player): void
export function OnPlayerUndeploy(player: mod.Player): void

// Player actions
export function OnPlayerDied(
    player: mod.Player,
    killer: mod.Player,
    deathType: mod.DeathType,
    weaponUnlock: mod.WeaponUnlock
): void

export function OnPlayerEarnedKill(
    player: mod.Player,
    victim: mod.Player,
    deathType: mod.DeathType,
    weaponUnlock: mod.WeaponUnlock
): void

export function OnPlayerDamaged(
    player: mod.Player,
    damager: mod.Player,
    damageType: mod.DamageType,
    weaponUnlock: mod.WeaponUnlock
): void

// Interaction
export async function OnPlayerInteract(
    player: mod.Player,
    interactPoint: mod.InteractPoint
): Promise<void>

export function OnPlayerSwitchTeam(
    player: mod.Player,
    team: mod.Team
): void

// Area triggers
export function OnPlayerEnterAreaTrigger(
    player: mod.Player,
    areaTrigger: mod.AreaTrigger
): void

export function OnPlayerExitAreaTrigger(
    player: mod.Player,
    areaTrigger: mod.AreaTrigger
): void

// Capture points
export function OnPlayerEnterCapturePoint(
    player: mod.Player,
    capturePoint: mod.CapturePoint
): void

export function OnPlayerExitCapturePoint(
    player: mod.Player,
    capturePoint: mod.CapturePoint
): void

export function OnCapturePointCapturing(
    capturePoint: mod.CapturePoint
): void

export function OnCapturePointCaptured(
    capturePoint: mod.CapturePoint
): void

// Vehicles
export async function OnVehicleSpawned(
    vehicle: mod.Vehicle
): Promise<void>

export function OnVehicleDestroyed(
    vehicle: mod.Vehicle,
    destroyer: mod.Player
): void

// UI
export function OnPlayerUIButtonEvent(
    player: mod.Player,
    widget: mod.UIWidget,
    event: mod.UIButtonEvent
): void
```

---

## Common Patterns

### Initialize Game Mode

```typescript
export async function OnGameModeStarted() {
    // 1. Configure game settings
    mod.SetFriendlyFire(false);
    mod.SetSpawnMode(mod.SpawnModes.AutoSpawn);
    
    // 2. Setup objectives
    mod.EnableHQ(mod.GetHQ(1), true);
    mod.EnableGameModeObjective(mod.GetCapturePoint(1), true);
    
    // 3. Wait for players
    while (playerCount < minPlayers) {
        await mod.Wait(1);
    }
    
    // 4. Start update loops
    TickUpdate();
    SlowUpdate();
}
```

### Player Tracking

```typescript
class JsPlayer {
    static #allPlayers: { [key: number]: JsPlayer } = {};
    static playerInstances: mod.Player[] = [];
    
    static get(player: mod.Player): JsPlayer | undefined {
        let id = mod.GetObjId(player);
        if (id > -1) {
            let jsPlayer = this.#allPlayers[id];
            if (!jsPlayer) {
                jsPlayer = new JsPlayer(player);
                this.#allPlayers[id] = jsPlayer;
            }
            return jsPlayer;
        }
        return undefined;
    }
}
```

### Distance Check

```typescript
let playerPos = mod.GetSoldierState(player, mod.SoldierStateVector.GetPosition);
let targetPos = mod.CreateVector(100, 0, 100);
let distance = mod.DistanceBetween(playerPos, targetPos);

if (distance < 10) {
    // Player is within 10 meters
}
```

### Iterate Players

```typescript
let allPlayers = mod.AllPlayers();
let count = mod.CountOf(allPlayers);

for (let i = 0; i < count; i++) {
    let player = mod.ValueInArray(allPlayers, i) as mod.Player;
    // Do something with player
}
```

---

## Best Practices

1. **Always check object validity**: Use `mod.IsPlayerValid()` and check `mod.GetObjId() > -1`
2. **Use JsPlayer pattern**: Track player data in a class with static getter
3. **Clean up on player leave**: Remove UI and data when players disconnect
4. **Use async/await**: For time-based operations and delays
5. **Cache GetObjId results**: Don't call repeatedly in comparisons
6. **Validate before operations**: Check if objects exist before using them
7. **Use try-catch for equipment**: Removing equipment from empty slots throws errors
8. **Leverage modlib**: Import helpers from `code/modlib/index.ts`
9. **Test incrementally**: Add features one at a time
10. **Handle AI differently**: Check `IsAISoldier` and skip certain logic

---

## Additional Resources

- **modlib/index.ts**: Helper functions for UI, arrays, conditions, messages
- **BasicTemplate.ts**: Minimal game mode template
- **Official Mods**: Vertigo, BombSquad, AcePursuit, Exfil for advanced patterns

---

*This documentation covers the most commonly used SDK functions. For complete listings of weapons, gadgets, vehicles, and runtime spawn objects, refer to the full index.d.ts file.*
