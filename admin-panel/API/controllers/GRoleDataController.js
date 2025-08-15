const { getRoleData } = require('../services/GRoleDataService');


async function roleData(req, res) {
    const { roleId } = req.params;

    if (!roleId) {
        return res.status(400).json({ success: false, message: 'RoleID é obrigatório.' });
    }

    try {
        console.log(`Iniciando consulta getRoleData para roleId: ${roleId}`);
        const roleDataResult = await getRoleData(parseInt(roleId));
        console.log('Consulta getRoleData concluída com sucesso');
        res.json({ success: true, data: roleDataResult });
    } catch (error) {
        console.error('Erro ao buscar informações de GRoleData:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar informações de GRoleData.', error: error.message });
    }
}

module.exports = { roleData };
