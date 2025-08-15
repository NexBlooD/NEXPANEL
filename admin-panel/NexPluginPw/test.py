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


# Adicionar moedas (de prata) para jogador
#send_plugin_command("game__PlayerGiveSilver", [1028, 10])

# Remover moedas (de prata) do jogador
#send_plugin_command("game__PlayerSpendSilver", [1028, 3])

# Enviar mensagem no chat do jogo
# Espera: type, roleid, channel, utf8_msg (string), shift_pos
send_plugin_command("game__ChatMsg", [2, 1028, 9, "Agora vai!", -1])