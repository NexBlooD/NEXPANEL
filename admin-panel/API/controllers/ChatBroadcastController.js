const { sendChatBroadcast } = require('../services/ChatBroadcastService');


async function chatBroadcast(req, res) {
    const { channel, userid, mensagem } = req.body;

    if (channel === undefined || userid === undefined || !mensagem) {
        return res.status(400).json({
            success: false,
            message: 'Os campos "channel", "userid" e "mensagem" são obrigatórios.',
        });
    }
    

    try {
        const result = await sendChatBroadcast(channel, userid, mensagem);
        res.status(200).json({
            success: true,
            message: result,
        });
    } catch (error) {
        console.error('Erro ao enviar mensagem via ChatBroadcast:', error.message);

        res.status(500).json({
            success: false,
            message: 'Erro ao enviar mensagem via ChatBroadcast.',
            error: error.message,
        });
    }
}

module.exports = { chatBroadcast };
