import Like from "../../models/Like.js";

async function handleCreateLikeForComment(req, res, db) {
    try {
        const { comment_id } = req.params;
        const { type } = req.body;

        if (!["like", "dislike"].includes(type)) {
            return res.status(400).json({ error: "Type must be 'like' or 'dislike'" });
        }

        const authorId = req.session.user.id;

        const likeModel = new Like(db);
        const like = await likeModel.createOrUpdate(null, comment_id, authorId, type);

        res.status(201).json(like);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleCreateLikeForComment;