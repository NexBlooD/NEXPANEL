const GMShutupUser = require('../services/GMShutupUserService');

const gmShutupUserService = new GMShutupUser();

async function muteUser(req, res) {
    const { userid, time, reason } = req.body;

    if (!userid || !time || !reason) {
        return res.status(400).json({
            success: false,
            message: 'Parâmetros obrigatórios ausentes. Certifique-se de fornecer userid, time e reason.'
        });
    }

    try {
        const response = await gmShutupUserService.muteUser(userid, time, reason);
        res.status(200).json(response); 
    } catch (error) {
        console.error('Erro ao executar o kickout:', error.message);
        res.status(500).json({
            success: false,
            message: `Erro ao executar o kickout: ${error.message}`
        });
    }
}

module.exports = { muteUser };
