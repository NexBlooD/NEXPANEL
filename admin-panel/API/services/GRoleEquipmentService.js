const { logDebug } = require('../utils/debug');
const { ReadPacket, WritePacket } = require('../utils/packet_class');
const net = require('net');
const config = require('../config/config');

class GRoleEquipment {
    async getRoleEquipment(roleId) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            const packet = new WritePacket();
        
            packet.writeUInt32(config.method.get);
            packet.writeUInt32(roleId); 
            packet.pack(config.type.getRoleEquipment); 

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
                    const GRoleEquiRes = new ReadPacket(data);
            
                    const result = {}; 
            
                    // Lendo e logando os metadados iniciais
                    const type = GRoleEquiRes.readCUInt32();            
                    logDebug('type:', type);
            
                    const Length = GRoleEquiRes.readCUInt32();
                    logDebug('Length:', Length);
            
                    const always = GRoleEquiRes.readUInt32();
                    logDebug('always:', always);
            
                    const retcode = GRoleEquiRes.readInt32();
                    logDebug('retcode:', retcode);
            
                    // Lendo o tamanho da lista de equipamentos
                    result.equip_size = GRoleEquiRes.readCUInt32();
                    logDebug('equip_size:', result.equip_size);
            
                    result.equipment = [];
            
                    for (let i = 0; i < result.equip_size; i++) {
                        const equipment = {};
            
                        equipment.id = GRoleEquiRes.readInt32();   
                        logDebug(`equipment[${i}].id:`, equipment.id);
            
                        equipment.pos = GRoleEquiRes.readInt32();  
                        logDebug(`equipment[${i}].pos:`, equipment.pos);
            
                        equipment.count = GRoleEquiRes.readInt32(); 
                        logDebug(`equipment[${i}].count:`, equipment.count);
            
                        equipment.max_count = GRoleEquiRes.readInt32();  
                        logDebug(`equipment[${i}].max_count:`, equipment.max_count);
            
                        equipment.data = GRoleEquiRes.readOctets(); 
                        logDebug(`equipment[${i}].data:`, equipment.data);
            
                        equipment.proctype = GRoleEquiRes.readInt32(); 
                        logDebug(`equipment[${i}].proctype:`, equipment.proctype);
            
                        equipment.expire_date = GRoleEquiRes.readInt32(); 
                        logDebug(`equipment[${i}].expire_date:`, equipment.expire_date);
            
                        equipment.guid1 = GRoleEquiRes.readInt32(); 
                        logDebug(`equipment[${i}].guid1:`, equipment.guid1);
            
                        equipment.guid2 = GRoleEquiRes.readInt32(); 
                        logDebug(`equipment[${i}].guid2:`, equipment.guid2);
            
                        equipment.mask = GRoleEquiRes.readUInt32(); 
                        logDebug(`equipment[${i}].mask:`, equipment.mask);
            
                        result.equipment.push(equipment);
                    }
            
                    logDebug('Resultado final:', result);
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

module.exports = GRoleEquipment;