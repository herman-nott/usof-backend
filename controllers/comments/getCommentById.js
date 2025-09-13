import Comment from "../../models/Comment.js";

async function handleGetCommentById(req, res, db) {
    try {
        const { comment_id } = req.params;
        if (!comment_id) {
            return res.status(400).json({ error: "Comment ID is required" });
        }

        const commentModel = new Comment(db);
        const comment = await commentModel.findById(comment_id);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetCommentById;