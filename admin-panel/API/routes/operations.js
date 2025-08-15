const express = require('express');
const MsgIOClient = require('../utils/MsgIOClient');
const LiveApiService = require('../services/LiveApiService');

const router = express.Router();

const operationMap = {
    'give-item': 'gatherResult',
    'teleport-player': 'longjump',
    'recall-player': 'gmrecallplayer',
    'assign-task': 'deliverTask',
    'add-money': 'giveMoney',
    'revive-player': 'revive',
    'kill-player': 'die',
    'remove-item': 'takeItem',
    'remove-specific-item': 'gmRemoveSpecItem',
};

async function handleOperation(operation, params) {
    const client = new MsgIOClient();
    const liveApiService = new LiveApiService(client);

    try {
        await client.connect(10901);
        await client.identify();

        const method = operationMap[operation];
        if (!method || typeof liveApiService[method] !== 'function') {
            throw new Error(`Unknown operation: '${operation}'`);
        }

        await liveApiService[method](params);
    } finally {
        client.disconnect();
    }
}

router.post('/:operation', async (req, res) => {
    const { operation } = req.params;
    const params = req.body;

    try {
        await handleOperation(operation, params);

        res.status(200).json({
            success: true,
            message: `${operation.replace(/-/g, ' ')} operation completed successfully.`,
        });
    } catch (error) {
        console.error(`Error processing '${operation}':`, error);

        res.status(500).json({
            success: false,
            message: `Error processing '${operation}': ${error.message}`,
        });
    }
});

module.exports = router;
