class Like {
    constructor(db) {
        this.db = db;
    }

    // получить все лайки для конкретного поста
    async findByPostId(postId) {
        return await this.db('likes')
            .where({ post_id: postId })
            .select('id', 'author_id', 'type', 'created_at');
    }

    // создать или обновить лайк
    async createOrUpdate(postId, authorId, type) {
        const existing = await this.db("likes")
            .where({ post_id: postId, author_id: authorId })
            .first();

        if (existing) {
            if (existing.type === type) {
                return existing;
            }

            await this.db("likes")
                .where({ id: existing.id })
                .update({ type: type });

            return await this.db("likes").where({ id: existing.id }).first();
        }

        const [id] = await this.db("likes").insert({
            post_id: postId,
            author_id: authorId,
            type: type
        });

        return await this.db("likes").where({ id }).first();
    }

    // удалить лайк
    async delete(postId, authorId) {
        return await this.db('likes')
            .where({ post_id: postId, author_id: authorId })
            .del();
    }
}

export default Like;