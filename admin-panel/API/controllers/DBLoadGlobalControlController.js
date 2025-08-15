const  DBLoadGlobalControl  = require('../services/ServerLoadControlService');

async function dbLoadGlobalControl(req, res) {
    try {
        const data = await DBLoadGlobalControl();
        
        res.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('Erro ao carregar controle global:', error.message);

        res.status(500).json({
            success: false,
            message: 'Erro ao carregar controle global.',
        });
    }
}

module.exports = { dbLoadGlobalControl };
