const { logDebug } = require('../utils/debug');
const { ReadPacket, WritePacket } = require('../utils/packet_class');
const net = require('net');
const config = require('../config/config');

class GRolePocket {
    async getRolePocket(roleId) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            const packet = new WritePacket();

            packet.writeUInt32(config.method.get);
            packet.writeUInt32(roleId); 
            packet.pack(config.type.getRolePocket); 

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
                    const GRoleInvRes = new ReadPacket(data);
            
                    const result = {}; 
            
                    const type = GRoleInvRes.readCUInt32();
                    logDebug('type:', type);
            
                    const Length = GRoleInvRes.readCUInt32();
                    logDebug('Length:', Length);
            
                    const always = GRoleInvRes.readUInt32();
                    logDebug('always:', always);
            
                    const retcode = GRoleInvRes.readInt32();
                    logDebug('retcode:', retcode);
            
                    result.capacity = GRoleInvRes.readInt32();
                    logDebug('capacity:', result.capacity);
            
                    result.timestamp = GRoleInvRes.readInt32();
                    logDebug('timestamp:', result.timestamp);
            
                    result.money_inv = GRoleInvRes.readInt32();
                    logDebug('money_inv:', result.money_inv);
            
                    result.invcount = GRoleInvRes.readCUInt32();
                    logDebug('invcount:', result.invcount);
            
                    result.items = [];
                    for (let i = 0; i < result.invcount; i++) {
                        const item = {};
            
                        item.id = GRoleInvRes.readInt32();
                        logDebug(`item[${i}].id:`, item.id);
            
                        item.pos = GRoleInvRes.readInt32();
                        logDebug(`item[${i}].pos:`, item.pos);
            
                        item.count = GRoleInvRes.readInt32();
                        logDebug(`item[${i}].count:`, item.count);
            
                        item.max_count = GRoleInvRes.readInt32();
                        logDebug(`item[${i}].max_count:`, item.max_count);
            
                        item.data = GRoleInvRes.readOctets();
                        logDebug(`item[${i}].data:`, item.data);
            
                        item.proctype = GRoleInvRes.readInt32();
                        logDebug(`item[${i}].proctype:`, item.proctype);
            
                        item.expire_date = GRoleInvRes.readInt32();
                        logDebug(`item[${i}].expire_date:`, item.expire_date);
            
                        item.guid1 = GRoleInvRes.readInt32();
                        logDebug(`item[${i}].guid1:`, item.guid1);
            
                        item.guid2 = GRoleInvRes.readInt32();
                        logDebug(`item[${i}].guid2:`, item.guid2);
            
                        item.mask = GRoleInvRes.readInt32();
                        logDebug(`item[${i}].mask:`, item.mask);
            
                        result.items.push(item);
                    }
            
                    result.silver = GRoleInvRes.readInt32();
                    logDebug('silver:', result.silver);
            
                    result.reserved7 = GRoleInvRes.readInt32();
                    logDebug('reserved7:', result.reserved7);
            
                    resolve(result);
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

module.exports = GRolePocket;
