import Post from "../models/Post.js";
import db from "../db.js";

async function requirePostAuthorOrAdmin(req, res, next) {
    try {
        const sessionUser = req.session.user;
        const { post_id } = req.params;

        const postModel = new Post(db);
        const post = await postModel.findById(post_id);

        if (sessionUser.role !== "admin" && post.author_id !== sessionUser.id) {
            return res.status(403).json({ error: "Forbidden: you are not allowed to delete this post" });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default requirePostAuthorOrAdmin;
