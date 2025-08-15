const roleStructure = require('./role_structure');

function serializeData(packet, data, structure) {
    for (const key in structure) {
        const type = structure[key];
        const value = data[key];

        if (value === undefined) {
            continue;
        }

        if (typeof type === 'object' && !Array.isArray(type)) {
            serializeData(packet, value, type);
        } else {
            switch (type) {
                case 'int':
                    packet.writeInt32(value);
                    break;
                case 'uInt':
                    packet.writeInt32(value);
                    break;
                case 'uByte':
                    packet.writeBytes(value); 
                    break;
                case 'short':
                    packet.writeInt16(value);
                    break;
                case 'float':
                    packet.writeFloat(value);
                    break;
                case 'cuint':
                    packet.writeCUInt32(value);
                    break;
                case 'uString':
                    packet.writeUString(value);
                    break;
                case 'octets':
                    packet.writeOctets(value);
                    break;
                default:
                    console.warn(`⚠️ Tipo desconhecido: ${type} para a chave ${key}`);
            }
        }
    }
}



module.exports = serializeData;
