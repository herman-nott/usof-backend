import Post from "../../models/Post.js";

async function handleGetPostById(req, res, db) {
    try {
        const { post_id } = req.params;

        const postModel = new Post(db);
        const post = await postModel.findById(post_id)

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetPostById;