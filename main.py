from js import document

TILE_FLOOR = 0
TILE_WALL = 1
TILE_TRIGGER = 2

tilemap = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

player_x = 1
player_y = 1

def is_walkable(x, y):
    if 0 <= y < len(tilemap) and 0 <= x < len(tilemap[0]):
        return tilemap[y][x] in (TILE_FLOOR, TILE_TRIGGER)
    return False

def move_player(dx, dy):
    global player_x, player_y
    new_x = player_x + dx
    new_y = player_y + dy
    if is_walkable(new_x, new_y):
        player_x = new_x
        player_y = new_y
        check_trigger()

def get_player_position():
    return {"x": player_x, "y": player_y}

def get_tilemap():
    return tilemap

def check_trigger():
    if tilemap[player_y][player_x] == TILE_TRIGGER:
        update_dialogue("You feel a strange presence here...")
    else:
        update_dialogue("")

def update_dialogue(text):
    document.getElementById("dialogueBox").innerText = text
