const { logDebug } = require('../utils/debug');
const { ReadPacket, WritePacket } = require('../utils/packet_class');
const net = require('net');
const config = require('../config/config');

class GRoleStorehouse {
    async getRoleStoreHouse(roleId) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            const packet = new WritePacket();

            packet.writeUInt32(config.method.get);
            packet.writeUInt32(roleId); 
            packet.pack(config.type.getRoleStoreHouse); 

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
                    const GRoleStoreRes = new ReadPacket(data);
            
                    const result = {};
            
            
                    const type = GRoleStoreRes.readCUInt32();
                    logDebug('type:', type);
            
                    const Length = GRoleStoreRes.readCUInt32();
                    logDebug('Length:', Length);
            
                    const always = GRoleStoreRes.readUInt32();
                    logDebug('always:', always);
            
                    const retcode = GRoleStoreRes.readInt32();
                    logDebug('retcode:', retcode);

                    result.storehouse = {};
            
                    result.storehouse.capacity_bank = GRoleStoreRes.readInt32();
                    logDebug('storehouse.capacity_bank:', result.storehouse.capacity_bank);
            
                    result.storehouse.money_bank = GRoleStoreRes.readInt32();
                    logDebug('storehouse.money_bank:', result.storehouse.money_bank);
            
                    result.storehouse.storecount = GRoleStoreRes.readCUInt32();
                    logDebug('storehouse.storecount:', result.storehouse.storecount);
            
                    result.storehouse.store = [];
                    for (let i = 0; i < result.storehouse.storecount; i++) {
                        const storeItem = {};
                        storeItem.id = GRoleStoreRes.readInt32();
                        logDebug(`store[${i}].id:`, storeItem.id);
            
                        storeItem.pos = GRoleStoreRes.readInt32();
                        logDebug(`store[${i}].pos:`, storeItem.pos);
            
                        storeItem.count = GRoleStoreRes.readInt32();
                        logDebug(`store[${i}].count:`, storeItem.count);
            
                        storeItem.max_count = GRoleStoreRes.readInt32();
                        logDebug(`store[${i}].max_count:`, storeItem.max_count);
            
                        storeItem.data = GRoleStoreRes.readOctets();
                        logDebug(`store[${i}].data:`, storeItem.data);
            
                        storeItem.proctype = GRoleStoreRes.readInt32();
                        logDebug(`store[${i}].proctype:`, storeItem.proctype);
            
                        storeItem.expire_date = GRoleStoreRes.readInt32();
                        logDebug(`store[${i}].expire_date:`, storeItem.expire_date);
            
                        storeItem.guid1 = GRoleStoreRes.readInt32();
                        logDebug(`store[${i}].guid1:`, storeItem.guid1);
            
                        storeItem.guid2 = GRoleStoreRes.readInt32();
                        logDebug(`store[${i}].guid2:`, storeItem.guid2);
            
                        storeItem.mask = GRoleStoreRes.readInt32();
                        logDebug(`store[${i}].mask:`, storeItem.mask);
            
                        result.storehouse.store.push(storeItem);
                    }
            
                    result.storehouse.capacity_material = GRoleStoreRes.readUByte();
                    logDebug('storehouse.capacity_material:', result.storehouse.capacity_material);
            
                    result.storehouse.capacity_dress = GRoleStoreRes.readUByte();
                    logDebug('storehouse.capacity_dress:', result.storehouse.capacity_dress);
            
                    result.storehouse.materialcount = GRoleStoreRes.readCUInt32();
                    logDebug('storehouse.materialcount:', result.storehouse.materialcount);
            
                    result.storehouse.material = [];
                    for (let i = 0; i < result.storehouse.materialcount; i++) {
                        const materialItem = {};
                        materialItem.id = GRoleStoreRes.readInt32();
                        logDebug(`material[${i}].id:`, materialItem.id);
            
                        materialItem.pos = GRoleStoreRes.readInt32();
                        logDebug(`material[${i}].pos:`, materialItem.pos);
            
                        materialItem.count = GRoleStoreRes.readInt32();
                        logDebug(`material[${i}].count:`, materialItem.count);
            
                        materialItem.max_count = GRoleStoreRes.readInt32();
                        logDebug(`material[${i}].max_count:`, materialItem.max_count);
            
                        materialItem.data = GRoleStoreRes.readOctets();
                        logDebug(`material[${i}].data:`, materialItem.data);
            
                        materialItem.proctype = GRoleStoreRes.readInt32();
                        logDebug(`material[${i}].proctype:`, materialItem.proctype);
            
                        materialItem.expire_date = GRoleStoreRes.readInt32();
                        logDebug(`material[${i}].expire_date:`, materialItem.expire_date);
            
                        materialItem.guid1 = GRoleStoreRes.readInt32();
                        logDebug(`material[${i}].guid1:`, materialItem.guid1);
            
                        materialItem.guid2 = GRoleStoreRes.readInt32();
                        logDebug(`material[${i}].guid2:`, materialItem.guid2);
            
                        materialItem.mask = GRoleStoreRes.readInt32();
                        logDebug(`material[${i}].mask:`, materialItem.mask);
            
                        result.storehouse.material.push(materialItem);
                    }
            
