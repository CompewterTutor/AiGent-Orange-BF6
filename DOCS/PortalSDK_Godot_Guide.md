# Battlefield 6 Portal SDK

Battlefield's Portal Builder Tool is a diverse sandbox where creators and players can push Battlefield to the limit, giving you detailed options to let you customize your Battlefield experiences to fit your preferences or even create wild new experiences.

The Portal Builder Tool also lets you take unprecedented control of your environment by moving, scaling, and duplicating existing objects with a spatial editor while Bot scripting and customizable UI allows you to create entirely new game modes.

Any experience made with Portal will be available as a Community Experience within the Community section.

For additional information, visit: https://portal.battlefield.com

## Getting Started

1. Open the included Godot executable.
2. A "Project Selection" window will open. Drag the GodotProject folder into this window to import the Portal project automatically, or press "Import" to find it on your machine manually.
3. Open the Battlefield 6 Portal Project and wait for it to start up. This can take a few minutes.
4. Click the "Portal Setup" button in the "BFPortal" tab on the right hand side of the Godot UI and wait for setup to finish. This can take several minutes.
5. To begin spatial editing, open a level by opening the "Scene" dropdown and selecting "Open Scene". Open the "levels" directory and select the level you wish to begin editing.

> **Note:** Level geometry will often be above the default camera location in Godot. Look up if you can't find the level.

## Key Features

### Spatial Editor

Battlefield 6 Portal allows for additive spatial editing of all levels via the included Godot editor. You may add new instances of most objects that appear in a level to that level, and move, rotate, and scale them to build whatever you can imagine.

In addition to environmental objects, Portal includes a number of gameplay objects that can be added and modified on every map, such as Headquarters, Spawn Points, Combat Areas, etc.

Map edits are exported from Godot and can be attached to Custom Experiences via the Portal Web Builder.

### Object Manipulation

#### Camera Navigation

While holding down the **Right Mouse Button**:

- Move the mouse to tilt and pan the camera
- Use **W, A, S, D** keys to move the camera position
- Scroll the mouse wheel to change the camera movement speed
- Scroll the mouse wheel to zoom in and out

#### Selecting Objects

- Click an object in the Scene Outliner to select it
- Press **Q** and then click the object you wish to select in the 3D scene
- Press **F** to frame the selected object into view

#### Moving Objects

- Press **W** with an object selected to enter Move mode

#### Rotating Objects

- Press **E** with an object selected to enter Rotate mode

#### Scaling Objects

- Press **R** with an object selected to enter Scale mode

> **Note:** Objects should always be uniformly scaled. Non-uniform scaling is not officially supported.

#### Object Library

- Click and drag objects from the Object Library into the 3D Scene or the Scene Outliner
- Only use objects that are in the level tab that matches the level you are editing; using objects from other levels is not supported in most cases
- To find which assets are usable in your level, check that level's tab in the Object Library at the bottom center of Godot

#### Exporting Map Edits

- Export your current level edits by pressing the "Export Current Level" button in the BFPortal tab
- This will export your level edits as a `.spatial.json` file that can be added to a map in a custom experience via the Portal Web Builder tool

#### Static Layers

Each map contains a "Static" layer that contains the Terrain and baked Assets in each level. These objects are not currently editable.

## Important Gameplay Objects

### Combat Area

- Combat Areas define the playable boundaries of a level
- Combat Areas require the Combat Volume property to be set with the created boundaries
- Use a PolygonVolume to draw out the shape by moving the points of the volume by holding left-click on a point, and holding control and left-clicking to create new points
- To remove points, hold control and right click on individual points
- Working Combat Areas are pre-placed on all maps

### HQ's and Player Spawners

In order to deploy into a level, you must set up either `HQ_PlayerSpawner` or `PlayerSpawner` objects.

**HQ_PlayerSpawner:**
- A standard Battlefield HQ spawner, which will allow players to manually spawn themselves onto the map using their team's HQ
- HQ_PlayerSpawners are assigned to a specific team via the Inspector Panel in the Spatial Editor

**PlayerSpawner:**
- An alternate spawning method that has no HQ but can be used to script player deployment directly
- PlayerSpawners are not assigned to a specific team and can be used to spawn any players

