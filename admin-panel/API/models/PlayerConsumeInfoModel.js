// src/models/PlayerConsumeInfoModel.js
class PlayerConsumeInfoModel {
    constructor(data) {
        this.always = data.always;
        this.retcode = data.retcode;
        this.count = data.count;
        this.receivedRoleId = data.receivedRoleId;
        this.level = data.level;
        this.ip = data.ip;
        this.cashAdd = data.cash_add;
        this.mallConsumption = data.mall_consumption;
        this.avgOnlineTime = data.avg_online_time;
    }

    toJSON() {
        return {
            always: this.always,
            retcode: this.retcode,
            count: this.count,
            receivedRoleId: this.receivedRoleId,
            level: this.level,
            ip: this.ip,
            cashAdd: this.cashAdd,
            mallConsumption: this.mallConsumption,
            avgOnlineTime: this.avgOnlineTime,
        };
    }
}

module.exports = PlayerConsumeInfoModel;
