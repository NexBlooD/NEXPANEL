const { logDebug } = require('../utils/debug');
const { ReadPacket, WritePacket } = require('../utils/packet_class');
const net = require('net');
const config = require('../config/config');

class GUserRoles {
    async getUserRoles(id) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            const packet = new WritePacket();

            const aid = Math.floor(id / 16) * 16;
            packet.writeUInt32(config.method.get);
            packet.writeInt32(aid);
            packet.pack(config.type.getUserRoles);

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
                    const GUserRolesRes = new ReadPacket(data);

                    // Construindo o objeto result
                    const result = {};

                    // Lendo os valores
                    result.type = GUserRolesRes.readCUInt32();
                    logDebug('type:', result.type);

                    result.answlen = GUserRolesRes.readCUInt32();
                    logDebug('answlen:', result.answlen);

                    result.localsid = GUserRolesRes.readInt32();
                    logDebug('localsid:', result.localsid);

                    result.retcode = GUserRolesRes.readInt32();
                    logDebug('retcode:', result.retcode);

                    result.count = GUserRolesRes.readUByte();
                    logDebug('count:', result.count);

                    // Lendo a lista de roles
                    result.roles = [];
                    for (let i = 0; i < result.count; i++) {
                        const role = {};
                        role.id = GUserRolesRes.readInt32();
                        logDebug(`role[${i}].id:`, role.id);

                        role.name = GUserRolesRes.readUString();
                        logDebug(`role[${i}].name:`, role.name);

                        result.roles.push(role);
                    }

                    // Retornar o resultado
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

    async getUserName(id) {
        try {
            const result = await this.getUserRoles(id);

            for (const role of result.roles) {
                if (role.id === id) {
                    return role.name;
                }
            }

            return null; // Se não encontrar o ID
        } catch (err) {
            logDebug('Erro em getUserName:', err.message);
            throw err;
        }
    }
}

module.exports = GUserRoles;

// Teste
async function testRoleBase() {
    const roleId = 80;
    const gUserRoles = new GUserRoles();
    try {
        const result = await gUserRoles.getUserRoles(roleId);
        logDebug('Resultado:', result);
    } catch (error) {
        console.error('Erro ao obter GUserRoles:', error);
    }
}
testRoleBase();
