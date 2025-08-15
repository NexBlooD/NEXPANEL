const GMShutupRole = require('../services/GMShutupRoleService');

const gmShutupRoleService = new GMShutupRole();

async function muteRole(req, res) {
    const { roleid, time, reason } = req.body;

    if (!roleid || !time || !reason) {
        return res.status(400).json({
            success: false,
            message: 'Parâmetros obrigatórios ausentes. Certifique-se de fornecer roleid, time e reason.'
        });
    }

    try {
        const response = await gmShutupRoleService.muteRole(roleid, time, reason);
        res.status(200).json(response); 
    } catch (error) {
        console.error('Erro ao executar o kickout:', error.message);
        res.status(500).json({
            success: false,
            message: `Erro ao executar o kickout: ${error.message}`
        });
    }
}

module.exports = { muteRole };
