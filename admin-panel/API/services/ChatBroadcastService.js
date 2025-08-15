// src/controllers/ChatBroadcast.js
const { WritePacket } = require('../utils/packet_class');
const config = require('../config/config');

async function sendChatBroadcast(channel, userid, mensagem) {
    return new Promise((resolve, reject) => {
        const ChatBroadCast = new WritePacket();
        ChatBroadCast.getResponse = false;

        ChatBroadCast.writeUByte(channel);
        ChatBroadCast.writeUByte(0);
        ChatBroadCast.writeUInt32(userid);
        ChatBroadCast.writeUString(mensagem);
        ChatBroadCast.writeOctets(Buffer.alloc(0));

        ChatBroadCast.pack(config.type.worldChat);

        ChatBroadCast.send(config.servers.GProviderClient.ip, config.servers.GProviderClient.port, (err, response) => {
            if (err) {
                console.error("Erro ao enviar o pacote:", err);
                reject(err);
            } else {
                console.log(`Pacote ChatBroadcast enviado com sucesso: Canal = ${channel}, UserID = ${userid}, Mensagem = "${mensagem}"`);
                resolve(`Mensagem enviada com sucesso: "${mensagem}"`);
            }
        });
    });
}

module.exports = { sendChatBroadcast };
