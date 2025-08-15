const PRole = require('./PRole');
const roleService = new PRole();

const roleID = 1025;  // ID do personagem
const updates = { status: { reputation: 2500 } }; // Atualiza apenas a reputação

roleService.putRole(roleID, updates)
    .then(response => console.log("✅ Atualização concluída:", response))
    .catch(error => console.error("❌ Erro ao atualizar:", error));
