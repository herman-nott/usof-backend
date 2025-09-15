import Post from "../../models/Post.js";

async function handleLockPost(req, res, db) {
    try {
        const { post_id } = req.params;

        const postModel = new Post(db);

        if (!(await postModel.isLocked(post_id))) {
            const result = await postModel.lock(post_id);
            res.json(result);
        } else {
            res.json({ message: 'Post is already locked' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleLockPost;