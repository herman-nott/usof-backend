import Post from "../../models/Post.js";

async function handleGetAllPosts(req, res, db) {
    try {
        const page = parseInt(req.query.page) || 1;   // текущая страница
        const limit = parseInt(req.query.limit) || 10; // постов на страницу
        const sort = req.query.sort || "rating";   // likes или date
        const order = req.query.order || "desc";  // asc или desc

        const filters = {
            status: req.query.status || null,
            categories: req.query.categories ? req.query.categories.split(',').map(Number) : [],
            date_from: req.query.date_from || null,
            date_to: req.query.date_to || null,
        };

        // создать юзера из сессии, если он авторизован, если нет, то юзер равен null
        const user = req.session.user || null; 

        const postModel = new Post(db);
        const result = await postModel.selectAll(page, limit, sort, order, filters, user);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetAllPosts;