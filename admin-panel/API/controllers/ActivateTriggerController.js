const { activateTrigger } = require('../services/ActivateTriggerService');

async function activateTriggerController(req, res) {
    const { worldTag, triggerId } = req.body;

    if (!triggerId && triggerId !== 0) {
        return res.status(400).json({
            success: false,
            message: 'O campo "triggerId" é obrigatório.',
        });
    }

    if (!worldTag && worldTag !== 0) {
        return res.status(400).json({
            success: false,
            message: 'O campo "worldTag" é obrigatório.',
        });
    }

    try {
        const result = await activateTrigger( worldTag, triggerId);
        return res.status(200).json({
            success: true,
            message: result,
        });
    } catch (error) {
        console.error('Erro ao ativar o trigger:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao ativar o trigger.',
        });
    }
}

module.exports = { activateTriggerController };
