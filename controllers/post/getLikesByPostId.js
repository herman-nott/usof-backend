import Like from "../../models/Like.js";

async function handleGetLikesByPostId(req, res, db) {
    try {
        const { post_id } = req.params;
        const likeModel = new Like(db);
        const likes = await likeModel.findByPostId(post_id);

        res.json({ post_id, likes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetLikesByPostId;