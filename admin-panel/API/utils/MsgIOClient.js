const net = require('net');

const size_32 = 48;
const size_64 = 56;
const is_64bit = process.arch === 'x64';
const baseSize = is_64bit ? size_64 : size_32;
const contentOffset = baseSize;

class MsgIOClient {
    constructor() {
        this.socket = new net.Socket();
    }

    connect(port, host = '127.0.0.1') {
        return new Promise((resolve, reject) => {
            this.socket.connect(port, host, () => {
                console.log('Connected to server');
                resolve();
            });

            this.socket.on('error', (err) => {
                console.error('Connection error:', err);
                reject(err);
            });
        });
    }

    disconnect() {
        this.socket.end(() => console.log('Disconnected from server'));
    }

    async identify() {
        const rectData = Buffer.alloc(16);
        const msg = {
            message: 5,
            target: { type: 2, id: 0 },
            source: { type: 0, id: 1 },
            pos: { x: 0, y: 0, z: 0 },
            ttl: 2,
            param: 0,
            content_length: BigInt(rectData.length),
            content: rectData,
        };

        const buffer = this.serializeMsg(msg);
        console.log("Identificação buffer (hex):", buffer.toString('hex'));
        await this.sendMessage(buffer);
    }

    serializeMsg(msg) {
        const outSize = baseSize + (msg.content_length > 0 ? Number(msg.content_length) : 0);
        const buffer = Buffer.alloc(outSize);

        buffer.writeInt32LE(msg.message, 0);
        buffer.writeInt32LE(msg.target.type, 4);
        buffer.writeInt32LE(msg.target.id, 8);
        buffer.writeInt32LE(msg.source.type, 12);
        buffer.writeInt32LE(msg.source.id, 16);
        buffer.writeFloatLE(msg.pos.x, 20);
        buffer.writeFloatLE(msg.pos.y, 24);
        buffer.writeFloatLE(msg.pos.z, 28);
        buffer.writeInt32LE(msg.ttl, 32);
        buffer.writeInt32LE(msg.param, 36);
        buffer.writeBigUInt64LE(BigInt(msg.content_length), 40);

        if (msg.content && msg.content_length > 0) {
            msg.content.copy(buffer, contentOffset);
        }

        console.log("Serialized MSG structure (hex):", buffer.slice(0, baseSize).toString('hex'));
        return buffer;
    }

    sendMessage(buffer) {
        return new Promise((resolve, reject) => {
            console.log(`Sending package of size: ${buffer.length} bytes`);
            this.socket.write(buffer, (err) => {
                if (err) {
                    console.error('Error sending message:', err);
                    reject(err);
                } else {
                    console.log('Message sent successfully');
                    resolve();
                }
            });
        });
    }
}

module.exports = MsgIOClient;
