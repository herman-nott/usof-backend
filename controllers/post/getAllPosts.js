import Post from "../../models/Post.js";

async function handleGetAllPosts(req, res, db) {
    try {
        const page = parseInt(req.query.page) || 1;   // текущая страница
        const limit = parseInt(req.query.limit) || 10; // постов на страницу

        const postModel = new Post(db);
        const result = await postModel.selectAll(page, limit);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetAllPosts;