import db from "../db.js";

export async function requireCommentExists(req, res, next) {
    const { comment_id } = req.params;

    try {
        const comment = await db('comments').where({ id: comment_id }).first();
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
}

export default requireCommentExists;