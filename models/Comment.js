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

    // залочить коммент
    async lock(id) {
        await this.db('comments').where({ id }).update({ status: 'inactive' });
        return { message: "Comment locked successfully" };
    }

    // разлочить коммент
    async unlock(id) {
        await this.db('comments').where({ id }).update({ status: 'active' });
        return { message: "Comment unlocked successfully" };
    }

    // проверить залочен ли коммент
    async isLocked(id) {
        const post = await this.db('comments').where({ id }).select('status').first();
        if (!post) return false;
        return post.status !== 'active';
    }
}

export default Comment;