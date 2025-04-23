from js import document, console

player_x = 5
player_y = 5

def move_player(dx, dy):
    global player_x, player_y
    player_x += dx
    player_y += dy
    update_dialogue(f"Player moved to ({player_x}, {player_y})")

def update_dialogue(text):
    document.getElementById("dialogueBox").innerText = text

def get_player_position():
    return {"x": player_x, "y": player_y}
