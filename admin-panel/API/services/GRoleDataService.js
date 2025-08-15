const { logDebug } = require('../utils/debug');

const GRoleBase = require('./GRoleBaseService');
const GRoleStatus = require('./GRoleStatusService');
const GRolePocket = require('./GRolePocketService');
const GRoleEquipment = require('./GRoleEquipmentService');
const GRoleStorehouse = require('./GRoleStorehouseService');
const GRoleTask = require('./GRoleTaskService');

async function getRoleData(roleId) {
    try {
        const roleData = {};

        logDebug('🔎 Iniciando busca por RoleBase...');
        roleData.base = await new GRoleBase().getRoleBase(roleId);
        if (!roleData.base) throw new Error('RoleBase retornou vazio!');
        logDebug('✅ RoleBase obtido:', roleData.base);

        logDebug('🔎 Iniciando busca por RoleStatus...');
        roleData.status = await new GRoleStatus().getRoleStatus(roleId);
        if (!roleData.status) throw new Error('RoleStatus retornou vazio!');
        logDebug('✅ RoleStatus obtido:', roleData.status);

        logDebug('🔎 Iniciando busca por RolePocket...');
        roleData.pocket = await new GRolePocket().getRolePocket(roleId);
        if (!roleData.pocket) throw new Error('RolePocket retornou vazio!');
        logDebug('✅ RolePocket obtido:', roleData.pocket);

        logDebug('🔎 Iniciando busca por RoleEquipment...');
        roleData.equipment = await new GRoleEquipment().getRoleEquipment(roleId);
        if (!roleData.equipment) throw new Error('RoleEquipment retornou vazio!');
        logDebug('✅ RoleEquipment obtido:', roleData.equipment);

        logDebug('🔎 Iniciando busca por RoleStorehouse...');
        roleData.storehouse = await new GRoleStorehouse().getRoleStoreHouse(roleId);
        if (!roleData.storehouse) throw new Error('RoleStorehouse retornou vazio!');
        logDebug('✅ RoleStorehouse obtido:', roleData.storehouse);

        logDebug('🔎 Iniciando busca por RoleTask...');
        roleData.task = await new GRoleTask().getRoleTask(roleId);
        if (!roleData.task) throw new Error('RoleTask retornou vazio!');
        logDebug('✅ RoleTask obtido:', roleData.task);

        logDebug('🎯 Todos os dados foram carregados com sucesso!');
        return roleData;
    } catch (err) {
        logDebug('❌ Erro em getRoleData:', err.message);
        throw new Error('Erro ao obter RoleData: ' + err.message);
    }
}

module.exports = { getRoleData };
