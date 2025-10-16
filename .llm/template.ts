/**
 * Battlefield 6 Portal - Game Mode Template
 * 
 * This template provides a comprehensive skeleton for creating Portal game modes.
 * It includes all essential functions, common patterns, and best practices derived
 * from official mods (Vertigo, BombSquad, AcePursuit, Exfil).
 * 
 * Instructions:
 * 1. Copy this file to your mods/ folder
 * 2. Rename to match your game mode
 * 3. Fill in the game-specific logic
 * 4. Test incrementally
 * 
 * See dev_guidelines.md for detailed best practices.
 */

///////////////////////////////////////////////////////////////////////////////
// VERSION & DEBUG FLAGS
///////////////////////////////////////////////////////////////////////////////

const VERSION = [1, 0, 0]; // [major, minor, patch]
const debugJSPlayer = true;
const debugMode = false; // DISABLE BEFORE SHARING

///////////////////////////////////////////////////////////////////////////////
// TYPE DEFINITIONS
///////////////////////////////////////////////////////////////////////////////

type Widget = mod.UIWidget;
type Dict = { [key: string]: any };

enum GameState {
    Lobby,
    Countdown,
    InProgress,
    Ended
}

///////////////////////////////////////////////////////////////////////////////
// CONSTANTS
///////////////////////////////////////////////////////////////////////////////

// Player requirements
const minimumInitialPlayerCount: number = 2;
const combatStartDelaySeconds: number = 30;

// Object IDs (assigned in Godot)
const mainHQID: number = 1;
const capturePointID: number = 1;
const interactPointID: number = 1;

// Timings
const tickRate: number = 0.016; // 60fps
const slowTickRate: number = 1; // 1 second
const messageDisplayTime: number = 5;

// Colors (for UI)
const BLACKCOLOR: number[] = [1, 1, 1];
const REDCOLOR: number[] = [1, 0, 0];
const WHITECOLOR: number[] = [0, 0, 0];

// Vectors
const ZEROVEC: mod.Vector = mod.CreateVector(0, 0, 0);
const ONEVEC: mod.Vector = mod.CreateVector(1, 1, 1);

///////////////////////////////////////////////////////////////////////////////
// GLOBAL STATE VARIABLES
///////////////////////////////////////////////////////////////////////////////

let gameState: GameState = GameState.Lobby;
let gameOver: boolean = false;

let initialPlayerCount: number = 0;
let combatCountdownStarted: boolean = false;
let combatStartDelayRemaining: number = combatStartDelaySeconds;
let combatStarted: boolean = false;

let messageTime: number = 0;

// Team scores (if needed)
let team1Score: number = 0;
let team2Score: number = 0;

///////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Create a localized message with variable arguments
 */
function MakeMessage(message: string, ...args: any[]): mod.Message {
    switch (args.length) {
        case 0: return mod.Message(message);
        case 1: return mod.Message(message, args[0]);
        case 2: return mod.Message(message, args[0], args[1]);
        default: return mod.Message(message, args[0], args[1], args[2]);
    }
}

/**
 * Generate random integer from 0 to max-1
 */
function GetRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

/**
 * Generate random float in range [min, max)
 */
function GetRandomFloatInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Linear interpolation between a and b
 */
function Lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/**
 * Get all players within range of a point
 */
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

/**
 * Get all players on a specific team
 */
function GetPlayersOnTeam(team: mod.Team): mod.Player[] {
    let teamPlayers: mod.Player[] = [];
    let teamID = mod.GetObjId(team);
    
    JsPlayer.playerInstances.forEach(player => {
        if (mod.GetObjId(mod.GetTeam(player)) == teamID) {
            teamPlayers.push(player);
        }
    });
    
    return teamPlayers;
}

/**
 * Get all living players on a specific team
 */
