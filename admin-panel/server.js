const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');
const http = require('http');
const net = require('net');
const mysql = require('mysql2/promise');

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Configuração do banco de dados MySQL (opcional)
let db = null;
async function initDatabase() {
    try {
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'salles321',
            database: 'pw',
            charset: 'utf8mb4'
        });
        console.log('💾 Conectado ao banco MySQL');
    } catch (error) {
        console.log('⚠️  MySQL não conectado:', error.message);
        console.log('📝 O painel funcionará sem recursos de conta');
    }
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Desabilitar cache para desenvolvimento
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('ETag', false);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Função para enviar comandos para o plugin
function sendPluginCommand(funcName, args) {
    return new Promise((resolve, reject) => {
        const payload = {
            "func": funcName,
            "args": args
        };

        const client = new net.Socket();
        
        client.connect(9020, '127.0.0.1', () => {
            client.write(JSON.stringify(payload));
        });

        client.on('data', (data) => {
            client.destroy();
            resolve(data.toString());
        });

        client.on('error', (err) => {
            client.destroy();
            reject(err);
        });

        client.on('close', () => {
            resolve('Comando enviado com sucesso');
        });

        // Timeout de 5 segundos
        setTimeout(() => {
            client.destroy();
            resolve('Comando enviado (timeout)');
        }, 5000);
    });
}

// Integração com API externa
app.use('/api', async (req, res, next) => {
    // Mapeamento de rotas do painel para rotas da API
    const routeMapping = {
        'getrolebase': 'getRoleBase',
        'getrolestatus': 'getRoleStatus', 
        'getrole': 'getRoleData',
        'banuser': 'ban-account',
        'banrole': 'ban-character',
        'muteuser': 'mute-account',
        'muterole': 'mute-character',
        'onlineusers': 'online-users',
        'setserverforbid': 'server-forbid-control'
    };
    
    // Verificar se é um endpoint da API externa
    const endpoint = req.path.slice(1).split('/')[0];
    const mappedRoute = routeMapping[endpoint];
    
    if (mappedRoute) {
        try {
            // Construir URL da API externa
            let apiPath = req.path.replace(`/${endpoint}`, `/${mappedRoute}`);
            const apiUrl = `http://localhost:3001/api${apiPath}`;
            
            console.log(`Proxy request: ${req.method} ${apiUrl}`);
            
            let response;
            if (req.method === 'GET') {
                response = await fetch(apiUrl);
            } else {
                response = await fetch(apiUrl, {
                    method: req.method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req.body)
                });
            }
            
            // Verificar se a resposta é válida
            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }
            
            const data = await response.json();
            return res.json(data);
        } catch (error) {
            console.error('API Proxy Error:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Erro ao conectar com a API do servidor.' 
            });
        }
    }
    
    next();
});

