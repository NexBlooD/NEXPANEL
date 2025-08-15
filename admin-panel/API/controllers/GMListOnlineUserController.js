const GMListOnline = require('../services/GMListOnlineUserService');

async function getOnlineUsers(req, res) {
    try {

        const gmListOnlineService = new GMListOnline();
        const userList = await gmListOnlineService.sendGMListOnlineUser();

        res.status(200).json({
            success: true,
            count: userList.count,
            users: userList.userlist,
        });
    } catch (error) {
        console.error('Erro ao buscar lista de usuários online:', error.message);
        
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar lista de usuários online.',
            error: error.message,
        });
    }
}

module.exports = { getOnlineUsers };
