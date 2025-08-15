const { logDebug } = require('../utils/debug');
const { ReadPacket, WritePacket } = require('../utils/packet_class');
const net = require('net');
const config = require('../config/config');

class GRoleTask {
    async getRoleTask(roleId) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            const packet = new WritePacket();

            packet.writeUInt32(config.method.get);
            packet.writeUInt32(roleId); 
            packet.pack(config.type.getRoleTask); 

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
                    const GRoleTaskRes = new ReadPacket(data);
            
                    const result = {};
            
                    const type = GRoleTaskRes.readCUInt32();
                    logDebug('type:', type);
            
                    const Length = GRoleTaskRes.readCUInt32();
                    logDebug('Length:', Length);
            
                    const always = GRoleTaskRes.readUInt32();
                    logDebug('always:', always);
            
                    const retcode = GRoleTaskRes.readInt32();
                    logDebug('retcode:', retcode);
                    
                    result.task = {};
            
                    result.task.task_data = GRoleTaskRes.readOctets();
                    logDebug('task.task_data:', result.task.task_data);
            
                    result.task.task_complete = GRoleTaskRes.readOctets();
                    logDebug('task.task_complete:', result.task.task_complete);
            
                    result.task.task_finishtime = GRoleTaskRes.readOctets();
                    logDebug('task.task_finishtime:', result.task.task_finishtime);
            
                    result.task.task_inventorycount = GRoleTaskRes.readCUInt32();
                    logDebug('task.task_inventorycount:', result.task.task_inventorycount);
            
                    result.task.task_inventory = [];
                    for (let i = 0; i < result.task.task_inventorycount; i++) {
                        const taskItem = {};
            
                        taskItem.id = GRoleTaskRes.readInt32();
                        logDebug(`task_inventory[${i}].id:`, taskItem.id);
            
                        taskItem.pos = GRoleTaskRes.readInt32();
                        logDebug(`task_inventory[${i}].pos:`, taskItem.pos);
            
                        taskItem.count = GRoleTaskRes.readInt32();
                        logDebug(`task_inventory[${i}].count:`, taskItem.count);
            
                        taskItem.max_count = GRoleTaskRes.readInt32();
                        logDebug(`task_inventory[${i}].max_count:`, taskItem.max_count);
            
                        taskItem.data = GRoleTaskRes.readOctets();
                        logDebug(`task_inventory[${i}].data:`, taskItem.data);
            
                        taskItem.proctype = GRoleTaskRes.readInt32();
                        logDebug(`task_inventory[${i}].proctype:`, taskItem.proctype);
            
                        taskItem.expire_date = GRoleTaskRes.readInt32();
                        logDebug(`task_inventory[${i}].expire_date:`, taskItem.expire_date);
            
                        taskItem.guid1 = GRoleTaskRes.readInt32();
                        logDebug(`task_inventory[${i}].guid1:`, taskItem.guid1);
            
                        taskItem.guid2 = GRoleTaskRes.readInt32();
                        logDebug(`task_inventory[${i}].guid2:`, taskItem.guid2);
            
                        taskItem.mask = GRoleTaskRes.readInt32();
                        logDebug(`task_inventory[${i}].mask:`, taskItem.mask);
            
                        result.task.task_inventory.push(taskItem);
                    }
            
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
module.exports = GRoleTask;
