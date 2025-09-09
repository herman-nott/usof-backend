import Like from "../../models/Like.js";

async function handleDeleteLikeFromPost(req, res, db) {
    try {
        const { post_id } = req.params;
        const userId = req.session.user.id;

        const likeModel = new Like(db);
        const deleted = await likeModel.delete(post_id, userId);

        if (!deleted) {
            return res.status(404).json({ error: "Like not found" });
        }

        res.json({ message: "Like removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default handleDeleteLikeFromPost;
