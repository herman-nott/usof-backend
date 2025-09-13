import Comment from "../../models/Comment.js";
import Like from "../../models/Like.js";

async function handleGetLikesByCommentId(req, res, db) {
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

        const likeModel = new Like(db);
        const likes = await likeModel.findByCommentId(comment_id);

        res.json(likes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetLikesByCommentId;