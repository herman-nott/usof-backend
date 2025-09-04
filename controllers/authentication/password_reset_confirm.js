import { deflate } from "zlib";

async function handlePasswordResetConfirm(req, res, db, bcrypt, crypto) {
    try {
        const { confirm_token } = req.params;
        const { new_password } = req.body;

        if (!new_password) {
            return res.status(400).json({ error: "Password is required" });
        }

        // поиск токена
        const resetToken = await db('password_resets')
            .where({ token_hash: crypto.createHash('sha256').update(confirm_token).digest('hex') })
            .first();

        // проверить наличие, скрок действия и использование токена
        if (!resetToken) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        if (resetToken.used) {
            return res.status(400).json({ error: "Token is already used" });   
        }

        if (new Date(resetToken.expires_at) < new Date()) {
            return res.status(400).json({ error: "Token has expired" });
        }

        // получить пользователя
        const user = await db('users').where({ id: resetToken.user_id }).first();
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 10);

        // обновить пароль
        await db('users')
            .where({ id: user.id })
            .update({ password_hash: hashedNewPassword, updated_at: new Date() });

        // поменять у токена used на true
        await db('password_resets')
            .where({ id: resetToken.id })
            .update({ used: true });

        return res.json({ message: "Password has been reset successfully" });        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
}

export default handlePasswordResetConfirm;