import Like from "../../models/Like.js";

async function handleDeleteLikeForComment(req, res, db) {
    try {
        const { comment_id } = req.params;
        const authorId = req.session.user.id;

        const likeModel = new Like(db);

        const deleted = await likeModel.delete(null, comment_id, authorId);

        if (!deleted) {
            return res.status(404).json({ error: "Like not found" });
        }

        res.json({ message: "Like removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleDeleteLikeForComment