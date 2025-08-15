const net = require('net');
const { logDebug } = require('../utils/debug');

class ReadPacket {
    constructor(response = null) {
        this.data = response;
        this.pos = 0;
    }

    readBytes(length) {
        const value = this.data.slice(this.pos, this.pos + length);
        this.pos += length;
        return value;
    }

    readUByte() {
        const value = this.data.readUInt8(this.pos);
        this.pos += 1;
        return value;
    }

    readFloat() {
        const value = this.data.readFloatLE(this.pos);
        this.pos += 4;
        return value;
    }

    readFloatBE() {
        const value = this.data.readFloatBE(this.pos);
        this.pos += 4;
        return value;
    }

    readUInt32() {
        const value = this.data.readUInt32BE(this.pos);
        this.pos += 4;
        return value;
    }

    readUInt16() {
        const value = this.data.readUInt16BE(this.pos);
        this.pos += 2;
        return value;
    }
    
    readUInt16LE() {
        const value = this.data.readUInt16LE(this.pos);
        this.pos += 2;
        return value;
    }
  
    readInt32() { 
        const value = this.data.readInt32BE(this.pos);
        this.pos += 4;
        return value;
    }
    
    readUString() {
        const length = this.readCUInt32();
        const value = this.data.slice(this.pos, this.pos + length).toString('utf16le');
        this.pos += length;
        return value;
    }

    readLevel2() {
        const value = this.data[this.pos + 3]; 
        this.pos += 4; 
        return value;
    }
    
    readPacketInfo() {
        return {
            Opcode: this.readCUInt32(),
            Length: this.readCUInt32()
        };
    }

    seek(value) {
        this.pos += value;
    }

    readOctets() {
        const length = this.readCUInt32();
        logDebug("Octets length (CUInt):", length);
    
        if (length < 0 || length > (this.data.length - this.pos)) {
            throw new Error(`Invalid octet length: ${length}`);
        }
    
        const value = this.data.slice(this.pos, this.pos + length); 
        this.pos += length; // Avançar o ponteiro no buffer
    
        // Retornar o valor em hexadecimal
        return value.toString('hex');
    }
    
    readCUInt32() {
        let value = this.readUByte();
        logDebug("First byte:", value.toString(16));
        if (value < 0x80) {
            return value;
        } else if (value < 0xC0) {
            const secondByte = this.readUByte();
            value = ((value & 0x3F) << 8) | secondByte;   
            logDebug("CUInt32 value (2 bytes):", value);
            return value;
        } else if (value < 0xE0) {
            value = ((value & 0x1F) << 24) | (this.readUByte() << 16) | (this.readUByte() << 8) | this.readUByte();
            logDebug("CUInt32 value (4 bytes compacted):", value);
            return value;
        } else {
            this.readUByte();
            value = this.readUInt32();
            logDebug("CUInt32 value (4 bytes uncompressed):", value);
            return value;
        }
    }
    
    
}

class WritePacket {
    constructor() {
        this.request = Buffer.alloc(0);
        this.response = null;
        this.passEstablished = false;
        this.getResponse = true;
    }

    writeBytes(value) {
        if (typeof value === 'number') {
            // Se for um número, converte para um Buffer de 1 byte
            value = Buffer.alloc(1, value);
        } else if (typeof value === 'string') {
            // Se for uma string, converte para Buffer
            value = Buffer.from(value, 'utf8'); 
        } else if (!Buffer.isBuffer(value)) {
            throw new Error(`writeBytes expects a Buffer, string, or number, but got ${typeof value}`);
        }
    
        this.request = Buffer.concat([this.request, value]);
    }
    
    writeUByte(value) {
        this.request = Buffer.concat([this.request, Buffer.alloc(1, value)]);
    }

    writeUInt8(value) {
        this.writeUByte(value);
    }

    writeInt8(value) {
        const buffer = Buffer.alloc(1);
        buffer.writeInt8(value);
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeFloat(value) {
        const buffer = Buffer.alloc(4);
        buffer.writeFloatLE(value);
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeDouble(value) {
        const buffer = Buffer.alloc(8);
        buffer.writeDoubleBE(value);
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeDoubleLE(value) {
        const buffer = Buffer.alloc(8);
        buffer.writeDoubleLE(value);
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeUInt32(value) {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt32BE(value);
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeInt32(value) {
        const buffer = Buffer.alloc(4);
        buffer.writeInt32BE(value);
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeUInt16(value) {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt16BE(value);
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeUInt16LE(value) {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt16LE(value);
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeInt16(value) {
        const buffer = Buffer.alloc(2);
        buffer.writeInt16BE(value);
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeInt16LE(value) {
        const buffer = Buffer.alloc(2);
        buffer.writeInt16LE(value);
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeUInt64(value) {
        const buffer = Buffer.alloc(8);
        buffer.writeBigUInt64BE(BigInt(value));
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeInt64(value) {
        const buffer = Buffer.alloc(8);
        buffer.writeBigInt64BE(BigInt(value));
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeOctets(value) {
        if (!value || value.length === 0) {
            value = Buffer.alloc(0); // Corrige strings vazias para um Buffer vazio
        } else if (typeof value === 'string' && /^[0-9a-fA-F]+$/.test(value)) {
            value = Buffer.from(value, 'hex');
        } else if (!(value instanceof Buffer)) {
            throw new Error(`writeOctets expects a Buffer or hex string, but got ${typeof value}`);
        }

        this.writeCUInt32(value.length);
        this.request = Buffer.concat([this.request, value]);
    }

    writeUString(value, encoding = 'utf16le') {
        const buffer = Buffer.from(value, encoding);
        this.writeCUInt32(buffer.length);
        this.request = Buffer.concat([this.request, buffer]);
    }

    pack(value) {
        this.request = Buffer.concat([this.cUInt(value), this.cUInt(this.request.length), this.request]);
    }

    unmarshal() {
        return Buffer.concat([this.cUInt(this.request.length), this.request]);
    }

    send(address, port, callback) {
        const client = new net.Socket();
        client.connect(port, address, () => {
            client.write(this.request, () => {
                if (!this.getResponse) {
                    client.end();
                    callback(null, null);
                }
            });

            if (this.getResponse) {
                client.on('data', (data) => {
                    this.response = data;
                    client.destroy();
                    callback(null, this.response);
                });
            }
        });

        client.on('error', (err) => {
            client.destroy();
            callback(err, null);
        });
    }

    writeCUInt32(value) {
        this.request = Buffer.concat([this.request, this.cUInt(value)]);
    }

    cUInt(value) {
        if (value <= 0x7F) {
            return Buffer.from([value]);
        } else if (value <= 0x3FFF) {
            const buffer = Buffer.alloc(2);
            buffer.writeUInt16BE(value | 0x8000);
            return buffer;
        } else if (value <= 0x1FFFFFFF) {
            const buffer = Buffer.alloc(4);
            buffer.writeUInt32BE(value | 0xC0000000);
            return buffer;
        } else {
            const buffer = Buffer.alloc(5);
            buffer.writeUInt8(0xE0, 0);
            buffer.writeUInt32BE(value, 1);
            return buffer;
        }
    }
}

module.exports = {
    WritePacket,
    ReadPacket
};
