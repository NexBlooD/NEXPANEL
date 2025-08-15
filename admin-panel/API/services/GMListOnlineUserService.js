const { WritePacket, ReadPacket } = require('../utils/packet_class');
const net = require('net');
const { logDebug } = require('../utils/debug');
const config = require('../config/config');

class GMListOnline {
    async sendGMListOnlineUser() {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            const initialPacket = new WritePacket();

            initialPacket.getResponse = true;
            initialPacket.writeUInt32(0);
            initialPacket.writeUInt32(0);
            initialPacket.writeUInt32(0);
            initialPacket.writeOctets(Buffer.alloc(0));
            initialPacket.pack(config.type.getGMListOnlineUser); 

            const { ip, port } = config.servers.deliveryServer;

            logDebug('Iniciando conexão com o servidor gdelivery...');

            client.connect(port, ip, () => {
                logDebug('Conectado ao servidor gdelivery.');
            });

            client.once('data', (initialResponse) => {
                try {
                    logDebug('Resposta inicial recebida:', initialResponse.toString('hex'));

                    const readPacket = new ReadPacket(initialResponse);

                    const attr = readPacket.readUInt32();
                    const freecreatime = readPacket.readInt32();
                    const exp_rate = readPacket.readUByte();

                    logDebug(
                        `Resposta inicial processada: attr = ${attr}, freecreatime = ${freecreatime}, exp_rate = ${exp_rate}`
                    );

                    client.write(initialPacket.request, () => {
                        logDebug('Pacote GMListOnlineUser enviado ao servidor:', initialPacket.request.toString('hex'));
                    });

                    client.once('data', (response) => {
                        try {
                            logDebug('Resposta do GMListOnlineUser recebida:', response.toString('hex'));
                    
                            const readPacket = new ReadPacket(response);
                            const result = {};
                    
                            const type = readPacket.readCUInt32();
                            logDebug('type:', type);
                    
                            const answlen = readPacket.readCUInt32();
                            logDebug('answlen:', answlen);
                    
                            const retcode = readPacket.readInt32();
                            logDebug('retcode:', retcode);
                    
                            const gmroleid = readPacket.readInt32();
                            logDebug('gmroleid:', gmroleid);
                    
                            const localsid = readPacket.readInt32();
                            logDebug('localsid:', localsid);
                    
                            const handler = readPacket.readInt32();
                            logDebug('handler:', handler);
                    
                            result.count = readPacket.readCUInt32();
                            logDebug('count:', result.count);
                    
                            result.userlist = [];
                            if (result.count > 0) {
                                for (let i = 0; i < result.count; i++) {
                                    const user = {
                                        userid: readPacket.readInt32(),
                                        roleid: readPacket.readInt32(),
                                        linkid: readPacket.readInt32(),
                                        localsid: readPacket.readInt32(),
                                        gsid: readPacket.readInt32(),
                                        status: readPacket.readUByte(),
                                        name: readPacket.readUString(),
                                    };
                                    logDebug(`Usuário [${i}]:`, user);
                                    result.userlist.push(user);
                                }
                            } else {
                                logDebug('Nenhum usuário online.');
                            }
                    
                            logDebug('Lista de usuários online:', result.userlist);
                            resolve(result);
                    
                            client.end(() => logDebug('Conexão com o servidor gdelivery encerrada.'));
                        } catch (err) {
                            logDebug('Erro ao processar a resposta do GMListOnlineUser:', err.message);
                            reject(err);
                        }
                    });
                    
                } catch (err) {
                    logDebug('Erro ao processar a resposta inicial:', err.message);
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

module.exports = GMListOnline;
