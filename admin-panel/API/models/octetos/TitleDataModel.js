class TitleDataModel {
    constructor() {
        this.current_title = 0; // Equivale a ushort current_title
        this.delivered_titles = []; // QList<int>
        this.expire_titles = {}; // QMap<ushort, int>
    }

    unmarshal(readPacket) {
        // Lê o current_title
        this.current_title = readPacket.readUInt16LE();

        // Lê a contagem de delivered_titles
        const deliveredCount = readPacket.readInt32();
        if (deliveredCount > 0) {
            for (let i = 0; i < deliveredCount; i++) {
                this.delivered_titles.push(readPacket.readInt32());
            }
        }

        // Lê a contagem de expire_titles
        const expireCount = readPacket.readUInt16LE();
        if (expireCount > 0) {
            for (let i = 0; i < expireCount; i++) {
                const id = readPacket.readUInt16LE();
                const time = readPacket.readInt32();
                this.expire_titles[id] = time;
            }
        }
    }

    marshal(writePacket) {
        // Escreve o current_title
        writePacket.writeUInt16LE(this.current_title);

        // Escreve a contagem de delivered_titles
        writePacket.writeInt32(this.delivered_titles.length);
        if (this.delivered_titles.length > 0) {
            this.delivered_titles.forEach((title) => {
                writePacket.writeInt32(title);
            });
        }

        // Escreve a contagem de expire_titles
        const expireKeys = Object.keys(this.expire_titles);
        writePacket.writeUInt16LE(expireKeys.length);
        if (expireKeys.length > 0) {
            expireKeys.forEach((key) => {
                writePacket.writeUInt16LE(parseInt(key)); // ID
                writePacket.writeInt32(this.expire_titles[key]); // Time
            });
        }
    }

    toObject() {
        return {
            current_title: this.current_title,
            delivered_titles: this.delivered_titles,
            expire_titles: this.expire_titles,
        };
    }
}

module.exports = TitleDataModel;
