import Comment from "../../models/Comment.js";

async function handleDeleteComment(req, res, db) {
    try {
        const { comment_id } = req.params;
        const user = req.session.user;

        const commentModel = new Comment(db);
        const comment = await commentModel.findById(comment_id);

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        await commentModel.delete(comment_id);
        
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleDeleteComment;