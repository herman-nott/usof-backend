import Post from "../../models/Post.js";

async function handleGetAllPosts(req, res, db) {
    try {
        const page = parseInt(req.query.page) || 1;   // текущая страница
        const limit = parseInt(req.query.limit) || 10; // постов на страницу
        const sort = req.query.sort || "rating";   // likes или date
        const order = req.query.order || "desc";  // asc или desc

        const postModel = new Post(db);
        const result = await postModel.selectAll(page, limit, sort, order);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetAllPosts;