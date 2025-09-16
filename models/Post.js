class Post {
    constructor(db) {
        this.db = db;
    }

    // получить все посты с пагинацией
    async selectAll(page = 1, limit = 10, sort = "rating", order = "desc") {
        const offset = (page - 1) * limit;
        const [{ count }] = await this.db('posts').count('id as count');        

        let query = this.db('posts') 
            .select( 
                'posts.*', 
                this.db.raw("COUNT(CASE WHEN likes.type = 'like' THEN 1 END) as likes_count"), 
                this.db.raw("COUNT(CASE WHEN likes.type = 'dislike' THEN 1 END) as dislikes_count"), 
                this.db.raw("COUNT(CASE WHEN likes.type = 'like' THEN 1 END) - COUNT(CASE WHEN likes.type = 'dislike' THEN 1 END) as rating") 
            ) 
            .leftJoin('likes', 'posts.id', 'likes.post_id') 
            .groupBy('posts.id'); 
            
        if (sort === 'date') { 
            query = query.orderBy('posts.publish_date', order); 
        } else if (sort === 'rating') { 
            query = query.orderBy('rating', order); 
        } else { 
            query = query.orderBy('likes_count', order); 
        } 
        
        const posts = await query.limit(limit).offset(offset); 
        
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

    // получить все посты по category_id
    async findPostsByCategoryId(categoryId) {
        return await this.db('posts')
            .join('post_categories', 'posts.id', 'post_categories.post_id')
            .where('post_categories.category_id', categoryId)
            .select(
                'posts.id',
                'posts.author_id',
                'posts.title',
                'posts.publish_date',
                'posts.status',
                'posts.content',
                'posts.created_at',
                'posts.updated_at'
            );
    }

    // залочить пост
    async lock(id) {
        await this.db('posts').where({ id }).update({ status: 'inactive' });
        return { message: "Post locked successfully" };
    }

    // разлочить пост
    async unlock(id) {
        await this.db('posts').where({ id }).update({ status: 'active' });
        return { message: "Post unlocked successfully" };
    }

    // проверить залочен ли пост
    async isLocked(id) {
        const post = await this.db('posts').where({ id }).select('status').first();
        if (!post) return false;
        return post.status !== 'active';
    }
}

export default Post;