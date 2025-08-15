const express = require('express');
const router = express.Router();

const { activateTriggerController } = require('../controllers/ActivateTriggerController');
const { cancelTriggerController } = require('../controllers/CancelTriggerController');
const { chatBroadcast } = require('../controllers/ChatBroadcastController');
const { getOnlineUsers } = require('../controllers/GMListOnlineUserController');
const { getPlayerConsumeInfo  } = require('../controllers/PlayerConsumeInfoController');
const { dbLoadGlobalControl } = require('../controllers/DBLoadGlobalControlController');
const { serverForbidControl  } = require('../controllers/ServerForbidControlController');
const { getGRoleStatus } = require('../controllers/GRoleStatusController');
const { getGRoleBase } = require('../controllers/GRoleBaseController');
const { roleData} = require('../controllers/GRoleDataController')
const { getUnifiedOnlineUsers } = require('../controllers/UnifiedController');
const { kickoutUser } = require('../controllers/GMKickoutUserController');
const { kickoutRole } = require('../controllers/GMKickoutRoleController');
const { muteUser } = require('../controllers/GMShutupUserController');
const { muteRole } = require('../controllers/GMShutupRoleController');

router.get('/server-load-control', dbLoadGlobalControl);

router.post('/server-forbid-control', serverForbidControl );

router.post('/activate-trigger', activateTriggerController);

router.post('/cancel-trigger', cancelTriggerController);

router.post('/chat-broadcast', chatBroadcast);

router.get('/online-users', getOnlineUsers);

router.post('/player-consume-info', getPlayerConsumeInfo);

router.get('/getRoleStatus/:roleId', getGRoleStatus);

router.get('/getRoleBase/:roleId', getGRoleBase);

router.get('/getRoleData/:roleId', roleData);

router.get('/unified-online-users', getUnifiedOnlineUsers);

router.post('/ban-account', kickoutUser);

router.post('/ban-character', kickoutRole);

router.post('/mute-account', muteUser);

router.post('/mute-character', muteRole);

module.exports = router;
