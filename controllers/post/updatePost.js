import Post from "../../models/Post.js";

async function handleUpdatePost(req, res, db) {
    try {
        const { post_id } = req.params;
        const { title, content, categories } = req.body;
        const userId = req.session.user.id;;

        const postModel = new Post(db);
        const post = await postModel.findById(post_id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.author_id !== userId) {
            return res.status(403).json({ error: "Forbidden: you are not the author of this post" });
        }

        const updatedPost = await postModel.update(post_id, {
            title,
            content,
            categories
        });

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleUpdatePost;