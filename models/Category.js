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
}

export default Category;