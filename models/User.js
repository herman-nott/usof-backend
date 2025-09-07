class User {
    constructor(db) {
        this.db = db;
    }

    // создание пользователя
    async create(userData) {
        const [id] = await this.db('users').insert(userData);
        return id;
    }

    // поиск по id
    async findById(userId) {
        return await this.db('users').where({ id: userId }).first();
    }

    // поиск по эмейлу или логину
    async findByEmailOrLogin(emailOrLogin) {
        return await this.db('users').where({ email: emailOrLogin }).orWhere('login', emailOrLogin).first();
    }

    // поиск по эмейл
    async findByEmail(userEmail) {
        return await this.db('users').where({ email: userEmail }).first();
    }

    // обновить пароль
    async updatePassword(userId, newHashedPassword) {
        return await this.db('users')
            .where({ id: userId })
            .update({ password_hash: newHashedPassword, updated_at: new Date() });
    }

    // получить всех пользователей
    async selectAll() {
        return await this.db('users').select('*');
    }

    // обновить аватар
    async updateAvatar(userId, avatarPath) {
        return await this.db('users').where({ id: userId }).update({ profile_picture: avatarPath });
    }
}

export default User;