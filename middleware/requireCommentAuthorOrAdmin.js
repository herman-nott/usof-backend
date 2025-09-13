import Comment from "../models/Comment.js";
import db from "../db.js";

async function requireCommentAuthorOrAdmin(req, res, next) {
    try {
        const sessionUser = req.session.user;
        const { comment_id } = req.params;

        const commentModel = new Comment(db);
        const comment = await commentModel.findById(comment_id);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (sessionUser.role !== "admin" && comment.author_id !== sessionUser.id) {
            return res.status(403).json({ error: "Forbidden: you are not allowed to delete this comment" });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default requireCommentAuthorOrAdmin;
