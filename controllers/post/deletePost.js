import Post from "../../models/Post.js";

async function handleDeletePost(req, res, db) {
    try {
        const { post_id } = req.params;
        const userId = req.session.user.id;

        const postModel = new Post(db);
        const post = await postModel.findById(post_id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.author_id !== userId) {
            return res.status(403).json({ error: "Forbidden: you are not the author of this post" });
        }

        await postModel.delete(post_id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleDeletePost;