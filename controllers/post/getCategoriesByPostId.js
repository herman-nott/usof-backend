import Category from "../../models/Category.js";

async function handleGetCategoriesByPostId(req, res, db) {
    try {
        const { post_id } = req.params;
        const categoryModel = new Category(db);
        const categories = await categoryModel.findByPostId(post_id);

        res.json({ post_id, categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export default handleGetCategoriesByPostId;