// Conectar ao Socket
const socket = io();

// Elementos DOM
const sidebarItems = document.querySelectorAll('.sidebar-menu li');
const tabContents = document.querySelectorAll('.tab-content');
const pageTitle = document.querySelector('.page-title');

// Navegação entre abas
function showTab(tabName) {
    // Remover classe active de todas as abas
    tabContents.forEach(tab => tab.classList.remove('active'));
    sidebarItems.forEach(item => item.classList.remove('active'));
    
    // Remover classe active de todos os itens do dropdown
    document.querySelectorAll('.dropdown-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Adicionar classe active à aba selecionada
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Adicionar classe active ao item selecionado (pode ser no menu principal ou dropdown)
    const selectedItem = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // Atualizar título da página
    const titles = {
        'dashboard': 'Dashboard',
        'players': 'Gerenciar Jogadores',
        'items': 'Gerenciar Itens',
        'teleport': 'Teleporte',
        'titles': 'Gerenciar Títulos',
        'vip': 'Sistema VIP',
        'objects': 'Criar Npcs',
        'chat': 'Sistema de Chat',
        'playerinfo': 'Info Personagem',
        'moderation': 'Moderação',
        'onlineplayers': 'Jogadores Online',
        'server': 'Servidor',
        'admin': 'Ferramentas Admin',
        'logs': 'Logs do Sistema'
    };
    pageTitle.textContent = titles[tabName] || 'Dashboard';
    
    // Carregar dados específicos para certas abas
    if (tabName === 'onlineplayers') {
        loadOnlinePlayers();
    }
}


// Event listeners para navegação
sidebarItems.forEach(item => {
    // Não adicionar evento click para itens dropdown
    if (!item.classList.contains('dropdown-item')) {
        item.addEventListener('click', () => {
            const tabName = item.getAttribute('data-tab');
            if (tabName) {
                showTab(tabName);
            }
        });
    }
});

// Função para inicializar o dropdown
function initializeDropdown() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    
    if (dropdownToggle) {
        // Remover qualquer listener existente
        dropdownToggle.removeEventListener('click', handleDropdownClick);
        // Adicionar o novo listener
        dropdownToggle.addEventListener('click', handleDropdownClick);
        console.log('Dropdown inicializado com sucesso');
    } else {
        console.error('Dropdown toggle não encontrado!');
    }
}

// Função separada para lidar com o clique
function handleDropdownClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const dropdownItem = e.target.closest('.dropdown-item');
    
    if (dropdownItem) {
        const isOpen = dropdownItem.classList.contains('open');
        
        // Fechar todos os dropdowns primeiro
        document.querySelectorAll('.dropdown-item.open').forEach(item => {
            item.classList.remove('open');
        });
        
        // Se não estava aberto, abrir este
        if (!isOpen) {
            dropdownItem.classList.add('open');
        }
    }
}

// Função para configurar os itens do dropdown
function setupDropdownMenuItems() {
    const dropdownMenuItems = document.querySelectorAll('.dropdown-menu li[data-tab]');
    dropdownMenuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const tabName = item.getAttribute('data-tab');
            if (tabName) {
                showTab(tabName);
                
                // Remover classe active de todos os itens do dropdown
                dropdownMenuItems.forEach(menuItem => {
                    menuItem.classList.remove('active');
                });
                
                // Adicionar classe active ao item clicado
                item.classList.add('active');
                
                // Fechar o dropdown
                const dropdownItem = item.closest('.dropdown-item');
                if (dropdownItem) {
                    dropdownItem.classList.remove('open');
                }
            }
        });
    });
    
    // Fechar dropdown ao clicar fora - com delay para evitar conflitos
    document.addEventListener('click', (e) => {
        // Não fechar se o clique foi dentro do dropdown
        if (!e.target.closest('.dropdown-item') && !e.target.closest('.dropdown-toggle')) {
            setTimeout(() => {
                document.querySelectorAll('.dropdown-item.open').forEach(item => {
                    item.classList.remove('open');
                });
            }, 10);
        }
    });
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    document.getElementById('notificationContainer').appendChild(notification);
    
    // Remover notificação após 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Update dashboard stats
function updateDashboardStats() {
    // Esta função pode ser implementada para atualizar as estatísticas
    console.log('Dashboard stats updated');
}

// Atualizar stats a cada 30 segundos
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado - sem validação de coordenadas');
    
    // Garantir que não há validação de coordenadas
    setTimeout(() => {
        // Remover qualquer classe de erro dos inputs
        ['x', 'y', 'z'].forEach(axis => {
            const input = document.getElementById(axis);
            if (input) {
                input.classList.remove('coordinate-invalid', 'coordinate-valid');
                // Remover qualquer listener de validação
                input.removeEventListener('input', () => {});
                input.removeEventListener('blur', () => {});
            }
        });
    }, 100);
    
    updateDashboardStats();
    setInterval(updateDashboardStats, 30000);
    
    // Aguardar um pouco antes de inicializar o dropdown
    setTimeout(() => {
        console.log('Inicializando dropdown');
        initializeDropdown();
        setupDropdownMenuItems();
    }, 500);
});


// Adicionar log
function addLog(message, type = 'info') {
    const logContainer = document.getElementById('logContainer');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    
    const now = new Date();
    const time = now.toLocaleTimeString('pt-BR');
    
    logEntry.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-message">${message}</span>
    `;
    
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    
    // Manter apenas os últimos 50 logs
    const logs = logContainer.querySelectorAll('.log-entry');
    if (logs.length > 50) {
        logs[logs.length - 1].remove();
    }
}

// Funções para API
async function sendApiRequest(endpoint, data) {
    try {
        const response = await fetch(`/api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        return { success: false, message: 'Erro de conexão', error: error.message };
    }
}

// Form handlers
document.getElementById('goldForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        amount: formData.get('amount')
    };
    
    const result = await sendApiRequest('give-gold', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Gold Cash enviado: ${data.amount} para jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao enviar gold cash: ${result.message}`, 'error');
    }
});

document.getElementById('soulForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        amount: formData.get('amount')
    };
    
    const result = await sendApiRequest('give-soul', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Alma enviada: ${data.amount} para jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao enviar alma: ${result.message}`, 'error');
    }
});

document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        itemId: formData.get('itemId'),
        quantity: formData.get('quantity')
    };
    
    const result = await sendApiRequest('give-item', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Item enviado: ${data.itemId} (${data.quantity}x) para jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao enviar item: ${result.message}`, 'error');
    }
});

document.getElementById('teleportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        zone: formData.get('zone'),
        x: formData.get('x'),
        y: formData.get('y'),
        z: formData.get('z')
    };
    
    const result = await sendApiRequest('teleport', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Teleporte: Jogador ${data.playerId} para zona ${data.zone} (${data.x}, ${data.y}, ${data.z})`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao teleportar: ${result.message}`, 'error');
    }
});

// Remove Gold Form
document.getElementById('removeGoldForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        amount: formData.get('amount')
    };
    
    const result = await sendApiRequest('remove-gold', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Gold Cash removido: ${data.amount} do jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao remover gold cash: ${result.message}`, 'error');
    }
});

// Money Form (Give KKs)
document.getElementById('moneyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        amount: formData.get('amount')
    };
    
    const result = await sendApiRequest('give-money', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Moedas enviadas: ${data.amount} KKs para jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao enviar moedas: ${result.message}`, 'error');
    }
});

// Spend Money Form (Remove KKs)
document.getElementById('spendMoneyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        amount: formData.get('amount')
    };
    
    const result = await sendApiRequest('spend-money', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Moedas removidas: ${data.amount} KKs do jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao remover moedas: ${result.message}`, 'error');
    }
});

// Silver Form (Give Silver)
document.getElementById('silverForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        amount: formData.get('amount')
    };
    
    const result = await sendApiRequest('give-silver', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Prata enviada: ${data.amount} moedas de prata para jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao enviar prata: ${result.message}`, 'error');
    }
});

// Spend Silver Form (Remove Silver)
document.getElementById('spendSilverForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        amount: formData.get('amount')
    };
    
    const result = await sendApiRequest('spend-silver', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Prata removida: ${data.amount} moedas de prata do jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao remover prata: ${result.message}`, 'error');
    }
});

// Disconnect Player Form
document.getElementById('disconnectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId')
    };
    
    const result = await sendApiRequest('disconnect-player', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Jogador ${data.playerId} desconectado`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao desconectar jogador: ${result.message}`, 'error');
    }
});

// Title Form
document.getElementById('titleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        titleId: formData.get('titleId'),
        time: formData.get('time')
    };
    
    const result = await sendApiRequest('give-title', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Título ${data.titleId} dado ao jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao dar título: ${result.message}`, 'error');
    }
});

// Remove Title Form
document.getElementById('removeTitleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        titleId: formData.get('titleId')
    };
    
    const result = await sendApiRequest('remove-title', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Título ${data.titleId} removido do jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao remover título: ${result.message}`, 'error');
    }
});

// VIP Form
document.getElementById('vipForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        days: formData.get('days')
    };
    
    const result = await sendApiRequest('add-vip', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`${data.days} dias de VIP adicionados ao jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao adicionar VIP: ${result.message}`, 'error');
    }
});

// Object Form
document.getElementById('objectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        type: formData.get('type'),
        playerId: formData.get('playerId'),
        objectId: formData.get('objectId'),
        time: formData.get('time'),
        count: formData.get('count')
    };
    
    const result = await sendApiRequest('create-object', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Npc/Mob/Mine ${data.objectId} criado para jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao criar Npc/Mob/Mine: ${result.message}`, 'error');
    }
});

// Task Form
document.getElementById('taskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        taskId: formData.get('taskId')
    };
    
    const result = await sendApiRequest('deliver-task', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Missão ${data.taskId} entregue ao jogador ${data.playerId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao entregar missão: ${result.message}`, 'error');
    }
});

