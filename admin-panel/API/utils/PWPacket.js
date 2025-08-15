const net = require('net');

class ReadPacket {
    constructor(response = null) {
        this.data = response || Buffer.alloc(0); // Buffer inicial vazio ou fornecido
        this.pos = 0; // Posição atual de leitura
    }

    validateBuffer(size) {
        if (this.pos + size > this.data.length) {
            throw new RangeError(`Tentativa de ler além dos limites do buffer. Posição: ${this.pos}, Tamanho: ${size}, Buffer disponível: ${this.data.length}`);
        }
    }

    readBytes(length) {
        this.validateBuffer(length);
        const value = this.data.slice(this.pos, this.pos + length);
        this.pos += length;
        return value;
    }

    readUByte() {
        this.validateBuffer(1);
        const value = this.data.readUInt8(this.pos);
        this.pos += 1;
        return value;
    }

    readBigInt64BE() {
        this.validateBuffer(8); // Verifica se há pelo menos 8 bytes disponíveis
        const high = this.data.readUInt32BE(this.pos); // Parte alta (4 bytes)
        const low = this.data.readUInt32BE(this.pos + 4); // Parte baixa (4 bytes)
        this.pos += 8; // Move o ponteiro
        return BigInt(high) << 32n | BigInt(low); // Combina as partes alta e baixa
    }
    

    readFloat() {
        this.validateBuffer(4);
        const buffer = this.data.slice(this.pos, this.pos + 4).reverse();
        const value = Buffer.from(buffer).readFloatLE(0);
        this.pos += 4;
        return value;
    }

    readFloatBE() {
        this.validateBuffer(4);
        const value = this.data.readFloatBE(this.pos);
        this.pos += 4;
        return value;
    }

    readUInt32() {
        this.validateBuffer(4);
        const value = this.data.readUInt32BE(this.pos);
        this.pos += 4;
        return value;
    }

    readUInt16() {
        this.validateBuffer(2);
        const value = this.data.readUInt16BE(this.pos);
        this.pos += 2;
        return value;
    }

    readUInt16LE() {
        this.validateBuffer(2);
        const value = this.data.readUInt16LE(this.pos);
        this.pos += 2;
        return value;
    }

    readOctets() {
        const length = this.readCUInt();
        this.validateBuffer(length);
        const value = this.data.slice(this.pos, this.pos + length).toString('hex');
        this.pos += length;
        return value;
    }

    readUString() {
        const length = this.readCUInt();
        this.validateBuffer(length);
        const buffer = this.data.slice(this.pos, this.pos + length);
        const value = Buffer.from(buffer).toString('utf16le');
        this.pos += length;
        return value;
    }

    readPacketInfo() {
        return {
            Opcode: this.readCUInt32(),
            Length: this.readCUInt32(),
        };
    }

    seek(value) {
        this.pos += value;
    }

    readCUInt32() {
        this.validateBuffer(1);
        let value = this.data.readUInt8(this.pos);
        this.pos++;

        switch (value & 0xE0) {
            case 0xE0:
                this.validateBuffer(4);
                value = this.data.readUInt32BE(this.pos);
                this.pos += 4;
                break;
            case 0xC0:
                this.validateBuffer(3);
                value = this.data.readUInt32BE(this.pos - 1) & 0x1FFFFFFF;
                this.pos += 3;
                break;
            case 0x80:
            case 0xA0:
                this.validateBuffer(1);
                value = this.data.readUInt16BE(this.pos - 1) & 0x3FFF;
                this.pos++;
                break;
            default:
                break;
        }

        return value;
    }

    readCUInt() {
        this.validateBuffer(1);
        let value = this.data.readUInt8(this.pos); // Read the first byte
        this.pos++;

        if (value < 0x80) {
            return value;
        } else if (value < 0xC0) {
            this.validateBuffer(1);
            value = ((value & 0x3F) << 8) | this.data.readUInt8(this.pos);
            this.pos++;
            return value;
        } else if (value < 0xE0) {
            this.validateBuffer(3);
            value = ((value & 0x1F) << 24) |
                (this.data.readUInt8(this.pos) << 16) |
                (this.data.readUInt8(this.pos + 1) << 8) |
                this.data.readUInt8(this.pos + 2);
            this.pos += 3;
            return value;
        } else {
            this.validateBuffer(4);
            value = this.data.readUInt32BE(this.pos);
            this.pos += 4;
            return value;
        }
    }

    readInt32() {
        this.validateBuffer(4);
        const value = this.data.readInt32BE(this.pos);
        this.pos += 4;
        return value;
    }

    readLevel2() {
        this.validateBuffer(4);
        const value = this.data[this.pos + 3];
        this.pos += 4;
        return value;
    }
}

class WritePacket {
    constructor() {
        this.request = Buffer.alloc(0); // Buffer inicial vazio
        this.response = null;
        this.passEstablished = false;
        this.getResponse = true;
    }

    writeBytes(value) {
        this.request = Buffer.concat([this.request, Buffer.from(value)]);
    }

    writeUByte(value) {
        this.request = Buffer.concat([this.request, Buffer.alloc(1, value)]);
    }

    writeFloat(value) {
        const buffer = Buffer.alloc(4);
        buffer.writeFloatLE(value);
        this.request = Buffer.concat([this.request, buffer.reverse()]);
    }

    writeUInt32(value) {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt32BE(value);
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeUInt16(value) {
        const buffer = Buffer.alloc(2);
        buffer.writeUInt16BE(value);
        this.request = Buffer.concat([this.request, buffer]);
    }

    writeOctets(value) {
        if (/^[0-9a-fA-F]+$/.test(value)) {
            value = Buffer.from(value, 'hex');
        }
        this.writeCUInt32(value.length);
        this.request = Buffer.concat([this.request, value]);
    }

    writeUString(value, encoding = 'utf16le') {
        const buffer = Buffer.from(value, encoding);
        this.writeCUInt32(buffer.length);
        this.request = Buffer.concat([this.request, buffer]);
    }

    pack(opcode) {
        const opcodeBuffer = this.cUInt(opcode);
        const lengthBuffer = this.cUInt(this.request.length);
        this.request = Buffer.concat([opcodeBuffer, lengthBuffer, this.request]);
    }

    unmarshal() {
        return Buffer.concat([this.cUInt(this.request.length), this.request]);
    }

    send(address, port) {
        return new Promise((resolve, reject) => {
            const client = new net.Socket();

            client.connect(port, address, () => {
                client.write(this.request, () => {
                    if (!this.getResponse) {
                        client.destroy();
                        resolve(null);
                    }
                });

                client.on('data', (data) => {
                    this.response = data;
                    client.destroy();
                    resolve(this.response);
                });

                client.on('error', (err) => {
                    client.destroy();
                    reject(err);
                });
            });
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
    ReadPacket,
};
