class Category {
    constructor(db) {
        this.db = db;
    }

    // получить все категории для поста
    async findByPostId(postId) {
        return await this.db('categories')
            .join('post_categories', 'categories.id', 'post_categories.category_id')
            .where('post_categories.post_id', postId)
            .select('categories.id', 'categories.title', 'categories.description');
    }

    // получить все категории
    async selectAll() {
        return await this.db('categories').select('*');
    }

    // получить категорию по id
    async findById(id) {
        return await this.db('categories').where({ id }).first();
    }

    // создать категорию
    async create(title, description) {
        const [id] = await this.db('categories').insert({ title: title, description: description });
        return this.findById(id);
    }

    // обновить категорию
    async update(id, title, description) {
        await this.db('categories')
            .where({ id })
            .update({ 
                ...(title !== undefined ? { title: title } : {}),
                ...(description !== undefined ? { description: description } : {}) 
            });
        return this.findById(id);
    }

    // удалить категорию
    async delete(id) {
        const deleted = await this.db('categories')
            .where({ id: id })
            .del();

        return deleted > 0; // true, если реально что-то удалилось
    }
}

export default Category;