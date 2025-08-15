// src/services/PlayerConsumeInfoService.js
const { WritePacket, ReadPacket } = require('../utils/packet_class');
const config = require('../config/config');
const net = require('net');
const PlayerConsumeInfoModel = require('../models/PlayerConsumeInfoModel');

async function fetchPlayerConsumeInfo(roleid) {
    return new Promise((resolve, reject) => {
        const DBGetConsumeInfos = new WritePacket();
        DBGetConsumeInfos.getResponse = true;

        DBGetConsumeInfos.writeUInt32(4294967295);
        DBGetConsumeInfos.writeCUInt32(1);        
        DBGetConsumeInfos.writeUInt32(roleid);   

        DBGetConsumeInfos.pack(config.type.dBGetConsumeInfos);

        const client = new net.Socket();

        client.connect(config.servers.gameDbClient.port, config.servers.gameDbClient.ip, () => {
            client.write(DBGetConsumeInfos.request, () => {
                client.once('data', (response) => {
                    const DBGetConsumeInfos_Re = new ReadPacket(response);

                    DBGetConsumeInfos_Re.readPacketInfo();
                    const always = DBGetConsumeInfos_Re.readUInt32();
                    const retcode = DBGetConsumeInfos_Re.readUInt32();
                    const count = DBGetConsumeInfos_Re.readCUInt32();
                    const receivedRoleId = DBGetConsumeInfos_Re.readUInt32();
                    const level = DBGetConsumeInfos_Re.readUInt32();

                    const loginip = DBGetConsumeInfos_Re.readUInt32();
                    const ip = [
                        loginip & 0xFF,
                        (loginip >> 8) & 0xFF,
                        (loginip >> 16) & 0xFF,
                        (loginip >> 24) & 0xFF
                    ];
                    const cash_add = DBGetConsumeInfos_Re.readUInt32();
                    const mall_consumption = DBGetConsumeInfos_Re.readUInt32();
                    const avg_online_time = DBGetConsumeInfos_Re.readUInt32();

                    const consumeInfo = new PlayerConsumeInfoModel({
                        always,
                        retcode,
                        count,
                        receivedRoleId,
                        level,
                        ip: ip.join('.'),
                        cash_add,
                        mall_consumption,
                        avg_online_time,
                    });

                    resolve(consumeInfo.toJSON());
                    client.destroy();
                });
            });
        });

        client.on('error', (err) => reject(err));
        client.on('close', () => console.log('Conexão fechada.'));
    });
}

module.exports = { fetchPlayerConsumeInfo };
