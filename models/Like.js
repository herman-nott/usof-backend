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
    async createOrUpdate(postId = null, commentId = null, authorId, type) {
        if (!postId && !commentId) {
            throw new Error("Either postId or commentId must be provided");
        }

        const existing = await this.db("likes")
            .where({ 
                author_id: authorId, 
                ...(postId ? { post_id: postId } : { comment_id: commentId }) 
            })
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
            comment_id: commentId,
            author_id: authorId,
            type: type
        });

        return await this.db("likes").where({ id }).first();
    }

    // удалить лайк
    async delete(postId = null, commentId = null, authorId) {
        if (!authorId) {
            throw new Error("authorId is required");
        }

        const query = this.db("likes").where({ author_id: authorId });

        if (postId) {
            query.andWhere({ post_id: postId });
        } else if (commentId) {
            query.andWhere({ comment_id: commentId });
        } else {
            throw new Error("Either postId or commentId must be provided");
        }

        return await query.del();
    }

    // получить все лайки для конкретного комментария
    async findByCommentId(commentId) {
        return await this.db('likes')
            .where({ comment_id: commentId })
            .select('id', 'author_id', 'type', 'created_at');
    }
}

export default Like;