// src/controllers/GRoleBaseController.js
const GRoleBase = require('../services/GRoleBaseService');

const gRB = new GRoleBase();

async function getGRoleBase(req, res) {
    const { roleId } = req.params;

    if (!roleId) {
        return res.status(400).json({ success: false, message: 'RoleID é obrigatório.' });
    }

    try {
        console.log(`Iniciando consulta getRoleBase para roleId: ${roleId}`);
        const roleBase = await gRB.getRoleBase(parseInt(roleId));
        console.log('Consulta getRoleBase concluída com sucesso');
        res.json({ success: true, data: roleBase });
    } catch (error) {
        console.error('Erro ao buscar informações de GRoleBase:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar informações de GRoleBase.', error: error.message });
    }
}

module.exports = { getGRoleBase };
