// controllers/ServerForbidControl.js

const net = require('net');
const { WritePacket, ReadPacket } = require('../utils/packet_class');
const config = require('../config/config');

const DELIVERY_PORT = config.servers.deliveryServer.port;
const HOST = config.servers.deliveryServer.ip;

class GGlobalControlData {
    constructor(forbidLists) {
        this.forbid_ctrl_list = forbidLists.forbid_ctrl_list.length ? forbidLists.forbid_ctrl_list : [0];
        this.forbid_item_list = forbidLists.forbid_item_list.length ? forbidLists.forbid_item_list : [0];
        this.forbid_recipe_list = forbidLists.forbid_recipe_list.length ? forbidLists.forbid_recipe_list : [0];
        this.forbid_service_list = forbidLists.forbid_service_list.length ? forbidLists.forbid_service_list : [0];
        this.forbid_shopitem_list = forbidLists.forbid_shopitem_list.length ? forbidLists.forbid_shopitem_list : [0];
        this.forbid_skill_list = forbidLists.forbid_skill_list.length ? forbidLists.forbid_skill_list : [0];
        this.forbid_task_list = forbidLists.forbid_task_list.length ? forbidLists.forbid_task_list : [0];
        this.trigger_ctrl_list = forbidLists.trigger_ctrl_list.length ? forbidLists.trigger_ctrl_list : [0];
    }

    toFormattedString() {
        const lists = [
            { type: 1, list: this.forbid_ctrl_list },
            { type: 2, list: this.forbid_item_list },
            { type: 3, list: this.forbid_service_list },
            { type: 4, list: this.forbid_task_list },
            { type: 5, list: this.forbid_skill_list },
            { type: 6, list: this.trigger_ctrl_list },
            { type: 7, list: this.forbid_shopitem_list },
            { type: 8, list: this.forbid_recipe_list },
        ];
        return lists.map(({ type, list }) => `${type}:1:${list.join(';')}`).join('#') + '#';
    }
}

function ServerForbidControl(forbidLists, oper = 1) {
    return new Promise((resolve, reject) => {
        const controlData = new GGlobalControlData(forbidLists);
        const formattedString = controlData.toFormattedString();
        const base64Encoded = Buffer.from(formattedString).toString('base64');

        const opcode = 0xA009;
        const operator = 1;
        const payloadSize = Buffer.byteLength(base64Encoded, 'utf-8');
        const packetSize = 4 + 1 + 1 + payloadSize;

        const client = new net.Socket();
        client.connect(DELIVERY_PORT, HOST, () => {
            client.once('data', (initialResponse) => {
                const packet = new WritePacket();
                packet.writeUInt16(opcode);
                packet.writeUByte(packetSize);
                packet.writeUInt32(0xFFFFFFFF);
                packet.writeUByte(operator);
                packet.writeUByte(payloadSize);   
                packet.writeBytes(Buffer.from(base64Encoded, 'utf-8'));

                client.once('data', (response) => {
                    const readPacket = new ReadPacket(response);
                    const result = readPacket.readInt32();
                    client.destroy();
                    resolve(result);
                });

                client.write(packet.request);
            });
        });

        client.on('error', (err) => {
            client.destroy();
            reject(err);
        });
    });
}

module.exports = ServerForbidControl;