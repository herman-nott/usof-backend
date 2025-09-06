class PasswordReset {
    // удалить старые токены сброса пароля
    static async deletePasswordResets(db, userId) {
        return db('password_resets').where({ user_id: userId }).del();
    }

    // создать запись с токеном
    static async createPasswordReset(db, userId, tokenHash, expiresAt) {
        return db('password_resets').insert({
            user_id: userId,
            token_hash: tokenHash,
            expires_at: expiresAt,
            used: false
        });
    }

    // найти запись в password_resets по хешу токена
    static async findResetToken(db, tokenHash) {
        return db('password_resets').where({ token_hash: tokenHash }).first();
    }

    // отметить токен как использованный
    static async markResetTokenUsed(db, id) {
        return db('password_resets')
            .where({ id })
            .update({ used: true });
    }
}

export default PasswordReset;