const ServerForbidControl = require('../services/ServerForbidControlService');

async function serverForbidControl(req, res) {
    const {
        forbid_ctrl_list = [],
        forbid_item_list = [],
        forbid_recipe_list = [],
        forbid_service_list = [],
        forbid_shopitem_list = [],
        forbid_skill_list = [],
        forbid_task_list = [],
        trigger_ctrl_list = []
    } = req.body;

    try {
        const forbidLists = {
            forbid_ctrl_list,
            forbid_item_list,
            forbid_recipe_list,
            forbid_service_list,
            forbid_shopitem_list,
            forbid_skill_list,
            forbid_task_list,
            trigger_ctrl_list,
        };

        const result = await ServerForbidControl(forbidLists);
        res.status(200).json({
            success: true,
            message: 'Operação realizada com sucesso.',
            result,
        });
    } catch (err) {
        console.error('Erro ao processar controle do servidor:', err);
        res.status(500).json({
            success: false,
            message: 'Erro ao processar a operação de controle do servidor.',
        });
    }
}

module.exports = { serverForbidControl };
