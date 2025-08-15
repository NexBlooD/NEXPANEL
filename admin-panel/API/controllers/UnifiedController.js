const { fetchPlayerConsumeInfo } = require('../services/PlayerConsumeInfoService');
const GMListOnline = require('../services/GMListOnlineUserService');

async function getUnifiedOnlineUsers(req, res) {
    try {
        const gmListOnlineService = new GMListOnline();
        const userList = await gmListOnlineService.sendGMListOnlineUser();

        if (!userList || !userList.userlist) {
            return res.status(404).json({
                success: false,
                message: 'Nenhum usuário online encontrado.',
            });
        }

        const enrichedUsers = await Promise.all(
            userList.userlist.map(async (user) => {
                try {
                    const consumeInfo = await fetchPlayerConsumeInfo(parseInt(user.roleid, 10));
                    

                    return {
                        ...user,
                        ip: consumeInfo.ip || null, 
                    };
                } catch (error) {
                    console.error(`Erro ao buscar IP para roleid ${user.roleid}:`, error.message);
                    return {
                        ...user,
                        ip: null, 
                    };
                }
            })
        );

        res.status(200).json({
            success: true,
            count: enrichedUsers.length,
            users: enrichedUsers,
        });
    } catch (error) {
        console.error('Erro ao unificar usuários online com IP:', error.message);

        res.status(500).json({
            success: false,
            message: 'Erro ao buscar lista de usuários online com IP.',
            error: error.message,
        });
    }
}

module.exports = { getUnifiedOnlineUsers };