function GetLivingPlayersOnTeam(team: mod.Team): mod.Player[] {
    let teamPlayers: mod.Player[] = [];
    let teamID = mod.GetObjId(team);
    
    JsPlayer.playerInstances.forEach(player => {
        let jsPlayer = JsPlayer.get(player);
        if (!jsPlayer) return;
        
        if (mod.GetObjId(mod.GetTeam(player)) == teamID 
            && mod.GetSoldierState(player, mod.SoldierStateBool.IsAlive)) {
            teamPlayers.push(player);
        }
    });
    
    return teamPlayers;
}

///////////////////////////////////////////////////////////////////////////////
// PLAYER MANAGEMENT CLASS
///////////////////////////////////////////////////////////////////////////////

class JsPlayer {
    player: mod.Player;
    playerId: number;
    
    // Game-specific properties
    score: number = 0;
    deaths: number = 0;
    isDeployed: boolean = false;
    
    // UI references
    lobbyUI?: LobbyUI;
    messageUI?: MessageUI;
    
    // Track all player instances
    static playerInstances: mod.Player[] = [];
    static #allJsPlayers: { [key: number]: JsPlayer } = {};
    
    constructor(player: mod.Player) {
        this.player = player;
        this.playerId = mod.GetObjId(player);
        JsPlayer.playerInstances.push(this.player);
        
        if (debugJSPlayer) {
            console.log("Adding Player [", mod.GetObjId(this.player), "] Creating JS Player: ", JsPlayer.playerInstances.length);
        }
        
        // Create UI for human players only
        if (!mod.GetSoldierState(player, mod.SoldierStateBool.IsAISoldier)) {
            this.lobbyUI = new LobbyUI(this);
            this.messageUI = new MessageUI(this);
        }
    }
    
    /**
     * Get or create JsPlayer instance for a player
     */
    static get(player: mod.Player): JsPlayer | undefined {
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
    
    /**
     * Remove invalid players and clean up
     */
    static removeInvalidJSPlayers(invalidPlayerId: number): void {
        if (gameOver) return;
        
        if (debugJSPlayer) {
            console.log("Removing Invalid JSPlayer:", invalidPlayerId);
        }
        
        // Clean up UI
        this.#allJsPlayers[invalidPlayerId]?.destroyUI();
        
        // Remove from dictionary
        delete this.#allJsPlayers[invalidPlayerId];
        
        // Remove from instances array
        let indexToRemove = -1;
        JsPlayer.playerInstances.forEach((player, i) => {
            if (mod.GetObjId(player) < 0) {
                indexToRemove = i;
            }
        });
        
        if (indexToRemove > -1) {
            JsPlayer.playerInstances.splice(indexToRemove, 1);
        }
    }
    
    /**
     * Clean up all UI elements
     */
    destroyUI(): void {
        this.lobbyUI?.close();
        this.messageUI?.close();
    }
}

///////////////////////////////////////////////////////////////////////////////
// UI CLASSES
///////////////////////////////////////////////////////////////////////////////

class LobbyUI {
    #jsPlayer: JsPlayer;
    #rootWidget: mod.UIWidget | undefined;
    #statusText: mod.UIWidget | undefined;
    #isVisible: boolean = false;
    
    #containerWidth = 700;
    #containerHeight = 300;
    
    constructor(jsPlayer: JsPlayer) {
        this.#jsPlayer = jsPlayer;
    }
    