                    result.storehouse.dresscount = GRoleStoreRes.readCUInt32();
                    logDebug('storehouse.dresscount:', result.storehouse.dresscount);
            
                    result.storehouse.dress = [];
                    for (let i = 0; i < result.storehouse.dresscount; i++) {
                        const dressItem = {};
                        dressItem.id = GRoleStoreRes.readInt32();
                        logDebug(`dress[${i}].id:`, dressItem.id);
            
                        dressItem.pos = GRoleStoreRes.readInt32();
                        logDebug(`dress[${i}].pos:`, dressItem.pos);
            
                        dressItem.count = GRoleStoreRes.readInt32();
                        logDebug(`dress[${i}].count:`, dressItem.count);
            
                        dressItem.max_count = GRoleStoreRes.readInt32();
                        logDebug(`dress[${i}].max_count:`, dressItem.max_count);
            
                        dressItem.data = GRoleStoreRes.readOctets();
                        logDebug(`dress[${i}].data:`, dressItem.data);
            
                        dressItem.proctype = GRoleStoreRes.readInt32();
                        logDebug(`dress[${i}].proctype:`, dressItem.proctype);
            
                        dressItem.expire_date = GRoleStoreRes.readInt32();
                        logDebug(`dress[${i}].expire_date:`, dressItem.expire_date);
            
                        dressItem.guid1 = GRoleStoreRes.readInt32();
                        logDebug(`dress[${i}].guid1:`, dressItem.guid1);
            
                        dressItem.guid2 = GRoleStoreRes.readInt32();
                        logDebug(`dress[${i}].guid2:`, dressItem.guid2);
            
                        dressItem.mask = GRoleStoreRes.readInt32();
                        logDebug(`dress[${i}].mask:`, dressItem.mask);
            
                        result.storehouse.dress.push(dressItem);
                    }
            
                    result.storehouse.capacity_card = GRoleStoreRes.readUByte();
                    logDebug('storehouse.capacity_card:', result.storehouse.capacity_card);
            
                    result.storehouse.generalcardcount = GRoleStoreRes.readCUInt32();
                    logDebug('storehouse.generalcardcount:', result.storehouse.generalcardcount);
            
                    result.storehouse.generalcard = [];
                    for (let i = 0; i < result.storehouse.generalcardcount; i++) {
                        const cardItem = {};
                        cardItem.id = GRoleStoreRes.readInt32();
                        logDebug(`generalcard[${i}].id:`, cardItem.id);
            
                        cardItem.pos = GRoleStoreRes.readInt32();
                        logDebug(`generalcard[${i}].pos:`, cardItem.pos);
            
                        cardItem.count = GRoleStoreRes.readInt32();
                        logDebug(`generalcard[${i}].count:`, cardItem.count);
            
                        cardItem.max_count = GRoleStoreRes.readInt32();
                        logDebug(`generalcard[${i}].max_count:`, cardItem.max_count);
            
                        cardItem.data = GRoleStoreRes.readOctets();
                        logDebug(`generalcard[${i}].data:`, cardItem.data);
            
                        cardItem.proctype = GRoleStoreRes.readInt32();
                        logDebug(`generalcard[${i}].proctype:`, cardItem.proctype);
            
                        cardItem.expire_date = GRoleStoreRes.readInt32();
                        logDebug(`generalcard[${i}].expire_date:`, cardItem.expire_date);
            
                        cardItem.guid1 = GRoleStoreRes.readInt32();
                        logDebug(`generalcard[${i}].guid1:`, cardItem.guid1);
            
                        cardItem.guid2 = GRoleStoreRes.readInt32();
                        logDebug(`generalcard[${i}].guid2:`, cardItem.guid2);
            
                        cardItem.mask = GRoleStoreRes.readInt32();
                        logDebug(`generalcard[${i}].mask:`, cardItem.mask);
            
                        result.storehouse.generalcard.push(cardItem);
                    }
            
                    result.storehouse.reserved = GRoleStoreRes.readCUInt32();
                    logDebug('storehouse.reserved:', result.storehouse.reserved);
            
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

module.exports = GRoleStorehouse;

