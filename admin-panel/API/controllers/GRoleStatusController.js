// src/controllers/GRoleStatusController.js
const GRoleStatus = require('../services/GRoleStatusService');

const gRS = new GRoleStatus();

async function getGRoleStatus(req, res) {
    const { roleId } = req.params;

    if (!roleId) {
        return res.status(400).json({ success: false, message: 'RoleID é obrigatório.' });
    }

    try {
        console.log(`Iniciando consulta getRoleStatus para roleId: ${roleId}`);
        const roleStatus = await gRS.getRoleStatus(parseInt(roleId));
        console.log('Consulta getRoleStatus concluída com sucesso');
        res.json({ success: true, data: roleStatus });
    } catch (error) {
        console.error('Erro ao obter status do personagem:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar status do personagem.', error: error.message });
    }
}

module.exports = { getGRoleStatus };
