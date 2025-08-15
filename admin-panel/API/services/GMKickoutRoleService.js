const net = require('net');
const { WritePacket, ReadPacket } = require('../utils/packet_class');
const config = require('../config/config');
const logDebug = console.log;

class GMKickoutRole {
    async kickoutRole(role, time, reason) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();

            const { ip, port } = config.servers.deliveryServer;

            logDebug('Iniciando conexão com o servidor gdelivery...');

            client.connect(port, ip, () => {
                logDebug('Conectado ao servidor gdelivery. Aguardando resposta inicial...');
            });

            client.once('data', (initialResponse) => {
                try {
                    logDebug('Resposta inicial recebida do servidor:', initialResponse.toString('hex'));

                    const readPacket = new ReadPacket(initialResponse);

                    const attr = readPacket.readUInt32();
                    const freecreatime = readPacket.readInt32();
                    const exp_rate = readPacket.readUByte();

                    logDebug(
                        `Resposta inicial processada: attr = ${attr}, freecreatime = ${freecreatime}, exp_rate = ${exp_rate}`
                    );

                    const packet = new WritePacket();
                    packet.writeInt32(-1); 
                    packet.writeUInt32(0); 
                    packet.writeUInt32(role); 
                    packet.writeUInt32(time); 
                    packet.writeUString(reason); 
                    packet.pack(config.type.forbidRole); 

                    logDebug('Pacote de kickout configurado:', packet.request.toString('hex'));

                    client.write(packet.request, () => {
                        logDebug('Pacote de kickout enviado ao servidor.');
                    });

                    client.once('data', (response) => {
                        try {
                            logDebug('Resposta final recebida do servidor:', response.toString('hex'));

                            const readPacket = new ReadPacket(response);
                            const type = readPacket.readCUInt32();          
                            const answlen = readPacket.readCUInt32();
                            const retcode = readPacket.readInt32(); 
                            const gmroleid = readPacket.readInt32(); 
                            const localsid = readPacket.readInt32(); 
                            const kickroleid = readPacket.readInt32(); 

                            if (retcode === 0) {
                                logDebug('Kickout aplicado com sucesso.');
                                resolve({ success: true, message: `Personagem ${kickroleid} banido com sucesso.` });
                            } else {
                                logDebug('Falha ao aplicar o kickout:', retcode);
                                reject(new Error(`Falha ao aplicar o kickout. Código de retorno: ${retcode}`));
                            }
                        } catch (err) {
                            logDebug('Erro ao processar a resposta final do servidor:', err.message);
                            reject(err);
                        } finally {
                            client.destroy();
                        }
                    });
                } catch (err) {
                    logDebug('Erro ao processar a resposta inicial do servidor:', err.message);
                    client.destroy();
                    reject(err);
                }
            });

            client.on('error', (err) => {
                logDebug('Erro na conexão:', err.message);
                reject(err);
            });

            client.on('close', () => {
                logDebug('Conexão com o servidor gdelivery fechada.');
            });
        });
    }
}

module.exports = GMKickoutRole;
