const net = require('net');
const { WritePacket, ReadPacket } = require('../utils/packet_class');
const config = require('../config/config');
const logDebug = console.log;

class GMShutupUser {
    async muteUser(userid, time, reason) {
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

                    const packet = new WritePacket();
                    packet.writeInt32(-1); 
                    packet.writeUInt32(0); 
                    packet.writeUInt32(userid);
                    packet.writeUInt32(time);
                    packet.writeUString(reason);
                    packet.pack(config.type.muteAcc);

                    logDebug('Pacote configurado:', packet.request.toString('hex'));

                    client.write(packet.request, () => {
                        logDebug('Pacote de mute enviado ao servidor:', packet.request.toString('hex'));
                    });

                    client.once('data', (response) => {
                        try {
                            logDebug('Resposta do mute recebida:', response.toString('hex'));

                            const readPacket = new ReadPacket(response);

                            const type = readPacket.readCUInt32();
                            logDebug('Tipo do pacote:', type);

                            const answlen = readPacket.readCUInt32();
                            logDebug('Tamanho da resposta:', answlen);
                          
                            const localsid = readPacket.readInt32();
                            logDebug('Local SID:', localsid);

                            const retcode = readPacket.readInt32();
                            logDebug('Código de retorno:', retcode);


                            const dstroleid = readPacket.readInt32();
                            logDebug('ID do usuário de destino:', dstroleid);

                            const forbid_time = readPacket.readInt32();
                            logDebug('Tempo de restrição:', forbid_time);


                            if (retcode === 0) {
                                logDebug('Mute aplicado com sucesso.');
                                resolve({ success: true, message: `Mute aplicado com sucesso para a conta ${dstroleid} tempo: ${forbid_time}.` });
                            } else {
                                logDebug('Falha ao aplicar o mute:', retcode);
                                reject(new Error(`Falha ao aplicar o mute. Código de retorno: ${retcode}`));
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

module.exports = GMShutupUser;

// Teste do método
//(async () => {
    //const gmShutup = new GMShutupUser();
   // try {
    //    const response = await gmShutup.muteRole(1073, 36, 'Breaking rules');
     //   console.log(response.message);
    //} catch (err) {
     //   console.error('Erro ao aplicar mute:', err.message);
   // }
//})();
