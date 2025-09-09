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

    // создать пост
    async create(authorId, title, content) {
        const [id] = await this.db("posts").insert({
            author_id: authorId,
            title: title,
            content: content
        });

        return await this.db("posts").where({ id: id }).first();
    }

    // обновить пост
    async update(postId, data) {
        const updateData = {};

        if (data.title !== undefined) {
            updateData.title = data.title;
        }
        if (data.content !== undefined) {
            updateData.content = data.content;
        }

        if (Object.keys(updateData).length > 0) {
            updateData.updated_at = this.db.fn.now();
            await this.db("posts")
                .where({ id: postId })
                .update(updateData);
        }

        if (data.categories !== undefined) {
            await this.db("post_categories").where({ post_id: postId }).del();

            if (Array.isArray(data.categories) && data.categories.length > 0) {
                const newCategories = data.categories.map(catId => ({
                    post_id: postId,
                    category_id: catId
                }));
                await this.db("post_categories").insert(newCategories);
            }
        }

        return await this.findById(postId);
    }

    // удалить пост
    async delete(postId) {
        return await this.db('posts').where({ id: postId }).del();
    }
}

export default Post;