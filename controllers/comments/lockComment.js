import Comment from "../../models/Comment.js";

async function handleLockComment(req, res, db) {
    try {
        const { comment_id } = req.params;

        const commentModel = new Comment(db);

        if (!(await commentModel.isLocked(comment_id))) {
            const result = await commentModel.lock(comment_id);
            res.json(result);
        } else {
            res.json({ message: 'Comment is already locked' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleLockComment;