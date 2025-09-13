class Comment {
    constructor(db) {
        this.db = db;
    }

    // получить все комментарии для конкретного поста
    async findByPostId(postId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const [{ count }] = await this.db('comments')
            .where({ post_id: postId })
            .count('id as count');

         const comments = await this.db('comments')
            .where({ post_id: postId })
            .orderBy('created_at', 'desc') // новые комментарии первыми
            .limit(limit)
            .offset(offset);

        return {
            page: page,
            totalPages: Math.ceil(count / limit),
            totalComments: count,
            comments: comments
        };
    }

    // создать комметарий
    async create(postId, authorId, content, parentId = null) {
        const [id] = await this.db('comments').insert({
            post_id: postId,
            author_id: authorId,
            content: content,
            parent_id: parentId
        });

        return await this.db('comments').where({ id: id }).first();
    }

    // найти комметарий по id
    async findById(id) {
        return await this.db("comments").where({ id }).first();
    }

    // изменить комментарий
    async update(id, content) {
        await this.db("comments")
            .where({ id: id })
            .update({ content: content });

        return this.findById(id);
    }

    // удалить комментарий
    async delete(id) {
        return await this.db("comments").where({ id }).del();
    }
}

export default Comment;