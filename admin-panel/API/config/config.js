module.exports = {
    version: 174,
    debug: true,
    servers: {
        gameDbClient: {
            ip: '127.0.0.1',
            port: 29400
        },
        deliveryServer: {
            ip: '127.0.0.1',
            port: 29100
        },
        GProviderClient:
        {
            ip: '127.0.0.1',
            port: 29300
        },
    },
    type: {
        worldChat: 120,
        gmControlGame: 380,
        dBGetConsumeInfos: 384,
        debugAddCash: 521,
        getRoleBase: 3013,
        getRoleStatus: 3015,
        getRoleEquipment: 3017,
        getRolePocket: 3053,
        getRoleStoreHouse: 3027,
        getRoleTask: 3019,
        getRole: 3005,
        getUserRoles: 3401,
        getGMListOnlineUser: 352,
        muteRole: 356,
        muteAcc: 362,
        renameRole: 3404,
        forbidAcc: 5035,
        forbidRole: 360,
        putRoleStatus: 3014
    },
    method:{
        get: 2147483648,
        put: 2147483649
    },
};
