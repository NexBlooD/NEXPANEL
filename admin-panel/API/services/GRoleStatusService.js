const { logDebug } = require('../utils/debug');
const { ReadPacket, WritePacket } = require('../utils/packet_class');
const net = require('net');
const config = require('../config/config');

class GRoleStatus {
    async getRoleStatus(roleId) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            const packet = new WritePacket();

            packet.writeUInt32(config.method.get);
            packet.writeUInt32(roleId); 
            packet.pack(config.type.getRoleStatus); 

            const { ip, port } = config.servers.gameDbClient;

            logDebug('Pacote enviado:', packet.request.toString('hex'));

            client.connect(port, ip, () => {
                client.write(packet.request, () => {
                    logDebug('Pacote enviado ao servidor');
                });
            });

            client.on('data', (data) => {
                const GRoleStatusRes = new ReadPacket(data);

                const result = {};

                const type = GRoleStatusRes.readCUInt32();
                logDebug('type:', type);

                const answlen = GRoleStatusRes.readCUInt32();
                logDebug('answlen:', answlen);

                const localsid = GRoleStatusRes.readInt32();
                logDebug('localsid:', localsid);

                const retcode = GRoleStatusRes.readInt32();
                logDebug('retcode:', retcode);
                
                result.version = GRoleStatusRes.readUByte();
                logDebug('version:', result.version);

                result.level = GRoleStatusRes.readInt32();
                logDebug('level:', result.level);
                
                result.level2 = GRoleStatusRes.readLevel2();
                logDebug('level2:', result.level2);
                
                result.exp = GRoleStatusRes.readInt32();
                logDebug('exp:', result.exp);
                
                result.sp = GRoleStatusRes.readInt32();
                logDebug('sp:', result.sp);
                
                result.pts = GRoleStatusRes.readInt32();
                logDebug('pts:', result.pts);
                
                result.hp = GRoleStatusRes.readInt32();
                logDebug('hp:', result.hp);
                
                result.mp = GRoleStatusRes.readInt32();
                logDebug('mp:', result.mp);

                result.posx = GRoleStatusRes.readFloatBE();
                logDebug('posx:', result.posx);

                result.posy = GRoleStatusRes.readFloatBE();
                logDebug('posy:', result.posy);

                result.posz = GRoleStatusRes.readFloatBE();
                logDebug('posz:', result.posz);

                result.worldtag = GRoleStatusRes.readInt32();
                logDebug('worldtag:', result.worldtag);

                result.invader_state = GRoleStatusRes.readInt32();
                logDebug('invader_state', result.invader_state);

                result.invader_time = GRoleStatusRes.readInt32();
                logDebug('invader_time', result.invader_time);

                result.pariah_time = GRoleStatusRes.readInt32();
                logDebug('pariah_time', result.pariah_time);

                result.reputation = GRoleStatusRes.readInt32();
                logDebug('reputation', result.reputation);

                result.custom_status = GRoleStatusRes.readOctets();
                logDebug('custom_status', result.custom_status);

                result.filter_data = GRoleStatusRes.readOctets();
                logDebug('filter_data', result.filter_data);

                result.charactermode = GRoleStatusRes.readOctets();
                logDebug('charactermode', result.charactermode);

                result.instancekeylist = GRoleStatusRes.readOctets();
                logDebug('instancekeylist', result.instancekeylist);

                result.dbltime_expire = GRoleStatusRes.readInt32();
                logDebug('dbltime_expire', result.dbltime_expire);

                result.dbltime_mode = GRoleStatusRes.readInt32();
                logDebug('dbltime_mode', result.dbltime_mode);

                result.dbltime_begin = GRoleStatusRes.readInt32();
                logDebug('dbltime_begin', result.dbltime_begin);

                result.dbltime_used = GRoleStatusRes.readInt32();
                logDebug('dbltime_used', result.dbltime_used);

                result.dbltime_max = GRoleStatusRes.readInt32();
                logDebug('dbltime_max', result.dbltime_max);

                result.time_used = GRoleStatusRes.readInt32();
                logDebug('time_used', result.time_used);

                result.dbltime_data = GRoleStatusRes.readOctets();
                logDebug('dbltime_data', result.dbltime_data);

                result.storesize = GRoleStatusRes.readUInt16LE();
                logDebug('storesize', result.storesize);

                result.petcorral = GRoleStatusRes.readOctets();
                logDebug('petcorral', result.petcorral);

                result.property = GRoleStatusRes.readOctets();
                logDebug('property', result.property);

                result.var_data = GRoleStatusRes.readOctets();
                logDebug('var_data', result.var_data);

                result.skills = GRoleStatusRes.readOctets();
                logDebug('skills', result.skills);

                result.storehousepasswd = GRoleStatusRes.readOctets();
                logDebug('storehousepasswd', result.storehousepasswd);

                result.waypointlist = GRoleStatusRes.readOctets();
                logDebug('waypointlist', result.waypointlist);

                result.coolingtime = GRoleStatusRes.readOctets();
                logDebug('coolingtime', result.coolingtime);

                result.npc_relation = GRoleStatusRes.readOctets();
                logDebug('npc_relation', result.npc_relation);

                result.multi_exp_ctrl = GRoleStatusRes.readOctets();
                logDebug('multi_exp_ctrl', result.multi_exp_ctrl);

                result.storage_task = GRoleStatusRes.readOctets();
                logDebug('storage_task', result.storage_task);

                result.faction_contrib = GRoleStatusRes.readOctets();
                logDebug('faction_contrib', result.faction_contrib);

                result.force_data = GRoleStatusRes.readOctets();
                logDebug('force_data', result.force_data);

                result.online_award = GRoleStatusRes.readOctets();
                logDebug('online_award', result.online_award);

                result.profit_time_data = GRoleStatusRes.readOctets();
                logDebug('profit_time_data', result.profit_time_data);

                result.country_data = GRoleStatusRes.readOctets();
                logDebug('country_data', result.country_data);

                result.king_data = GRoleStatusRes.readOctets();
                logDebug('king_data', result.king_data);

                result.meridian_data = GRoleStatusRes.readOctets();
                logDebug('meridian_data', result.meridian_data);

                result.extraprop = GRoleStatusRes.readOctets();
                logDebug('extraprop', result.extraprop);

                result.title_data = GRoleStatusRes.readOctets();
                logDebug('title_data', result.title_data);

                result.reincarnation_data = GRoleStatusRes.readOctets();
                logDebug('reincarnation_data', result.reincarnation_data);

                result.realm_data = GRoleStatusRes.readOctets();
                logDebug('realm_data', result.realm_data);
                
                resolve(result); 
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

module.exports = GRoleStatus;
