const { cancelTrigger } = require('../services/CancelTriggerService');

async function cancelTriggerController(req, res) {
    const { triggerId } = req.body;

    if (!triggerId && triggerId !== 0) {
        return res.status(400).json({
            success: false,
            message: 'O campo "triggerId" é obrigatório.',
        });
    }

    try {
        const result = await cancelTrigger(triggerId);
        return res.status(200).json({
            success: true,
            message: result,
        });
    } catch (error) {
        console.error('Erro ao cancelar o trigger:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao cancelar o trigger.',
        });
    }
}

module.exports = { cancelTriggerController };
