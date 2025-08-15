class RealmDataModel {
    static fields = [
        { name: 'level', method: 'readInt32' },
        { name: 'exp', method: 'readInt32' },
        { name: 'reserved1', method: 'readInt32' },
        { name: 'reserved2', method: 'readInt32' }
    ];

    static unmarshal(readPacket) {
        const data = {};
        this.fields.forEach(field => {
            data[field.name] = readPacket[field.method]();
        });
        return data;
    }
}

module.exports = RealmDataModel;
