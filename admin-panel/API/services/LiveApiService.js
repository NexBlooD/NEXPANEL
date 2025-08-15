class LiveApiService {
    constructor(client) {
        this.client = client;
    }

    static is_64bit = process.arch === 'x64'; 

    async gatherResult(params) {
        const { roleid, item_id, amount } = params;
        const data = Buffer.alloc(24);
        data.writeInt32LE(amount, 0);
        data.writeInt32LE(0, 4); // task_id placeholder
        data.writeInt32LE(0, 8); // eliminate_tool placeholder
        data.writeInt32LE(0, 12); // mine_tid placeholder
        data.writeInt32LE(0, 16); // life placeholder
        data.writeUInt8(0, 20); // mine_type placeholder

        const msg = {
            message: 88,
            target: { type: 2, id: roleid },
            source: { type: 2, id: 0 },
            param: item_id,
            pos: { x: 0, y: 0, z: 0 },
            ttl: 2,
            content_length: BigInt(data.length),
            content: data
        };

        const buffer = this.client.serializeMsg(msg);
        await this.client.sendMessage(buffer);
    }

    normalizeCoords(x, y, z) {
        const normalizedX = Math.floor((x - 400) * 10);
        const normalizedY = Math.floor(y * 10);
        const normalizedZ = Math.floor((z - 550) * 10);
        return [normalizedX, normalizedY, normalizedZ];
    }

    async longjump(params) {
        const { roleid, worldtag, x, y, z, normalize = false } = params;

        // Apply normalization if requested
        let [finalX, finalY, finalZ] = normalize ? this.normalizeCoords(x, y, z) : [x, y, z];

        const destination = Buffer.alloc(12);
        destination.writeFloatLE(finalX, 0);
        destination.writeFloatLE(finalY, 4);
        destination.writeFloatLE(finalZ, 8);

        const msg = {
            message: 180,
            target: { type: 2, id: roleid },
            source: { type: 0, id: 0 },
            pos: { x: 0, y: 0, z: 0 },
            ttl: 2,
            param: worldtag,
            content_length: BigInt(destination.length),
            content: destination
        };

        const buffer = this.client.serializeMsg(msg);
        await this.client.sendMessage(buffer);
    }

    async gmrecallplayer(params) {
        const { roleid, worldtag, x, y, z } = params;
        const destination = Buffer.alloc(12);
        destination.writeFloatLE(x, 0);
        destination.writeFloatLE(y, 4);
        destination.writeFloatLE(z, 8);

        const msg = {
            message: 603,
            target: { type: 2, id: roleid },
            source: { type: 0, id: 0 },
            pos: { x: 0, y: 0, z: 0 },
            ttl: 2,
            param: worldtag,
            content_length: BigInt(destination.length),
            content: destination
        };

        const buffer = this.client.serializeMsg(msg);
        await this.client.sendMessage(buffer);
    }

    async deliverTask(params) {
        const { roleid, taskid } = params;
        const msg = {
            message: 188,
            target: { type: 2, id: roleid },
            source: { type: 2, id: 0 },
            pos: { x: 0, y: 0, z: 0 },
            ttl: 2,
            param: taskid,
            content_length: BigInt(0),
            content: Buffer.alloc(0)
        };

        const buffer = this.client.serializeMsg(msg);
        await this.client.sendMessage(buffer);
    }

    async giveMoney(params) {
        const { roleid, amount } = params;
        const msg = {
            message: 18,
            target: { type: 2, id: roleid },
            source: { type: 2, id: 0 },
            param: amount,
            pos: { x: 0, y: 0, z: 0 },
            ttl: 2,
            content_length: BigInt(0),
            content: Buffer.alloc(0)
        };

        const buffer = this.client.serializeMsg(msg);
        await this.client.sendMessage(buffer);
    }

    async revive(params) {
        const { roleid, param } = params;
        const msg = {
            message: 609,
            target: { type: 2, id: roleid },
            source: { type: 2, id: 0 },
            param: param,
            pos: { x: 0, y: 0, z: 0 },
            ttl: 2,
            content_length: BigInt(0),
            content: Buffer.alloc(0)
        };

        const buffer = this.client.serializeMsg(msg);
        await this.client.sendMessage(buffer);
    }

    async die(params) {
        const { roleid, param } = params;
        const msg = {
            message: 103,
            target: { type: 2, id: roleid },
            source: { type: 2, id: 0 },
            param: param,
            pos: { x: 0, y: 0, z: 0 },
            ttl: 2,
            content_length: BigInt(0),
            content: Buffer.alloc(0)
        };

        const buffer = this.client.serializeMsg(msg);
        await this.client.sendMessage(buffer);
    }

    async takeItem(params) {
        const { roleid, itemid } = params;
        const msg = {
            message: 132,
            param: itemid,
            target: { type: 2, id: roleid },
            source: { type: 2, id: 0 },
            pos: { x: 0, y: 0, z: 0 },
            ttl: 2,
            content_length: BigInt(0),
            content: Buffer.alloc(0)
        };

        const buffer = this.client.serializeMsg(msg);
        await this.client.sendMessage(buffer);
    }

    async gmRemoveSpecItem(params) {
        const { roleid, item_id, where, index, count, cs_index = 0, cs_sid = 0 } = params;
    
        const inventoryId = this.getInventoryId(where);
        if (inventoryId === -1) throw new Error(`Invalid inventory name "${where}"`);
    
        const content = Buffer.alloc(LiveApiController.is_64bit ? 24 : 20);
        content.writeInt32LE(item_id, 0);
        content.writeUInt8(inventoryId, 4);
        content.writeUInt8(index, 5);
        content.writeUInt16LE(0, 6);
    
        if (LiveApiController.is_64bit) {  
            content.writeBigUInt64LE(BigInt(count), 8);
            content.writeInt32LE(cs_index, 16);
            content.writeInt32LE(cs_sid, 20);
        } else {
            content.writeInt32LE(count, 8);
            content.writeInt32LE(cs_index, 12);
            content.writeInt32LE(cs_sid, 16);
        }
    
        const msg = {
            message: 614,
            target: { type: 2, id: roleid },
            source: { type: 2, id: 0 },
            pos: { x: 0, y: 0, z: 0 },
            ttl: 2,
            param: 0,
            content_length: BigInt(content.length),
            content: content
        };
    
        const buffer = this.client.serializeMsg(msg);
        await this.client.sendMessage(buffer);
    }
    

    getInventoryId(inventoryName) {
        const inventoryMap = {
            pocket: 0,
            equipment: 1,
            task_inventory: 2,
            bank: 3,
            trash_box2: 4,
            trash_box3: 5,
            user_trash_box: 6,
            trash_box4: 7
        };
        return inventoryMap[inventoryName] ?? -1;
    }
}

module.exports = LiveApiService;
