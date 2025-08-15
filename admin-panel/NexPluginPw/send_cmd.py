import socket
import json

def send_plugin_command(func_name, args):
    payload = {
        "func": func_name,
        "args": args
    }

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect(("127.0.0.1", 9020))
    s.send(json.dumps(payload).encode("utf-8"))
    s.close()

# 🔧 EXEMPLOS:

# Dar gold Cash para o jogador
send_plugin_command("game__PlayerAddGold", [1024, 9999])

# Dar item ID 1234 (1x) para jogador 1024
send_plugin_command("game__InvPlayerGiveItem2", [1024, 11208, 1])

# Teleportar jogador 1024 para mapa 1, coordenada x 123, y 456, z 487
send_plugin_command("game__PlayerTeleport", [1024, 1, 123, 456, 487])

# Entregar uma missao ao jogador roleid - taskid
send_plugin_command("game__DeliverTask", [1024, 2001])

# Desconectar jogador 1024
send_plugin_command("game__PlayerDisconnect", [1024])

# Adicionar moedas (kks) para jogador
send_plugin_command("game__PlayerGiveGold", [1024, 5000])

# Remover moedas (kks) do jogador 
send_plugin_command("game__PlayerSpendGold", [1024, 1000])

# Adicionar moedas (de prata) para jogador
send_plugin_command("game__PlayerGiveSilver", [1024, 5000])

# Remover moedas (de prata) do jogador
send_plugin_command("game__PlayerSpendSilver", [1024, 1000])

# Criar objeto: exemplo com 5 argumentos
# game__CreateObj(int type ,int roleid, int id, int time, int count)
# tipos disponiveis
# CREATE_MOB              = 0       -- game__CreateObj type
# CREATE_NPC              = 1       -- game__CreateObj type
# CREATE_MINE             = 2       -- game__CreateObj type
# --- 1 type, roleid, idnpc/mob/mine, tempo, quantidade
send_plugin_command("game__CreateObj", [1, 1024, 2165, 30, 1])

# Jogador obtém título
# Exemplo:  game__PlayerObtainTitle(int roleid, int title, int time)
send_plugin_command("game__PlayerObtainTitle", [1024, 10, 1])

# Jogador perde título
# Exemplo: game__PlayerDeleteTitle(int roleid, int title)
send_plugin_command("game__PlayerDeleteTitle", [1024, 10])

# Adicionar VIP ao jogador
send_plugin_command("game__PlayerAddVip", [1024, 30])

# Remover gold do jogador
# game__PlayerRemoveGold(int roleid, int count)
send_plugin_command("game__PlayerRemoveGold", [1024, 500])

# Matar jogador game__Die(int roleid, int target_id)
send_plugin_command("game__Die", [1024, 1028])

# Adicionar Alma ao Jogador game__AddSoulPower(int roleid, int power)
send_plugin_command("game__AddSoulPower", [1024, 777])

# Ativar trigger game__ActivateTriggerId(int trigger)
send_plugin_command("game__ActivateTriggerId", [100])

# Desativar trigger game__DeactivateTriggerId(int trigger)
send_plugin_command("game__DeactivateTriggerId", [100])

# Enviar mensagem no chat do jogo 
# game__ChatMsg(int type , int roleid, int channel, const char * utf8_msg, int shift_pos)
# types disponives:
# CHAT_SINGLE             = 0 -- game__ChatMsg type
# CHAT_INSTANCE           = 1 -- game__ChatMsg type
# CHAT_WORLD              = 2 -- game__ChatMsg type
# Canais disponiveis : 
# GN_CHAT_CHANNEL_LOCAL       = 0     # White channel
# GN_CHAT_CHANNEL_FARCRY      = 1     # World channel
# GN_CHAT_CHANNEL_TEAM        = 2     # Party channel
# GN_CHAT_CHANNEL_FACTION     = 3     # Clan channel
# GN_CHAT_CHANNEL_WHISPER     = 4     # Private message channel
# GN_CHAT_CHANNEL_DAMAGE      = 5     # Damage channel
# GN_CHAT_CHANNEL_FIGHT       = 6     # Fight channel
# GN_CHAT_CHANNEL_TRADE       = 7     # Trade channel
# GN_CHAT_CHANNEL_SYSTEM      = 8     # System channel
# GN_CHAT_CHANNEL_BROADCAST   = 9     # GM broadcast channel
# GN_CHAT_CHANNEL_MISC        = 10    # Blue channel
# GN_CHAT_CHANNEL_INSTANCE    = 11    # Instance (Red) channel
# GN_CHAT_CHANNEL_SUPERFARCRY = 12    # Horn channel
# GN_CHAT_CHANNEL_BATTLE      = 13    # TV channel
# GN_CHAT_CHANNEL_COUNTRY     = 14    # Country channel
# GN_CHAT_CHANNEL_GLOBAL      = 15    # Global inter-server channel
# GN_CHAT_CHANNEL_ALLIANCE    = 16    # Alliance channel
# GN_CHAT_CHANNEL_CENTER      = 17    # Center of screen channel
send_plugin_command("game__ChatMsg", [2, 1028, 9, "Agora vai!", -1])


