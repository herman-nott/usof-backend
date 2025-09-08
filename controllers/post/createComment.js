import Comment from "../../models/Comment.js";

async function handleCreateComment(req, res, db) {
    try {
        const { post_id } = req.params;
        const { content, parent_id } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        const authorId = req.session.user.id;

        const commentModel = new Comment(db);
        const newComment = await commentModel.create(post_id, authorId, content, parent_id);

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleCreateComment;