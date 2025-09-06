class User {
    constructor(db) {
        this.db = db;
        this.table = 'users';
    }

    // создание пользователя
    async create(userData) {
        const [id] = await this.db(this.table).insert(userData);
        return id;
    }

    // поиск по id
    async findById(id) {
        return await this.db(this.table).where({ id: id }).first();
    }

    // поиск по эмейлу или логину
    async findByEmailOrLogin(emailOrLogin) {
        return await this.db(this.table).where({ email: emailOrLogin }).orWhere('login', emailOrLogin).first();
    }

    // поиск по эмейл
    async findByEmail(email) {
        return await this.db('users').where({ email }).first();
    }

    // обновить пароль
    async updatePassword(id, newHashedPassword) {
        return await this.db('users')
            .where({ id })
            .update({ password_hash: newHashedPassword, updated_at: new Date() });
    }
}

export default User;