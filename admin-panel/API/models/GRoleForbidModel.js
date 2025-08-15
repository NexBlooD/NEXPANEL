// src/models/GRoleForbidModel.js
class GRoleForbidModel {
    static fields = [
        { name: 'type', method: 'readUByte' },
        { name: 'time', method: 'readInt32' },
        { name: 'createtime', method: 'readInt32' },
        { name: 'reason', method: 'readOctets' }
    ];
}

module.exports = GRoleForbidModel;