    open(): void {
        if (!this.#rootWidget) this.#create();
        if (!this.#rootWidget) return;
        
        mod.SetUIWidgetVisible(this.#rootWidget, true);
        this.#isVisible = true;
    }
    
    close(): void {
        if (this.#rootWidget) {
            mod.SetUIWidgetVisible(this.#rootWidget, false);
            this.#isVisible = false;
        }
    }
    
    refresh(): void {
        if (!this.#statusText) return;
        
        if (combatCountdownStarted) {
            mod.SetUITextLabel(
                this.#statusText,
                MakeMessage(mod.stringkeys.combatStartDelayCountdown || "Starting in {0}...", combatStartDelayRemaining)
            );
        } else {
            mod.SetUITextLabel(
                this.#statusText,
                MakeMessage(mod.stringkeys.waitingforplayersX || "Waiting for players: {0}/{1}", initialPlayerCount, minimumInitialPlayerCount)
            );
        }
    }
    
    isOpen(): boolean {
        return this.#isVisible;
    }
    
    #create(): void {
        // Use ParseUI from modlib or create manually
        // This is a simplified example - use the ParseUI pattern from official mods
        mod.AddUIContainer(
            "LobbyContainer",
            mod.CreateVector(0, 100, 0),
            mod.CreateVector(this.#containerWidth, this.#containerHeight, 0),
            mod.UIAnchor.TopCenter,
            mod.GetUIRoot(),
            true,
            0,
            mod.CreateVector(0.1, 0.1, 0.1),
            1,
            mod.UIBgFill.Blur,
            this.#jsPlayer.player
        );
        
        this.#rootWidget = mod.FindUIWidgetWithName("LobbyContainer") as mod.UIWidget;
        if (!this.#rootWidget) return;
        
        // Add status text (simplified)
        mod.AddUIText(
            "LobbyStatusText",
            mod.CreateVector(0, -30, 0),
            mod.CreateVector(this.#containerWidth, 50, 0),
            mod.UIAnchor.BottomCenter,
            this.#rootWidget,
            true,
            8,
            ZEROVEC,
            0,
            mod.UIBgFill.None,
            MakeMessage(mod.stringkeys.waitingforplayersX || "Waiting...", 0, minimumInitialPlayerCount),
            36,
            mod.CreateVector(1, 1, 1),
            1,
            mod.UIAnchor.Center,
            this.#jsPlayer.player
        );
        
        this.#statusText = mod.FindUIWidgetWithName("LobbyStatusText") as mod.UIWidget;
    }
}

class MessageUI {
    #jsPlayer: JsPlayer;
    #rootWidget: mod.UIWidget | undefined;
    #messageText: mod.UIWidget | undefined;
    #isVisible: boolean = false;
    
    #containerWidth = 700;
    #containerHeight = 100;
    
    constructor(jsPlayer: JsPlayer) {
        this.#jsPlayer = jsPlayer;
    }
    
    open(message: mod.Message, textColor: number[]): void {
        if (!this.#rootWidget) {
            this.#create(message, textColor);
        } else {
            this.refresh(message);
            if (this.#messageText && textColor.length >= 3) {
                mod.SetUITextColor(this.#messageText, mod.CreateVector(textColor[0], textColor[1], textColor[2]));
            }
        }
        
        if (!this.#rootWidget) return;
        mod.SetUIWidgetVisible(this.#rootWidget, true);
        this.#isVisible = true;
    }
    
    close(): void {
        if (this.#rootWidget) {
            mod.SetUIWidgetVisible(this.#rootWidget, false);
            this.#isVisible = false;
        }
    }
    
    refresh(message: mod.Message): void {
        if (!this.#messageText) return;
        mod.SetUITextLabel(this.#messageText, message);
    }
    
    isOpen(): boolean {
        return this.#isVisible;
    }
    
    #create(message: mod.Message, textColor: number[]): void {
        // Simplified creation - use ParseUI in production
        mod.AddUIContainer(
            "MessageContainer",
            mod.CreateVector(0, 25, 0),
            mod.CreateVector(this.#containerWidth, this.#containerHeight, 0),
            mod.UIAnchor.TopCenter,
            mod.GetUIRoot(),
            true,
            0,
            ZEROVEC,
            0.8,
            mod.UIBgFill.Blur,
            this.#jsPlayer.player
        );
        
        this.#rootWidget = mod.FindUIWidgetWithName("MessageContainer") as mod.UIWidget;
        if (!this.#rootWidget) return;
        
        mod.AddUIText(
            "MessageText",
            mod.CreateVector(0, 0, 0),
            mod.CreateVector(this.#containerWidth, this.#containerHeight, 0),
            mod.UIAnchor.Center,
            this.#rootWidget,
            true,
            8,
            ZEROVEC,
            0,
            mod.UIBgFill.None,
            message,
            36,
            mod.CreateVector(textColor[0], textColor[1], textColor[2]),
            1,
            mod.UIAnchor.Center,
            this.#jsPlayer.player
        );
        
        this.#messageText = mod.FindUIWidgetWithName("MessageText") as mod.UIWidget;
    }
}

///////////////////////////////////////////////////////////////////////////////
// MESSAGE SYSTEM
///////////////////////////////////////////////////////////////////////////////

function MessageAllUI(message: mod.Message, textColor: number[]): void {
    JsPlayer.playerInstances.forEach(player => {
        let jsPlayer = JsPlayer.get(player);
        if (!jsPlayer) return;
        
        if (jsPlayer.messageUI?.isOpen()) {
            jsPlayer.messageUI.refresh(message);
        } else {
            jsPlayer.messageUI?.open(message, textColor);
        }
    });
    messageTime = messageDisplayTime;
}

function HideAllMessageUI(): void {
    JsPlayer.playerInstances.forEach(player => {
        let jsPlayer = JsPlayer.get(player);
        if (!jsPlayer) return;
        jsPlayer.messageUI?.close();
    });
}

function UpdateAllLobbyUI(): void {
    JsPlayer.playerInstances.forEach(player => {
        let jsPlayer = JsPlayer.get(player);
        if (!jsPlayer) return;
        jsPlayer.lobbyUI?.refresh();
    });
}

function HideAllLobbyUI(): void {
    JsPlayer.playerInstances.forEach(player => {
        let jsPlayer = JsPlayer.get(player);
        if (!jsPlayer) return;
        jsPlayer.lobbyUI?.close();
    });
}

async function UpdateMessages(): Promise<void> {
    if (messageTime > 0) {
        messageTime--;
        if (messageTime <= 0) {
            HideAllMessageUI();
            messageTime = 0;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// GAME FLOW FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

async function CombatCountdown(): Promise<void> {
    combatCountdownStarted = true;
    console.log("Combat Countdown Started");
    
    while (combatStartDelayRemaining > 0) {
        UpdateAllLobbyUI();
        await mod.Wait(1);
        combatStartDelayRemaining--;
    }
    
    combatStarted = true;
    mod.DisablePlayerJoin();
    console.log("Combat Started");
    HideAllLobbyUI();
    return Promise.resolve();
}

function CheckVictoryConditions(): boolean {
    // Implement your victory logic here
    // Return true if game should end
    
    // Example: Check team scores
    if (team1Score >= 10) {
        mod.EndGameMode(mod.GetTeam(1));
        return true;
    }
    
    if (team2Score >= 10) {
        mod.EndGameMode(mod.GetTeam(2));
        return true;
    }
    
    return false;
}

///////////////////////////////////////////////////////////////////////////////
// UPDATE LOOPS
///////////////////////////////////////////////////////////////////////////////

async function TickUpdate(): Promise<void> {
    while (true) {
        await mod.Wait(tickRate);
        
        if (gameOver) continue;
        
        // Fast update logic here (60fps)
        // - Proximity checks
        // - Progress bars
        // - Input handling
    }
}

async function ThrottledUpdate(): Promise<void> {
    while (true) {
        await mod.Wait(slowTickRate);
        
        if (gameOver) continue;
        
        // Slow update logic here (1 second)
        UpdateMessages();
        
        JsPlayer.playerInstances.forEach(player => {
            if (!mod.IsPlayerValid(player)) return;
            
            // Update player-specific logic
            // - UI refreshes
            // - Position checks
            // - Timers
        });
        
        // Check victory conditions
        if (combatStarted) {
            CheckVictoryConditions();
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// EXPORTED EVENT HANDLERS
///////////////////////////////////////////////////////////////////////////////

/**
 * Called once when the game mode starts
 */
export async function OnGameModeStarted(): Promise<void> {
    console.log("Game Mode Started - Version", VERSION[0], ".", VERSION[1], ".", VERSION[2]);
    
    // 1. Configure game settings
    mod.SetFriendlyFire(false);
    mod.SetSpawnMode(mod.SpawnModes.AutoSpawn);
    
    // 2. Setup game objects (HQs, objectives, etc.)
    let mainHQ = mod.GetHQ(mainHQID);
    mod.EnableHQ(mainHQ, true);
    
    // 3. Wait for minimum players
    while (initialPlayerCount < minimumInitialPlayerCount) {
        await mod.Wait(1);
    }
    
    console.log("Adequate players have joined. Starting countdown.");
    
    // 4. Start countdown
    await CombatCountdown();
    
    // 5. Begin update loops (don't await these)
    TickUpdate();
    ThrottledUpdate();
}

/**
 * Called when game mode is ending
 */
export function OnGameModeEnding(): void {
    gameOver = true;
    HideAllMessageUI();
    console.log("Game Mode Ending");
}

/**
 * Called every game tick
 */
export function OngoingGlobal(): void {
    // Use sparingly - this is called every frame
    // Prefer using async update loops instead
}

/**
 * Called when a player joins the game
 */
export async function OnPlayerJoinGame(player: mod.Player): Promise<void> {
    await mod.Wait(0.1); // Small delay for initialization
    
    let jsPlayer = JsPlayer.get(player);
    if (!jsPlayer) return;
    
    // Check if human player
    if (!mod.GetSoldierState(player, mod.SoldierStateBool.IsAISoldier)) {
        if (!combatStarted) {
            jsPlayer.lobbyUI?.open();
            initialPlayerCount++;
            console.log("Player joined. Total:", initialPlayerCount);
            UpdateAllLobbyUI();
        }
    }
}

/**
 * Called when a player leaves the game
 */
export async function OnPlayerLeaveGame(playerId: number): Promise<void> {
    JsPlayer.removeInvalidJSPlayers(playerId);
    
    if (!combatStarted && !gameOver) {
        initialPlayerCount--;
        UpdateAllLobbyUI();
    }
}

/**
 * Called when a player deploys into the game
 */
export function OnPlayerDeployed(eventPlayer: mod.Player): void {
    let jsPlayer = JsPlayer.get(eventPlayer);
    if (!jsPlayer) return;
    
    jsPlayer.isDeployed = true;
    
    // Setup player loadout, position, etc.
    if (!combatStarted) {
        // Pre-game spawn logic
    } else {
        // In-game spawn logic
    }
}

/**
 * Called when a player undeploys
 */
export function OnPlayerUndeploy(eventPlayer: mod.Player): void {
    let jsPlayer = JsPlayer.get(eventPlayer);
    if (!jsPlayer) return;
    
    jsPlayer.isDeployed = false;
}

/**
 * Called when a player dies
 */
export function OnPlayerDied(
    eventPlayer: mod.Player,
    eventOtherPlayer: mod.Player,
    eventDeathType: mod.DeathType,
    eventWeaponUnlock: mod.WeaponUnlock
): void {
    let jsPlayer = JsPlayer.get(eventPlayer);
    if (!jsPlayer) return;
    
    jsPlayer.deaths++;
    
    // Handle death logic
    // - Update scores
    // - Check victory conditions
    // - Trigger events
}

/**
 * Called when a player earns a kill
 */
export function OnPlayerEarnedKill(
    eventPlayer: mod.Player,
    eventOtherPlayer: mod.Player,
    eventDeathType: mod.DeathType,
    eventWeaponUnlock: mod.WeaponUnlock
): void {
    // Skip redeploy "kills"
    if (mod.EventDeathTypeCompare(eventDeathType, mod.PlayerDeathTypes.Redeploy)) {
        return;
    }
    
    let jsPlayer = JsPlayer.get(eventPlayer);
    if (!jsPlayer) return;
    
    jsPlayer.score++;
    
    // Handle kill logic
    // - Award points
    // - Update UI
}

/**
 * Called when a player takes damage
 */
export function OnPlayerDamaged(
    eventPlayer: mod.Player,
    eventOtherPlayer: mod.Player,
    eventDamageType: mod.DamageType,
    eventWeaponUnlock: mod.WeaponUnlock
): void {
    // Handle damage events
    // - Custom damage modifiers
    // - Damage feedback
}

/**
 * Called when a player interacts with an interact point
 */
export async function OnPlayerInteract(
    player: mod.Player,
    interactPoint: mod.InteractPoint
): Promise<void> {
    let id = mod.GetObjId(interactPoint);
    let jsPlayer = JsPlayer.get(player);
    if (!jsPlayer) return;
    
    // Switch on interact point ID
    switch (id) {
        case interactPointID:
            // Handle interaction
            console.log("Player interacted with object:", id);
            break;
        
        default:
            console.log("Unknown interact point:", id);
    }
}

/**
 * Called when a player switches teams
 */
export function OnPlayerSwitchTeam(
    eventPlayer: mod.Player,
    eventTeam: mod.Team
): void {
    console.log("Player switched to team:", mod.GetObjId(eventTeam));
}

/**
 * Called when a player enters an area trigger
 */
export function OnPlayerEnterAreaTrigger(
    eventPlayer: mod.Player,
    eventAreaTrigger: mod.AreaTrigger
): void {
    let id = mod.GetObjId(eventAreaTrigger);
    
    // Handle area trigger entry
    console.log("Player entered area trigger:", id);
}

/**
 * Called when a player exits an area trigger
 */
export function OnPlayerExitAreaTrigger(
    eventPlayer: mod.Player,
    eventAreaTrigger: mod.AreaTrigger
): void {
    let id = mod.GetObjId(eventAreaTrigger);
    
    // Handle area trigger exit
    console.log("Player exited area trigger:", id);
}

/**
 * Called when a player enters a capture point
 */
export function OnPlayerEnterCapturePoint(
    eventPlayer: mod.Player,
    eventCapturePoint: mod.CapturePoint
): void {
    // Handle capture point entry
}

/**
 * Called when a player exits a capture point
 */
export function OnPlayerExitCapturePoint(
    eventPlayer: mod.Player,
    eventCapturePoint: mod.CapturePoint
): void {
    // Handle capture point exit
}

/**
 * Called when a capture point is being captured
 */
export function OnCapturePointCapturing(
    eventCapturePoint: mod.CapturePoint
): void {
    // Display capture progress
    mod.DisplayNotificationMessage(
        MakeMessage(mod.stringkeys.teamCapture || "Capturing...")
    );
}

/**
 * Called when a capture point is captured
 */
export function OnCapturePointCaptured(
    eventCapturePoint: mod.CapturePoint
): void {
    let ownerTeam = mod.GetCurrentOwnerTeam(eventCapturePoint);
    
    MessageAllUI(
        MakeMessage(mod.stringkeys.pointCaptured || "Point captured by team {0}", mod.GetObjId(ownerTeam)),
        REDCOLOR
    );
}

/**
 * Called when a vehicle spawns
 */
export async function OnVehicleSpawned(eventVehicle: mod.Vehicle): Promise<void> {
    // Handle vehicle spawn
    // - Custom vehicle behavior
    // - Destroy in certain areas
}

/**
 * Called when a vehicle is destroyed
 */
export function OnVehicleDestroyed(
    eventVehicle: mod.Vehicle,
    eventPlayer: mod.Player
): void {
    // Handle vehicle destruction
}

/**
 * Called when a UI button is pressed
 */
export function OnPlayerUIButtonEvent(
    player: mod.Player,
    widget: mod.UIWidget,
    event: mod.UIButtonEvent
): void {
    let jsPlayer = JsPlayer.get(player);
    if (!jsPlayer) return;
    
    // Handle button events
    // - Store purchases
    // - Menu navigation
}

///////////////////////////////////////////////////////////////////////////////
// END OF TEMPLATE
///////////////////////////////////////////////////////////////////////////////

/**
 * TODO: Implement your game-specific logic
 * 
 * 1. Define your game state enums and types
 * 2. Add constants for your game (IDs, timings, positions)
 * 3. Implement JsPlayer properties for tracking player state
 * 4. Create UI classes for your interface elements
 * 5. Implement victory condition checking
 * 6. Fill in event handlers with your game logic
 * 7. Add custom helper functions as needed
 * 8. Test incrementally!
 */