// Rotas existentes...
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dar gold cash para jogador
app.post('/api/give-gold', async (req, res) => {
    try {
        const { playerId, amount } = req.body;
        const result = await sendPluginCommand("game__PlayerAddGold", [parseInt(playerId), parseInt(amount)]);
        res.json({ success: true, message: `${amount} gold cash enviado para jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao enviar gold cash', error: error.message });
    }
});

// Dar alma para jogador
app.post('/api/give-soul', async (req, res) => {
    try {
        const { playerId, amount } = req.body;
        const result = await sendPluginCommand("game__AddSoulPower", [parseInt(playerId), parseInt(amount)]);
        res.json({ success: true, message: `${amount} alma enviada para jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao enviar alma', error: error.message });
    }
});

// Dar item para jogador
app.post('/api/give-item', async (req, res) => {
    try {
        const { playerId, itemId, quantity } = req.body;
        const result = await sendPluginCommand("game__InvPlayerGiveItem2", [parseInt(playerId), parseInt(itemId), parseInt(quantity)]);
        res.json({ success: true, message: `Item ${itemId} (${quantity}x) enviado para jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao enviar item', error: error.message });
    }
});

// Teleportar jogador
app.post('/api/teleport', async (req, res) => {
    try {
        const { playerId, zone, x, y, z } = req.body;
        const result = await sendPluginCommand("game__PlayerTeleport", [parseInt(playerId), parseInt(zone), parseInt(x), parseInt(y), parseInt(z)]);
        res.json({ success: true, message: `Jogador ${playerId} teleportado para zona ${zone} (${x}, ${y}, ${z})`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao teleportar jogador', error: error.message });
    }
});

// Desconectar jogador
app.post('/api/disconnect-player', async (req, res) => {
    try {
        const { playerId } = req.body;
        const result = await sendPluginCommand("game__PlayerDisconnect", [parseInt(playerId)]);
        res.json({ success: true, message: `Jogador ${playerId} desconectado`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao desconectar jogador', error: error.message });
    }
});

// Remover Gold Cash do jogador
app.post('/api/remove-gold', async (req, res) => {
    try {
        const { playerId, amount } = req.body;
        const result = await sendPluginCommand("game__PlayerRemoveGold", [parseInt(playerId), parseInt(amount)]);
        res.json({ success: true, message: `${amount} Gold Cash removido do jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao remover Gold Cash', error: error.message });
    }
});

// Dar moedas (KKs) para jogador
app.post('/api/give-money', async (req, res) => {
    try {
        const { playerId, amount } = req.body;
        const result = await sendPluginCommand("game__PlayerGiveGold", [parseInt(playerId), parseInt(amount)]);
        res.json({ success: true, message: `${amount} moedas (KKs) enviadas para jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao enviar moedas (KKs)', error: error.message });
    }
});

// Remover moedas (KKs) do jogador
app.post('/api/spend-money', async (req, res) => {
    try {
        const { playerId, amount } = req.body;
        const result = await sendPluginCommand("game__PlayerSpendGold", [parseInt(playerId), parseInt(amount)]);
        res.json({ success: true, message: `${amount} moedas (KKs) removidas do jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao remover moedas (KKs)', error: error.message });
    }
});

// Dar moedas de prata para jogador
app.post('/api/give-silver', async (req, res) => {
    try {
        const { playerId, amount } = req.body;
        const result = await sendPluginCommand("game__PlayerGiveSilver", [parseInt(playerId), parseInt(amount)]);
        res.json({ success: true, message: `${amount} moedas de prata enviadas para jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao enviar moedas de prata', error: error.message });
    }
});

// Remover moedas de prata do jogador
app.post('/api/spend-silver', async (req, res) => {
    try {
        const { playerId, amount } = req.body;
        const result = await sendPluginCommand("game__PlayerSpendSilver", [parseInt(playerId), parseInt(amount)]);
        res.json({ success: true, message: `${amount} moedas de prata removidas do jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao remover moedas de prata', error: error.message });
    }
});

// Dar título ao jogador
app.post('/api/give-title', async (req, res) => {
    try {
        const { playerId, titleId, time } = req.body;
        const result = await sendPluginCommand("game__PlayerObtainTitle", [parseInt(playerId), parseInt(titleId), parseInt(time)]);
        res.json({ success: true, message: `Título ${titleId} dado ao jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao dar título', error: error.message });
    }
});

// Remover título do jogador
app.post('/api/remove-title', async (req, res) => {
    try {
        const { playerId, titleId } = req.body;
        const result = await sendPluginCommand("game__PlayerDeleteTitle", [parseInt(playerId), parseInt(titleId)]);
        res.json({ success: true, message: `Título ${titleId} removido do jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao remover título', error: error.message });
    }
});

// Adicionar VIP ao jogador
app.post('/api/add-vip', async (req, res) => {
    try {
        const { playerId, days } = req.body;
        const result = await sendPluginCommand("game__PlayerAddVip", [parseInt(playerId), parseInt(days)]);
        res.json({ success: true, message: `${days} dias de VIP adicionados ao jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao adicionar VIP', error: error.message });
    }
});

// Matar jogador
app.post('/api/kill-player', async (req, res) => {
    try {
        const { playerId, targetId } = req.body;
        const result = await sendPluginCommand("game__Die", [parseInt(playerId), parseInt(targetId)]);
        res.json({ success: true, message: `Jogador ${playerId} foi morto por ${targetId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao matar jogador', error: error.message });
    }
});

// Entregar missão
app.post('/api/deliver-task', async (req, res) => {
    try {
        const { playerId, taskId } = req.body;
        const result = await sendPluginCommand("game__DeliverTask", [parseInt(playerId), parseInt(taskId)]);
        res.json({ success: true, message: `Missão ${taskId} entregue ao jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao entregar missão', error: error.message });
    }
});

// Criar objeto
app.post('/api/create-object', async (req, res) => {
    try {
        const { type, playerId, objectId, time, count } = req.body;
        const result = await sendPluginCommand("game__CreateObj", [parseInt(type), parseInt(playerId), parseInt(objectId), parseInt(time), parseInt(count)]);
        res.json({ success: true, message: `Objeto ${objectId} criado para jogador ${playerId}`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao criar objeto', error: error.message });
    }
});

// Ativar trigger
app.post('/api/activate-trigger', async (req, res) => {
    try {
        const { triggerId } = req.body;
        const result = await sendPluginCommand("game__ActivateTriggerId", [parseInt(triggerId)]);
        res.json({ success: true, message: `Trigger ${triggerId} ativado`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao ativar trigger', error: error.message });
    }
});

// Desativar trigger
app.post('/api/deactivate-trigger', async (req, res) => {
    try {
        const { triggerId } = req.body;
        const result = await sendPluginCommand("game__DeactivateTriggerId", [parseInt(triggerId)]);
        res.json({ success: true, message: `Trigger ${triggerId} desativado`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao desativar trigger', error: error.message });
    }
});

// Enviar mensagem no chat
app.post('/api/send-chat', async (req, res) => {
    try {
        const { type, playerId, channel, message, shiftPos } = req.body;
        const result = await sendPluginCommand("game__ChatMsg", [parseInt(type), parseInt(playerId), parseInt(channel), message, parseInt(shiftPos)]);
        res.json({ success: true, message: `Mensagem enviada no chat`, result });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao enviar mensagem', error: error.message });
    }
});

// Criar conta de usuário
// Endpoint para criar conta
app.post('/api/create-account', async (req, res) => {
    if (!db) {
        return res.json({ success: false, message: 'Banco de dados não conectado' });
    }

    try {
        const { 
            username, 
            password, 
            email, 
            truename, 
            prompt, 
            answer, 
            gender, 
            qq,
            initialGold
        } = req.body;

        // Verificar se a conta já existe
        const [checkResults] = await db.execute('SELECT name FROM users WHERE name = ?', [username]);
        
        if (checkResults.length > 0) {
            return res.json({ success: false, message: 'Nome de usuário já existe' });
        }

        // Criar hash da senha usando o mesmo método do PHP: base64_encode(md5($login.$pass, true))
        const crypto = require('crypto');
        const hash = crypto.createHash('md5');
        hash.update(username + password, 'utf8');
        const salt = Buffer.from(hash.digest()).toString('base64');

        // Criar nova conta usando a procedure adduser
        const params = [
            username,           // name1
            salt,               // passwd1 (criptografado)
            '0',                // prompt1
            '0',                // answer1
            '0',                // truename1
            '0',                // idnumber1
            email || '',        // email1
            '0',                // mobilenumber1
            '0',                // province1
            '0',                // city1
            '0',                // phonenumber1
            '0',                // address1
            '0',                // postalcode1
            '0',                // gender1
            '',                 // birthday1
            '',                 // qq1
            salt                // passwd21 (mesmo salt)
        ];

        await db.execute('CALL adduser(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', params);
        
        // Se foi especificado ouro inicial, adicionar após criar a conta
        if (initialGold && initialGold > 0) {
            try {
                // Buscar ID da conta recém-criada
                const [userResult] = await db.execute('SELECT ID FROM users WHERE name = ?', [username]);
                
                if (userResult.length > 0) {
                    const userId = userResult[0].ID;
                    
                    // Multiplicar ouro por 100 (como moedas do jogo)
                    const goldAmount = initialGold * 100;
                    
                    // Usar procedure usecash para adicionar ouro
                    await db.execute('CALL usecash(?, 1, 0, 1, 0, ?, 1, @error)', [userId, goldAmount]);
                    
                    res.json({ 
                        success: true, 
                        message: `Conta '${username}' criada com sucesso! ${initialGold} ouro (${goldAmount} moedas) adicionado.` 
                    });
                } else {
                    res.json({ 
                        success: true, 
                        message: `Conta '${username}' criada com sucesso! (Erro ao adicionar ouro)` 
                    });
                }
            } catch (goldError) {
                res.json({ 
                    success: true, 
                    message: `Conta '${username}' criada com sucesso! (Erro ao adicionar ouro: ${goldError.message})` 
                });
            }
        } else {
            res.json({ 
                success: true, 
                message: `Conta '${username}' criada com sucesso!` 
            });
        }

    } catch (error) {
        res.json({ success: false, message: 'Erro ao criar conta', error: error.message });
    }
});

// Listar contas
app.get('/api/list-accounts', async (req, res) => {
    if (!db) {
        return res.json({ success: false, message: 'Banco de dados não conectado' });
    }

    try {
        const [results] = await db.execute('SELECT ID, name, email, truename, creatime, gender FROM users ORDER BY creatime DESC LIMIT 50');
        res.json({ success: true, accounts: results });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao listar contas', error: error.message });
    }
});

// Buscar dados de uma conta específica
app.get('/api/account/:id', async (req, res) => {
    if (!db) {
        return res.json({ success: false, message: 'Banco de dados não conectado' });
    }

    try {
        const { id } = req.params;
        const [results] = await db.execute('SELECT ID, name, email, truename, gender FROM users WHERE ID = ?', [id]);
        
        if (results.length === 0) {
            return res.json({ success: false, message: 'Conta não encontrada' });
        }
        
        res.json({ success: true, account: results[0] });
    } catch (error) {
        res.json({ success: false, message: 'Erro ao buscar conta', error: error.message });
    }
});

// Editar conta
app.put('/api/account/:id', async (req, res) => {
    if (!db) {
        return res.json({ success: false, message: 'Banco de dados não conectado' });
    }

    try {
        const { id } = req.params;
        const { email, truename, gender, newPassword } = req.body;

        // Verificar se a conta existe
        const [checkResults] = await db.execute('SELECT name FROM users WHERE ID = ?', [id]);
        
        if (checkResults.length === 0) {
            return res.json({ success: false, message: 'Conta não encontrada' });
        }

        const username = checkResults[0].name;

        // Atualizar dados básicos
        await db.execute(
            'UPDATE users SET email = ?, truename = ?, gender = ? WHERE ID = ?', 
            [email || '', truename || '', gender || 0, id]
        );

        // Se foi especificada nova senha, atualizar
        if (newPassword && newPassword.trim() !== '') {
            const crypto = require('crypto');
            const hash = crypto.createHash('md5');
            hash.update(username + newPassword, 'utf8');
            const salt = Buffer.from(hash.digest()).toString('base64');

            await db.execute(
                'UPDATE users SET passwd = ?, passwd2 = ? WHERE ID = ?', 
                [salt, salt, id]
            );
        }

        res.json({ 
            success: true, 
            message: `Conta '${username}' atualizada com sucesso!` 
        });

    } catch (error) {
        res.json({ success: false, message: 'Erro ao atualizar conta', error: error.message });
    }
});

// Deletar conta
app.delete('/api/account/:id', async (req, res) => {
    if (!db) {
        return res.json({ success: false, message: 'Banco de dados não conectado' });
    }

    try {
        const { id } = req.params;
        
        // Verificar se a conta existe
        const [checkResults] = await db.execute('SELECT name FROM users WHERE ID = ?', [id]);
        
        if (checkResults.length === 0) {
            return res.json({ success: false, message: 'Conta não encontrada' });
        }

        const username = checkResults[0].name;

        // Deletar conta
        await db.execute('DELETE FROM users WHERE ID = ?', [id]);

        res.json({ 
            success: true, 
            message: `Conta '${username}' deletada com sucesso!` 
        });

    } catch (error) {
        res.json({ success: false, message: 'Erro ao deletar conta', error: error.message });
    }
});

// Verificar conexão com banco
app.get('/api/db-status', async (req, res) => {
    if (!db) {
        return res.json({ success: false, message: 'Banco de dados não conectado' });
    }

    try {
        await db.ping();
        res.json({ success: true, message: 'Conexão com banco ativa' });
    } catch (error) {
        res.json({ success: false, message: 'Erro de conexão com banco', error: error.message });
    }
});

// Socket.io para atualizações em tempo real
io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
    console.log(`🚀 Painel Administrativo PW rodando em http://localhost:${PORT}`);
    console.log(`📡 Conectando ao plugin na porta 9020`);
    
    // Inicializar conexão com banco de dados
    await initDatabase();
});
