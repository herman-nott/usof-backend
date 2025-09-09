class PostCategory {
    constructor(db) {
        this.db = db;
    }

    // привязать категории к посту
    async attachCategoriesToPost(postId, categoryIds) {
        for (const categoryId of categoryIds) {
            await this.db("post_categories").insert({
                post_id: postId,
                category_id: categoryId
            });
        }
    }

    // получить категории по ID поста
    async getCategoriesByPostId(postId) {
        return await this.db("categories")
            .join("post_categories", "categories.id", "post_categories.category_id")
            .where("post_categories.post_id", postId)
            .select("categories.*");
    }
}

export default PostCategory;