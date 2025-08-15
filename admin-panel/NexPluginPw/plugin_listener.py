import socket
import json

def start_listener():
    HOST = '127.0.0.1'
    PORT = 9010

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((HOST, PORT))
    server.listen()

    print(f"[PLUGIN] Escutando na porta {PORT}...")

    while True:
        conn, addr = server.accept()
        try:
            data = conn.recv(2048)
            if not data:
                continue

            event = json.loads(data.decode('utf-8'))
            process_event(event)

        except Exception as e:
            print(f"[ERRO] Falha ao processar evento: {e}")

        finally:
            conn.close()

def process_event(event):
    event_type = event.get("event", "unknown")
    payload = event.get("data", {})

    print(f"[EVENTO] {event_type}: {payload}")

    if event_type == "player_killed":
        killer = payload.get("k1")
        victim = payload.get("k2")
        print(f"⚔️  Jogador {killer} matou {victim}")

    elif event_type == "player_login":
        print(f"👤 Login detectado: {payload}")

    # Adicione outros tipos de evento aqui conforme necessário

if __name__ == "__main__":
    start_listener()
