const express = require('express');
const noblox = require('noblox.js');
const app = express();

app.use(express.json());

// Puxa a senha de segurança direto das configurações do Render
const CHAVE_SECRETA = process.env.SECRET_KEY || "EB_THE_FOX_SENHA_123"; 

async function startBot() {
    try {
        await noblox.setCookie(process.env.ROBLOX_COOKIE);
        console.log(`🤖 Bot conectado com sucesso como: ${(await noblox.getCurrentUser()).UserName}`);
    } catch (err) {
        console.error("❌ Falha ao logar o Bot. Verifique o Cookie!", err);
    }
}

app.post('/promote', async (req, res) => {
    const { UserId, GroupId, SecretKey } = req.body;

    if (SecretKey !== CHAVE_SECRETA) {
        return res.status(401).json({ success: false, error: "Acesso não autorizado." });
    }

    if (!UserId || !GroupId) {
        return res.status(400).json({ success: false, error: "Dados incompletos." });
    }

    try {
        const promotionResult = await noblox.promote(GroupId, UserId);
        return res.status(200).json({ 
            success: true, 
            newRole: promotionResult.newRoleName,
            oldRole: promotionResult.oldRoleName 
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`📡 Proxy rodando na porta ${PORT}`);
    startBot();
});
