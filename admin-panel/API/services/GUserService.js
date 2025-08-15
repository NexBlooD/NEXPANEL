const net = require('net');
const { ReadPacket, WritePacket } = require('../utils/packet_class');
const { logDebug } = require('../utils/debug');
const config = require('../config/config');

// Classes Auxiliares
class GRoleForbids {
    constructor() {
        this.count = 0; // CUInt32
        this.forbids = []; // Array de GRoleForbid
    }
}

class GRoleForbid {
    constructor() {
        this.type = 0; // Byte
        this.time = 0; // Int32
        this.createtime = 0; // Int32
        this.reason = ''; // String
    }
}

class GPair {
    constructor() {
        this.key = 0; // int32
        this.value = 0; // int32
    }
}

class StockLogs {
    constructor() {
        this.count = 0; // Byte
        this.stocklog = []; // Array de StockLog
    }
}

function readGRoleForbids(packet) {
    const obj = new GRoleForbids();

    obj.count = packet.readCUInt32();

    obj.forbids = [];
    for (let i = 0; i < obj.count; i++) {
        obj.forbids.push(readGRoleForbid(packet));
    }

    return obj;
}

function readGRoleForbid(packet) {
    const obj = new GRoleForbid();

    obj.type = packet.readUByte(); 
    obj.time = packet.readInt32(); 
    obj.createtime = packet.readInt32(); 
    obj.reason = packet.readUString();

    return obj;
}

class GUser {
    async getUser(id, ip = '127.0.0.1') {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();
            const packet = new WritePacket();

            const aid = Math.floor(id / 16) * 16;
            packet.writeUInt32(2147483648);
            packet.writeInt32(aid);

            const ipParts = ip.split('.').map(Number);
            if (ipParts.length !== 4) {
                return reject(new Error('IP inválido'));
            }
            ipParts.forEach((part) => packet.writeUByte(part));

            packet.writeInt32(Math.floor(Date.now() / 1000));

            packet.pack(3002); 

            const { ip: serverIp, port } = config.servers.gameDbClient;

            logDebug('Pacote enviado:', packet.request.toString('hex'));

            client.connect(port, serverIp, () => {
                client.write(packet.request, () => {
                    logDebug('Pacote enviado ao servidor');
                });
            });

            client.on('data', (data) => {
                try {
                    logDebug('Pacote recebido:', data.toString('hex'));
                    const GUserRes = new ReadPacket(data);

                    const result = {};
                    result.type = GUserRes.readCUInt32();
                    result.answlen = GUserRes.readCUInt32();
                    result.localsid = GUserRes.readInt32();
                    result.retcode = GUserRes.readInt32();
                    result.logicuid = GUserRes.readInt32();
                    result.rolelist = GUserRes.readInt32();
                    result.cash = GUserRes.readInt32();
                    result.money = GUserRes.readInt32();
                    result.cash_add = GUserRes.readInt32();
                    result.cash_buy = GUserRes.readInt32();
                    result.cash_sell = GUserRes.readInt32();
                    result.cash_used = GUserRes.readInt32();
                    result.add_serial = GUserRes.readInt32();
                    result.use_serial = GUserRes.readInt32();

                    result.exg_log = {
                        count: GUserRes.readCUInt32(),
                        stocklog: [],
                    };

                    for (let i = 0; i < result.exg_log.count; i++) {
                        const stockLog = {};
                        stockLog.tid = GUserRes.readInt32();
                        stockLog.time = GUserRes.readInt32();
                        stockLog.result = GUserRes.readInt16();
                        stockLog.volume = GUserRes.readInt16();
                        stockLog.cost = GUserRes.readInt32();
                        result.exg_log.stocklog.push(stockLog);
                    }

                    result.addiction = GUserRes.readOctets();
                    result.cash_password = GUserRes.readOctets();

                    result.autolock = [];
                    const autolockCount = GUserRes.readCUInt32();
                    for (let i = 0; i < autolockCount; i++) {
                        const autolockEntry = {
                            key: GUserRes.readInt32(),
                            value: GUserRes.readInt32(),
                        };
                        result.autolock.push(autolockEntry);
                    }

                    result.status = GUserRes.readUByte();
                    result.forbid = readGRoleForbids(GUserRes);
                    result.reference = GUserRes.readOctets();
                    result.consume_reward = GUserRes.readOctets();
                    result.taskcounter = GUserRes.readOctets();

                    result.cash_sysauction = GUserRes.readOctets();
                    result.login_record = GUserRes.readOctets();

                    result.charactermode = GUserRes.readOctets();
                    result.instancekeylist = GUserRes.readOctets();
                    result.time_used = GUserRes.readInt32();
                    result.profit_time_data = GUserRes.readOctets();
                    result.force_data = GUserRes.readOctets();
                    result.storage_task = GUserRes.readOctets();

                    resolve(result);
                } catch (err) {
                    logDebug('Erro ao processar pacote:', err.message);
                    reject(err);
                }
            });

            client.on('error', (err) => {
                logDebug('Erro no cliente:', err.message);
                reject(err);
            });

            client.on('close', () => {
                logDebug('Conexão fechada');
            });
        });
    }
}

module.exports = GUser;
