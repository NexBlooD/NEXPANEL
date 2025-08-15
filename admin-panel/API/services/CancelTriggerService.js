const { WritePacket } = require('../utils/packet_class');
const config = require('../config/config');
const net = require('net');

async function cancelTrigger(triggerId) {
    return new Promise((resolve, reject) => {
        const xid = 0x00;
        const worldTag = 1;

        const client = new net.Socket();
        client.connect(config.servers.deliveryServer.port, config.servers.deliveryServer.ip, () => {
            console.log('Conectado ao servidor. Aguardando resposta inicial...');
        });

        client.on('data', (data) => {
            console.log('Resposta inicial recebida do servidor:', data.toString('hex'));

            const DeactivateTrigger = new WritePacket(); 
            DeactivateTrigger.getResponse = true;

            DeactivateTrigger.writeUByte(0x00);
            DeactivateTrigger.writeUByte(0x00);
            DeactivateTrigger.writeUByte(0x01);
            DeactivateTrigger.writeUByte(xid);
            DeactivateTrigger.writeInt32(worldTag);

            const commandBuffer = Buffer.from(`cancel_npc_generator ${triggerId}`);
            DeactivateTrigger.writeOctets(commandBuffer);

            DeactivateTrigger.pack(380);

            const hexOutput = DeactivateTrigger.request.toString('hex').match(/.{1,2}/g).join('');
            console.log("Pacote completo a ser enviado (hexadecimal):", hexOutput);

            DeactivateTrigger.send(config.servers.deliveryServer.ip, config.servers.deliveryServer.port, (err, response) => {
                if (err) {
                    console.error("Erro ao enviar o pacote:", err);
                    reject(err);
                } else {
                    console.log(`Trigger cancelado com sucesso: TriggerID = ${triggerId}, WorldTag = ${worldTag}, XID = ${xid}`);
                    resolve(`Trigger cancelado com sucesso: TriggerID = ${triggerId}`);
                }
                client.destroy();
            });
        });

        client.on('error', (err) => {
            console.error('Erro na conexão:', err);
            client.destroy();
            reject(err);
        });

        client.on('close', () => {
            console.log('Conexão com o servidor fechada.');
        });
    });
}

module.exports = { cancelTrigger };
