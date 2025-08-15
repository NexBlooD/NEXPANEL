// controllers/DBLoadGlobalControl.js

const net = require('net');
const { WritePacket, ReadPacket } = require('../utils/packet_class');
const config = require('../config/config');  
const HOST = config.servers.gameDbClient.ip;
const GAME_DB_PORT = config.servers.gameDbClient.port;

class GGlobalControlData {
    constructor() {
        this.cash_money_exchange_open = 0;
        this.cash_money_exchange_rate = 0;
        this.forbid_ctrl_list = [];
        this.forbid_item_list = [];
        this.forbid_service_list = [];
        this.forbid_task_list = [];
        this.forbid_skill_list = [];
        this.trigger_ctrl_list = [];
        this.forbid_shopitem_list = [];
        this.forbid_recipe_list = [];
        this.reserved3 = 0;
        this.reserved4 = 0;
        this.reserved5 = 0;
        this.reserved6 = 0;
        this.reserved7 = 0;
        this.reserved8 = 0;
        this.reserved9 = 0;
        this.reserved10 = 0;
    }

    fromPacket(packet) {
        packet.seek(8);

        this.cash_money_exchange_open = packet.readInt32();
        this.cash_money_exchange_rate = packet.readInt32();

        const readOctetList = (packet) => {
            const count = packet.readUByte(); 
            const values = [];
            for (let i = 0; i < count; i++) {
                values.push(packet.readInt32()); 
            }
            return values;
        };

        this.forbid_ctrl_list = readOctetList(packet);
        this.forbid_item_list = readOctetList(packet);
        this.forbid_service_list = readOctetList(packet);
        this.forbid_task_list = readOctetList(packet);
        this.forbid_skill_list = readOctetList(packet);
        this.trigger_ctrl_list = readOctetList(packet);
        this.forbid_shopitem_list = readOctetList(packet);
        this.forbid_recipe_list = readOctetList(packet);

        this.reserved3 = packet.readInt32();
        this.reserved4 = packet.readInt32();
        this.reserved5 = packet.readInt32();
        this.reserved6 = packet.readInt32();
        this.reserved7 = packet.readInt32();
        this.reserved8 = packet.readInt32();
        this.reserved9 = packet.readInt32();
        this.reserved10 = packet.readInt32();
    }
}

function connectToServer(port) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.connect(port, HOST, () => {
            resolve(client);
        });

        client.on('error', (err) => {
            reject(err);
        });

        client.on('close', () => {
            console.log('Conexão fechada.');
        });
    });
}

function DBLoadGlobalControl(nouse = 1) {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await connectToServer(GAME_DB_PORT);

            const packet = new WritePacket();
            packet.writeUByte(0x8C);
            packet.writeUInt16(0x2708);
            packet.writeUInt32(0xFFFFFFFF);
            packet.writeUInt32(0x00000001);

            client.once('data', (response) => {
                const readPacket = new ReadPacket(response);
                const loadResponse = new GGlobalControlData();
                loadResponse.fromPacket(readPacket);

                client.destroy();
                resolve(loadResponse);
            });

            client.write(packet.request);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports =  DBLoadGlobalControl;
