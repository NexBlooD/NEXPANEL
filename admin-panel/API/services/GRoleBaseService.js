const { logDebug } = require('../utils/debug');
const { ReadPacket, WritePacket } = require('../utils/packet_class');
const net = require('net');
const config = require('../config/config');

class GRoleBase {
    async getRoleBase(roleId) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            const packet = new WritePacket();
        
            packet.writeUInt32(config.method.get);
            packet.writeUInt32(roleId); 
            packet.pack(config.type.getRoleBase); 

            const { ip, port } = config.servers.gameDbClient;

            logDebug('Pacote enviado:', packet.request.toString('hex'));

            client.connect(port, ip, () => {
                client.write(packet.request, () => {
                    logDebug('Pacote enviado ao servidor');
                });
            });

            client.on('data', (data) => {
                try {
                    logDebug('Pacote recebido:', data.toString('hex'));
                    const GRoleBaseRes = new ReadPacket(data);

                    const result = {}; 

                    const type = GRoleBaseRes.readCUInt32();
                    logDebug('type:', type);
                    
                    const answlen = GRoleBaseRes.readCUInt32();
                    logDebug('answlen:', answlen);
                    
                    const localsid = GRoleBaseRes.readInt32();
                    logDebug('localsid:', localsid);
                    
                    const retcode = GRoleBaseRes.readInt32();
                    logDebug('retcode:', retcode);
                    
                    result.version = GRoleBaseRes.readUByte();
                    logDebug('version:', result.version);

                    result.id = GRoleBaseRes.readInt32();
                    logDebug('id:', result.id);

                    result.name = GRoleBaseRes.readUString();
                    logDebug('name:', result.name);

                    result.race = GRoleBaseRes.readInt32();
                    logDebug('race:', result.race);

                    result.cls = GRoleBaseRes.readInt32();
                    logDebug('cls:', result.cls);

                    result.gender = GRoleBaseRes.readUByte();
                    logDebug('gender:', result.gender);

                    result.custom_data = GRoleBaseRes.readOctets();
                    logDebug('custom_data:', result.custom_data);

                    result.config_data = GRoleBaseRes.readOctets();
                    logDebug('config_data:', result.config_data);

                    result.custom_stamp = GRoleBaseRes.readUInt32();
                    logDebug('custom_stamp:', result.custom_stamp);

                    result.status = GRoleBaseRes.readUByte();
                    logDebug('status:', result.status);

                    result.delete_time = GRoleBaseRes.readUInt32();
                    logDebug('delete_time:', result.delete_time);

                    result.create_time = GRoleBaseRes.readUInt32();
                    logDebug('create_time:', result.create_time);

                    result.lastlogin_time = GRoleBaseRes.readUInt32();
                    logDebug('lastlogin_time:', result.lastlogin_time);

                    const forbid_size = GRoleBaseRes.readCUInt32();
                    logDebug('forbid_size:', forbid_size);
                    result.forbidem = [];
                    for (let i = 0; i < forbid_size; i++) {
                        const forbid = {};
                        forbid.type = GRoleBaseRes.readUByte();   
                        forbid.time = GRoleBaseRes.readInt32();  
                        forbid.createtime = GRoleBaseRes.readInt32(); 
                        forbid.reason = GRoleBaseRes.readUString();  
                        result.forbidem.push(forbid);
                    }

                    result.help_states = GRoleBaseRes.readOctets();
                    logDebug('help_states:', result.help_states);

                    result.spouse = GRoleBaseRes.readUInt32();
                    logDebug('spouse:', result.spouse);

                    result.userid = GRoleBaseRes.readUInt32();
                    logDebug('userid:', result.userid);

                    result.cross_data = GRoleBaseRes.readOctets();
                    logDebug('cross_data:', result.cross_data);

                    result.custom_data_highmode = GRoleBaseRes.readOctets();
                    logDebug('custom_data_highmode:', result.custom_data_highmode);

                    result.reserved3 = GRoleBaseRes.readUByte();
                    logDebug('reserved3:', result.reserved3);

                    result.reserved4 = GRoleBaseRes.readUByte();
                    logDebug('reserved4:', result.reserved4);

                    resolve(result); // Resolver a promessa com o objeto result
                } catch (err) {
                    logDebug('Erro ao processar pacote:', err);
                    reject(err);
                }
            });

            client.on('error', (err) => {
                logDebug('Erro no cliente:', err);
                reject(err);
            });

            client.on('close', () => {
                logDebug('Conexão fechada');
            });
        });
    }
}

module.exports = GRoleBase;
