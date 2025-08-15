const serializeData = require('../utils/serializeData');
const roleStructure = require('../utils/role_structure');
const { WritePacket, ReadPacket } = require('../utils/packet_class');
const config = require('../config/config');
const net = require('net');
const { getRoleData } = require('../services/GRoleDataService');
const { logDebug } = require('../utils/debug');

class PRole {
    async putRole(roleId, updates) {
        return new Promise(async (resolve, reject) => {
            const client = new net.Socket();
            const packet = new WritePacket();

            let fullData = await getRoleData(roleId);

            if (!fullData || Object.keys(fullData).length === 0) {
                reject("❌ Erro: Dados do personagem estão vazios ou inválidos.");
                return;
            }

            logDebug('📋 Dados completos antes da modificação:', fullData);

            function updateNested(obj, updates) {
                for (const key in updates) {
                    if (typeof updates[key] === 'object' && obj[key]) {
                        updateNested(obj[key], updates[key]);
                    } else {
                        obj[key] = updates[key];
                        logDebug(`🔄 Atualizado ${key}:`, updates[key]);
                    }
                }
            }
            updateNested(fullData, updates);

            logDebug('✏️ Dados finais modificados:', fullData);
            packet.writeUInt32(config.method.get);
            packet.writeUInt32(0xFFFFFFFF);
            packet.writeInt32(roleId);
            packet.writeUInt32(1);

            serializeData(packet, fullData, roleStructure);

            packet.pack(8002);

            const { ip, port } = config.servers.gameDbClient;
            logDebug('📤 Enviando pacote PUT:', packet.request.toString('hex'));

            client.connect(port, ip, () => {
                logDebug('✅ Conectado ao servidor para PUT');
                client.write(packet.request);
            });

            client.on('data', (data) => {
                logDebug('📥 Resposta recebida no PUT:', data.toString('hex'));

                const response = new ReadPacket(data);
                const result = {
                    type: response.readCUInt32(),
                    retcode: response.readInt32()
                };

                logDebug('📌 Resposta decodificada do PUT:', result);
                client.end();
                resolve(result);
            });

            client.on('error', (err) => {
                logDebug('❌ Erro na conexão PUT:', err);
                client.end();
                reject(err);
            });

            client.on('close', () => logDebug('🔌 Conexão PUT fechada'));
        });
    }
}

module.exports = PRole;
