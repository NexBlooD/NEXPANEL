// src/controllers/PlayerConsumeInfoController.js
const { fetchPlayerConsumeInfo } = require('../services/PlayerConsumeInfoService');

async function getPlayerConsumeInfo(req, res) {
    const { roleId } = req.body;

    if (!roleId) {
        return res.status(400).json({ success: false, message: 'RoleID é obrigatório.' });
    }

    try {
        const consumeInfo = await fetchPlayerConsumeInfo(parseInt(roleId, 10));
        res.json({ success: true, consumeInfo });
    } catch (error) {
        console.error('Erro ao buscar informações de consumo do jogador:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar informações do jogador.' });
    }
}

module.exports = { getPlayerConsumeInfo };