// Chat Form
document.getElementById('chatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        type: formData.get('type'),
        playerId: formData.get('playerId'),
        channel: formData.get('channel'),
        message: formData.get('message'),
        shiftPos: 0
    };
    
    const result = await sendApiRequest('send-chat', data);
    
    if (result.success) {
        showNotification('Mensagem enviada com sucesso', 'success');
        addLog(`Mensagem enviada no chat: "${data.message}"`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao enviar mensagem: ${result.message}`, 'error');
    }
});

// Kill Player Form
document.getElementById('killForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        playerId: formData.get('playerId'),
        targetId: formData.get('targetId')
    };
    
    const result = await sendApiRequest('kill-player', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Jogador ${data.playerId} foi morto por ${data.targetId}`, 'success');
        e.target.reset();
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao matar jogador: ${result.message}`, 'error');
    }
});

// Função para definir item preset
function setItem(itemId) {
    document.getElementById('itemId').value = itemId;
    showTab('items');
    showNotification(`Item ID ${itemId} selecionado`, 'info');
}

// Função para definir localização preset
function setLocation(zone, x, y, z) {
    document.getElementById('zone').value = zone;
    document.getElementById('x').value = x;
    document.getElementById('y').value = y;
    document.getElementById('z').value = z;
    
    // Disparar validação para cada coordenada
    ['x', 'y', 'z'].forEach(axis => {
        const input = document.getElementById(axis);
        if (input) {
            input.dispatchEvent(new Event('input'));
        }
    });
    
    showNotification(`Localização definida: Zona ${zone} (${x}, ${y}, ${z})`, 'info');
}

// Função para definir dias VIP preset
function setVipDays(days) {
    document.getElementById('vipDays').value = days;
    showNotification(`${days} dias de VIP selecionados`, 'info');
}

// Funções para triggers
async function activateTrigger() {
    const triggerId = document.getElementById('triggerId').value;
    if (!triggerId) {
        showNotification('Digite o ID do trigger', 'error');
        return;
    }
    
    const result = await sendApiRequest('activate-trigger', { triggerId });
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Trigger ${triggerId} ativado`, 'success');
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao ativar trigger: ${result.message}`, 'error');
    }
}

async function deactivateTrigger() {
    const triggerId = document.getElementById('triggerId').value;
    if (!triggerId) {
        showNotification('Digite o ID do trigger', 'error');
        return;
    }
    
    const result = await sendApiRequest('deactivate-trigger', { triggerId });
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Trigger ${triggerId} desativado`, 'success');
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao desativar trigger: ${result.message}`, 'error');
    }
}

// Atualizar estatísticas (simulado)
function updateStats() {
    // Aqui você pode implementar a lógica real para buscar dados do servidor
    const stats = {
        playersOnline: Math.floor(Math.random() * 200) + 50,
        uptime: '24h 15m',
        totalGold: '1.2M',
        totalMoney: Math.floor(Math.random() * 100) + 800 + 'K',
        totalSilver: Math.floor(Math.random() * 100) + 400 + 'K',
        itemsCreated: Math.floor(Math.random() * 100) + 400,
        totalSoul: Math.floor(Math.random() * 50) + 30 + 'K'
    };
    
    // Atualizar elementos se existirem
    const elements = document.querySelectorAll('.stat-number');
    if (elements.length >= 7) {
        // Buscar número real de jogadores online da API
        fetch('/api/onlineusers')
            .then(response => response.json())
            .then(data => {
            if (data.success && Array.isArray(data.users)) {
                elements[0].textContent = data.users.length;
            } else {
                elements[0].textContent = '0';
            }
            })
            .catch(() => {
            elements[0].textContent = '0';
            });
        elements[1].textContent = stats.uptime;
        elements[2].textContent = stats.totalGold;
        elements[3].textContent = stats.totalMoney;
        elements[4].textContent = stats.totalSilver;
        elements[5].textContent = stats.itemsCreated;
        elements[6].textContent = stats.totalSoul;
    }
}

// Conexão Socket.IO
socket.on('connect', () => {
    console.log('Conectado ao servidor');
    showNotification('Conectado ao servidor', 'success');
    addLog('Conectado ao painel administrativo', 'success');
});

socket.on('disconnect', () => {
    console.log('Desconectado do servidor');
    showNotification('Desconectado do servidor', 'error');
    addLog('Desconectado do servidor', 'error');
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Atualizar estatísticas a cada 30 segundos
    updateStats();
    setInterval(updateStats, 30000);
    
    // Verificar status do banco de dados
    checkDbStatus();
    
    // Carregar contas existentes
    loadAccounts();
    
    // Log inicial
    addLog('Painel administrativo iniciado', 'success');
});

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                showTab('dashboard');
                break;
            case '2':
                e.preventDefault();
                showTab('players');
                break;
            case '3':
                e.preventDefault();
                showTab('items');
                break;
            case '4':
                e.preventDefault();
                showTab('teleport');
                break;
            case '5':
                e.preventDefault();
                showTab('titles');
                break;
            case '6':
                e.preventDefault();
                showTab('vip');
                break;
            case '7':
                e.preventDefault();
                showTab('objects');
                break;
            case '8':
                e.preventDefault();
                showTab('chat');
                break;
            case '9':
                e.preventDefault();
                showTab('accounts');
                break;
            case '0':
                e.preventDefault();
                showTab('admin');
                break;
        }
    }
});

// Funções para criação de contas
document.getElementById('createAccountForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const initialGold = formData.get('initialGold');
    
    const data = {
        username: formData.get('username'),
        password: formData.get('password'), // Senha sem encode - será criptografada no backend
        email: formData.get('email'),
        truename: formData.get('truename'),
        gender: formData.get('gender'),
        initialGold: initialGold && initialGold !== '' ? parseInt(initialGold) : 0
    };
    
    const result = await sendApiRequest('create-account', data);
    
    if (result.success) {
        showNotification(result.message, 'success');
        addLog(`Conta criada: ${data.username}${data.initialGold > 0 ? ` (${data.initialGold} ouro)` : ''}`, 'success');
        e.target.reset();
        loadAccounts(); // Recarregar lista de contas
    } else {
        showNotification(result.message, 'error');
        addLog(`Erro ao criar conta: ${result.message}`, 'error');
    }
});

// Gerador de senha
function generatePassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Função para mostrar feedback visual temporário
function showPasswordGenerated(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Gerada!';
    button.style.backgroundColor = '#10b981';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = '';
    }, 1500);
}

// Event listeners para geradores de senha
document.addEventListener('DOMContentLoaded', () => {
    // Gerador de senha para criação
    const generateBtn = document.getElementById('generatePassword');
    const passwordField = document.getElementById('password');
    
    if (generateBtn && passwordField) {
        generateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const newPassword = generatePassword();
            passwordField.value = newPassword;
            
            // Disparar evento de input para garantir que o valor seja reconhecido
            passwordField.dispatchEvent(new Event('input', { bubbles: true }));
            passwordField.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Mostrar feedback visual
            showPasswordGenerated(generateBtn);
            
            // Focar no campo para mostrar que foi atualizado
            passwordField.focus();
            setTimeout(() => passwordField.select(), 100);
        });
    }
    
    // Gerador de senha para edição
    const generateEditBtn = document.getElementById('generateEditPassword');
    const editPasswordField = document.getElementById('editNewPassword');
    
    if (generateEditBtn && editPasswordField) {
        generateEditBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const newPassword = generatePassword();
            editPasswordField.value = newPassword;
            
            // Disparar evento de input para garantir que o valor seja reconhecido
            editPasswordField.dispatchEvent(new Event('input', { bubbles: true }));
            editPasswordField.dispatchEvent(new Event('change', { bubbles: true }));
            
            // Mostrar feedback visual
            showPasswordGenerated(generateEditBtn);
            
            // Focar no campo para mostrar que foi atualizado
            editPasswordField.focus();
            setTimeout(() => editPasswordField.select(), 100);
        });
    }
});

// Verificar status do banco de dados
async function checkDbStatus() {
    try {
        const response = await fetch('/api/db-status');
        const result = await response.json();
        
        const statusContainer = document.getElementById('dbStatus');
        const statusIcon = result.success ? 'online' : 'offline';
        const statusColor = result.success ? '#22c55e' : '#ef4444';
        
        statusContainer.innerHTML = `
            <div class="status-item">
                <i class="fas fa-circle ${statusIcon}" style="color: ${statusColor}"></i>
                <span>${result.message}</span>
            </div>
        `;
        
        if (result.success) {
            showNotification('Banco de dados conectado', 'success');
        } else {
            showNotification('Erro de conexão com banco', 'error');
        }
    } catch (error) {
        showNotification('Erro ao verificar banco', 'error');
    }
}

// Variável global para armazenar todas as contas
let allAccounts = [];

// Função de busca/filtro
function filterAccounts() {
    const searchTerm = document.getElementById('accountSearch').value.toLowerCase().trim();
    const accountItems = document.querySelectorAll('.account-item');
    const searchStats = document.getElementById('searchStats');
    const searchResultsCount = document.getElementById('searchResultsCount');
    
    let visibleCount = 0;
    
    accountItems.forEach(item => {
        const accountName = item.querySelector('.account-name')?.textContent.toLowerCase() || '';
        const accountDetails = item.querySelector('.account-details')?.textContent.toLowerCase() || '';
        const accountId = item.querySelector('.account-id')?.textContent.toLowerCase() || '';
        
        const matchesSearch = searchTerm === '' || 
                            accountName.includes(searchTerm) || 
                            accountDetails.includes(searchTerm) || 
                            accountId.includes(searchTerm);
        
        if (matchesSearch) {
            item.classList.remove('hidden');
            item.classList.add('highlight');
            visibleCount++;
            
            // Remover highlight após um tempo se não há busca ativa
            if (searchTerm === '') {
                setTimeout(() => item.classList.remove('highlight'), 500);
            }
        } else {
            item.classList.add('hidden');
            item.classList.remove('highlight');
        }
    });
    
    // Mostrar estatísticas de busca
    if (searchTerm !== '') {
        searchStats.style.display = 'block';
        searchResultsCount.textContent = `${visibleCount} conta(s) encontrada(s) para "${searchTerm}"`;
    } else {
        searchStats.style.display = 'none';
    }
}

// Limpar busca
function clearSearch() {
    document.getElementById('accountSearch').value = '';
    filterAccounts();
    document.getElementById('accountSearch').focus();
}

// Configurar busca em tempo real
function setupAccountSearch() {
    const searchInput = document.getElementById('accountSearch');
    
    if (searchInput) {
        // Remover listeners anteriores se existirem
        searchInput.removeEventListener('input', filterAccounts);
        searchInput.removeEventListener('keyup', filterAccounts);
        
        // Adicionar listeners para busca em tempo real
        searchInput.addEventListener('input', filterAccounts);
        searchInput.addEventListener('keyup', filterAccounts);
        
        // Atalho ESC para limpar busca
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                clearSearch();
            }
        });
    }
}

// Carregar lista de contas
async function loadAccounts() {
    try {
        const response = await fetch('/api/list-accounts');
        const result = await response.json();
        
        const accountsList = document.getElementById('accountsList');
        
        if (result.success && result.accounts.length > 0) {
            // Armazenar contas globalmente para busca
            allAccounts = result.accounts;
            
            accountsList.innerHTML = result.accounts.map(account => `
                <div class="account-item" data-account-id="${account.ID}" data-account-name="${account.name}" data-account-email="${account.email || ''}" data-account-truename="${account.truename || ''}">
                    <div class="account-info">
                        <div class="account-name">${account.name}</div>
                        <div class="account-details">
                            ${account.truename ? account.truename + ' • ' : ''}
                            ${account.email || 'Sem email'}
                        </div>
                    </div>
                    <div class="account-meta">
                        <span class="account-id">ID: ${account.ID}</span>
                        <span>${new Date(account.creatime).toLocaleDateString('pt-BR')}</span>
                        <span>${account.gender === 1 ? '♂' : account.gender === 2 ? '♀' : '○'}</span>
                        <button class="btn btn-sm btn-info" onclick="editAccount(${account.ID})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                    </div>
                </div>
            `).join('');
            
            // Configurar busca em tempo real
            setupAccountSearch();
            
            addLog(`${result.accounts.length} contas carregadas`, 'info');
        } else {
            accountsList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #94a3b8;">
                    <i class="fas fa-users" style="font-size: 24px; margin-bottom: 8px;"></i>
                    <p>Nenhuma conta encontrada</p>
                </div>
            `;
        }
    } catch (error) {
        showNotification('Erro ao carregar contas', 'error');
        addLog(`Erro ao carregar contas: ${error.message}`, 'error');
    }
}

