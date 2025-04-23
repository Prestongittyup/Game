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

# Player state
player_x = 1
player_y = 1
player_form = "normal"  # "normal" or "shadow"
player_health = 5

# Enemy state
enemy_x = 10
enemy_y = 2
enemy_health = 3

def get_player_position():
    return {"x": player_x, "y": player_y}

def get_enemy_position():
    return {"x": enemy_x, "y": enemy_y} if enemy_health > 0 else None

def get_tilemap():
    return tilemap

def update_dialogue(text):
    document.getElementById("dialogueBox").innerText = text

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
        check_enemy_contact()

def check_trigger():
    if tilemap[player_y][player_x] == TILE_TRIGGER:
        update_dialogue("You feel a strange presence...")
    else:
        update_dialogue("")

def check_enemy_contact():
    global player_health
    if enemy_health > 0 and abs(player_x - enemy_x) + abs(player_y - enemy_y) == 1:
        player_health -= 1
        update_dialogue(f"Ouch! Enemy hit you! Health: {player_health}")

def attack():
    global enemy_health
    if enemy_health <= 0:
        return

    range_reach = 1 if player_form == "normal" else 2
    dx = abs(player_x - enemy_x)
    dy = abs(player_y - enemy_y)
    if dx + dy <= range_reach:
        enemy_health -= 1
        update_dialogue(f"Enemy hit! Enemy health: {enemy_health}")
    else:
        update_dialogue("Missed!")

def transform():
    global player_form
    player_form = "shadow" if player_form == "normal" else "normal"
    update_dialogue(f"Transformed into {player_form} form!")

def get_status():
    return {
        "player_form": str(player_form),
        "player_health": int(player_health),
        "enemy_health": int(enemy_health),
    }

