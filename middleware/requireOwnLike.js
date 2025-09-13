import db from "../db.js";

async function requireOwnLike(req, res, next) {
    try {
        const sessionUser = req.session.user;
        const { post_id, comment_id } = req.params;

        if (!sessionUser) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        let query = db("likes").where({ author_id: sessionUser.id });

        if (post_id) {
            query = query.andWhere({ post_id });
        } else if (comment_id) {
            query = query.andWhere({ comment_id });
        } else {
            return res.status(400).json({ error: "post_id or comment_id is required" });
        }

        const like = await query.first();

        if (!like) {
            return res.status(403).json({ error: "Forbidden: you can only delete your own like" });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}

export default requireOwnLike;