// Editar conta
async function editAccount(accountId) {
    try {
        const response = await fetch(`/api/account/${accountId}`);
        const result = await response.json();
        
        if (result.success) {
            const account = result.account;
            
            // Preencher modal com dados da conta
            document.getElementById('editAccountId').value = account.ID;
            document.getElementById('editUsername').value = account.name;
            document.getElementById('editEmail').value = account.email || '';
            document.getElementById('editTruename').value = account.truename || '';
            document.getElementById('editGender').value = account.gender || 0;
            document.getElementById('editNewPassword').value = '';
            
            // Mostrar modal
            document.getElementById('editAccountModal').style.display = 'block';
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        showNotification('Erro ao carregar dados da conta', 'error');
    }
}

// Fechar modal de edição
function closeEditModal() {
    document.getElementById('editAccountModal').style.display = 'none';
}

// Salvar alterações da conta
document.getElementById('editAccountForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const accountId = document.getElementById('editAccountId').value;
    const formData = new FormData(e.target);
    
    const data = {
        email: formData.get('email'),
        truename: formData.get('truename'),
        gender: formData.get('gender'),
        newPassword: formData.get('newPassword')
    };
    
    try {
        const response = await fetch(`/api/account/${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            addLog(`Conta atualizada: ${document.getElementById('editUsername').value}`, 'success');
            closeEditModal();
            loadAccounts(); // Recarregar lista
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        showNotification('Erro ao atualizar conta', 'error');
    }
});

// Deletar conta
async function deleteAccount() {
    const accountId = document.getElementById('editAccountId').value;
    const username = document.getElementById('editUsername').value;
    
    if (!confirm(`Tem certeza que deseja deletar a conta '${username}'? Esta ação não pode ser desfeita.`)) {
        return;
    }
    
    try {
        const response = await fetch(`/api/account/${accountId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(result.message, 'success');
            addLog(`Conta deletada: ${username}`, 'warning');
            closeEditModal();
            loadAccounts(); // Recarregar lista
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        showNotification('Erro ao deletar conta', 'error');
    }
}

// Fechar modal clicando fora dele
window.addEventListener('click', (e) => {
    const modal = document.getElementById('editAccountModal');
    if (e.target === modal) {
        closeEditModal();
    }
});

// Validação de coordenadas removida - sem limites
// Aceita qualquer valor numérico

// Funções para seletor de jogadores online no chat
let chatOnlineUsers = [];
let currentPage = 1;
let playersPerPage = 20;
let filteredUsers = [];

function loadOnlinePlayersForChat() {
    const selector = document.getElementById('chatOnlinePlayersSelector');
    const list = document.getElementById('chatOnlinePlayersList');
    const count = document.getElementById('chatOnlineCount');
    const searchInput = document.getElementById('chatPlayerSearch');
    const perPageSelect = document.getElementById('playersPerPage');
    
    // Mostrar o seletor
    selector.style.display = 'block';
    
    // Limpar busca anterior
    searchInput.value = '';
    currentPage = 1;
    playersPerPage = parseInt(perPageSelect.value) || 20;
    
    // Mostrar loading
    list.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Carregando jogadores online...</span>
        </div>
    `;
    
    // Esconder controles de paginação
    document.getElementById('paginationControls').style.display = 'none';
    document.getElementById('paginationInfo').style.display = 'none';
    
    // Buscar jogadores online
    fetch('/api/onlineusers')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.users && data.users.length > 0) {
                // Ordenar jogadores por nome
                data.users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
                
                chatOnlineUsers = data.users;
                filteredUsers = [...data.users];
                
                count.textContent = `${data.users.length} jogadores`;
                
                displayChatPlayersWithPagination();
                setupChatPlayerSearch();
                setupPlayersPerPageChange();
            } else {
                count.textContent = '0 jogadores';
                list.innerHTML = `
                    <div style="text-align: center; padding: 20px; color: #94a3b8;">
                        <i class="fas fa-users" style="font-size: 24px; margin-bottom: 8px;"></i>
                        <p>Nenhum jogador online no momento</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            count.textContent = 'Erro';
            list.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 8px;"></i>
                    <p>Erro ao carregar jogadores online</p>
                </div>
            `;
        });
}

function displayChatPlayersWithPagination() {
    const totalPlayers = filteredUsers.length;
    const totalPages = Math.ceil(totalPlayers / playersPerPage);
    const startIndex = (currentPage - 1) * playersPerPage;
    const endIndex = Math.min(startIndex + playersPerPage, totalPlayers);
    const playersToShow = filteredUsers.slice(startIndex, endIndex);
    
    // Atualizar informações de paginação
    updatePaginationInfo(totalPlayers, totalPages);
    
    // Exibir jogadores da página atual
    displayChatOnlinePlayersList(playersToShow);
    
    // Mostrar/esconder controles de paginação
    const paginationControls = document.getElementById('paginationControls');
    if (totalPages > 1) {
        paginationControls.style.display = 'flex';
        updatePaginationControls(totalPages);
    } else {
        paginationControls.style.display = 'none';
    }
}

function updatePaginationInfo(totalPlayers, totalPages) {
    const paginationInfo = document.getElementById('paginationInfo');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    
    if (totalPages > 1) {
        paginationInfo.style.display = 'block';
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;
    } else {
        paginationInfo.style.display = 'none';
    }
}

function updatePaginationControls(totalPages) {
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageNumbers = document.getElementById('pageNumbers');
    
    // Atualizar botões anterior/próximo
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Gerar números de página
    let pageNumbersHtml = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar se não temos páginas suficientes no início
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Primeira página se não está visível
    if (startPage > 1) {
        pageNumbersHtml += `<span class="page-number" onclick="goToPage(1)">1</span>`;
        if (startPage > 2) {
            pageNumbersHtml += `<span class="page-number disabled">...</span>`;
        }
    }
    
    // Páginas visíveis
    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        pageNumbersHtml += `<span class="page-number ${activeClass}" onclick="goToPage(${i})">${i}</span>`;
    }
    
    // Última página se não está visível
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbersHtml += `<span class="page-number disabled">...</span>`;
        }
        pageNumbersHtml += `<span class="page-number" onclick="goToPage(${totalPages})">${totalPages}</span>`;
    }
    
    pageNumbers.innerHTML = pageNumbersHtml;
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredUsers.length / playersPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayChatPlayersWithPagination();
    }
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredUsers.length / playersPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayChatPlayersWithPagination();
    }
}

function setupPlayersPerPageChange() {
    const perPageSelect = document.getElementById('playersPerPage');
    
    perPageSelect.removeEventListener('change', handlePlayersPerPageChange);
    perPageSelect.addEventListener('change', handlePlayersPerPageChange);
}

function handlePlayersPerPageChange() {
    const perPageSelect = document.getElementById('playersPerPage');
    playersPerPage = parseInt(perPageSelect.value) || 20;
    currentPage = 1; // Resetar para primeira página
    displayChatPlayersWithPagination();
}

function setupChatPlayerSearch() {
    const searchInput = document.getElementById('chatPlayerSearch');
    
    if (searchInput) {
        // Remover listeners anteriores
        searchInput.removeEventListener('input', filterChatPlayers);
        
        // Adicionar novo listener
        searchInput.addEventListener('input', filterChatPlayers);
    }
}

function filterChatPlayers() {
    const searchTerm = document.getElementById('chatPlayerSearch').value.toLowerCase().trim();
    const count = document.getElementById('chatOnlineCount');
    
    if (searchTerm === '') {
        filteredUsers = [...chatOnlineUsers];
    } else {
        filteredUsers = chatOnlineUsers.filter(user => {
            const name = (user.name || '').toLowerCase();
            const roleId = (user.roleid || user.userid || '').toString();
            
            return name.includes(searchTerm) || roleId.includes(searchTerm);
        });
    }
    
    // Resetar para primeira página após busca
    currentPage = 1;
    
    // Atualizar contador
    if (searchTerm === '') {
        count.textContent = `${chatOnlineUsers.length} jogadores`;
    } else {
        count.textContent = `${filteredUsers.length} de ${chatOnlineUsers.length} jogadores`;
    }
    
    // Atualizar exibição com paginação
    displayChatPlayersWithPagination();
}

function closeChatPlayerSelector() {
    document.getElementById('chatOnlinePlayersSelector').style.display = 'none';
}

function displayChatOnlinePlayersList(users) {
    const list = document.getElementById('chatOnlinePlayersList');
    
    if (users.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #94a3b8;">
                <i class="fas fa-users" style="font-size: 24px; margin-bottom: 8px;"></i>
                <p>Nenhum jogador encontrado</p>
            </div>
        `;
        return;
    }
    
    // Ordenar jogadores por nome
    users.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    
    let html = '';
    users.forEach(user => {
        const roleId = user.roleid || user.userid || 'N/A';
        const userName = user.name || 'Nome não disponível';
        const userStatus = user.status || 'Online';
        
        // Escapar caracteres especiais para uso em HTML
        const safeUserName = userName.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
        
        html += `
            <div class="chat-player-item" onclick="selectChatPlayer(${roleId}, '${safeUserName}')">
                <div class="chat-player-info">
                    <div class="chat-player-name">${userName}</div>
                    <div class="chat-player-meta">
                        Role ID: ${roleId} • Status: ${userStatus}
                    </div>
                </div>
                <button class="chat-player-select" onclick="event.stopPropagation(); selectChatPlayer(${roleId}, '${safeUserName}')">
                    <i class="fas fa-check"></i> Selecionar
                </button>
            </div>
        `;
    });
    
    list.innerHTML = html;
}

function selectChatPlayer(roleId, playerName) {
    // Preencher o campo ID do jogador
    document.getElementById('chatPlayerId').value = roleId;
    
    // Esconder o seletor
    document.getElementById('chatOnlinePlayersSelector').style.display = 'none';
    
    // Mostrar notificação
    showNotification(`Jogador selecionado: ${playerName} (ID: ${roleId})`, 'success');
    
    // Focar no campo de mensagem
    setTimeout(() => {
        document.getElementById('chatMessage').focus();
    }, 100);
}

// Player Info functions

// Sistema de Eventos Simplificado
let activeTimers = {};
let eventCounter = 0;

// Variáveis do Event Builder
let currentEventStep = 1;
let currentEventData = {};
let isEditingEvent = false;
let editingEventId = null;

// Adicionar estatísticas de eventos
if (!window.eventStats) {
    window.eventStats = {};
}

// Funções para executar ações dos eventos usando as APIs existentes
async function executeEventAction(action) {
    try {
        switch(action.type) {
            case 'send_chat':
                // Usar a mesma estrutura do chat que já funciona
                return await sendApiRequest('send-chat', {
                    type: action.chatType || '2', // CHAT_WORLD por padrão
                    playerId: action.playerId || 32, // ID padrão para global
                    channel: action.channel || 15, // Canal para Avisos da Administração
                    message: action.message || 'Mensagem do evento',
                    shiftPos: 0
                });
                
            case 'give_item':
                return await sendApiRequest('give-item', {
                    playerId: action.playerId,
                    itemId: action.itemId,
                    quantity: action.quantity || 1
                });
                
            case 'give_gold':
                return await sendApiRequest('give-gold', {
                    playerId: action.playerId,
                    amount: action.amount
                });
                
            case 'give_soul':
                return await sendApiRequest('give-soul', {
                    playerId: action.playerId,
                    amount: action.amount
                });
                
            case 'give_money':
                return await sendApiRequest('give-money', {
                    playerId: action.playerId,
                    amount: action.amount
                });
                
            case 'teleport':
                return await sendApiRequest('teleport', {
                    playerId: action.playerId,
                    zone: action.zone || action.mapId,
                    x: action.x,
                    y: action.y,
                    z: action.z
                });
                
            case 'activate_trigger':
                return await sendApiRequest('activate-trigger', {
                    triggerId: action.triggerId
                });
                
            case 'deactivate_trigger':
                return await sendApiRequest('deactivate-trigger', {
                    triggerId: action.triggerId
                });
                
            default:
                return { success: false, message: 'Tipo de ação desconhecida' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Executar evento baseado em timer
function executeTimerEvent(eventData) {
    console.log('=== EXECUTANDO EVENTO ===');
    console.log('Nome do evento:', eventData.name);
    console.log('Timestamp atual:', new Date().toLocaleString('pt-BR'));
    console.log('Stack trace:', new Error().stack);
    console.log('============================');
    
    addLog(`🚀 Executando evento: ${eventData.name}`, 'info');
    
    // Incrementar estatística
    if (!window.eventStats[eventData.id]) {
        window.eventStats[eventData.id] = {
            executions: 0,
            lastExecution: null,
            created: Date.now()
        };
    }
    
    window.eventStats[eventData.id].executions++;
    window.eventStats[eventData.id].lastExecution = Date.now();
    
    if (eventData.actions && eventData.actions.length > 0) {
        eventData.actions.forEach(async (action) => {
            const result = await executeEventAction(action);
            if (result.success) {
                addLog(`Evento ${eventData.name}: ${getActionDescription(action)}`, 'success');
            } else {
                addLog(`Erro no evento ${eventData.name}: ${result.message}`, 'error');
            }
        });
    }
    
    // Atualizar exibição do evento ativo se existir
    updateActiveEventDisplay(eventData.id);
}

// Atualizar exibição de evento ativo
function updateActiveEventDisplay(eventId) {
    const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
    if (eventElement && window.eventStats[eventId]) {
        const stats = window.eventStats[eventId];
        const eventData = window.activeEvents[eventId];
        
        // Atualizar contador de execuções
        const metaDiv = eventElement.querySelector('.event-meta');
        if (metaDiv) {
            const statsSpan = metaDiv.querySelector('.event-stats') || document.createElement('span');
            statsSpan.className = 'event-stats executed';
            statsSpan.innerHTML = `${stats.executions} execuções`;
            if (!metaDiv.querySelector('.event-stats')) {
                metaDiv.appendChild(statsSpan);
            }
        }
        
        // Atualizar informações de agendamento
        const scheduleInfo = eventElement.querySelector('.event-schedule-info');
        if (scheduleInfo && eventData) {
            const nextExecution = getNextExecutionTime(eventData);
            
            // Atualizar próxima execução
            const nextExecutionDiv = scheduleInfo.querySelector('.next-execution');
            if (nextExecutionDiv && nextExecution) {
                nextExecutionDiv.innerHTML = `
                    <i class="fas fa-calendar-alt"></i>
                    <span>Próxima: ${nextExecution}</span>
                `;
                nextExecutionDiv.className = 'next-execution executed';
            }
            
            // Atualizar última execução
            const lastExecutionDiv = scheduleInfo.querySelector('.last-execution');
            if (lastExecutionDiv) {
                lastExecutionDiv.innerHTML = `
                    <i class="fas fa-history"></i>
                    <span>Última: ${new Date(stats.lastExecution).toLocaleString('pt-BR')}</span>
                `;
            } else {
                // Criar div de última execução se não existir
                const newLastExecution = document.createElement('div');
                newLastExecution.className = 'last-execution';
                newLastExecution.innerHTML = `
                    <i class="fas fa-history"></i>
                    <span>Última: ${new Date(stats.lastExecution).toLocaleString('pt-BR')}</span>
                `;
                scheduleInfo.appendChild(newLastExecution);
            }
        }
        
        // Adicionar efeito visual de execução
        eventElement.classList.add('event-just-executed');
        setTimeout(() => {
            eventElement.classList.remove('event-just-executed');
        }, 2000);
    }
}

function getActionDescription(action) {
    switch(action.type) {
        case 'send_chat':
            return `Mensagem enviada: "${action.message}"`;
        case 'give_item':
            return `Item ${action.itemId} (${action.quantity}x) dado para jogador ${action.playerId}`;
        case 'give_gold':
            return `${action.amount} gold dado para jogador ${action.playerId}`;
        case 'give_soul':
            return `${action.amount} soul dado para jogador ${action.playerId}`;
        case 'give_money':
            return `${action.amount} KKs dados para jogador ${action.playerId}`;
        case 'teleport':
            return `Jogador ${action.playerId} teleportado para zona ${action.zone || action.mapId}`;
        default:
            return 'Ação executada';
    }
}

// Iniciar timer de evento com suporte robusto a agendamento
function startEventTimer(eventData) {
    console.log('=== INICIANDO TIMER DE EVENTO ===');
    console.log('Nome do evento:', eventData.name);
    console.log('Schedule completo:', eventData.schedule);
    console.log('Timestamp atual:', new Date().toLocaleString('pt-BR'));
    console.log('==================================');
    
    addLog(`⏰ Iniciando timer para evento: ${eventData.name}`, 'info');
    
    // Parar timer existente se houver
    if (activeTimers[eventData.id]) {
        clearInterval(activeTimers[eventData.id]);
        clearTimeout(activeTimers[eventData.id + '_timeout']);
    }
    
    if (!eventData.schedule) {
        // Fallback para eventos sem agendamento específico
        const interval = eventData.interval || 3600;
        activeTimers[eventData.id] = setInterval(() => {
            executeTimerEvent(eventData);
        }, interval * 1000);
        addLog(`Timer iniciado para evento "${eventData.name}" - Intervalo: ${interval}s`, 'info');
        return;
    }
    
    const schedule = eventData.schedule;
    console.log('Processando schedule tipo:', schedule.type);
    
    switch(schedule.type) {
        case 'interval':
            const intervalValue = schedule.value || 1;
            const intervalUnit = parseInt(schedule.unit) || 3600;
            const intervalSeconds = intervalValue * intervalUnit;
            
            activeTimers[eventData.id] = setInterval(() => {
                executeTimerEvent(eventData);
            }, intervalSeconds * 1000);
            
            addLog(`Timer de intervalo iniciado para evento "${eventData.name}" - ${intervalValue} × ${intervalUnit}s = ${intervalSeconds}s`, 'info');
            break;
            
        case 'datetime':
            const targetDate = new Date(schedule.date + ' ' + schedule.time);
            const now = new Date();
            
            console.log('Agendamento datetime:', {
                targetDate: targetDate.toLocaleString('pt-BR'),
                now: now.toLocaleString('pt-BR'),
                isPast: targetDate <= now,
                schedule: schedule
            });
            
            if (targetDate <= now) {
                if (schedule.repeat) {
                    // Se for para repetir, agendar para o próximo dia
                    const nextDay = new Date(targetDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    addLog(`Data/hora do evento "${eventData.name}" já passou. Agendando para próximo dia: ${nextDay.toLocaleString('pt-BR')}`, 'warning');
                    scheduleDateTime(eventData, nextDay);
                } else {
                    // Se não for para repetir e já passou, não agendar
                    addLog(`Erro: Data/hora do evento "${eventData.name}" já passou: ${targetDate.toLocaleString('pt-BR')} e não está configurado para repetir`, 'error');
                }
                return;
            }
            
            scheduleDateTime(eventData, targetDate);
            break;
            
        case 'daily':
            scheduleDailyEvent(eventData, schedule.time);
            break;
            
        case 'weekly':
            scheduleWeeklyEvent(eventData, schedule.day, schedule.time);
            break;
            
        case 'monthly':
            scheduleMonthlyEvent(eventData, schedule.day, schedule.time);
            break;
            
        default:
            // Fallback
            const defaultInterval = eventData.interval || 3600;
            activeTimers[eventData.id] = setInterval(() => {
                executeTimerEvent(eventData);
            }, defaultInterval * 1000);
            addLog(`Timer padrão iniciado para evento "${eventData.name}" - ${defaultInterval}s`, 'info');
    }
}

// Agendar evento para data/hora específica
function scheduleDateTime(eventData, targetDate) {
    const now = new Date();
    const delay = targetDate.getTime() - now.getTime();
    
    console.log('Agendando evento datetime:', {
        eventName: eventData.name,
        targetDate: targetDate.toLocaleString('pt-BR'),
        now: now.toLocaleString('pt-BR'),
        delay: delay,
        delayMinutes: Math.round(delay / 1000 / 60)
    });
    
    if (delay <= 0) {
        addLog(`Erro: Data/hora já passou para evento "${eventData.name}" - Target: ${targetDate.toLocaleString('pt-BR')}, Agora: ${now.toLocaleString('pt-BR')}`, 'error');
        return;
    }
    
    activeTimers[eventData.id + '_timeout'] = setTimeout(() => {
        addLog(`Executando evento agendado "${eventData.name}" na data/hora programada`, 'info');
        executeTimerEvent(eventData);
        
        // Se for para repetir diariamente
        if (eventData.schedule.repeat) {
            const nextDay = new Date(targetDate);
            nextDay.setDate(nextDay.getDate() + 1);
            addLog(`Reagendando evento "${eventData.name}" para o próximo dia: ${nextDay.toLocaleString('pt-BR')}`, 'info');
            scheduleDateTime(eventData, nextDay);
        }
    }, delay);
    
    addLog(`Evento "${eventData.name}" agendado para ${targetDate.toLocaleString('pt-BR')} (em ${Math.round(delay / 1000 / 60)} minutos)`, 'info');
}

// Agendar evento diário
function scheduleDailyEvent(eventData, time) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(hours, minutes, 0, 0);
    
    // Se já passou hoje, agendar para amanhã
    if (targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const delay = targetTime.getTime() - now.getTime();
    
    activeTimers[eventData.id + '_timeout'] = setTimeout(() => {
        executeTimerEvent(eventData);
        
        // Agendar próxima execução (24 horas depois)
        activeTimers[eventData.id] = setInterval(() => {
            executeTimerEvent(eventData);
        }, 24 * 60 * 60 * 1000); // 24 horas
        
    }, delay);
    
    addLog(`Evento diário "${eventData.name}" agendado para ${targetTime.toLocaleString('pt-BR')}`, 'info');
}

// Função auxiliar para reagendar evento diário após execução
function rescheduleDailyEvent(eventData, time) {
    const [hours, minutes] = time.split(':').map(Number);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(hours, minutes, 0, 0);
    
    // Limpar timer atual
    if (activeTimers[eventData.id]) {
        clearInterval(activeTimers[eventData.id]);
    }
    
    // Agendar para amanhã
    const delay = tomorrow.getTime() - Date.now();
    activeTimers[eventData.id + '_timeout'] = setTimeout(() => {
        executeTimerEvent(eventData);
        
        // Continuar agendamento diário
        activeTimers[eventData.id] = setInterval(() => {
            executeTimerEvent(eventData);
        }, 24 * 60 * 60 * 1000);
        
    }, delay);
}

// Agendar evento semanal
function scheduleWeeklyEvent(eventData, dayOfWeek, time) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const targetTime = new Date();
    
    // Calcular próxima ocorrência do dia da semana
    const currentDay = now.getDay();
    const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
    
    targetTime.setDate(now.getDate() + daysUntilTarget);
    targetTime.setHours(hours, minutes, 0, 0);
    
    // Se for hoje mas já passou a hora, agendar para próxima semana
    if (daysUntilTarget === 0 && targetTime <= now) {
        targetTime.setDate(targetTime.getDate() + 7);
    }
    
    const delay = targetTime.getTime() - now.getTime();
    
    activeTimers[eventData.id + '_timeout'] = setTimeout(() => {
        executeTimerEvent(eventData);
        
        // Agendar próxima execução (7 dias depois)
        activeTimers[eventData.id] = setInterval(() => {
            executeTimerEvent(eventData);
        }, 7 * 24 * 60 * 60 * 1000); // 7 dias
        
    }, delay);
    
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    addLog(`Evento semanal "${eventData.name}" agendado para ${dayNames[dayOfWeek]} ${targetTime.toLocaleString('pt-BR')}`, 'info');
}

// Agendar evento mensal
function scheduleMonthlyEvent(eventData, dayOfMonth, time) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const targetTime = new Date();
    
    targetTime.setDate(dayOfMonth);
    targetTime.setHours(hours, minutes, 0, 0);
    
    // Se já passou este mês, agendar para próximo mês
    if (targetTime <= now) {
        targetTime.setMonth(targetTime.getMonth() + 1);
    }
    
    const delay = targetTime.getTime() - now.getTime();
    
    activeTimers[eventData.id + '_timeout'] = setTimeout(() => {
        executeTimerEvent(eventData);
        
        // Agendar próxima execução (próximo mês)
        scheduleNextMonthlyExecution(eventData, dayOfMonth, time);
        
    }, delay);
    
    addLog(`Evento mensal "${eventData.name}" agendado para dia ${dayOfMonth} às ${time} - ${targetTime.toLocaleString('pt-BR')}`, 'info');
}

// Agendar próxima execução mensal
function scheduleNextMonthlyExecution(eventData, dayOfMonth, time) {
    const [hours, minutes] = time.split(':').map(Number);
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(dayOfMonth);
    nextMonth.setHours(hours, minutes, 0, 0);
    
    const delay = nextMonth.getTime() - Date.now();
    
    activeTimers[eventData.id] = setTimeout(() => {
        executeTimerEvent(eventData);
        scheduleNextMonthlyExecution(eventData, dayOfMonth, time);
    }, delay);
}

// Parar timer de evento
function stopEventTimer(eventId) {
    let stopped = false;
    
    if (activeTimers[eventId]) {
        clearInterval(activeTimers[eventId]);
        delete activeTimers[eventId];
        stopped = true;
    }
    
    if (activeTimers[eventId + '_timeout']) {
        clearTimeout(activeTimers[eventId + '_timeout']);
        delete activeTimers[eventId + '_timeout'];
        stopped = true;
    }
    
    return stopped;
}
let eventTemplates = {
    timer_chat: {
        name: "Mensagem Automática",
        description: "Envia mensagens automaticamente em intervalos de tempo",
        template: "timer_chat",
        interval: 3600, // 1 hora
        actions: [
            { 
                type: "send_chat", 
                chatType: "2", 
                playerId: 32, 
                channel: 15, 
                message: "Bem-vindos ao servidor!" 
            }
        ]
    },
    timer_rewards: {
        name: "Recompensas Automáticas",
        description: "Dá recompensas para todos os jogadores online",
        template: "timer_rewards",
        interval: 7200, // 2 horas
        actions: [
            { 
                type: "send_chat", 
                chatType: "2", 
                playerId: 32, 
                channel: 15, 
                message: "Recompensa horária distribuída!" 
            }
        ]
    },
    custom: {
        name: "Evento Personalizado",
        description: "Crie um evento completamente personalizado",
        template: "custom",
        interval: 3600,
        actions: []
    }
};

function loadEventTemplate(templateId) {
    const template = eventTemplates[templateId];
    if (!template) return;
    
    currentEventData = JSON.parse(JSON.stringify(template)); // Deep copy
    currentEventStep = 1;
    
    document.getElementById('eventBuilderTitle').textContent = template.name;
    document.getElementById('eventBuilderSection').style.display = 'block';
    
    // Reset steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    document.querySelector('[data-step="1"]').classList.add('active');
    
    loadStepContent(1);
    updateStepNavigation();
    
    // Scroll to builder
    document.getElementById('eventBuilderSection').scrollIntoView({ behavior: 'smooth' });
}

function closeEventBuilder() {
    document.getElementById('eventBuilderSection').style.display = 'none';
    
    // Reset builder state
    currentEventData = {};
    currentEventStep = 1;
    isEditingEvent = false;
    editingEventId = null;
    
    // Reset builder title
    const builderTitle = document.querySelector('.event-builder h3');
    if (builderTitle) {
        builderTitle.innerHTML = '<i class="fas fa-calendar-plus"></i> Criador de Eventos';
    }
}

function loadStepContent(step) {
    console.log('Carregando etapa:', step, 'currentEventData:', currentEventData);
    const content = document.getElementById('stepContent');
    
    switch(step) {
        case 1:
            content.innerHTML = generateTriggerStep();
            break;
        case 2:
            content.innerHTML = generateActionsStep();
            break;
        case 3:
            content.innerHTML = generateSummaryStep();
            break;
    }
}

function generateTriggerStep() {
    // Garantir que o schedule existe
    if (!currentEventData.schedule) {
        currentEventData.schedule = {
            type: 'interval',
            interval: 3600,
            enabled: true
        };
    }
    
    return `
        <div class="step-header">
            <h4><i class="fas fa-calendar-alt"></i> Configurar Agendamento</h4>
            <p>Defina quando e como o evento será executado</p>
        </div>
        
        <div class="form-group">
            <label for="eventName">Nome do Evento:</label>
            <input type="text" id="eventName" class="form-control" value="${currentEventData.name || ''}" 
                   placeholder="Digite o nome do evento" onchange="updateEventData('name', this.value)">
        </div>
        
        <div class="form-group">
            <label for="eventDescription">Descrição:</label>
            <textarea id="eventDescription" class="form-control" rows="3" 
                      placeholder="Descreva o que este evento faz" onchange="updateEventData('description', this.value)">${currentEventData.description || ''}</textarea>
        </div>
        
        <div class="form-group">
            <label for="scheduleType">Tipo de Agendamento:</label>
            <select id="scheduleType" class="form-control" onchange="updateScheduleType()">
                <option value="interval" ${currentEventData.schedule?.type === 'interval' ? 'selected' : ''}>Intervalo de Tempo</option>
                <option value="datetime" ${currentEventData.schedule?.type === 'datetime' ? 'selected' : ''}>Data/Hora Específica</option>
                <option value="daily" ${currentEventData.schedule?.type === 'daily' ? 'selected' : ''}>Diariamente</option>
                <option value="weekly" ${currentEventData.schedule?.type === 'weekly' ? 'selected' : ''}>Semanalmente</option>
                <option value="monthly" ${currentEventData.schedule?.type === 'monthly' ? 'selected' : ''}>Mensalmente</option>
            </select>
        </div>
        
        <div id="scheduleOptions">
            ${generateScheduleOptions(currentEventData.schedule?.type || 'interval')}
        </div>
        
        <div class="step-preview">
            <h5>Preview do Agendamento:</h5>
            <div class="preview-box">
                ${generateSchedulePreview()}
            </div>
        </div>
    `;
}

function generateScheduleOptions(type) {
    switch(type) {
        case 'interval':
            return `
                <div class="form-group">
                    <label for="intervalTime">Intervalo:</label>
                    <div class="form-row">
                        <div class="form-group col-6">
                            <input type="number" id="intervalValue" class="form-control" 
                                   value="${currentEventData.schedule?.value || 1}" min="1" 
                                   onchange="updateScheduleData('value', parseInt(this.value))">
                        </div>
                        <div class="form-group col-6">
                            <select id="intervalUnit" class="form-control" onchange="updateScheduleData('unit', this.value)">
                                <option value="60" ${currentEventData.schedule?.unit === '60' ? 'selected' : ''}>Minutos</option>
                                <option value="3600" ${currentEventData.schedule?.unit === '3600' || !currentEventData.schedule?.unit ? 'selected' : ''}>Horas</option>
                                <option value="86400" ${currentEventData.schedule?.unit === '86400' ? 'selected' : ''}>Dias</option>
                            </select>
                        </div>
                    </div>
                    <small class="form-text">O evento será executado a cada período especificado</small>
                </div>
            `;
        case 'datetime':
            return `
                <div class="form-group">
                    <label for="eventDate">Data:</label>
                    <input type="date" id="eventDate" class="form-control" 
                           value="${currentEventData.schedule?.date || ''}" 
                           onchange="updateScheduleData('date', this.value)">
                </div>
                <div class="form-group">
                    <label for="eventTime">Horário:</label>
                    <input type="time" id="eventTime" class="form-control" 
                           value="${currentEventData.schedule?.time || '12:00'}" 
                           onchange="updateScheduleData('time', this.value)">
                </div>
                <div class="form-group">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="eventRepeat" 
                               ${currentEventData.schedule?.repeat ? 'checked' : ''} 
                               onchange="updateScheduleData('repeat', this.checked)">
                        <label class="form-check-label" for="eventRepeat">
                            Repetir evento (mesmo horário todos os dias)
                        </label>
                    </div>
                </div>
            `;
        case 'daily':
            return `
                <div class="form-group">
                    <label for="dailyTime">Horário Diário:</label>
                    <input type="time" id="dailyTime" class="form-control" 
                           value="${currentEventData.schedule?.time || '12:00'}" 
                           onchange="updateScheduleData('time', this.value)">
                    <small class="form-text">Evento será executado todos os dias neste horário</small>
                </div>
            `;
        case 'weekly':
            return `
                <div class="form-group">
                    <label for="weeklyDay">Dia da Semana:</label>
                    <select id="weeklyDay" class="form-control" onchange="updateScheduleData('day', parseInt(this.value))">
                        <option value="0" ${currentEventData.schedule?.day === 0 ? 'selected' : ''}>Domingo</option>
                        <option value="1" ${currentEventData.schedule?.day === 1 ? 'selected' : ''}>Segunda-feira</option>
                        <option value="2" ${currentEventData.schedule?.day === 2 ? 'selected' : ''}>Terça-feira</option>
                        <option value="3" ${currentEventData.schedule?.day === 3 ? 'selected' : ''}>Quarta-feira</option>
                        <option value="4" ${currentEventData.schedule?.day === 4 ? 'selected' : ''}>Quinta-feira</option>
                        <option value="5" ${currentEventData.schedule?.day === 5 ? 'selected' : ''}>Sexta-feira</option>
                        <option value="6" ${currentEventData.schedule?.day === 6 ? 'selected' : ''}>Sábado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="weeklyTime">Horário:</label>
                    <input type="time" id="weeklyTime" class="form-control" 
                           value="${currentEventData.schedule?.time || '12:00'}" 
                           onchange="updateScheduleData('time', this.value)">
                    <small class="form-text">Evento será executado semanalmente neste dia e horário</small>
                </div>
            `;
        case 'monthly':
            return `
                <div class="form-group">
                    <label for="monthlyDay">Dia do Mês:</label>
                    <select id="monthlyDay" class="form-control" onchange="updateScheduleData('day', parseInt(this.value))">
                        ${Array.from({length: 31}, (_, i) => {
                            const day = i + 1;
                            const selected = currentEventData.schedule?.day === day ? 'selected' : '';
                            return `<option value="${day}" ${selected}>Dia ${day}</option>`;
                        }).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="monthlyTime">Horário:</label>
                    <input type="time" id="monthlyTime" class="form-control" 
                           value="${currentEventData.schedule?.time || '12:00'}" 
                           onchange="updateScheduleData('time', this.value)">
                    <small class="form-text">Evento será executado mensalmente neste dia e horário</small>
                </div>
            `;
        default:
            return '';
    }
}

function generateTriggerPreview() {
    switch(currentEventData.trigger) {
        case 'player_login':
            return '<i class="fas fa-sign-in-alt"></i> Quando um jogador fazer login no servidor';
        case 'level_up':
            return '<i class="fas fa-level-up-alt"></i> Quando um jogador subir de level';
        case 'timer':
            return `<i class="fas fa-clock"></i> A cada ${currentEventData.interval || 3600} segundos`;
        case 'command':
            return `<i class="fas fa-terminal"></i> Quando alguém digitar "${currentEventData.command || '!evento'}"`;
        case 'item_use':
            return `<i class="fas fa-hand-pointer"></i> Quando usar o item ID ${currentEventData.itemId || 'XXXXX'}`;
        case 'player_kill':
            return '<i class="fas fa-skull"></i> Quando um jogador matar outro';
        default:
            return '<i class="fas fa-question"></i> Trigger não configurado';
    }
}

function updateScheduleType() {
    const scheduleType = document.getElementById('scheduleType').value;
    
    // Reset schedule data based on type
    switch(scheduleType) {
        case 'interval':
            currentEventData.schedule = {
                type: 'interval',
                value: 1,
                unit: '3600'
            };
            // Calcular interval para compatibilidade
            currentEventData.interval = 1 * 3600; // 1 hora
            break;
        case 'datetime':
            currentEventData.schedule = {
                type: 'datetime',
                date: new Date().toISOString().split('T')[0],
                time: '12:00',
                repeat: false
            };
            // Para eventos únicos, usar um valor alto para não repetir automaticamente
            currentEventData.interval = 999999999;
            break;
        case 'daily':
            currentEventData.schedule = {
                type: 'daily',
                time: '12:00'
            };
            // 24 horas = 86400 segundos
            currentEventData.interval = 86400;
            break;
        case 'weekly':
            currentEventData.schedule = {
                type: 'weekly',
                day: 1,
                time: '12:00'
            };
            // 7 dias = 604800 segundos
            currentEventData.interval = 604800;
            break;
        case 'monthly':
            currentEventData.schedule = {
                type: 'monthly',
                day: 1,
                time: '12:00'
            };
            // 30 dias = 2592000 segundos
            currentEventData.interval = 2592000;
            break;
    }
    
    // Reload schedule options
    document.getElementById('scheduleOptions').innerHTML = generateScheduleOptions(scheduleType);
    document.querySelector('.preview-box').innerHTML = generateSchedulePreview();
}

function updateScheduleData(field, value) {
    if (!currentEventData.schedule) {
        currentEventData.schedule = {};
    }
    
    currentEventData.schedule[field] = value;
    
    // Para compatibilidade com o sistema antigo, calcular o interval em segundos
    if (currentEventData.schedule.type === 'interval') {
        const scheduleValue = currentEventData.schedule.value || 1;
        const scheduleUnit = parseInt(currentEventData.schedule.unit) || 3600;
        currentEventData.interval = scheduleValue * scheduleUnit;
    }
    
    // Update preview
    const previewBox = document.querySelector('.preview-box');
    if (previewBox) {
        previewBox.innerHTML = generateSchedulePreview();
    }
}

function generateSchedulePreview() {
    if (!currentEventData.schedule) {
        return '<i class="fas fa-clock"></i> Nenhum agendamento configurado';
    }
    
    const schedule = currentEventData.schedule;
    
    switch(schedule.type) {
        case 'interval':
            const value = schedule.value || 1;
            const unit = schedule.unit || '3600';
            const unitNames = {
                '60': 'minuto(s)',
                '3600': 'hora(s)',
                '86400': 'dia(s)'
            };
            return `<i class="fas fa-clock"></i> A cada ${value} ${unitNames[unit] || 'hora(s)'}`;
            
        case 'datetime':
            if (schedule.date && schedule.time) {
                const targetDate = new Date(schedule.date + ' ' + schedule.time);
                const formattedDate = targetDate.toLocaleString('pt-BR');
                const repeat = schedule.repeat ? ' (repetindo diariamente)' : ' (execução única)';
                return `<i class="fas fa-calendar"></i> Em ${formattedDate}${repeat}`;
            } else if (schedule.datetime) {
                const targetDate = new Date(schedule.datetime);
                const formattedDate = targetDate.toLocaleString('pt-BR');
                const repeat = schedule.repeat ? ' (repetindo diariamente)' : ' (execução única)';
                return `<i class="fas fa-calendar"></i> Em ${formattedDate}${repeat}`;
            } else {
                return `<i class="fas fa-calendar"></i> Data não configurada`;
            }
            
        case 'daily':
            const dailyTime = schedule.time || '12:00';
            return `<i class="fas fa-calendar-day"></i> Todos os dias às ${dailyTime}`;
            
        case 'weekly':
            const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
            const weeklyDay = dayNames[schedule.day] || 'Segunda';
            const weeklyTime = schedule.time || '12:00';
            return `<i class="fas fa-calendar-week"></i> Toda ${weeklyDay} às ${weeklyTime}`;
            
        case 'monthly':
            const monthlyDay = schedule.day || 1;
            const monthlyTime = schedule.time || '12:00';
            return `<i class="fas fa-calendar-alt"></i> Todo dia ${monthlyDay} do mês às ${monthlyTime}`;
            
        default:
            return '<i class="fas fa-question-circle"></i> Agendamento não configurado';
    }
}

function updateEventTrigger() {
    const trigger = document.getElementById('eventTrigger').value;
    currentEventData.trigger = trigger;
    
    document.getElementById('triggerOptions').innerHTML = generateTriggerOptions(trigger);
    document.querySelector('.preview-box').innerHTML = generateTriggerPreview();
}

function generateConditionsStep() {
    // Garantir que conditions existe
    if (!currentEventData.conditions) {
        currentEventData.conditions = [];
    }
    
    return `
        <div class="step-header">
            <h4><i class="fas fa-filter"></i> Condições</h4>
            <p>Defina condições que devem ser atendidas (opcional)</p>
        </div>
        
        <div class="conditions-list" id="conditionsList">
            ${currentEventData.conditions.map((condition, index) => generateConditionItem(condition, index)).join('')}
        </div>
        
        <button type="button" class="btn btn-secondary" onclick="addCondition()">
            <i class="fas fa-plus"></i> Adicionar Condição
        </button>
        
        <div class="step-preview">
            <h5>Preview das Condições:</h5>
            <div class="preview-box">
                ${generateConditionsPreview()}
            </div>
        </div>
    `;
}

function generateConditionItem(condition, index) {
    return `
        <div class="condition-item" data-index="${index}">
            <div class="condition-content">
                <div class="form-row">
                    <div class="form-group">
                        <select class="form-control" onchange="updateCondition(${index}, 'type', this.value)">
                            <option value="level" ${condition.type === 'level' ? 'selected' : ''}>Level do Jogador</option>
                            <option value="online_time" ${condition.type === 'online_time' ? 'selected' : ''}>Tempo Online</option>
                            <option value="has_item" ${condition.type === 'has_item' ? 'selected' : ''}>Possui Item</option>
                            <option value="money" ${condition.type === 'money' ? 'selected' : ''}>Dinheiro</option>
                            <option value="vip" ${condition.type === 'vip' ? 'selected' : ''}>VIP Ativo</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <select class="form-control" onchange="updateCondition(${index}, 'operator', this.value)">
                            <option value="equals" ${condition.operator === 'equals' ? 'selected' : ''}>Igual a</option>
                            <option value="greater" ${condition.operator === 'greater' ? 'selected' : ''}>Maior que</option>
                            <option value="less" ${condition.operator === 'less' ? 'selected' : ''}>Menor que</option>
                            <option value="multiple_of" ${condition.operator === 'multiple_of' ? 'selected' : ''}>Múltiplo de</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <input type="number" class="form-control" value="${condition.value}" 
                               onchange="updateCondition(${index}, 'value', this.value)" placeholder="Valor">
                    </div>
                    <button type="button" class="btn btn-danger btn-sm" onclick="removeCondition(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateConditionsPreview() {
    if (!currentEventData.conditions || currentEventData.conditions.length === 0) {
        return '<i class="fas fa-check-circle"></i> Sem condições - evento sempre será executado';
    }
    
    return currentEventData.conditions.map(condition => {
        return `<i class="fas fa-filter"></i> ${getConditionText(condition)}`;
    }).join('<br>');
}

function getConditionText(condition) {
    const typeNames = {
        level: 'Level',
        online_time: 'Tempo online',
        has_item: 'Possui item',
        money: 'Dinheiro',
        vip: 'VIP'
    };
    
    const operatorNames = {
        equals: 'igual a',
        greater: 'maior que',
        less: 'menor que',
        multiple_of: 'múltiplo de'
    };
    
    return `${typeNames[condition.type]} ${operatorNames[condition.operator]} ${condition.value}`;
}

function addCondition() {
    currentEventData.conditions.push({
        type: 'level',
        operator: 'greater',
        value: 1
    });
    
    loadStepContent(2);
}

function removeCondition(index) {
    currentEventData.conditions.splice(index, 1);
    loadStepContent(2);
}

function updateCondition(index, field, value) {
    if (currentEventData.conditions[index]) {
        currentEventData.conditions[index][field] = field === 'value' ? parseInt(value) : value;
        document.querySelector('.preview-box').innerHTML = generateConditionsPreview();
    }
}

function nextStep() {
    if (currentEventStep < 3) {
        // Validar etapa atual
        if (currentEventStep === 1) {
            if (!currentEventData.name || !currentEventData.description) {
                showNotification('Nome e descrição são obrigatórios!', 'error');
                return;
            }
            if (!currentEventData.interval || currentEventData.interval < 60) {
                showNotification('Intervalo deve ser de pelo menos 60 segundos!', 'error');
                return;
            }
        }
        
        // Mark current step as completed
        document.querySelector(`[data-step="${currentEventStep}"]`).classList.add('completed');
        document.querySelector(`[data-step="${currentEventStep}"]`).classList.remove('active');
        
        currentEventStep++;
        
        // Mark next step as active
        document.querySelector(`[data-step="${currentEventStep}"]`).classList.add('active');
        
        loadStepContent(currentEventStep);
        updateStepNavigation();
    }
}

function previousStep() {
    if (currentEventStep > 1) {
        // Remove active from current step
        document.querySelector(`[data-step="${currentEventStep}"]`).classList.remove('active');
        
        currentEventStep--;
        
        // Remove completed and add active to previous step
        document.querySelector(`[data-step="${currentEventStep}"]`).classList.remove('completed');
        document.querySelector(`[data-step="${currentEventStep}"]`).classList.add('active');
        
        loadStepContent(currentEventStep);
        updateStepNavigation();
    }
}

function updateStepNavigation() {
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    
    prevBtn.disabled = currentEventStep === 1;
    
    if (currentEventStep === 3) {
        nextBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Evento';
        nextBtn.onclick = saveEvent;
    } else {
        nextBtn.innerHTML = 'Próximo <i class="fas fa-chevron-right"></i>';
        nextBtn.onclick = nextStep;
    }
}

// Função para atualizar dados do evento
function updateEventData(field, value) {
    currentEventData[field] = value;
}

function saveEvent() {
    // Validar dados do evento
    if (!currentEventData.name || !currentEventData.description) {
        showNotification('Nome e descrição são obrigatórios!', 'error');
        return;
    }
    
    if (!currentEventData.actions || currentEventData.actions.length === 0) {
        showNotification('Adicione pelo menos uma ação ao evento!', 'error');
        return;
    }
    
    // Garantir que o trigger seja timer
    currentEventData.trigger = 'timer';
    
    if (isEditingEvent && editingEventId) {
        // Atualizar evento existente
        if (window.activeEvents && window.activeEvents[editingEventId]) {
            // Parar timer antigo
            stopEventTimer(editingEventId);
            
            // Atualizar dados
            window.activeEvents[editingEventId] = { ...currentEventData };
            
            // Iniciar novo timer
            startEventTimer(window.activeEvents[editingEventId]);
            
            // Atualizar UI do evento na lista
            updateEventInList(editingEventId, currentEventData);
            
            showNotification('Evento atualizado com sucesso!', 'success');
            addLog(`Evento editado: ${currentEventData.name}`, 'success');
        }
    } else {
        // Criar novo evento
        const eventData = { ...currentEventData };
        addToActiveEvents(eventData);
        
        // Iniciar timer
        startEventTimer(eventData);
        
        showNotification('Evento criado e ativado com sucesso!', 'success');
        addLog(`Evento criado: ${currentEventData.name}`, 'success');
    }
    
    closeEventBuilder();
}

function updateEventInList(eventId, eventData) {
    const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
    if (eventElement) {
        const eventInfo = eventElement.querySelector('.event-info');
        eventInfo.innerHTML = `
            <h4>${eventData.name}</h4>
            <p>${eventData.description}</p>
            <div class="event-meta">
                <span class="event-type">${getEventTypeText(eventData.template)}</span>
                <span class="event-actions">${eventData.actions ? eventData.actions.length : 0} ações</span>
            </div>
        `;
    }
}

function addToActiveEvents(eventData) {
    const activeList = document.getElementById('activeEventsList');
    const noEventsMsg = activeList.querySelector('.no-events-message');
    
    if (noEventsMsg) {
        activeList.innerHTML = '';
    }
    
    // Adicionar ID único se não existir
    if (!eventData.id) {
        eventData.id = 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Inicializar estatísticas se não existir
    if (!window.eventStats[eventData.id]) {
        window.eventStats[eventData.id] = {
            executions: 0,
            lastExecution: null,
            created: Date.now()
        };
    }
    
    const stats = window.eventStats[eventData.id];
    const nextExecution = getNextExecutionTime(eventData);
    const hasExecuted = stats.executions > 0;
    
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    eventItem.setAttribute('data-event-id', eventData.id);
    eventItem.innerHTML = `
        <div class="event-info">
            <h4>${eventData.name}</h4>
            <p>${eventData.description}</p>
            <div class="event-meta">
                <span class="event-type">${getEventTypeText(eventData.template)}</span>
                <span class="event-actions">${eventData.actions ? eventData.actions.length : 0} ações</span>
                <span class="event-stats ${hasExecuted ? 'executed' : ''}">${stats.executions} execuções</span>
            </div>
            <div class="event-schedule-info">
                <div class="schedule-detail">
                    <i class="fas fa-clock"></i>
                    <span>${getScheduleDisplayText(eventData)}</span>
                </div>
                ${nextExecution ? `
                <div class="next-execution ${hasExecuted ? 'executed' : 'pending'}">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Próxima: ${nextExecution}</span>
                </div>
                ` : ''}
                ${stats.lastExecution ? `
                <div class="last-execution">
                    <i class="fas fa-history"></i>
                    <span>Última: ${new Date(stats.lastExecution).toLocaleString('pt-BR')}</span>
                </div>
                ` : ''}
            </div>
        </div>
        <div class="event-status">
            <div class="status-indicator active"></div>
            <span>Ativo</span>
            <div class="event-controls">
                <button class="btn btn-sm btn-primary" onclick="editEvent('${eventData.id}')" title="Editar Evento">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="removeEvent(this)" title="Remover Evento">
                    <i class="fas fa-stop"></i>
                </button>
            </div>
        </div>
    `;
    
    activeList.appendChild(eventItem);
    
    // Armazenar o evento para edição posterior
    if (!window.activeEvents) {
        window.activeEvents = {};
    }
    window.activeEvents[eventData.id] = eventData;
}

function getEventTypeText(template) {
    const templates = {
        'welcome': 'Boas-vindas',
        'hourly': 'Recompensa Horária',
        'level_reward': 'Recompensa por Level',
        'boss': 'Evento de Boss',
        'custom': 'Evento Personalizado'
    };
    return templates[template] || 'Personalizado';
}

function getScheduleDisplayText(eventData) {
    if (!eventData.schedule) {
        const interval = eventData.interval || 3600;
        return `A cada ${Math.floor(interval / 60)} minutos`;
    }
    
    const schedule = eventData.schedule;
    
    switch(schedule.type) {
        case 'interval':
            const value = schedule.value || 1;
            const unit = parseInt(schedule.unit) || 3600;
            const unitNames = {
                '60': 'minuto(s)',
                '3600': 'hora(s)',
                '86400': 'dia(s)'
            };
            return `A cada ${value} ${unitNames[unit] || 'hora(s)'}`;
            
        case 'datetime':
            const repeat = schedule.repeat ? ' (repetindo)' : ' (única vez)';
            return `Em ${schedule.date} às ${schedule.time}${repeat}`;
            
        case 'daily':
            return `Diariamente às ${schedule.time}`;
            
        case 'weekly':
            const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
            return `Semanalmente (${dayNames[schedule.day]}) às ${schedule.time}`;
            
        case 'monthly':
            return `Mensalmente (dia ${schedule.day}) às ${schedule.time}`;
            
        default:
            return 'Agendamento personalizado';
    }
}

function getNextExecutionTime(eventData) {
    if (!eventData.schedule) {
        return null;
    }
    
    const schedule = eventData.schedule;
    const now = new Date();
    const stats = window.eventStats[eventData.id];
    
    try {
        switch(schedule.type) {
            case 'datetime':
                const targetDate = new Date(schedule.date + ' ' + schedule.time);
                if (targetDate > now) {
                    return targetDate.toLocaleString('pt-BR');
                } else if (schedule.repeat) {
                    // Para eventos com repetição diária, calcular próximo dia
                    const nextDay = new Date(targetDate);
                    if (stats && stats.lastExecution) {
                        // Se já executou hoje, próxima execução é amanhã
                        const lastExecDate = new Date(stats.lastExecution);
                        const todayStr = now.toDateString();
                        const lastExecStr = lastExecDate.toDateString();
                        
                        if (todayStr === lastExecStr) {
                            nextDay.setDate(nextDay.getDate() + 1);
                        }
                    }
                    return nextDay.toLocaleString('pt-BR');
                }
                return null;
                
            case 'daily':
                const [hours, minutes] = schedule.time.split(':').map(Number);
                const dailyTarget = new Date();
                dailyTarget.setHours(hours, minutes, 0, 0);
                
                // Se já executou hoje, próxima execução é amanhã
                if (stats && stats.lastExecution) {
                    const lastExecDate = new Date(stats.lastExecution);
                    const todayStr = now.toDateString();
                    const lastExecStr = lastExecDate.toDateString();
                    
                    if (todayStr === lastExecStr) {
                        dailyTarget.setDate(dailyTarget.getDate() + 1);
                    } else if (dailyTarget <= now) {
                        dailyTarget.setDate(dailyTarget.getDate() + 1);
                    }
                } else if (dailyTarget <= now) {
                    dailyTarget.setDate(dailyTarget.getDate() + 1);
                }
                
                return dailyTarget.toLocaleString('pt-BR');
                
            case 'weekly':
                const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                const [wHours, wMinutes] = schedule.time.split(':').map(Number);
                const currentDay = now.getDay();
                const daysUntilTarget = (schedule.day - currentDay + 7) % 7;
                const weeklyTarget = new Date();
                weeklyTarget.setDate(now.getDate() + daysUntilTarget);
                weeklyTarget.setHours(wHours, wMinutes, 0, 0);
                
                // Se é hoje mas já passou a hora, ou já executou hoje, próxima semana
                if (daysUntilTarget === 0) {
                    if (weeklyTarget <= now || (stats && stats.lastExecution && 
                        new Date(stats.lastExecution).toDateString() === now.toDateString())) {
                        weeklyTarget.setDate(weeklyTarget.getDate() + 7);
                    }
                }
                
                return weeklyTarget.toLocaleString('pt-BR');
                
            case 'monthly':
                const [mHours, mMinutes] = schedule.time.split(':').map(Number);
                const monthlyTarget = new Date();
                monthlyTarget.setDate(schedule.day);
                monthlyTarget.setHours(mHours, mMinutes, 0, 0);
                
                // Se já passou este mês ou já executou hoje
                if (monthlyTarget <= now || (stats && stats.lastExecution && 
                    new Date(stats.lastExecution).toDateString() === now.toDateString())) {
                    monthlyTarget.setMonth(monthlyTarget.getMonth() + 1);
                }
                
                return monthlyTarget.toLocaleString('pt-BR');
                
            default:
                return null;
        }
    } catch (error) {
        console.error('Erro ao calcular próxima execução:', error);
        return null;
    }
}

function editEvent(eventId) {
    if (!window.activeEvents || !window.activeEvents[eventId]) {
        showNotification('Evento não encontrado!', 'error');
        return;
    }
    
    // Carregar dados do evento para edição
    currentEventData = { ...window.activeEvents[eventId] };
    currentEventStep = 1;
    isEditingEvent = true;
    editingEventId = eventId;
    
    // Mostrar o builder
    document.getElementById('eventBuilderSection').style.display = 'block';
    
    // Carregar primeira etapa
    loadStepContent(1);
    
    // Atualizar título do builder
    const builderTitle = document.querySelector('.event-builder h3');
    if (builderTitle) {
        builderTitle.innerHTML = '<i class="fas fa-edit"></i> Editando Evento';
    }
    
    // Scroll para o builder
    document.getElementById('eventBuilderSection').scrollIntoView({ behavior: 'smooth' });
}

function removeEvent(button) {
    const eventItem = button.closest('.event-item');
    const eventId = eventItem.getAttribute('data-event-id');
    
    // Parar timer se existir
    if (eventId && stopEventTimer(eventId)) {
        addLog(`Timer parado para evento ID: ${eventId}`, 'info');
    }
    
    // Remover da lista de eventos ativos
    if (window.activeEvents && eventId) {
        delete window.activeEvents[eventId];
    }
    
    eventItem.remove();
    
    const activeList = document.getElementById('activeEventsList');
    if (activeList.children.length === 0) {
        activeList.innerHTML = `
            <div class="no-events-message">
                <i class="fas fa-calendar-times"></i>
                <p>Nenhum evento ativo no momento</p>
            </div>
        `;
    }
    
    showNotification('Evento removido com sucesso!', 'success');
}

// Actions Step Functions
function generateActionsStep() {
    // Garantir que actions existe
    if (!currentEventData.actions) {
        currentEventData.actions = [];
    }
    
    return `
        <div class="step-header">
            <h4><i class="fas fa-cogs"></i> Ações do Evento</h4>
            <p>Defina o que acontecerá quando o evento for ativado</p>
        </div>
        
        <div class="actions-list" id="actionsList">
            ${currentEventData.actions.map((action, index) => generateActionItem(action, index)).join('')}
        </div>
        
        <button type="button" class="btn btn-secondary" onclick="addAction()">
            <i class="fas fa-plus"></i> Adicionar Ação
        </button>
        
        <div class="step-preview">
            <h5>Preview das Ações:</h5>
            <div class="preview-box">
                ${generateActionsPreview()}
            </div>
        </div>
    `;
}

function generateActionItem(action, index) {
    return `
        <div class="action-item" data-index="${index}">
            <div class="action-content">
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipo de Ação:</label>
                        <select class="form-control" onchange="updateActionType(${index}, this.value)">
                            <option value="send_chat" ${action.type === 'send_chat' ? 'selected' : ''}>Enviar Mensagem no Chat</option>
                            <option value="give_item" ${action.type === 'give_item' ? 'selected' : ''}>Dar Item</option>
                            <option value="give_gold" ${action.type === 'give_gold' ? 'selected' : ''}>Dar Gold</option>
                            <option value="give_soul" ${action.type === 'give_soul' ? 'selected' : ''}>Dar Soul</option>
                            <option value="give_money" ${action.type === 'give_money' ? 'selected' : ''}>Dar KKs (Moedas)</option>
                            <option value="teleport" ${action.type === 'teleport' ? 'selected' : ''}>Teleportar</option>
                            <option value="activate_trigger" ${action.type === 'activate_trigger' ? 'selected' : ''}>Ativar Trigger</option>
                            <option value="deactivate_trigger" ${action.type === 'deactivate_trigger' ? 'selected' : ''}>Desativar Trigger</option>
                        </select>
                    </div>
                </div>
                <div class="action-params">
                    ${generateActionParams(action, index)}
                </div>
                <div class="action-controls">
                    <button type="button" class="btn btn-danger btn-sm" onclick="removeAction(${index})">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateActionParams(action, index) {
    switch(action.type) {
        case 'send_chat':
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipo de Chat:</label>
                        <select class="form-control" onchange="updateAction(${index}, 'chatType', this.value)">
                            <option value="0" ${action.chatType === '0' ? 'selected' : ''}>CHAT_SINGLE</option>
                            <option value="1" ${action.chatType === '1' ? 'selected' : ''}>CHAT_INSTANCE</option>
                            <option value="2" ${action.chatType === '2' || !action.chatType ? 'selected' : ''}>CHAT_WORLD</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Player ID:</label>
                        <input type="number" class="form-control" value="${action.playerId || 32}" placeholder="32 para global"
                               onchange="updateAction(${index}, 'playerId', parseInt(this.value))">
                        <small class="form-text">Use 32 para mensagem global</small>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Canal:</label>
                        <select class="form-control" onchange="updateAction(${index}, 'channel', parseInt(this.value))">
                            <option value="0" ${action.channel === 0 ? 'selected' : ''}>GN_CHAT_CHANNEL_LOCAL</option>
                            <option value="1" ${action.channel === 1 ? 'selected' : ''}>GN_CHAT_CHANNEL_FARCRY</option>
                            <option value="2" ${action.channel === 2 ? 'selected' : ''}>GN_CHAT_CHANNEL_TEAM</option>
                            <option value="3" ${action.channel === 3 ? 'selected' : ''}>GN_CHAT_CHANNEL_FACTION</option>
                            <option value="4" ${action.channel === 4 ? 'selected' : ''}>GN_CHAT_CHANNEL_WHISPER</option>
                            <option value="5" ${action.channel === 5 ? 'selected' : ''}>GN_CHAT_CHANNEL_DAMAGE</option>
                            <option value="6" ${action.channel === 6 ? 'selected' : ''}>GN_CHAT_CHANNEL_FIGHT</option>
                            <option value="7" ${action.channel === 7 ? 'selected' : ''}>GN_CHAT_CHANNEL_TRADE</option>
                            <option value="8" ${action.channel === 8 ? 'selected' : ''}>GN_CHAT_CHANNEL_SYSTEM</option>
                            <option value="9" ${action.channel === 9 ? 'selected' : ''}>GN_CHAT_CHANNEL_BROADCAST</option>
                            <option value="10" ${action.channel === 10 ? 'selected' : ''}>GN_CHAT_CHANNEL_MISC</option>
                            <option value="11" ${action.channel === 11 ? 'selected' : ''}>GN_CHAT_CHANNEL_INSTANCE</option>
                            <option value="12" ${action.channel === 12 ? 'selected' : ''}>GN_CHAT_CHANNEL_SUPERFARCRY</option>
                            <option value="13" ${action.channel === 13 ? 'selected' : ''}>GN_CHAT_CHANNEL_BATTLE</option>
                            <option value="14" ${action.channel === 14 ? 'selected' : ''}>GN_CHAT_CHANNEL_COUNTRY</option>
                            <option value="15" ${action.channel === 15 || !action.channel ? 'selected' : ''}>Canal para Avisos da Administração</option>
                            <option value="16" ${action.channel === 16 ? 'selected' : ''}>GN_CHAT_CHANNEL_ALLIANCE</option>
                            <option value="17" ${action.channel === 17 ? 'selected' : ''}>GN_CHAT_CHANNEL_CENTER</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Mensagem:</label>
                    <textarea class="form-control" rows="3" placeholder="Digite a mensagem do evento"
                              onchange="updateAction(${index}, 'message', this.value)">${action.message || ''}</textarea>
                </div>
            `;
        case 'give_item':
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>Player ID:</label>
                        <input type="number" class="form-control" value="${action.playerId || ''}" placeholder="ID do jogador"
                               onchange="updateAction(${index}, 'playerId', parseInt(this.value))">
                    </div>
                    <div class="form-group">
                        <label>ID do Item:</label>
                        <input type="number" class="form-control" value="${action.itemId || ''}" placeholder="ID do Item"
                               onchange="updateAction(${index}, 'itemId', parseInt(this.value))">
                    </div>
                    <div class="form-group">
                        <label>Quantidade:</label>
                        <input type="number" class="form-control" value="${action.quantity || 1}" placeholder="Quantidade"
                               onchange="updateAction(${index}, 'quantity', parseInt(this.value))">
                    </div>
                </div>
            `;
        case 'give_gold':
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>Player ID:</label>
                        <input type="number" class="form-control" value="${action.playerId || ''}" placeholder="ID do jogador"
                               onchange="updateAction(${index}, 'playerId', parseInt(this.value))">
                    </div>
                    <div class="form-group">
                        <label>Quantidade de Gold:</label>
                        <input type="number" class="form-control" value="${action.amount || 1000}" placeholder="Quantidade"
                               onchange="updateAction(${index}, 'amount', parseInt(this.value))">
                    </div>
                </div>
            `;
        case 'give_soul':
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>Player ID:</label>
                        <input type="number" class="form-control" value="${action.playerId || ''}" placeholder="ID do jogador"
                               onchange="updateAction(${index}, 'playerId', parseInt(this.value))">
                    </div>
                    <div class="form-group">
                        <label>Quantidade de Soul:</label>
                        <input type="number" class="form-control" value="${action.amount || 100}" placeholder="Quantidade"
                               onchange="updateAction(${index}, 'amount', parseInt(this.value))">
                    </div>
                </div>
            `;
        case 'give_money':
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>Player ID:</label>
                        <input type="number" class="form-control" value="${action.playerId || ''}" placeholder="ID do jogador"
                               onchange="updateAction(${index}, 'playerId', parseInt(this.value))">
                    </div>
                    <div class="form-group">
                        <label>Quantidade de KKs:</label>
                        <input type="number" class="form-control" value="${action.amount || 10}" placeholder="Quantidade"
                               onchange="updateAction(${index}, 'amount', parseInt(this.value))">
                    </div>
                </div>
            `;
        case 'teleport':
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>Player ID:</label>
                        <input type="number" class="form-control" value="${action.playerId || ''}" placeholder="ID do jogador"
                               onchange="updateAction(${index}, 'playerId', parseInt(this.value))">
                    </div>
                    <div class="form-group">
                        <label>Zona:</label>
                        <input type="number" class="form-control" value="${action.zone || 1}" placeholder="Zona/Map"
                               onchange="updateAction(${index}, 'zone', parseInt(this.value))">
                    </div>
                    <div class="form-group">
                        <label>X:</label>
                        <input type="number" class="form-control" value="${action.x || 0}" placeholder="X"
                               onchange="updateAction(${index}, 'x', parseInt(this.value))">
                    </div>
                    <div class="form-group">
                        <label>Y:</label>
                        <input type="number" class="form-control" value="${action.y || 0}" placeholder="Y"
                               onchange="updateAction(${index}, 'y', parseInt(this.value))">
                    </div>
                    <div class="form-group">
                        <label>Z:</label>
                        <input type="number" class="form-control" value="${action.z || 0}" placeholder="Z"
                               onchange="updateAction(${index}, 'z', parseInt(this.value))">
                    </div>
                </div>
            `;
        case 'activate_trigger':
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>ID do Trigger:</label>
                        <input type="number" class="form-control" value="${action.triggerId || ''}" placeholder="ID do Trigger"
                               onchange="updateAction(${index}, 'triggerId', parseInt(this.value))">
                        <small class="form-text">ID do trigger que será ativado</small>
                    </div>
                </div>
            `;
        case 'deactivate_trigger':
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>ID do Trigger:</label>
                        <input type="number" class="form-control" value="${action.triggerId || ''}" placeholder="ID do Trigger"
                               onchange="updateAction(${index}, 'triggerId', parseInt(this.value))">
                        <small class="form-text">ID do trigger que será desativado</small>
                    </div>
                </div>
            `;
        default:
            return '<div class="form-row"><div class="form-group"><em>Selecione um tipo de ação</em></div></div>';
    }
}

function generateActionsPreview() {
    if (!currentEventData.actions || currentEventData.actions.length === 0) {
        return '<i class="fas fa-exclamation-triangle"></i> Nenhuma ação configurada';
    }
    
    return currentEventData.actions.map(action => {
        return `<i class="fas fa-arrow-right"></i> ${getActionText(action)}`;
    }).join('<br>');
}

function getActionText(action) {
    switch(action.type) {
        case 'send_chat':
            const channels = {
                0: 'Chat Local',
                1: 'Farcry',
                2: 'Team',
                3: 'Faction',
                4: 'Whisper',
                5: 'Damage',
                6: 'Fight',
                7: 'Trade',
                8: 'System',
                9: 'Broadcast',
                10: 'Misc',
                11: 'Instance',
                12: 'Superfarcry',
                13: 'Battle',
                14: 'Country',
                15: 'Avisos da Administração',
                16: 'Alliance',
                17: 'Center'
            };
            const chatTypes = {
                0: 'Single',
                1: 'Instance',
                2: 'World'
            };
            return `Enviar mensagem ${chatTypes[action.chatType] || 'World'} (${channels[action.channel] || 'Avisos da Administração'}): "${action.message || 'Mensagem vazia'}"`;
        case 'give_item':
            return `Dar ${action.quantity || 1}x item ID ${action.itemId || 'XXXXX'} para jogador ${action.playerId || 'XXXXX'}`;
        case 'give_gold':
            return `Dar ${action.amount || 0} de gold para jogador ${action.playerId || 'XXXXX'}`;
        case 'give_soul':
            return `Dar ${action.amount || 0} de soul para jogador ${action.playerId || 'XXXXX'}`;
        case 'give_money':
            return `Dar ${action.amount || 0} KKs para jogador ${action.playerId || 'XXXXX'}`;
        case 'teleport':
            return `Teleportar jogador ${action.playerId || 'XXXXX'} para zona ${action.zone || 'X'} (${action.x || 0}, ${action.y || 0}, ${action.z || 0})`;
        case 'activate_trigger':
            return `Ativar trigger ID ${action.triggerId || 'XXXXX'}`;
        case 'deactivate_trigger':
            return `Desativar trigger ID ${action.triggerId || 'XXXXX'}`;
        default:
            return 'Ação desconhecida';
    }
}

function addAction() {
    if (!currentEventData.actions) {
        currentEventData.actions = [];
    }
    
    currentEventData.actions.push({
        type: 'give_item',
        itemId: '',
        quantity: 1
    });
    
    // Recarregar apenas a etapa de ações (etapa 2)
    loadStepContent(2);
    
    // Mostrar feedback visual
    showNotification('Nova ação adicionada! Configure os parâmetros abaixo.', 'success');
    
    // Scroll para a nova ação
    setTimeout(() => {
        const actionsList = document.getElementById('actionsList');
        if (actionsList) {
            actionsList.scrollTop = actionsList.scrollHeight;
        }
    }, 100);
}

function removeAction(index) {
    if (!currentEventData.actions || currentEventData.actions.length === 0) {
        showNotification('Nenhuma ação para remover!', 'warning');
        return;
    }
    
    currentEventData.actions.splice(index, 1);
    // Recarregar apenas a etapa de ações (etapa 2)
    loadStepContent(2);
    
    showNotification('Ação removida com sucesso!', 'info');
}

function updateActionType(index, type) {
    if (currentEventData.actions[index]) {
        // Reset action object with new type
        const baseAction = { type: type };
        
        switch(type) {
            case 'send_chat':
                baseAction.message = '';
                baseAction.chatType = '2'; // CHAT_WORLD por padrão
                baseAction.channel = 15; // Canal para Avisos da Administração por padrão
                baseAction.playerId = 32; // Global por padrão
                break;
            case 'give_item':
                baseAction.playerId = '';
                baseAction.itemId = '';
                baseAction.quantity = 1;
                break;
            case 'give_gold':
                baseAction.playerId = '';
                baseAction.amount = 1000;
                break;
            case 'give_soul':
                baseAction.playerId = '';
                baseAction.amount = 100;
                break;
            case 'give_money':
                baseAction.playerId = '';
                baseAction.amount = 10;
                break;
            case 'teleport':
                baseAction.playerId = '';
                baseAction.zone = 1;
                baseAction.x = 0;
                baseAction.y = 0;
                baseAction.z = 0;
                break;
            case 'activate_trigger':
                baseAction.triggerId = '';
                break;
            case 'deactivate_trigger':
                baseAction.triggerId = '';
                break;
        }
        
        currentEventData.actions[index] = baseAction;
        loadStepContent(2); // Recarregar a etapa de ações
    }
}

function updateAction(index, field, value) {
    if (!currentEventData.actions) {
        currentEventData.actions = [];
        return;
    }
    
    if (currentEventData.actions[index]) {
        const numericFields = ['itemId', 'count', 'amount', 'mapId', 'x', 'y', 'z', 'npcId', 'buffId', 'duration', 'titleId', 'channel', 'playerId', 'quantity', 'zone', 'triggerId'];
        const stringFields = ['chatType', 'message'];
        
        if (numericFields.includes(field)) {
            currentEventData.actions[index][field] = parseInt(value) || 0;
        } else {
            currentEventData.actions[index][field] = value;
        }
        
        const previewBox = document.querySelector('.preview-box');
        if (previewBox) {
            previewBox.innerHTML = generateActionsPreview();
        }
    }
}

// Schedule Step Functions
function generateScheduleStep() {
    // Garantir que schedule existe
    if (!currentEventData.schedule) {
        currentEventData.schedule = { type: 'always', enabled: true };
    }
    
    return `
        <div class="step-header">
            <h4><i class="fas fa-calendar-alt"></i> Agendamento</h4>
            <p>Configure quando e como o evento será executado</p>
        </div>
        
        <div class="form-group">
            <label for="scheduleType">Tipo de Agendamento:</label>
            <select id="scheduleType" class="form-control" onchange="updateScheduleType()">
                <option value="always" ${currentEventData.schedule?.type === 'always' ? 'selected' : ''}>Sempre Ativo</option>
                <option value="interval" ${currentEventData.schedule?.type === 'interval' ? 'selected' : ''}>Intervalo de Tempo</option>
                <option value="datetime" ${currentEventData.schedule?.type === 'datetime' ? 'selected' : ''}>Data/Hora Específica</option>
                <option value="daily" ${currentEventData.schedule?.type === 'daily' ? 'selected' : ''}>Diariamente</option>
                <option value="weekly" ${currentEventData.schedule?.type === 'weekly' ? 'selected' : ''}>Semanalmente</option>
            </select>
        </div>
        
        <div id="scheduleOptions">
            ${generateScheduleOptions(currentEventData.schedule?.type || 'always')}
        </div>
        
        <div class="form-group">
            <div class="form-check">
                <input type="checkbox" id="eventEnabled" class="form-check-input" 
                       ${currentEventData.schedule?.enabled !== false ? 'checked' : ''} 
                       onchange="updateScheduleEnabled()">
                <label for="eventEnabled" class="form-check-label">Evento Ativo</label>
                <small class="form-text">Desmarque para criar o evento desabilitado</small>
            </div>
        </div>
        
        <div class="step-preview">
            <h5>Preview do Agendamento:</h5>
            <div class="preview-box">
                ${generateSchedulePreview()}
            </div>
        </div>
    `;
}

function generateScheduleOptions(type) {
    switch(type) {
        case 'interval':
            return `
                <div class="form-group">
                    <label for="intervalValue">Intervalo (segundos):</label>
                    <input type="number" id="intervalValue" class="form-control" 
                           value="${currentEventData.schedule?.interval || 3600}" min="60" 
                           onchange="updateScheduleInterval()">
                    <small class="form-text">Mínimo 60 segundos</small>
                </div>
            `;
        case 'datetime':
            return `
                <div class="form-group">
                    <label for="eventDateTime">Data e Hora:</label>
                    <input type="datetime-local" id="eventDateTime" class="form-control" 
                           value="${currentEventData.schedule?.datetime || ''}" 
                           onchange="updateScheduleDateTime()">
                </div>
            `;
        case 'daily':
            return `
                <div class="form-group">
                    <label for="dailyTime">Horário:</label>
                    <input type="time" id="dailyTime" class="form-control" 
                           value="${currentEventData.schedule?.time || '12:00'}" 
                           onchange="updateScheduleTime()">
                </div>
            `;
        case 'weekly':
            return `
                <div class="form-group">
                    <label for="weeklyDay">Dia da Semana:</label>
                    <select id="weeklyDay" class="form-control" onchange="updateScheduleDay()">
                        <option value="0" ${currentEventData.schedule?.day === 0 ? 'selected' : ''}>Domingo</option>
                        <option value="1" ${currentEventData.schedule?.day === 1 ? 'selected' : ''}>Segunda</option>
                        <option value="2" ${currentEventData.schedule?.day === 2 ? 'selected' : ''}>Terça</option>
                        <option value="3" ${currentEventData.schedule?.day === 3 ? 'selected' : ''}>Quarta</option>
                        <option value="4" ${currentEventData.schedule?.day === 4 ? 'selected' : ''}>Quinta</option>
                        <option value="5" ${currentEventData.schedule?.day === 5 ? 'selected' : ''}>Sexta</option>
                        <option value="6" ${currentEventData.schedule?.day === 6 ? 'selected' : ''}>Sábado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="weeklyTime">Horário:</label>
                    <input type="time" id="weeklyTime" class="form-control" 
                           value="${currentEventData.schedule?.time || '12:00'}" 
                           onchange="updateScheduleTime()">
                </div>
            `;
        default:
            return '<p class="text-muted">Este evento será executado conforme o trigger configurado.</p>';
    }
}

function generateSchedulePreview() {
    const schedule = currentEventData.schedule;
    if (!schedule || !schedule.enabled) {
        return '<i class="fas fa-pause-circle"></i> Evento desabilitado';
    }
    
    switch(schedule.type) {
        case 'always':
            return '<i class="fas fa-infinity"></i> Sempre ativo - executado conforme trigger';
        case 'interval':
            return `<i class="fas fa-clock"></i> A cada ${schedule.interval} segundos`;
        case 'datetime':
            return `<i class="fas fa-calendar"></i> Em ${new Date(schedule.datetime).toLocaleString('pt-BR')}`;
        case 'daily':
            return `<i class="fas fa-calendar-day"></i> Todos os dias às ${schedule.time}`;
        case 'weekly':
            const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
            return `<i class="fas fa-calendar-week"></i> Toda ${days[schedule.day]} às ${schedule.time}`;
        default:
            return '<i class="fas fa-question"></i> Agendamento não configurado';
    }
}

function updateScheduleType() {
    const type = document.getElementById('scheduleType').value;
    if (!currentEventData.schedule) {
        currentEventData.schedule = {};
    }
    currentEventData.schedule.type = type;
    
    document.getElementById('scheduleOptions').innerHTML = generateScheduleOptions(type);
    document.querySelector('.preview-box').innerHTML = generateSchedulePreview();
}

function updateScheduleEnabled() {
    if (!currentEventData.schedule) {
        currentEventData.schedule = {};
    }
    currentEventData.schedule.enabled = document.getElementById('eventEnabled').checked;
    document.querySelector('.preview-box').innerHTML = generateSchedulePreview();
}

function updateScheduleInterval() {
    if (!currentEventData.schedule) {
        currentEventData.schedule = {};
    }
    currentEventData.schedule.interval = parseInt(document.getElementById('intervalValue').value);
    document.querySelector('.preview-box').innerHTML = generateSchedulePreview();
}

function updateScheduleDateTime() {
    if (!currentEventData.schedule) {
        currentEventData.schedule = {};
    }
    
    const datetimeValue = document.getElementById('eventDateTime').value;
    console.log('Atualizando datetime:', datetimeValue);
    
    if (datetimeValue) {
        // Separar data e hora para compatibilidade com a lógica de agendamento
        const datetime = new Date(datetimeValue);
        currentEventData.schedule.date = datetime.toISOString().split('T')[0]; // YYYY-MM-DD
        currentEventData.schedule.time = datetime.toTimeString().substr(0, 5); // HH:MM
        currentEventData.schedule.datetime = datetimeValue; // Manter o valor original também
        
        console.log('Schedule atualizado:', {
            date: currentEventData.schedule.date,
            time: currentEventData.schedule.time,
            datetime: currentEventData.schedule.datetime
        });
    }
    
    document.querySelector('.preview-box').innerHTML = generateSchedulePreview();
}

function updateScheduleTime() {
    if (!currentEventData.schedule) {
        currentEventData.schedule = {};
    }
    const timeInput = document.getElementById('dailyTime') || document.getElementById('weeklyTime');
    currentEventData.schedule.time = timeInput.value;
    document.querySelector('.preview-box').innerHTML = generateSchedulePreview();
}

function updateScheduleDay() {
    if (!currentEventData.schedule) {
        currentEventData.schedule = {};
    }
    currentEventData.schedule.day = parseInt(document.getElementById('weeklyDay').value);
    document.querySelector('.preview-box').innerHTML = generateSchedulePreview();
}

// Summary Step Functions
function generateSummaryStep() {
    return `
        <div class="step-header">
            <h4><i class="fas fa-check-circle"></i> Resumo do Evento</h4>
            <p>Revise todas as configurações antes de salvar</p>
        </div>
        
        <div class="event-summary">
            <div class="summary-section">
                <h5><i class="fas fa-info-circle"></i> Informações Básicas</h5>
                <div class="summary-item">
                    <strong>Nome:</strong> ${currentEventData.name || 'Evento sem nome'}
                </div>
                <div class="summary-item">
                    <strong>Descrição:</strong> ${currentEventData.description || 'Sem descrição'}
                </div>
            </div>
            
            <div class="summary-section">
                <h5><i class="fas fa-calendar-alt"></i> Agendamento</h5>
                <div class="summary-item">
                    ${generateSchedulePreview()}
                </div>
            </div>
            
            <div class="summary-section">
                <h5><i class="fas fa-cogs"></i> Ações</h5>
                <div class="summary-item">
                    ${generateActionsPreview()}
                </div>
            </div>
        </div>
        
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <strong>Importante:</strong> O evento será iniciado automaticamente após ser salvo e executará as ações configuradas no intervalo especificado.
        </div>
    `;
}

// Player Info functions
function getRoleBase() {
    const roleId = document.getElementById('playerInfoRoleId').value;
    if (!roleId) {
        showNotification('Por favor, insira um ID válido.', 'error');
        return;
    }
    
    fetch(`/api/getrolebase/${roleId}`)
        .then(response => response.json())
        .then(data => {
            displayPlayerInfo(data, 'Dados Base');
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Erro ao consultar dados base.', 'error');
        });
}

function getRoleStatus() {
    const roleId = document.getElementById('playerInfoRoleId').value;
    if (!roleId) {
        showNotification('Por favor, insira um ID válido.', 'error');
        return;
    }
    
    fetch(`/api/getrolestatus/${roleId}`)
        .then(response => response.json())
        .then(data => {
            displayPlayerInfo(data, 'Status');
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Erro ao consultar status.', 'error');
        });
}

function getRoleData() {
    const roleId = document.getElementById('playerInfoRoleId').value;
    if (!roleId) {
        showNotification('Por favor, insira um ID válido.', 'error');
        return;
    }
    
    fetch(`/api/getrole/${roleId}`)
        .then(response => response.json())
        .then(data => {
            displayPlayerInfo(data, 'Dados Completos');
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Erro ao consultar dados completos.', 'error');
        });
}

function displayPlayerInfo(data, type) {
    const resultsDiv = document.getElementById('playerInfoResults');
    const displayDiv = document.getElementById('infoDisplay');
    
    resultsDiv.style.display = 'block';
    
    if (data.success) {
        let html = `<h5>${type}:</h5><div class="info-grid">`;
        for (const [key, value] of Object.entries(data.data)) {
            html += `
                <div class="info-item">
                    <strong>${key}:</strong>
                    <span>${typeof value === 'object' ? JSON.stringify(value) : value}</span>
                </div>`;
        }
        html += '</div>';
        displayDiv.innerHTML = html;
        showNotification(`${type} consultado com sucesso!`, 'success');
    } else {
        displayDiv.innerHTML = `<p class="error-text">Erro: ${data.message}</p>`;
        showNotification(`Erro ao consultar ${type.toLowerCase()}.`, 'error');
    }
}

// Online Players functions
function loadOnlinePlayers() {
    const onlineDiv = document.getElementById('onlinePlayersFull');
    const countSpan = document.getElementById('onlineCount');
    
    onlineDiv.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i><span>Carregando lista completa...</span></div>';
    
    fetch('/api/onlineusers')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.users) {
                countSpan.textContent = `${data.users.length} jogadores`;
                displayOnlinePlayersList(data.users);
            } else {
                onlineDiv.innerHTML = '<p class="error-text">Nenhum jogador online encontrado.</p>';
                countSpan.textContent = '0 jogadores';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            onlineDiv.innerHTML = '<p class="error-text">Erro ao carregar lista de jogadores.</p>';
            countSpan.textContent = 'Erro';
        });
}

function displayOnlinePlayersList(users) {
    const onlineDiv = document.getElementById('onlinePlayersFull');
    
    if (users.length === 0) {
        onlineDiv.innerHTML = '<p>Nenhum jogador online no momento.</p>';
        return;
    }
    
    let html = '<div class="online-players-grid">';
    users.forEach(user => {
        html += `
            <div class="player-card">
                <div class="player-info">
                    <strong>${user.name || 'N/A'}</strong>
                    <span>User ID: ${user.userid || 'N/A'}</span>
                    <span>Role ID: ${user.roleid || 'N/A'}</span>
                    <span>Status: ${user.status || 'N/A'}</span>
                </div>
                <div class="player-actions">
                    <button class="btn btn-sm btn-info" onclick="viewPlayerDetails(${user.roleid || user.userid})">
                        <i class="fas fa-info"></i>
                    </button>
                </div>
            </div>`;
    });
    html += '</div>';
    
    onlineDiv.innerHTML = html;
}

function viewPlayerDetails(roleId) {
    // Switch to player info tab and auto-fill the role ID
    showTab('playerinfo');
    document.getElementById('playerInfoRoleId').value = roleId;
    showNotification(`Role ID ${roleId} preenchido na aba Info Personagem.`, 'info');
}

function loadServerStatus() {
    const statusDiv = document.getElementById('statusDisplay');
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando status...';
    
    // Since there's no specific server status endpoint, we'll check online users as indicator
    fetch('/api/onlineusers')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const onlineCount = data.users ? data.users.length : 0;
                statusDiv.innerHTML = `
                    <div class="status-info">
                        <div class="status-item">
                            <i class="fas fa-server"></i>
                            <span><strong>Status:</strong> Online</span>
                        </div>
                        <div class="status-item">
                            <i class="fas fa-users"></i>
                            <span><strong>Jogadores Online:</strong> ${onlineCount}</span>
                        </div>
                        <div class="status-item">
                            <i class="fas fa-clock"></i>
                            <span><strong>Última verificação:</strong> ${new Date().toLocaleString()}</span>
                        </div>
                    </div>`;
            } else {
                statusDiv.innerHTML = '<p class="error-text">Erro ao verificar status do servidor.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            statusDiv.innerHTML = '<p class="error-text">Servidor pode estar offline ou com problemas.</p>';
        });
}

// Initialize moderation forms
function setupModerationForms() {
    const banAccountForm = document.getElementById('banAccountForm');
    const banCharacterForm = document.getElementById('banCharacterForm');
    const muteAccountForm = document.getElementById('muteAccountForm');
    const muteCharacterForm = document.getElementById('muteCharacterForm');

    if (banAccountForm) {
        banAccountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            fetch('/api/banuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Conta banida com sucesso!', 'success');
                    this.reset();
                } else {
                    showNotification(data.message || 'Erro ao banir conta.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Erro ao banir conta.', 'error');
            });
        });
    }

    if (banCharacterForm) {
        banCharacterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            fetch('/api/banrole', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Personagem banido com sucesso!', 'success');
                    this.reset();
                } else {
                    showNotification(data.message || 'Erro ao banir personagem.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Erro ao banir personagem.', 'error');
            });
        });
    }

    if (muteAccountForm) {
        muteAccountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            fetch('/api/muteuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Conta mutada com sucesso!', 'success');
                    this.reset();
                } else {
                    showNotification(data.message || 'Erro ao mutar conta.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Erro ao mutar conta.', 'error');
            });
        });
    }

    if (muteCharacterForm) {
        muteCharacterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            fetch('/api/muterole', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Personagem mutado com sucesso!', 'success');
                    this.reset();
                } else {
                    showNotification(data.message || 'Erro ao mutar personagem.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Erro ao mutar personagem.', 'error');
            });
        });
    }
}

// Initialize server forms
function setupServerForms() {
    const serverForbidForm = document.getElementById('serverForbidForm');
    
    if (serverForbidForm) {
        serverForbidForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = {};
            
            // Convert comma-separated values to arrays
            for (const [key, value] of formData.entries()) {
                if (value.trim()) {
                    data[key] = value.split(',').map(item => item.trim()).filter(item => item);
                }
            }
            
            fetch('/api/setserverforbid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Proibições aplicadas com sucesso!', 'success');
                } else {
                    showNotification(data.message || 'Erro ao aplicar proibições.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Erro ao aplicar proibições.', 'error');
            });
        });
    }
}

// Player Info functions
function showPlayerInfo(playerId) {
    const roleId = playerId;
    window.open(`/player-info.html?roleId=${roleId}`, '_blank');
}

function copyToClipboard(value, element) {
    navigator.clipboard.writeText(value).then(() => {
        const originalIcon = element.innerHTML;
        element.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            element.innerHTML = originalIcon;
        }, 1000);
    });
}

// Initialize all new features when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Setup forms after DOM is loaded
    setTimeout(() => {
        setupModerationForms();
        setupServerForms();
    }, 100);
});