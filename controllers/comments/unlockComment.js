import Comment from "../../models/Comment.js";

async function handleUnlockComment(req, res, db) {
    try {
        const { comment_id } = req.params;

        const commentModel = new Comment(db);
        
        if (await commentModel.isLocked(comment_id)) {            
            const result = await commentModel.unlock(comment_id);
            res.json(result);
        } else {
            res.json({ message: 'Comment is already unlocked' });
        }   
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleUnlockComment;