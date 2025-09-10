class EmailVerification {
    constructor(db) {
        this.db = db;
    }

    // сохранить код
    async create(userId, code, expiresAt) {
        const [id] = await this.db('email_verifications').insert({
            user_id: userId,
            code,
            expires_at: expiresAt
        });
        return id;
    }

    // удалить код
    async deleteById(id) {
        return await this.db('email_verifications').where({ id }).delete();
    }

    // найти запись по user_id и коду
    async findByUserAndCode(userId, code) {
        return await this.db('email_verifications')
            .where({ user_id: userId, code })
            .andWhere('expires_at', '>', new Date())
            .first();
    }
}

export default EmailVerification;