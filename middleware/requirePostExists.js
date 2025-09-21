import db from "../db.js";

export async function requirePostExists(req, res, next) {
    const { post_id } = req.params;

    try {
        const post = await db('posts').where({ id: post_id }).first();
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
}

export default requirePostExists;