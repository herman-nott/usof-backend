class Post {
    constructor(db) {
        this.db = db;
    }

    // получить все посты с пагинацией
    async selectAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [{ count }] = await this.db('posts').count('id as count');;

        const posts = await this.db('posts')
            .select('*')
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);

        return {
            page: page,
            totalPages: Math.ceil(count / limit),
            totalPosts: count,
            posts: posts
        };
    }

    // поиск по id
    async findById(postId) {
        return await this.db('posts').where({ id: postId }).first();
    }
}

export default Post;