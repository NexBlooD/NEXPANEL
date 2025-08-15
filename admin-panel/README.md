# Perfect World - Painel Administrativo

Um painel web moderno e profissional para administração do servidor Perfect World, desenvolvido em Node.js com tema escuro e interface responsiva.

## 🚀 Características

- ✨ Interface moderna com tema escuro profissional
- 🎨 Design responsivo e intuitivo
- ⚡ Comunicação em tempo real com Socket.IO
- 🛡️ Sistema de notificações
- 📊 Dashboard com estatísticas
- 🎮 Gerenciamento completo de jogadores
- 🎁 Sistema de itens
- 🗺️ Teleporte de jogadores
- 📝 Sistema de logs

## 🛠️ Instalação

1. **Instalar dependências:**
```bash
cd /PWServer/admin-panel
npm install
```

2. **Iniciar o servidor:**
```bash
npm start
```

3. **Para desenvolvimento (com auto-reload):**
```bash
npm run dev
```

4. **Acessar o painel:**
   - Abra seu navegador em: `http://localhost:3000`

## 📋 Funcionalidades

### Dashboard
- Estatísticas do servidor em tempo real
- Status de conexão
- Ações rápidas

### Gerenciar Jogadores
- Enviar Gold para jogadores
- Enviar Alma (Soul Power)
- Logs de atividades

### Gerenciar Itens
- Dar itens específicos por ID
- Lista de itens populares
- Presets de itens comuns

### Teleporte
- Teleportar jogadores para coordenadas específicas
- Especificar zona e mapa

### Logs
- Histórico de todas as ações
- Diferentes tipos de log (sucesso, aviso, erro)
- Logs em tempo real

## 🔧 Configuração

O painel se conecta ao plugin do servidor na porta `9020`. Certifique-se de que:

1. O plugin NexPluginPw está rodando
2. A porta 9020 está aberta
3. O servidor Perfect World está ativo

## 🎨 Interface

- **Tema:** Escuro profissional
- **Cores principais:** Azul e roxo com gradientes
- **Tipografia:** Inter (moderna e legível)
- **Ícones:** Font Awesome 6
- **Animações:** Suaves e responsivas

## 🔗 API Endpoints

- `POST /api/give-gold` - Enviar gold para jogador
- `POST /api/give-soul` - Enviar alma para jogador
- `POST /api/give-item` - Dar item para jogador
- `POST /api/teleport` - Teleportar jogador

## ⌨️ Atalhos de Teclado

- `Ctrl/Cmd + 1` - Dashboard
- `Ctrl/Cmd + 2` - Jogadores
- `Ctrl/Cmd + 3` - Itens
- `Ctrl/Cmd + 4` - Teleporte
- `Ctrl/Cmd + 5` - Logs

## 🔒 Segurança

- Interface acessível apenas localmente por padrão
- Validação de dados de entrada
- Tratamento de erros robusto
- Logs de todas as ações

## 📱 Responsivo

O painel é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

---

**Desenvolvido para administração eficiente do Perfect World Server** 🐉