Both spawner types must be linked to one or more SpawnPoint objects in order to function. Working HQ examples are pre-placed on all levels.

### SpawnPoints

Objects which, when connected to HQ_PlayerSpawners and PlayerSpawners, determine where players are able to spawn into a level.

### Area Triggers

AreaTrigger objects, when paired with a PolygonVolume, can be used to trigger events in scripting such as:

- `OnPlayerEnterAreaTrigger`
- `OnPlayerExitAreaTrigger`

### DeployCam

The DeployCam is used to set up the Camera that will be used in the Deploy Screen when deploying into a level.

### VehicleSpawners

VehicleSpawners can be used to trigger vehicles to spawn into the map via script.

### WorldIcon

WorldIcons can be placed in a level to create in-world icons and text.

### Interact Point

InteractPoints can be placed in a level and used to trigger events in script.

### AI_Spawner

- AI Spawners are used to spawn Custom AI Bots into a level
- These bots and their behavior is controllable and customizable via script

## Available Levels

| Level Name | Map Code |
|---|---|
| Empire State | MP_Aftermath |
| Iberian Offensive | MP_Battery |
| Liberation Peak | MP_Capstone |
| Manhattan Bridge | MP_Dumbo |
| Mirak Valley | MP_Tungsten |
| New Sobek City | MP_Outskirts |
| Operation Firestorm | MP_Firestorm |
| Saint's Quarter | MP_Limestone |
| Siege of Cairo | MP_Abbasid |

## Gameplay Logic Scripting

Battlefield 6 Portal now supports multiple ways to script custom gameplay logic for your Custom Experiences. For veterans of the previous Portal builder tool and people looking to dip their toes into scripting, the Blockly logic editing tool is still available in the Portal Web Builder Tool. However, for more advanced users and creators looking to build large bespoke experiences, Portal now supports logic scripting via TypeScript.

### Gameplay Scripting

- Gameplay scripting can be done either through the Portal Web Tool via Blockly, or in TypeScript
- TypeScript can be written directly within the Portal Web Tool's script page, or can be developed externally and uploaded via the script page
- More information about TypeScript functions can be found in the `index.d.ts` file contained in the SDK

Below is a brief list of key new functions and capabilities in the Portal scripting system.

### Custom UI

- A fully customizable UI system is now available in Portal
- The custom UI system supports interactive as well as non-interactive UI elements, making it possible to build things like interactive menus and stores

### AI Behavior

- Custom AI Bots, outside of the normal Backfill or Static bots, can be directly spawned into levels via script, using the AI_Spawner object
- Unlike normal bots, the Custom AI Bots support direct scripting of things like their target, stance, speed, move to location, etc.
- This allows for a great deal of customization and flexibility

### Object Spawning

- Environmental and Gameplay objects can be spawned at runtime via the `SpawnObject` function
- Spawnable objects are restricted by map to objects that already exist in that map or are part of the Global object list

### VFX Spawning

- Visual FX can be spawned using the runtime spawner, or placed in the map using the Spatial editor
- Visual FX can be triggered at runtime via the `EnableVFX` function

### Audio Triggering

- Sound FX can be spawned using the runtime spawner, or placed in the map using the Spatial editor
- Sound FX can be triggered at runtime via the `PlaySound` function

### Object Moving

- Objects can be moved at runtime via the `MoveObject` function or the `SetObjectTransform` function

### Player Spawning

- Players can be deployed directly into the level using a PlayerSpawner object and the `SpawnPlayerFromSpawnPoint` function

### Referencing Objects In Script

Most objects placed in the Spatial Editor have an "Obj Id" field which can be set to a unique number. These objects can be referenced in script by using a matching "Get" function like:

- `GetSpatialObject`
- `GetSpawner`
- `GetInteractPoint`

## Example Experiences

Example experiences can be found in the "mods" directory.

### Mod Components

- **`modname.ts`** — This is the gameplay script for a mod
- **`modname.tscn`** — This is the Godot level with any spatial edits needed for the mod. This will need to be exported from Godot for use in an experience
- **`modname.strings.json`** — This is a predefined list of strings used in the mod
