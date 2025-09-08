import Comment from "../../models/Comment.js";

async function handleGetCommentsByPostId(req, res, db) {
    try {
        const { post_id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const commentModel = new Comment(db);
        const result = await commentModel.findByPostId(post_id, page, limit);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetCommentsByPostId;